  // ================= мир 9 (фразы 9–11): ночной щит у пустой дороги (координаты мира 1). Камера спускается с ночной стороны Земли (мир 9 вложен в верх шара),
  // нарисованный огонёк становится живым (#092), дым тает в небе (#141); Макларен: календарь и пачки, рентген (#037), планки щита поворачиваются (#105), щит → столб-памятник, ещё три столба.
  let T9 = null, K9 = null, NE9 = null;
  const M9 = .0012, POSTS = [540, 1260, 1980, 2700], HORZ = 1350;
  function w9Init() {
    const w = (s, q, n) => Ws(s, q, n);
    T9 = { a: SA('s9'), vot: w('s9', 'вот'), kov: w('s9', 'ковбои'), rekl0: w('s9', 'рекламы'), kur: w('s9', 'курили'), nast: w('s9', 'по-настоящему'),
      uein: w('s10', 'уэйн'), mak: w('s10', 'макларен'), vyk: w('s10', 'выкуривал'), polt: w('s10', 'полторы'), den: w('s10', 'день'), dev: w('s10', 'девяностом'), rak: w('s10', 'рак'), leg: w('s10', 'лёгких'),
      posl: w('s10', 'последний'), snim: w('s10', 'снимался'), rekl: w('s10', 'рекламе'), prot: w('s10', 'против'), umer: w('s10', 'умер'), pyat: w('s10', 'пятьдесят'), odin: w('s10', 'один'),
      vsego: w('s11', 'всего'), umerli: w('s11', 'умерли'), chet: w('s11', 'четверо'), kovb: w('s11', 'ковбоев'), marl: w('s11', 'мальборо'), end: (SA('s12') ?? SA('s13')) - .02 };
    const a = T9; a.sw = a.vot + .28;   // смена мира: шар Земли во весь кадр, горизонт — прямая
    NE9 = { x: GLOBE.x, y: GLOBE.y - GLOBE.R - (HORZ - 960) * M9, m: M9 };
    KE.push(KY(T8.sweep1 + .12, 540, 640, 2.6), KY(a.sw, 540, NE9.y + (1100 - 960) * M9, .14 / M9));
    K9 = [KY(a.kov + .05, 520, 900, .55), KY(a.rekl0 + .1, 430, 700, 1.6), KY(a.kur + .08, 405, 640, 3.4), KY(a.nast + .45, 420, 520, 2.4), KY(a.uein + .2, 470, 600, 1.75),
      KY(a.polt + .1, 560, 600, 1.45), KY(a.den + .3, 600, 640, 1.4), KY(a.dev + .2, 390, 660, 3.0), KY(a.leg + .25, 385, 668, 3.3), KY(a.posl + .2, 470, 690, 1.6),
      KY(a.rekl + .15, 540, 700, 1.15), KY(a.umer, 540, 800, 1.0), KY(a.odin + .2, 560, 900, .9), KY(a.umerli, 1250, 950, .58), KY(a.chet + .5, 1600, 970, .47), KY(a.end, 1640, 960, .45)];
  }
  const KEf = () => KE;
  // ночное небо и горизонт (для мира 9 целиком; noFill — внутри Земли: небо и землю там даёт сам шар)
  function nightLocal(c, t, q, noFill) {
    const a = T9;
    if (!noFill) { c.fillStyle = SPACE; c.fillRect(-60000, -60000, 120000, 60000 + HORZ) }
    if (!noFill) { c.save(); c.beginPath(); c.rect(-60000, -60000, 120000, 60000 + HORZ); c.clip(); starsS(c, t, 1); c.restore() }
    c.fillStyle = '#121640'; c.fillRect(-60000, 950, 120000, HORZ - 950); c.fillStyle = '#24183A'; c.fillRect(-60000, 1180, 120000, HORZ - 1180); c.fillStyle = '#3E1C30'; c.fillRect(-60000, 1300, 120000, HORZ - 1300);
    const mx = 870, my = 250; circ(c, mx, my, 96, '#F3EBDD'); circ(c, mx - 30, my - 20, 18, '#DCD3BE'); circ(c, mx + 26, my + 30, 12, '#DCD3BE'); circ(c, mx + 30, my - 34, 9, '#DCD3BE');
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
      if (km > 0) { const px = 540, py = 620, sx = lp(1, 44 / w, km), sy = lp(1, (1378 - py) / h, km); c.translate(px, lp(y + h / 2, py + (1378 - py) / 2, km)); c.scale(sx, sy); c.translate(-(x + w / 2), -(y + h / 2)) }
      billboardFrame(c, { lamp: 1 });
      const em = eo(at(t, a.kur - .15, a.kur + .25)) * (1 - .3 * at(t, a.nast + .6, a.uein + .3));
      poster(c, t, { peelPx: 0, night: .62, ember: em, chest: cc => xray(cc, t), cal: cc => calendar(cc, t), over: cc => slats(cc, t) });
      [x + 180, x + 480, x + 780].forEach(lx => poly(c, [lx + 40, y - 62, lx + 72, y - 56, lx + 330, y + h * .9, lx - 220, y + h * .9]) || fill(c, 'rgba(255,233,176,.09)'));
      c.restore();
    }
    if (km > 0) post(c, POSTS[0], t, 0);
    for (let i = 1; i < 4; i++) post(c, POSTS[i], t, i);
    wire(c, t);
    smoke9(c, t);
    const kn = at(t, a.nast - .05, a.nast + .35) * (1 - at(t, a.uein - .35, a.uein + .05)); if (kn > 0) tx(c, 'ПО-НАСТОЯЩЕМУ', 430, 330, { f: 'M', w: 800, s: 38 * bo(kn), c: '#F4F1EA', a: Math.min(1, kn * 2) });
    const k1 = at(t, a.polt + .1, a.polt + .45) * (1 - at(t, a.dev - .3, a.dev)); if (k1 > 0) plate(c, '1,5 ПАЧКИ В ДЕНЬ', 560, 300, bo(k1), { s: 40, bg: C3.red, c: '#fff', ls: 2 });
    const k5 = at(t, a.odin - .05, a.odin + .3) * (1 - at(t, a.vsego - .3, a.vsego + .1)); if (k5 > 0) tx(c, '51', 760, 760, { f: 'M', w: 800, s: 200 * bo(k5), c: '#F4F1EA', a: Math.min(1, k5 * 2) });
    const k4 = at(t, a.chet + .9, a.chet + 1.25); if (k4 > 0) tx(c, 'КАК МИНИМУМ 4', 1620, 470, { f: 'M', w: 800, s: 150 * bo(k4), c: '#F4F1EA', a: Math.min(1, k4 * 2) });
  }
  function smoke9(c, t) {   // дым выходит из плаката и тает в ночном небе
    const a = T9, k = at(t, a.kur + .1, a.uein + .6); if (k <= 0) return; const x0 = 404.5, y0 = 623.5;
    for (let j = 0; j < 3; j++) { const u = cl(k * 1.4 - j * .2), pts = []; for (let i = 0; i <= 10; i++) { const s2 = i / 10 * u; pts.push(x0 + Math.sin(s2 * 7 + j + t * 1.3) * 26 * s2 + s2 * 40, y0 - s2 * 520) } smokeLine(c, pts, 6 - j, '#DCD8E4', (1 - at(k, .7, 1)) * (1 - j * .2)) }
  }
  function calendar(c, t) {   // отрывной календарь на плакате между всадником и пачкой; за каждый день из пачки падают полторы пачки
    const a = T9, k = at(t, a.polt - .25, a.dev - .2); if (k <= 0) return; const cx = 560, cy = 520, A0 = Math.min(1, k * 6) * (1 - at(t, a.dev - .2, a.dev + .1));
    c.save(); c.globalAlpha *= A0;
    rr(c, cx - 74, cy - 96, 148, 176, 8); fill(c, '#F4F1EA'); c.fillStyle = C3.red; c.fillRect(cx - 74, cy - 96, 148, 40); circ(c, cx - 40, cy - 96, 6, '#333'); circ(c, cx + 40, cy - 96, 6, '#333');
    const n = Math.floor(k * 14); tx(c, String(1 + n), cx, cy + 18, { f: 'M', w: 800, s: 74, c: '#141010' });
    const fl = (k * 14) % 1; if (n < 14) { c.save(); c.translate(cx + 80 * fl, cy - 10 - 60 * fl); c.rotate(fl * 1.2); c.globalAlpha *= 1 - fl; rr(c, -74, -50, 148, 136, 8); fill(c, '#F4F1EA'); tx(c, String(n), 0, 18, { f: 'M', w: 800, s: 74, c: '#141010' }); c.restore() }
    const np = Math.min(21, Math.floor(k * 14 * 1.5)); for (let i = 0; i < np; i++) { const col = i % 3, row = Math.floor(i / 3); c.save(); c.translate(736 + 140 + col * 34, BB.y + BB.h - 30 - row * 46); c.scale(.17, .17); mPack(c, -95, -282, 190, 282, 34, { shadow: false }); c.restore() }
    const fp = (k * 21) % 1; if (np < 21) { c.save(); c.translate(860, lp(BB.y + 200, BB.y + BB.h - 60, ei(fp))); c.rotate(fp * 2); c.scale(.17, .17); mPack(c, -95, -141, 190, 282, 34, { shadow: false }); c.restore() }
    c.restore();
  }
  function xray(c, t) {   // светлая планка рентгена едет по груди всадника: за ней лёгкие контуром и тёмное пятно (координаты всадника)
    const a = T9, k = at(t, a.dev - .1, a.posl - .1); if (k <= 0 || k >= 1) return; const bx = lp(-30, 40, eio(at(k, 0, .45))), A0 = Math.min(1, k * 8) * (1 - at(k, .85, 1)), sp = eo(at(t, a.rak - .1, a.leg + .2));
    c.save(); c.globalAlpha *= A0; c.beginPath(); c.rect(bx - 30, -214, 60, 58); c.clip(); c.fillStyle = '#9FD4E6'; c.fillRect(bx - 30, -214, 60, 58);
    [[-1, 0], [1, 0]].forEach(([s2]) => { c.beginPath(); c.ellipse(10 + s2 * 9, -186, 7, 18, s2 * .15, 0, TAU); c.strokeStyle = '#1E4E6A'; c.lineWidth = 1.6; c.stroke() });
    c.beginPath(); c.moveTo(10, -208); c.lineTo(10, -170); c.strokeStyle = '#1E4E6A'; c.lineWidth = 1.4; c.stroke(); if (sp > 0) circ(c, 15, -192, 4.2 * sp, '#1A1214');
    c.restore(); c.save(); c.globalAlpha *= A0; c.strokeStyle = '#E8F7FC'; c.lineWidth = 1.5; c.strokeRect(bx - 30, -214, 60, 58); c.restore();
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
  function post(c, px, t, i) {   // столб-памятник у дороги: шляпа висит на нём
    const a = T9; let k;
    if (i === 0) k = boardMorph(t); else { const t0 = a.vsego + .1 + (i - 1) * .2; k = eo(at(t, t0, t0 + .5)) }
    if (k <= 0) return; const top = 620, H = (1378 - top) * (i === 0 ? 1 : k);
    c.fillStyle = '#2A1D18'; c.fillRect(px - 22, 1378 - H, 44, H); c.fillStyle = '#3E2A22'; c.fillRect(px - 22, 1378 - H, 14, H); c.fillRect(px - 70, 1378 - H + 90, 140, 22);
    const th = i === 0 ? at(t, a.pyat - .05, a.pyat + .35) : at(t, a.chet - .1 + (i - 1) * .25, a.chet + .3 + (i - 1) * .25); if (th > 0) { const hy = lp(top - 500, 1378 - H + 6, eo(th)); cHat(c, px, hy, 2.1) }
  }
  function wire(c, t) {   // проволока между столбами натягивается на «Мальборо»; в фильме на «Помните» краснеет — это красная нить доски
    const a = T9, k = at(t, a.vsego + .3, a.vsego + .9); if (k <= 0) return; const tight = eio(at(t, a.marl - .1, a.marl + .4)), red = SA('s12') !== null ? eio(at(t, SA('s12') - .05, SA('s12') + .5)) : 0;
    c.strokeStyle = mixc('#8A8296', '#DC2626', red); c.lineWidth = 5 + 4 * red; c.beginPath();
    for (let i = 0; i < 3; i++) { const x0 = POSTS[i], x1 = POSTS[i + 1], sag = 120 * (1 - tight) * Math.min(1, k * 2); c.moveTo(x0, 760); c.quadraticCurveTo((x0 + x1) / 2, 760 + sag, x0 + (x1 - x0) * Math.min(1, k * 3 - i), 760) } c.stroke();
    if (tight > 0) for (let i = 0; i < 10; i++) { const u = (t * 1.6 + i * .37) % 1, dx = lp(-200, 3800, u), dy = 900 + H1(i) * 400; c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + 140, dy - 40); lnB(c, 3, rgba('#B9A99A', .45 * tight)) }
  }
  function w9World(c, t, q) {
    nightLocal(c, t, q, false);
    if (q.z > .3) layerRel(c, q, K9REF, 1.3, cc => { for (let i = 0; i < 14; i++) { const lx = BB.x + 180 + (i % 3) * 300 + Math.sin(t * 3 + i) * 60, ly = BB.y - 40 + H1(i) * 300 + Math.cos(t * 2.3 + i * 2) * 40; circ(cc, lx, ly, 3, 'rgba(255,240,200,.7)') } });   // мошкара в луче лампы
  }
  let K9REF = null;
  function w9Shot(c, t) {
    if (t < T9.sw) { const q = camObj(camAt(KE, t)); layer(c, q, 1, cc => earthWorld(cc, t, q)); return }
    const q = camObj(camAt(K9, t)); if (!K9REF) K9REF = camObj(camAt(K9, T9.kur)); layer(c, q, 1, cc => w9World(cc, t, q));
  }
