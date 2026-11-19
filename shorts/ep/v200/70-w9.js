  // ================= мир 9 (фразы 9–11): ночной щит у пустой дороги (координаты мира 1). Камера спускается с ночной стороны Земли (мир 9 вложен в верх шара),
  // нарисованный огонёк становится живым (#092), дым тает в небе (#141); Макларен: календарь и пачки, рентген (#037), планки щита поворачиваются (#105), щит → столб-памятник, ещё три столба.
  let T9 = null, K9 = null, NE9 = null;
  const M9 = .0012, POSTS = [540, 980, 1420, 1860], HORZ = 1350, PTOP = 980;   // v20.2: столбы забора ближе и ниже — шляпы крупнее
  function w9Init() {
    const w = (s, q, n) => Ws(s, q, n);
    T9 = { a: SA('s9'), vot: w('s9', 'вот'), kov: w('s9', 'ковбои'), rekl0: w('s9', 'рекламы'), kur: w('s9', 'курили'), nast: w('s9', 'по-настоящему'),
      uein: w('s10', 'уэйн'), mak: w('s10', 'макларен'), vyk: w('s10', 'выкуривал'), polt: w('s10', 'полторы'), den: w('s10', 'день'), dev: w('s10', 'девяностом'), rak: w('s10', 'рак'), leg: w('s10', 'лёгких'),
      posl: w('s10', 'последний'), snim: w('s10', 'снимался'), rekl: w('s10', 'рекламе'), prot: w('s10', 'против'), umer: w('s10', 'умер'), pyat: w('s10', 'пятьдесят'), odin: w('s10', 'один'),
      vsego: w('s11', 'всего'), umerli: w('s11', 'умерли'), chet: w('s11', 'четверо'), kovb: w('s11', 'ковбоев'), marl: w('s11', 'мальборо'), end: (SA('s12') ?? SA('s13')) - .02 };
    const a = T9; a.sw = a.vot + .28;   // смена мира: шар Земли во весь кадр, горизонт — прямая
    NE9 = { x: GLOBE.x, y: GLOBE.y - GLOBE.R - (HORZ - 960) * M9, m: M9 };
    KE.push(KY(T8.sweep1 + .06, 540, 700, 1.7), KY(a.sw, 540, NE9.y + (1000 - 960) * M9, .45 / M9));   // v20.2: нырок к горизонту быстрее — щит сразу крупный
    K9 = [KY(a.kov + .05, 520, 880, .66), KY(a.rekl0 + .1, 430, 700, 1.6), KY(a.kur + .08, 405, 640, 3.4), KY(a.nast + .45, 420, 520, 2.4), KY(a.uein + .2, 470, 600, 1.75),
      KY(a.polt + .1, 560, 600, 1.45), KY(a.den + .3, 600, 640, 1.4), KY(a.dev + .2, 390, 660, 3.0), KY(a.leg + .25, 385, 668, 3.3), KY(a.posl + .2, 470, 690, 1.6),
      KY(a.rekl + .15, 540, 700, 1.15), KY(a.umer, 540, 800, 1.0), KY(a.odin + .2, 560, 900, .9), KY(a.umerli, 1000, 1010, .66), KY(a.chet + .5, 1170, 980, .58), KY(a.end, T9END[0], T9END[1], T9END[2])];
  }
  const KEf = () => KE;
  const T9END = [1200, 960, .56];   // последний кадр ночной сцены = фото карточки 1924 на доске (мир 12)
  // ночное небо и горизонт (для мира 9 целиком; noFill — внутри Земли: небо и землю там даёт сам шар)
  function nightLocal(c, t, q, noFill) {
    const a = T9;
    if (!noFill) { c.fillStyle = SPACE; c.fillRect(-60000, -60000, 120000, 60000 + HORZ) }
    if (!noFill) { c.save(); c.beginPath(); c.rect(-60000, -60000, 120000, 60000 + HORZ); c.clip(); starsS(c, t, 1); c.restore() }
    c.fillStyle = '#121640'; c.fillRect(-60000, 950, 120000, HORZ - 950); c.fillStyle = '#24183A'; c.fillRect(-60000, 1180, 120000, HORZ - 1180); c.fillStyle = '#3E1C30'; c.fillRect(-60000, 1300, 120000, HORZ - 1300);
    const mx = 900, my = 118; circ(c, mx, my, 84, '#F3EBDD'); circ(c, mx - 30, my - 20, 18, '#DCD3BE'); circ(c, mx + 26, my + 30, 12, '#DCD3BE'); circ(c, mx + 30, my - 34, 9, '#DCD3BE');   // v20.2: луна выше ламп щита
    PL(c, [-1500, HORZ, -1500, 1220, -900, 1220, -860, 1260, -500, 1260, -470, 1196, 110, 1196, 150, 1240, 250, 1240, 296, HORZ], NIGHT.mesa);
    PL(c, [800, HORZ, 836, 1262, 880, 1262, 904, 1222, 1500, 1222, 1540, 1180, 2100, 1180, 2600, HORZ], NIGHT.mesa); PL(c, [2600, HORZ, 2700, 1250, 3300, 1250, 3420, 1200, 4200, 1200, 4400, HORZ], NIGHT.mesa);
    if (!noFill) { c.fillStyle = GLOBEC; c.fillRect(-60000, HORZ, 120000, 60000) }
    c.fillStyle = '#0E0B1C'; c.fillRect(-60000, 1376, 120000, 64); c.fillStyle = '#2A2440'; c.fillRect(-60000, 1376, 120000, 4); c.fillRect(-60000, 1436, 120000, 4);
    c.fillStyle = '#5A4E44'; for (let dx = -2960; dx < 6000; dx += 120) c.fillRect(dx, 1406, 64, 5);
    c.fillStyle = '#0E0B1C'; for (let fx = -594; fx < 260; fx += 50) c.fillRect(fx, 1300, 11, 80); c.fillRect(-600, 1316, 866, 5); c.fillRect(-600, 1344, 866, 5);
    nightBoard(c, t, q);
  }
  function nightInEarth(c, t, q) { if (q.z < 12) return; inNest(c, NE9, cc => nightLocal(cc, t, q, true)) }
  // ---------- щит ночью: лампы, огонёк, дым, календарь, рентген, планки, столб ----------
  function boardMorph(t) { const a = T9; return eio(at(t, a.umer - .15, a.pyat + .2)) }
  function nightBoard(c, t, q) {
    const a = T9, km = boardMorph(t), { x, y, w, h } = BB;
    if (km < 1) {
      c.save();
      if (km > 0) { const gx0 = x - 12, gx1 = x + w + 12, gy0 = y - 92, gy1 = 1378, gcx = (gx0 + gx1) / 2, gcy = (gy0 + gy1) / 2;
        c.translate(lp(gcx, POSTS[0], km), lp(gcy, (PTOP + 1378) / 2, km)); c.scale(lp(1, 44 / (gx1 - gx0), km), lp(1, (1378 - PTOP) / (gy1 - gy0), km)); c.translate(-gcx, -gcy) }
      billboardFrame(c, { lamp: 1 });
      const em = eo(at(t, a.kur - .15, a.kur + .25)) * (1 - .3 * at(t, a.nast + .6, a.uein + .3));
      poster(c, t, { peelPx: 0, night: .62, ember: em, chest: cc => xray(cc, t), cal: cc => calendar(cc, t), over: cc => slats(cc, t) });
      [x + 180, x + 480, x + 780].forEach(lx => poly(c, [lx + 40, y - 62, lx + 72, y - 56, lx + 330, y + h * .9, lx - 220, y + h * .9]) || fill(c, 'rgba(255,233,176,.09)'));
      if (km > 0) { c.fillStyle = rgba('#4A3326', ss(.3, .92, km)); c.fillRect(x - 14, y - 94, w + 28, 1378 - y + 94) }   // щит становится деревом
      c.restore();
    }
    if (km >= 1) post(c, POSTS[0], t, 0);
    for (let i = 1; i < 4; i++) post(c, POSTS[i], t, i);
    wire(c, t);
    smoke9(c, t);
    const k1 = at(t, a.polt + .1, a.polt + .45) * (1 - at(t, a.dev - .3, a.dev)); if (k1 > 0) plate(c, '1,5 ПАЧКИ В ДЕНЬ', 560, 300, bo(k1), { s: 40, bg: C3.red, c: '#fff', ls: 2 });
    const k5 = at(t, a.odin - .05, a.odin + .3) * (1 - at(t, a.vsego - .3, a.vsego + .1)); if (k5 > 0) tx(c, '51', 760, 760, { f: 'M', w: 800, s: 200 * bo(k5), c: '#F4F1EA', a: Math.min(1, k5 * 2) });
    const k4 = at(t, a.chet + .9, a.chet + 1.25); if (k4 > 0) tx(c, 'КАК МИНИМУМ 4', 1200, 640, { f: 'M', w: 800, s: 112 * bo(k4), c: '#F4F1EA', a: Math.min(1, k4 * 2) });
  }
  function smoke9(c, t) {   // дым выходит из плаката и тает в ночном небе
    const a = T9, k = at(t, a.kur + .1, a.uein + .6); if (k <= 0) return; const x0 = 412, y0 = 628;   // кончик сигареты всадника (RCIG)
    for (let j = 0; j < 3; j++) { const u = cl(k * 1.4 - j * .2), pts = []; for (let i = 0; i <= 10; i++) { const s2 = i / 10 * u; pts.push(x0 + Math.sin(s2 * 7 + j + t * 1.3) * 26 * s2 + s2 * 40, y0 - s2 * 520) } smokeLine(c, pts, 6 - j, '#DCD8E4', (1 - at(k, .7, 1)) * (1 - j * .2)) }
  }
  function calendar(c, t) {   // отрывной календарь на плакате между всадником и пачкой; за каждый день из пачки падают полторы пачки
    const a = T9, k = at(t, a.polt - .25, a.dev - .2); if (k <= 0) return; const cx = 840, cy = 452, A0 = Math.min(1, k * 6) * (1 - at(t, a.dev - .2, a.dev + .1));
    c.save(); c.globalAlpha *= A0;
    rr(c, cx - 74, cy - 96, 148, 176, 8); fill(c, '#F4F1EA'); c.fillStyle = C3.red; c.fillRect(cx - 74, cy - 96, 148, 40); circ(c, cx - 40, cy - 96, 6, '#333'); circ(c, cx + 40, cy - 96, 6, '#333');
    const n = Math.floor(k * 14); tx(c, String(1 + n), cx, cy + 18, { f: 'M', w: 800, s: 74, c: '#141010' });
    const fl = (k * 14) % 1; if (n < 14) { c.save(); c.translate(cx + 80 * fl, cy - 10 - 60 * fl); c.rotate(fl * 1.2); c.globalAlpha *= 1 - fl; rr(c, -74, -50, 148, 136, 8); fill(c, '#F4F1EA'); tx(c, String(n), 0, 18, { f: 'M', w: 800, s: 74, c: '#141010' }); c.restore() }
    const np = Math.min(21, Math.floor(k * 14 * 1.5)); for (let i = 0; i < np; i++) { const col = i % 3, row = Math.floor(i / 3); c.save(); c.translate(736 + 140 + col * 34, BB.y + BB.h - 30 - row * 46); c.scale(.17, .17); mPack(c, -95, -282, 190, 282, 34, { shadow: false }); c.restore() }
    const fp = (k * 21) % 1; if (np < 21) { c.save(); c.translate(860, lp(BB.y + 200, BB.y + BB.h - 60, ei(fp))); c.rotate(fp * 2); c.scale(.17, .17); mPack(c, -95, -141, 190, 282, 34, { shadow: false }); c.restore() }
    c.restore();
  }
  function torsoPath(c) { c.beginPath(); c.moveTo(-6, -160); c.bezierCurveTo(-10, -178, -8, -196, -2, -208); c.quadraticCurveTo(6, -216, 16, -214); c.lineTo(24, -211); c.bezierCurveTo(31, -204, 32, -192, 28, -180); c.bezierCurveTo(24, -172, 22, -166, 20, -160); c.closePath() }
  function xray(c, t) {   // v20.2 (Боб #037): вертикальная полоса сканера идёт по всаднику слева направо; за ней тело — прозрачный контур на тёмной сетке: лёгкие, рёбра, тёмное пятно (координаты всадника)
    const a = T9, k = at(t, a.dev - .15, a.posl - .1); if (k <= 0 || k >= 1) return; const bx = lp(-16, 38, eio(at(k, 0, .4))), A0 = 1 - at(k, .88, 1), sp = eo(at(t, a.rak - .1, a.leg + .2));
    c.save(); c.globalAlpha *= A0;
    c.save(); torsoPath(c); c.clip(); c.beginPath(); c.rect(-20, -230, bx + 20, 90); c.clip();
    c.fillStyle = '#0B1A33'; c.fillRect(-20, -230, 60, 90); c.strokeStyle = 'rgba(120,210,240,.3)'; c.lineWidth = .5; c.beginPath(); for (let gx = -18; gx < 40; gx += 4) { c.moveTo(gx, -230); c.lineTo(gx, -140) } for (let gy = -228; gy < -140; gy += 4) { c.moveTo(-20, gy); c.lineTo(40, gy) } c.stroke();
    [-1, 1].forEach(s2 => { c.beginPath(); c.ellipse(11 + s2 * 6, -186, 5, 13, s2 * .14, 0, TAU); c.fillStyle = 'rgba(150,220,245,.32)'; c.fill(); c.strokeStyle = '#BFEFFF'; c.lineWidth = 1; c.stroke() });   // лёгкие
    c.strokeStyle = 'rgba(191,239,255,.55)'; c.lineWidth = .7; for (let r = 0; r < 4; r++) { c.beginPath(); c.arc(11, -198 + r * 7, 10, Math.PI * .1, Math.PI * .9); c.stroke() }   // рёбра
    c.beginPath(); c.moveTo(11, -210); c.lineTo(11, -166); c.strokeStyle = '#BFEFFF'; c.lineWidth = .9; c.stroke(); if (sp > 0) circ(c, 15, -190, 3.4 * sp, '#020308');   // трахея, пятно
    c.restore();
    c.strokeStyle = 'rgba(191,239,255,.85)'; c.lineWidth = .9;
    c.save(); c.beginPath(); c.rect(-20, -230, bx + 20, 90); c.clip(); torsoPath(c); c.stroke(); c.restore();   // контур тела — только за полосой
    if (k < .45) { c.fillStyle = 'rgba(190,240,255,.22)'; c.fillRect(bx - 3, -222, 6, 70); c.fillStyle = '#E8FBFF'; c.fillRect(bx - .8, -222, 1.6, 70) }   // полоса сканера
    c.restore();
    if (sp > 0) for (let q = 0; q < 2; q++) { const u = at(t, a.rak + q * .4, a.rak + .7 + q * .4); if (u > 0 && u < 1) ring(c, 15, -190, 5 + 16 * eo(u), rgba('#E23A4E', .9 * (1 - u)), 1.4) }
  }
  function slats(c, t) {   // щит делится на трёхгранные планки, они поворачиваются: реклама против курения — шляпа на больничной койке
    const a = T9, k = at(t, a.rekl - .25, a.prot + .5); if (k <= 0) return; const { x, y, w, h } = BB, N = 14, sw = w / N;
    for (let i = 0; i < N; i++) { const u = cl(k * 1.6 - i * .045); if (u <= 0) continue; const f = Math.sin(Math.PI / 2 * eio(u)), sx = x + i * sw, cx = sx + sw / 2;   // новая грань планки разворачивается из ребра
      c.save(); c.beginPath(); c.rect(cx - sw * f / 2, y, sw * f, h); c.clip(); hospital(c, t);
      if (f < 1) { c.fillStyle = `rgba(0,0,0,${.45 * (1 - f)})`; c.fillRect(cx - sw / 2, y, sw, h) } c.restore();
      if (f > .02 && f < 1) { c.fillStyle = 'rgba(10,8,20,.7)'; c.fillRect(cx - sw * f / 2 - 3, y, 3, h); c.fillRect(cx + sw * f / 2, y, 3, h) } }
  }
  function hospital(c, t) {
    const { x, y, w, h } = BB; c.fillStyle = '#C9D4DC'; c.fillRect(x, y, w, h); c.fillStyle = '#AEBAC4'; c.fillRect(x, y + h * .72, w, h * .28);
    c.fillStyle = '#7E8A94'; c.fillRect(x + 240, y + 300, 14, 250); c.fillRect(x + 720, y + 260, 14, 290); c.fillRect(x + 240, y + 420, 494, 12);
    rr(c, x + 254, y + 360, 466, 66, 12); fill(c, '#F4F1EA'); rr(c, x + 270, y + 330, 130, 40, 14); fill(c, '#FFFFFF'); c.fillStyle = '#9FB3C2'; c.fillRect(x + 254, y + 408, 466, 18);
    cHat(c, x + 520, y + 352, 1.9); c.fillStyle = '#5E6A74'; c.fillRect(x + 820, y + 120, 8, 430); rr(c, x + 790, y + 120, 70, 90, 10); fill(c, '#DCE6EC');
  }
  function hatL(c, x, y, s) {   // v20.2: светлая шляпа ковбоя в лунном свете — видна на ночном небе
    cHat(c, x, y, s, '#B88A5C'); c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = 'rgba(250,232,196,.9)'; c.lineWidth = 2.2;
    c.beginPath(); c.moveTo(-60, -13); c.quadraticCurveTo(-46, -1, -26, -5); c.lineTo(26, -5); c.quadraticCurveTo(46, -1, 60, -13); c.stroke();
    c.beginPath(); c.moveTo(-25, -8); c.bezierCurveTo(-25, -32, -18, -44, -8, -48); c.stroke(); c.restore();
  }
  function post(c, px, t, i) {   // v20.2: столб забора ранчо у дороги (тёплое дерево, скошенный верх); на него падает большая светлая шляпа
    const a = T9; let k;
    if (i === 0) k = 1; else { const t0 = a.vsego + .1 + (i - 1) * .2; k = eo(at(t, t0, t0 + .5)) }
    if (k <= 0) return; const H = (1378 - PTOP) * k, y0 = 1378 - H;
    c.fillStyle = '#4A3326'; c.fillRect(px - 22, y0, 44, H); c.fillStyle = '#5E4232'; c.fillRect(px - 22, y0, 12, H); c.fillStyle = '#2E1F17'; c.fillRect(px + 12, y0, 10, H);
    PL(c, [px - 22, y0, px, y0 - 12, px + 22, y0], '#5E4232'); c.fillStyle = 'rgba(30,20,14,.45)'; for (let g = 0; g < 3; g++) c.fillRect(px - 12 + g * 9, y0 + 40 + g * 70, 3, 60);
    const th = i === 0 ? at(t, a.pyat - .05, a.pyat + .35) : at(t, a.chet - .1 + (i - 1) * .25, a.chet + .3 + (i - 1) * .25); if (th > 0) hatL(c, px, lp(PTOP - 700, y0 - 16, eo(th)), 2.0);
  }
  function wire(c, t) {   // v20.2: между столбами — две жерди и колючая проволока; проволока натягивается на «Мальборо», в фильме на «Помните» краснеет — это красная нить доски
    const a = T9, red = SA('s12') !== null ? eio(at(t, SA('s12') - .05, SA('s12') + .5)) : 0, tight = eio(at(t, a.marl - .1, a.marl + .4));
    for (let i = 0; i < 3; i++) { const t0 = a.vsego + .1 + i * .2, k = eio(at(t, t0 + .2, t0 + .6)); if (k <= 0) continue; const x0 = POSTS[i], x1 = POSTS[i + 1], xe = lp(x0, x1, k);
      [PTOP + 110, PTOP + 250].forEach(ry => { c.fillStyle = '#3E2B20'; c.fillRect(x0, ry, xe - x0, 22); c.fillStyle = '#5E4232'; c.fillRect(x0, ry, xe - x0, 5) });
      const wy = PTOP + 34, sag = 46 * (1 - tight); c.strokeStyle = mixc('#8A8296', '#DC2626', red); c.lineWidth = 3 + 3 * red; c.beginPath(); c.moveTo(x0, wy); c.quadraticCurveTo((x0 + xe) / 2, wy + sag * k, xe, wy); c.stroke();
      for (let bx = x0 + 30; bx < xe - 10; bx += 46) { const u = (bx - x0) / (x1 - x0), by = wy + sag * k * 4 * u * (1 - u); c.beginPath(); c.moveTo(bx - 6, by - 6); c.lineTo(bx + 6, by + 6); c.moveTo(bx + 6, by - 6); c.lineTo(bx - 6, by + 6); c.stroke() } }   // колючки
  }
  function w9World(c, t, q) {
    nightLocal(c, t, q, false);
    if (q.z > .6) A(c, cl((q.z - .6) / .8), () => layerRel(c, q, K9REF, 1.3, cc => { for (let i = 0; i < 14; i++) { const lx = BB.x + 180 + (i % 3) * 300 + Math.sin(t * 3 + i) * 60, ly = BB.y - 40 + H1(i) * 300 + Math.cos(t * 2.3 + i * 2) * 40; circ(cc, lx, ly, 3, 'rgba(255,240,200,.7)') } }));   // мошкара в луче лампы
  }
  let K9REF = null;
  function w9Shot(c, t) {
    if (t < T9.sw) { const q = camObj(camAt(KE, t)); layer(c, q, 1, cc => earthWorld(cc, t, q)); return }
    const q = camObj(camAt(K9, t)); if (!K9REF) K9REF = camObj(camAt(K9, T9.kur)); layer(c, q, 1, cc => w9World(cc, t, q));
  }
