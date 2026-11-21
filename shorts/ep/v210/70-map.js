  // ================= карта США (строка 13 — на столе FDA; строки 14–17 — та же карта на столе кофейни) =================
  // Карта рисуется в координатах кабинета (мир H); в кофейне — она же через inNest(N_HA): на стыке H → A камера внутри листа карты, миры совпадают.
  // Строка 13: лист PATENT ложится на карту, по суше рядами стоят белые IQOS; молоток (комиссия); «нарушает» — лезвие на чертеже и в разрезе
  // держателя загораются, их соединяет красная линия; «выгнала» — красный шлагбаум от побережья Мэна одним махом сметает держатели в Атлантику (#005),
  // штамп «ЗАПРЕТ». Строка 14: держатели уплывают за край карты, отъезд — карта лежит на столе той же лондонской кофейни.
  // Фильм, строки 16–17: по океану к берегу катится белая баночка, шлагбаум поднимается, ценник $16 МЛРД, крышка открывается — подушечки, листа табака нет.
  // Шортс: на краю карты, у океана, — белый круг со знаком «?».
  const MAPH = { x: 1560, y: 1560, w: 900, h: 1024 }, MSC = 25.6, MLON = -84, MLAT = 37, MCOS = .8;
  const mpj = (lon, lat) => [MAPH.x + (lon - MLON) * MCOS * MSC, MAPH.y - (lat - MLAT) * MSC];
  const N_HA = { m: MAPA.w / MAPH.w, x: MAPA.x - (MAPH.x - 540) * MAPA.w / MAPH.w, y: MAPA.y - (MAPH.y - 960) * MAPA.w / MAPH.w };   // H → кофейня
  const LL = {   // долгота, широта — упрощённые очертания
    us: [-124.7, 48.4, -123.1, 49.0, -95.2, 49.0, -89.6, 48.0, -84.8, 46.5, -83.5, 46.1, -82.5, 43.0, -83.1, 42.2, -82.8, 41.7, -79.0, 42.8, -79.2, 43.3, -76.3, 43.6, -75.0, 44.8,
      -71.5, 45.0, -70.8, 45.4, -70.0, 46.7, -69.2, 47.45, -68.0, 47.2, -67.8, 45.9, -67.0, 44.8, -68.8, 44.2, -70.2, 43.6, -70.7, 42.7, -70.0, 41.8, -71.4, 41.4, -72.9, 41.2,
      -74.0, 40.6, -74.1, 39.7, -75.0, 38.8, -75.9, 37.2, -76.0, 36.9, -75.5, 35.3, -76.9, 34.6, -78.0, 33.9, -79.3, 33.1, -80.8, 32.0, -81.4, 30.4, -80.6, 28.5, -80.0, 26.5,
      -80.4, 25.2, -81.1, 25.1, -81.8, 26.5, -82.7, 28.0, -83.6, 29.9, -84.9, 29.7, -86.5, 30.4, -88.1, 30.4, -89.4, 30.2, -89.2, 29.2, -90.1, 29.1, -91.5, 29.5, -93.8, 29.7,
      -94.8, 29.3, -96.5, 28.3, -97.2, 27.5, -97.4, 26.0, -99.1, 26.5, -99.5, 27.5, -100.9, 29.4, -102.4, 29.8, -103.3, 29.0, -104.5, 29.7, -106.5, 31.8, -108.2, 31.8, -108.2, 31.3,
      -111.1, 31.3, -114.8, 32.5, -117.1, 32.5, -117.3, 33.2, -118.4, 33.8, -119.6, 34.4, -120.6, 34.6, -121.9, 36.5, -122.5, 37.8, -123.8, 39.6, -124.4, 40.4, -124.2, 41.9,
      -124.6, 42.8, -124.0, 46.2],
    can: [-112, 62, -54, 62, -55.7, 53.8, -56.0, 52.5, -57.1, 51.4, -60.0, 50.2, -63.0, 50.2, -66.4, 50.2, -68.6, 49.1, -70.5, 47.4, -71.2, 46.8, -69.5, 47.9, -67.5, 48.9, -64.4, 48.8,
      -64.8, 47.1, -64.2, 46.2, -62.5, 45.7, -61.6, 46.0, -60.6, 46.9, -60.0, 46.0, -61.0, 45.2, -63.6, 44.6, -66.0, 43.8, -65.8, 44.6, -64.5, 45.2, -64.8, 45.6, -66.1, 45.3,
      -67.0, 44.8, -67.8, 45.9, -68.0, 47.2, -69.2, 47.45, -70.0, 46.7, -70.8, 45.4, -71.5, 45.0, -75.0, 44.8, -76.3, 43.6, -79.2, 43.3, -79.0, 42.8, -82.8, 41.7, -83.1, 42.2,
      -82.5, 43.0, -83.5, 46.1, -84.8, 46.5, -89.6, 48.0, -95.2, 49.0, -112, 49.0],
    mex: [-117.1, 32.5, -114.8, 32.5, -111.1, 31.3, -108.2, 31.3, -108.2, 31.8, -106.5, 31.8, -104.5, 29.7, -103.3, 29.0, -102.4, 29.8, -100.9, 29.4, -99.5, 27.5, -99.1, 26.5, -97.4, 26.0,
      -97.6, 24.0, -97.4, 22.0, -96.0, 19.5, -94.5, 18.2, -92.0, 18.6, -90.5, 19.5, -90.4, 21.0, -88.0, 21.5, -86.8, 21.4, -87.5, 19.0, -88.3, 18.4, -88.5, 14.0, -112, 14.0, -112, 31.3],
    cuba: [-84.9, 21.9, -82.0, 23.1, -80.0, 23.0, -77.5, 21.7, -75.6, 21.0, -74.2, 20.2, -75.0, 19.9, -77.7, 19.9, -79.0, 21.6, -81.5, 22.0, -83.5, 21.8],
    hisp: [-74.4, 18.4, -72.8, 19.9, -70.0, 19.7, -68.4, 18.6, -70.0, 18.2, -71.5, 17.6], pr: [-67.2, 18.5, -65.6, 18.4, -65.7, 18.0, -67.2, 18.0],
    hud: [-95, 58.5, -92.5, 57, -88.5, 56.4, -85, 55.3, -82.3, 55.1, -82, 53, -80.5, 51.4, -79, 51.6, -78.9, 54.3, -77.7, 55.3, -77, 58.5],
  };
  const LAKE_US = [[-92.1, 46.7, -89.6, 48.0, -86.5, 48.7, -84.8, 46.9, -85.0, 46.5, -87.4, 46.5, -90.4, 46.6], [-87.8, 41.6, -86.6, 41.9, -86.2, 43.5, -85.5, 45.0, -85.0, 45.8, -86.9, 45.7, -87.6, 44.7, -87.9, 43.0],
    [-84.6, 45.8, -83.5, 46.0, -81.7, 45.3, -80.4, 45.0, -81.6, 43.2, -82.5, 43.0, -83.4, 43.9, -83.6, 44.8], [-83.4, 41.7, -82.5, 41.4, -81.0, 41.9, -79.0, 42.8, -80.2, 42.6, -81.7, 42.6, -83.1, 42.1],
    [-79.8, 43.3, -78.0, 43.4, -76.2, 43.5, -76.3, 44.1, -77.6, 44.0, -79.4, 43.7]];
  const BP = mpj(-68.2, 44.4), BFL = mpj(-79.6, 25.4), BPHI1 = Math.atan2(BFL[1] - BP[1], BFL[0] - BP[0]), BPHI0 = Math.PI, BLEN = 560, BOPEN = 2.78;   // шлагбаум: столб у Мэна
  const QM = mpj(-66.4, 38.6), CANF = mpj(-76.5, 38.2), CANR = 34, GV = [1730, 1290];   // v21.2: молоток бьёт по северо-востоку карты — не закрывает центральный IQOS
  let PJ = null, HOLD = null, WAVES = null, TM = null, TB4 = null, HCUT = null;
  function pip(P, x, y) { let ins = false; for (let i = 0, j = P.length - 2; i < P.length; j = i, i += 2) { const xi = P[i], yi = P[i + 1], xj = P[j], yj = P[j + 1]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins } return ins }
  function boomPhi(t) { const a = TM; let p = lp(BPHI0, BPHI1, eio(at(t, a.vygn + .02, a.vygn + .62))); if (a.zapr) p = lp(p, BOPEN, eio(at(t, a.zapr - .05, a.zapr + .55))); return p }
  function mapInit() {
    const w13 = q => Ws('s13', q), w14 = q => Ws('s14', q), w15 = q => Ws('s15', q), hasQ = SA('q') !== null, hasF = SA('s16') !== null;
    TM = { perv: w13('первом'), kom: w13('комиссия'), narush: w13('нарушает'), vygn: w13('выгнала'), amer: w13('америки'), obesch: w14('обещание'), chet: w14('четвёртом'),
      tri: w14('тридцать'), sig: w14('сигарет'), shest: w14('шестьсот'), bol: w14('больше'), brosaj: w15('бросают'), rovno: w15('ровно'), vy: w15('вы'),
      ugad: hasQ ? Ws('q', 'угадаете') : null, amerQ: hasQ ? Ws('q', 'америку') : null,
      amerF: hasF ? Ws('s16', 'америку') : null, vern: hasF ? Ws('s16', 'вернулся') : null, zapr: hasF ? Ws('s16', 'запрета') : null, shestn: hasF ? Ws('s16', 'шестнадцать') : null,
      net: hasF ? Ws('s17', 'нет') : null, dazhe: hasF ? Ws('s17', 'даже') : null, tab: hasF ? Ws('s17', 'табака') : null };
    TB4 = TM; const a = TM; a.jAJ = MODE === 'y' ? TLX.vEnd + .2 : null;   // v21.1: фильм — после «как и вы» сразу доска
    if (PJ) return;
    const P = L => { const o = []; for (let i = 0; i < L.length; i += 2) o.push(...mpj(L[i], L[i + 1])); return o };
    PJ = { us: P(LL.us), can: P(LL.can), mex: P(LL.mex), isl: [P(LL.cuba), P(LL.hisp), P(LL.pr)], hud: P(LL.hud), lakes: LAKE_US.map(P) };
    const land = (x, y) => (pip(PJ.us, x, y) || pip(PJ.can, x, y) || pip(PJ.mex, x, y) || PJ.isl.some(p => pip(p, x, y))) && !pip(PJ.hud, x, y);
    const H = []; let row = 0;
    for (let y = 1420; y <= 1830; y += 56, row++) for (let x = 1300; x <= 1880; x += 62) { const xx = x + (row % 2) * 31, dx = xx - BP[0], dy = y - BP[1], r = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      if (xx < 1470 || r < 110 || r > BLEN - 50 || th < BPHI1 + .07 || th > BPHI0 - 20 / r - .05) continue;
      if (![[0, 0], [-16, 4], [16, 4], [0, -40]].every(([u, v]) => pip(PJ.us, xx + u, y + v))) continue; if (PJ.lakes.some(p => pip(p, xx, y))) continue;
      H.push({ x: xx, y, r, th, i: H.length, ph: H1(H.length * 3.7) * 6 }) }
    HOLD = H; const [pbx, pby] = [PAT1.x - 46, PAT1.y + 14]; HCUT = H.reduce((b, h) => !b || Math.hypot(h.x - pbx, h.y - pby) < Math.hypot(b.x - pbx, b.y - pby) ? h : b, null);
    WAVES = []; for (let y = MAPH.y - MAPH.h / 2 + 30; y < MAPH.y + MAPH.h / 2; y += 46) for (let x = MAPH.x - MAPH.w / 2 + 24; x < MAPH.x + MAPH.w / 2; x += 58) { const xx = x + H1(x * .7 + y) * 26, yy = y + H1(y * .3 + x) * 16;
      if (!land(xx, yy) && !land(xx - 22, yy) && !land(xx + 22, yy) && !land(xx, yy - 14) && !land(xx, yy + 14)) WAVES.push([xx, yy, H1(xx + yy * 3)]) }
  }
  // момент, когда шлагбаум доходит до держателя (для падения)
  function hPushT(h) { const a = TM, d = 20 / h.r; for (let t = a.vygn; t < a.vygn + .7; t += .01) if (boomPhi(t) - d <= h.th) return t; return a.vygn + .62 }
  function holderPin(c, x, y, s, o = {}) {   // держатель стоит: белая капсула, тень вправо-вниз
    const L = 64 * s, w = 15 * s;
    if (o.sh !== false) { c.beginPath(); c.ellipse(x + 10 * s, y + 2 * s, 17 * s, 5 * s, .25, 0, TAU); fill(c, 'rgba(20,30,60,.3)') }
    rr(c, x - w / 2, y - L, w, L, w / 2); c.fillStyle = C4.iq; c.fill(); c.save(); rr(c, x - w / 2, y - L, w, L, w / 2); c.clip();
    c.fillStyle = C4.iqS; c.fillRect(x + w * .15, y - L, w, L); c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(x - w * .36, y - L + 5 * s, w * .16, L - 10 * s); c.fillStyle = C4.iqCap; c.fillRect(x - w / 2, y - L + L * .22, w, 2.5 * s); c.restore();
    rr(c, x - w / 2, y - L, w, L, w / 2); lnB(c, 1.5, 'rgba(20,23,51,.35)');
    if (o.hl > 0) { rr(c, x - 3 * s, y - L + 8 * s, 6 * s, 22 * s, 2); c.fillStyle = rgba('#E2412F', o.hl); c.fill(); glow(c, x, y - L + 19 * s, 36 * s, '#FF6A4A', .6 * o.hl) }   // v21.1: лезвие светится сквозь корпус
  }
  function holderState(h, t) {   // [x, y, наклон 0..1, в воде 0..1]
    const a = TM, phi = boomPhi(t), d = 20 / h.r; let th = t > a.vygn ? Math.min(h.th, phi - d) : h.th, x, y;
    x = BP[0] + Math.cos(th) * h.r; y = BP[1] + Math.sin(th) * h.r;
    if (h.tp === undefined) h.tp = hPushT(h);
    const fall = eio(at(t, h.tp, h.tp + .3)), wet = at(t, a.vygn + .6, a.vygn + 1.1), nx = Math.cos(BPHI1 - Math.PI / 2), ny = Math.sin(BPHI1 - Math.PI / 2);
    const out = 50 + h.r * .08, push = eo(at(t, h.tp, a.vygn + 1.2)) * out * (fall > 0 ? 1 : 0);
    x += nx * push; y += ny * push;
    const drift = ei(at(t, a.obesch - .25 + H1(h.i * 5) * .3, a.obesch + 1.3 + H1(h.i * 5) * .3)) * 760; x += drift; y += drift * .08;
    if (wet > 0) { y += Math.sin(t * 2.6 + h.ph) * 4 * wet; x += Math.sin(t * 1.7 + h.ph) * 3 * wet }
    return [x, y, fall, wet];
  }
  function gavel4(c, t) {   // молоток комиссии: опускается сверху, удар, кольца, уходит
    const a = TM, k = at(t, a.kom - .5, a.kom + .55); if (k <= 0 || k >= 1) return;
    const hk = .5 / 1.05, dn = k < hk ? ei(k / hk) : 1 - eo((k - hk) / (1 - hk)), s = lp(1.45, 1, dn), lift = lp(-380, 0, dn), rot = lp(-.75, -.2, dn), [gx, gy] = GV, ga = k < hk ? 1 : 1 - at(k, hk + .05, hk + .35);   // v21.1: меньше, после удара гаснет
    c.save(); c.globalAlpha *= .4 * dn * ga; c.beginPath(); c.ellipse(gx + 40, gy + 26, 120 * (2.2 - dn * 1.2), 34 * (2.2 - dn * 1.2), .2, 0, TAU); fill(c, '#0A0F23'); c.restore();
    c.save(); c.globalAlpha *= ga; c.translate(gx, gy + lift); c.rotate(rot); c.scale(s, s);
    rr(c, -13, -340, 26, 290, 12); cel(c, -13, -340, 26, 290, '#8A5A38', { sw: .35 }); rr(c, -13, -340, 26, 290, 12); lnB(c, 2, 'rgba(20,12,8,.4)');
    rr(c, -100, -76, 200, 82, 20); cel(c, -100, -76, 200, 82, '#6B4228', { sw: .3, hx: .1, ha: .25 }); c.fillStyle = '#C9A24A'; c.fillRect(-74, -76, 12, 82); c.fillRect(62, -76, 12, 82);
    rr(c, -100, -76, 200, 82, 20); lnB(c, 2.5, 'rgba(20,12,8,.45)'); c.restore();
    const ki = at(t, a.kom - .02, a.kom + .45); if (ki > 0 && ki < 1) for (let j = 0; j < 2; j++) ring(c, gx, gy - 20, 70 + 260 * eo(ki) * (1 + j * .45), `rgba(255,255,255,${.65 * (1 - ki)})`, 7 - j * 3);
  }
  function boom4(c, t) {   // красно-белый шлагбаум: «опускается» — вырастает из столба у Мэна, одним махом сметает держатели в океан
    const a = TM, k = eo(at(t, a.vygn - .22, a.vygn + .04)); if (k <= 0) return;
    const phi = boomPhi(t), L = BLEN * k, [px, py] = BP;
    c.save(); c.translate(px, py); c.rotate(phi);
    c.save(); c.translate(14, 16); rr(c, 0, -10, L, 20, 10); fill(c, 'rgba(10,20,50,.28)'); c.restore();
    rr(c, 0, -11, L, 22, 11); c.fillStyle = '#F4F1EA'; c.fill(); c.save(); rr(c, 0, -11, L, 22, 11); c.clip();
    for (let x = 34; x < L; x += 72) { c.fillStyle = '#D21F2E'; c.fillRect(x, -11, 36, 22) } c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(0, 3, L, 8); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(0, -8, L, 3); c.restore();
    rr(c, 0, -11, L, 22, 11); lnB(c, 2, 'rgba(20,23,51,.45)'); rr(c, -74, -17, 66, 34, 7); fill(c, '#3A3F4C'); c.restore();
    circ(c, px + 5, py + 7, 28, 'rgba(10,20,50,.3)'); circ(c, px, py, 26, '#5A5F72'); circ(c, px, py, 18, '#6E7488'); circ(c, px - 7, py - 8, 8, 'rgba(255,255,255,.4)');
  }
  // ---------- баночка (фильм): плывёт по волнам, шлагбаум поднимается, ценник, крышка открывается — подушечки ----------
  function canState(t) {   // [x, y, наклон ty, крышка 0..1]
    const a = TM; if (!a.vern || t < a.vern - .4) return null;
    const k1 = eo(at(t, a.vern - .4, a.zapr - .15)), x1 = 1846, y1 = 1588, k2 = eio(at(t, a.zapr + .25, a.zapr + 1.35)), wet = 1 - k2;
    let x = lp(lp(2070, x1, k1), CANF[0], k2), y = lp(lp(1606, y1, k1), CANF[1], k2) + Math.sin(t * 2.4) * 5 * wet;
    const ty = lp(.58 + .1 * Math.sin(t * 2.4) * wet, 1, eio(at(t, a.net - .25, a.net + .1))), lid = eio(at(t, a.net + .02, a.net + .38));
    return [x, y, ty, lid];
  }
  const POUCH = (x, y, R, ty, k) => { const al = Math.PI / 2 + k * TAU / 9; return [x + Math.cos(al) * R * .58, y + Math.sin(al) * R * .58 * ty, al] };
  function can4(c, t, x, y, R, ty, lid) {
    const hS = R * .78 * Math.sqrt(Math.max(0, 1 - ty * ty));   // бок баночки виден, пока она наклонена
    c.beginPath(); c.ellipse(x + R * .25, y + hS + R * ty * .5, R * 1.05, R * ty * .45 + 3, 0, 0, TAU); fill(c, 'rgba(10,25,60,.28)');
    if (hS > .5) { c.beginPath(); c.moveTo(x - R, y); c.lineTo(x - R, y + hS); c.ellipse(x, y + hS, R, R * ty, 0, Math.PI, 0, true); c.lineTo(x + R, y); c.closePath(); fill(c, '#E9EAEE');
      c.fillStyle = 'rgba(30,40,70,.12)'; c.fillRect(x + R * .35, y, R * .65, hS + R * ty * .6) }
    if (lid < 1) { c.beginPath(); c.ellipse(x, y, R, R * ty, 0, 0, TAU); fill(c, '#F4F4F2'); c.beginPath(); c.ellipse(x, y, R * .82, R * ty * .82, 0, 0, TAU); lnB(c, 1.4, 'rgba(120,128,145,.55)') }
    if (lid > 0) {   // внутри: дно и белые подушечки по кругу; крышка откидывается назад, за баночку
      c.beginPath(); c.ellipse(x, y, R * .94, R * ty * .94, 0, 0, TAU); fill(c, '#DADDE4');
      for (let k = 0; k < 9; k++) { const [px, py, al] = POUCH(x, y, R, ty, k); c.save(); c.translate(px, py); c.scale(1, ty); c.rotate(al);
        rr(c, -R * .18, -R * .13, R * .36, R * .26, R * .1); fill(c, C4.paperL); rr(c, -R * .18, -R * .13, R * .36, R * .26, R * .1); lnB(c, .7, 'rgba(150,156,170,.6)'); c.restore() }
      if (lid < 1) { const ly = y - R * ty * lp(0, 1.1, lid), lry = R * ty * lp(1, .28, lid); c.beginPath(); c.ellipse(x, ly, R, Math.max(.5, lry), 0, 0, TAU); fill(c, '#F7F7F5'); lnB(c, 1.2, 'rgba(120,128,145,.5)') }
      else { c.beginPath(); c.ellipse(x, y - R * ty * 1.1, R, R * ty * .28, 0, Math.PI, TAU); fill(c, '#ECEDEF') }
    }
  }
  function leaf4(c, t, x, y) {   // контур табачного листа над баночкой — перечёркивается и тает
    const a = TM, k = at(t, a.dazhe - .05, a.dazhe + .3), out = at(t, a.tab + .2, a.tab + .55); if (k <= 0 || out >= 1) return;
    c.save(); c.translate(x, y); c.globalAlpha *= Math.min(1, k * 2) * (1 - out); c.scale(lp(.7, 1, eo(k)), lp(.7, 1, eo(k)));
    c.beginPath(); c.moveTo(0, 30); c.bezierCurveTo(-26, 10, -22, -22, 0, -36); c.bezierCurveTo(22, -22, 26, 10, 0, 30); lnB(c, 2.4, '#7A5A26'); c.beginPath(); c.moveTo(0, 30); c.lineTo(0, -30); lnB(c, 1.4, '#7A5A26');
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, 12 - i * 13); c.lineTo(s * 13, 2 - i * 13); lnB(c, 1, '#7A5A26') }
    const kx = eo(at(t, a.tab - .05, a.tab + .2)); if (kx > 0) { c.beginPath(); c.moveTo(-30, 34); c.lineTo(lp(-30, 30, kx), lp(34, -38, kx)); lnB(c, 4, '#E2412F') }
    c.restore();
  }
  // ---------- карта целиком ----------
  function mapPrint(c, t) {
    const { x, y, w, h } = MAPH, x0 = x - w / 2, y0 = y - h / 2;
    rasterPoly(c, [x0 + w, y0 + 30, x0 + w + 44, y0 + 66, x0 + w + 44, y0 + h + 34, x0 + 44, y0 + h + 34, x0, y0 + h], 'rgba(6,8,24,.35)', 9, 2.4);
    c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip();
    c.fillStyle = '#9CC4DA'; c.fillRect(x0, y0, w, h);
    c.strokeStyle = 'rgba(52,96,140,.35)'; c.lineWidth = 2; for (const [wx, wy, ph] of WAVES) { const dx = Math.sin(t * 1.3 + ph * 6) * 4; c.beginPath(); c.moveTo(wx - 12 + dx, wy); c.quadraticCurveTo(wx - 6 + dx, wy - 5, wx + dx, wy); c.quadraticCurveTo(wx + 6 + dx, wy + 5, wx + 12 + dx, wy); c.stroke() }
    for (const p of [PJ.can, PJ.mex, ...PJ.isl]) { poly(c, p); fill(c, '#E2DCC9') }
    poly(c, PJ.hud); fill(c, '#9CC4DA');
    poly(c, PJ.us); fill(c, '#F2E5C1'); c.save(); poly(c, PJ.us); c.clip(); c.strokeStyle = 'rgba(140,110,60,.18)'; c.lineWidth = 1.6; c.setLineDash([6, 6]);
    for (const lon of [-100, -95, -90, -85, -80, -75, -70]) { const [lx] = mpj(lon, 37); c.beginPath(); c.moveTo(lx, y0); c.lineTo(lx, y0 + h); c.stroke() } c.setLineDash([]); c.restore();
    for (const p of PJ.lakes) { poly(c, p); fill(c, '#9CC4DA'); poly(c, p); lnB(c, 1.6, '#4E7FA6') }
    c.strokeStyle = 'rgba(70,110,150,.16)'; c.lineWidth = 1.5; for (let lat = 20; lat <= 55; lat += 5) { const [, ly] = mpj(-84, lat); c.beginPath(); c.moveTo(x0, ly); c.lineTo(x0 + w, ly); c.stroke() }
    for (const p of [PJ.us, PJ.can, PJ.mex, ...PJ.isl]) { poly(c, p); lnB(c, 2.4, '#4E7FA6') }
    c.setLineDash([8, 6]); c.beginPath(); for (const L of [[-95.2, 49.0, -89.6, 48.0], [-71.5, 45.0, -70.0, 46.7, -69.2, 47.45, -67.8, 45.9, -67.0, 44.8], [-117.1, 32.5, -111.1, 31.3, -106.5, 31.8, -104.5, 29.7, -102.4, 29.8, -99.5, 27.5, -97.4, 26.0]]) { for (let i = 0; i < L.length; i += 2) { const [px, py] = mpj(L[i], L[i + 1]); i ? c.lineTo(px, py) : c.moveTo(px, py) } } lnB(c, 1.6, 'rgba(120,90,50,.6)'); c.setLineDash([]);
    const [dx, dy] = mpj(-77.0, 38.9); star(c, dx, dy, 11, '#C8102E');
    { const [ux, uy] = mpj(-83.5, 39.2); tx(c, OBJ.mapUS, ux, uy, { f: 'P', w: 700, s: 30, c: 'rgba(110,84,40,.4)', ls: 10 }) }   // v21.1: подписи — на языке ролика, «США» не под листом патента
    { const [ox, oy] = mpj(-68.5, 32.6); OBJ.mapOcean.forEach((L, i) => tx(c, L, ox, oy + i * 28, { f: 'P', w: 400, st: 'italic', s: 22, c: 'rgba(40,80,120,.5)', ls: 3 })) }
    c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(x0 + w / 3 - 2, y0, 4, h); c.fillRect(x0 + w * 2 / 3 - 2, y0, 4, h); c.fillRect(x0, y0 + h / 2 - 2, w, 4);   // сгибы
    c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(x0 + w / 3 + 2, y0, 3, h); c.fillRect(x0 + w * 2 / 3 + 2, y0, 3, h); c.fillRect(x0, y0 + h / 2 + 2, w, 3);
    c.restore(); c.strokeStyle = 'rgba(60,50,30,.45)'; c.lineWidth = 2; c.strokeRect(x0, y0, w, h);
  }
  function usMapWorld(c, t, inH) {
    const a = TM; mapPrint(c, t);
    const kz = at(t, a.vygn + .5, a.vygn + .78); if (kz > 0) stamp4(c, TEXT.ban, 1560, 1712, kz, '#C8102E', -.16, 60);
    const P = patentPose(t), hl = at(t, a.narush - .05, a.narush + .3) * (1 - at(t, a.vygn - .3, a.vygn));
    if (t > TH.pat - .1) patent4(c, t, P.x, P.y, P.r, P.s, { lift: P.lift, hl });
    const { x: mx, y: my, w: mw, h: mh } = MAPH;
    c.save(); c.beginPath(); c.rect(mx - mw / 2, my - mh / 2, mw, mh); c.clip();
    const app = i => bo(at(t, a.perv - .35 + (i % 7) * .05, a.perv + .05 + (i % 7) * .05)), hop = Math.sin(Math.PI * at(t, a.kom, a.kom + .3)) * 16;
    const cut = t > a.narush - .15 && t < a.vygn - .12;
    for (const h of HOLD) { const s = app(h.i); if (s <= 0) continue; const [x, y, fall, wet] = holderState(h, t), hc = cut && h === HCUT;
      c.save(); c.translate(x, y - hop * (fall > 0 ? 0 : 1)); c.rotate(fall * (Math.PI / 2 - .3 + H1(h.i) * .6) + Math.sin(t * 2 + h.ph) * .08 * wet); c.scale(s, s);
      if (wet > 0) { c.beginPath(); c.ellipse(0, -30, 44 * wet, 16 * wet, 0, 0, TAU); c.strokeStyle = `rgba(255,255,255,${.35 * wet})`; c.lineWidth = 2; c.stroke() }
      holderPin(c, 0, 0, 1, { hl: hc ? hl : 0, sh: fall < .5 }); c.restore() }
    gavel4(c, t);
    if (hl > 0 && HCUT) { const [bx, by] = patentBlade(t), hx = HCUT.x, hy = HCUT.y - 64 + 19; c.save(); c.globalAlpha *= hl; c.setLineDash([14, 9]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(bx, by); c.lineTo(hx, hy); lnB(c, 5, '#E2412F'); c.setLineDash([]); circ(c, bx, by, 8, '#E2412F'); circ(c, hx, hy, 8, '#E2412F'); c.restore() }
    boom4(c, t);
    if (a.ugad) { const kq = at(t, a.ugad - .1, a.ugad + .35); if (kq > 0) { const [qx, qy] = QM, s = bo(kq) * (1 + .05 * Math.sin(t * 5)); c.save(); c.translate(qx, qy); c.scale(s, s);
      c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fillStyle = 'rgba(255,255,255,.25)'; c.fill(); c.setLineDash([9, 7]); c.lineDashOffset = -t * 20; lnB(c, 4, '#FFFFFF'); c.setLineDash([]);
      tx(c, '?', 0, 3, { f: 'M', w: 800, s: 48, c: '#FFFFFF' }); c.restore() } }
    const cs = canState(t); if (cs) { const [x, y, ty, lid] = cs; if (a.zapr && t > a.zapr - .2 && t < a.zapr + .5) ring(c, x, y, CANR * 1.3 + 30 * at(t, a.zapr - .2, a.zapr + .5), `rgba(255,255,255,${.4 * (1 - at(t, a.zapr - .2, a.zapr + .5))})`, 2);
      if (ty < .95) for (let j = 0; j < 2; j++) { const u = (t * .6 + j * .5) % 1; c.beginPath(); c.ellipse(x, y + CANR * .4, CANR * (1.1 + u * .8), CANR * ty * (.6 + u * .5), 0, 0, TAU); c.strokeStyle = `rgba(255,255,255,${.5 * (1 - u) * (1 - ty)})`; c.lineWidth = 2; c.stroke() }
      can4(c, t, x, y, CANR, ty, lid);
      const kt = at(t, a.shestn - .1, a.shestn + .25) * (1 - at(t, a.net - .35, a.net - .1)); if (kt > 0) { const sw = Math.sin(t * 3) * .18, tx0 = x + CANR * .7, ty0 = y - CANR * ty * .6;   // ценник на нитке
        c.save(); c.globalAlpha *= Math.min(1, kt * 2); c.translate(tx0, ty0); c.rotate(sw); c.beginPath(); c.moveTo(0, 0); c.lineTo(22, 26); lnB(c, 1.4, '#3A3F4C'); c.translate(22, 26); c.rotate(-.5);
        poly(c, [0, 0, 12, -9, 38, -9, 38, 9, 12, 9]); fill(c, '#F7F1DC'); poly(c, [0, 0, 12, -9, 38, -9, 38, 9, 12, 9]); lnB(c, 1, '#8A7A5A'); circ(c, 9, 0, 2.2, '#3A3F4C'); tx(c, '$', 25, 1, { f: 'M', w: 800, s: 12, c: '#17A86B' }); c.restore() }
      leaf4(c, t, x, y - CANR * 2.3) }
    c.restore();
  }
  // заголовки поверх кадра в мире карты (строка 13)
  function mapPlates(c, t) { const a = TM; capS(c, TEXT.itc, 560, 190, at(t, a.kom + .12, a.kom + .42) * (1 - at(t, a.narush - .35, a.narush - .1)), { s: 38 }) }   // v21.2: выше синего PATENT, правее плашки года
