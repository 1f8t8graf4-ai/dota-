  // ================= v18.5: вложенные миры — одна камера на весь выпуск =================
  // Камера одна: ключи в координатах мира 1 (KB). Мир-ребёнок лежит в «окне» родителя (дыра в бумаге, колба, бак):
  // точка ребёнка (x, y) = родитель (ox + x·s, oy + y·s), зум ребёнка = зум родителя · s. Рисуем самый глубокий мир, в окне
  // которого целиком стоит камера (кадр tin — как TIN у окна Капитолия): шва нет, родитель рисует ребёнка через окно до этого.
  const NEST = {
    S: { par: null, ox: CWIN.x - 500 * SHS, oy: CWIN.y - 750 * SHS, s: SHS },   // лист закона (координаты листа)
    B: { par: 'S', ox: 720, oy: 2720, s: 150 / 700 },                           // карта: полка «Джула» → океан → Шэньчжэнь
    C: { par: 'B', ox: 150, oy: 575, s: 260 / 700 },                            // жидкость в столбике → горло → бак
    D: { par: 'C', ox: 1900, oy: -3500, s: .5 },                                 // пузырь в баке одноразки → колба → касса → корпорации
  };
  const TINW = { B: 99, C: 99, D: 99 };
  function nestUp(id, x, y, lz) {   // точка и ln-зум мира id → мир 1
    for (let n = NEST[id]; n; n = NEST[n.par]) { x = n.ox + x * n.s; y = n.oy + y * n.s; lz -= Math.log(n.s); if (!n.par) break }
    return [x, y, lz];
  }
  function camIn(id, cm) {   // камера мира 1 → камера мира id
    const ch = []; for (let n = id; n; n = NEST[n].par) ch.unshift(n);
    let { x, y, z, r } = cm; for (const n of ch) { const q = NEST[n]; x = (x - q.ox) / q.s; y = (y - q.oy) / q.s; z *= q.s }
    return { x, y, z, r };
  }
  const KW = (id, t, x, y, z, r = 0) => { const p = nestUp(id, x, y, Math.log(z)); return [t, p[0], p[1], p[2], r] };
  function scanTin(id, par, rect, t0, t1) {   // первый кадр, когда камера (в координатах родителя) целиком в окне
    for (let f = Math.floor(t0 * 30); f < t1 * 30; f++) {
      const cm = par === 'W' ? camW(f / 30) : camIn(par, camW(f / 30)), v = viewRect(cm);
      if (v.x0 > rect.x0 && v.x1 < rect.x1 && v.y0 > rect.y0 && v.y1 < rect.y1) return f / 30;
    }
    throw new Error('v185: камера не заходит в окно мира ' + id);
  }
  // общий передний план любого мира: черты скорости по настоящей скорости камеры (в своих координатах)
  function speedLoc(c, cm, cm2, t, col = 'rgba(238,242,247,.55)') {
    const vx = (cm2.x - cm.x) * cm.z, vy = (cm2.y - cm.y) * cm.z, dz = Math.log(cm2.z / cm.z);
    const kp = cl((Math.hypot(vx, vy) - 22) / 50), kz = cl((Math.abs(dz) - .05) / .1);
    c.save();
    if (kp > 0) { const a = Math.atan2(vy, vx); for (let i = 0; i < 14; i++) {
      const L = 90 + H1(i) * 170, off = ((H1(i * 5.5) * 2400 - t * 2600) % 2400 + 2400) % 2400 - 1200, side = (H1(i * 3.7) - .5) * 1900;
      const cx = 540 + Math.cos(a) * off - Math.sin(a) * side, cy = 960 + Math.sin(a) * off + Math.cos(a) * side;
      A(c, kp * .5, () => { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - Math.cos(a) * L, cy - Math.sin(a) * L); lnW(c, 4, col) }) } }
    if (kz > 0) for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + H1(i) * .2, r0 = 380 + ((t * 1600 * Math.sign(dz) + H1(i * 7) * 700) % 700 + 700) % 700;
      A(c, kz * .45, () => { c.beginPath(); c.moveTo(540 + Math.cos(a) * r0, 960 + Math.sin(a) * r0 * 1.4); c.lineTo(540 + Math.cos(a) * (r0 + 140), 960 + Math.sin(a) * (r0 + 140) * 1.4); lnW(c, 4, col) }) }
    c.restore();
  }
  // ---------- мир S: лист закона «разворачивается» вниз — указ, картридж, пустой контур одноразки → дыра ----------
  let W2 = null;   // время слов мира 2
  function w2Words() {
    const w = Wd; W2 = {
      s3: w('но'), razv: w('разверните'), doc: w('документ'), zap: w('запрет'), prop: w('прописали'), only: w('только'), veip: w('вейпов'),
      smen: w('сменными'), cart: w('картриджами'), cel: w('цельные'), odr: w('одноразовые'), tam: w('там'), prosto: w('просто'), upom: w('упомянуты'),
      poka: w('пока'), juul: w('джул'), ubir: w('убирал'), vkus: w('вкусы'), polok: w('полок'), shen: w('шэньчжэне'), uzhe: w('уже'), zapusk: w('запускали'),
      conv: w('конвейеры'), puff: w('puff bar'), hqd: w('hqd'), elf: w('elf bar'), odn: w('одноразки'), nakr: w('накрыли'), amer: w('америку'), voln: w('волной'),
      vsego: w('всего'), god: w('год'), dolya: w('доля'), par: w('парящих'), star: w('старшеклассников'), vyr: w('выросла'), x11: w('одиннадцать'), raz: w('раз'),
    };
  }
  const RB = t => 1500 + 1720 * eio(at(t, W2.razv - .05, W2.doc + .8));   // где сейчас валик (низ развёрнутого листа)
  const SHOLE = { u: 720, v: 2720, w: 150, h: 360, r: 34 };
  function holePathS(c) { c.beginPath(); c.roundRect(SHOLE.u - SHOLE.w / 2, SHOLE.v - SHOLE.h / 2, SHOLE.w, SHOLE.h, SHOLE.r) }
  function scrollW(c, t) {   // продолжение листа ниже 1500 (координаты листа)
    if (!W2) w2Words();
    const k = W2, I = W1.ink, rb = RB(t);
    if (rb > 1502) {
      c.beginPath(); c.rect(22, 1500, 1000, rb - 1500 + 20); fill(c, 'rgba(8,10,24,.35)');
      c.beginPath(); c.rect(0, 1490, 1000, rb - 1490); fill(c, W1.paper);
      c.beginPath(); c.moveTo(0, 1500); c.lineTo(0, rb); c.moveTo(1000, 1500); c.lineTo(1000, rb); lnW(c, 5, I);
      c.save(); c.beginPath(); c.rect(0, 1500, 1000, rb - 1530); c.clip(); dotsRect(c, 930, 1500, 70, 1800, 14, 2.4, 'rgba(30,35,64,.10)'); decreeW(c, t); c.restore();
    }
    // валик: бумага намотана, торцы — тёмное дерево, полоски крутятся по мере размотки
    c.save(); c.translate(0, rb);
    c.beginPath(); c.roundRect(-34, -30, 1068, 60, 30); fill(c, '#e9e1cf'); lnW(c, 5, I);
    c.save(); c.beginPath(); c.roundRect(-34, -30, 1068, 60, 30); c.clip();
    for (let i = 0; i < 6; i++) { const ph = ((rb * .9 / 60 + i / 6) % 1); const yy = -30 + 60 * ph; c.beginPath(); c.moveTo(-40, yy); c.lineTo(1040, yy); lnW(c, 2, rgba('#9a8f78', Math.sin(Math.PI * ph) * .6)) }
    c.restore();
    [-34, 1034].forEach(x => { c.beginPath(); c.ellipse(x, 0, 16, 38, 0, 0, TAU); fill(c, '#7a4e33'); lnW(c, 4, I) });
    c.restore();
  }
  function decreeW(c, t) {
    const k = W2, I = W1.ink;
    const kh = eo(at(t, k.razv + .3, k.doc + .3));
    tx(c, 'FDA · США', 80, 1575, { f: 'M', w: 800, s: 28, c: '#7b8098', al: 'left', a: kh });
    c.save(); c.beginPath(); c.rect(70, 1590, 880 * kh, 90); c.clip(); tx(c, 'УКАЗ · ЯНВАРЬ 2020', 80, 1636, { f: 'U', w: 800, s: 54, c: I, al: 'left' }); c.restore();
    c.beginPath(); c.moveTo(80, 1688); c.lineTo(80 + 520 * kh, 1688); lnW(c, 7, W1.red);
    [[1745, 760], [1785, 620]].forEach(([v, L], i) => { const kl = eo(at(t, k.doc + i * .08, k.doc + .4 + i * .08)); if (kl > 0) { c.beginPath(); c.roundRect(80, v - 9, L * kl, 18, 9); fill(c, '#c9ccd8') } });
    // «запрет прописали только…»: строка пишется, «ТОЛЬКО» — маркером
    const kz = eo(at(t, k.zap - .15, k.prop + .3)), o1 = { f: 'M', w: 800, s: 44, c: I, al: 'left' }, w1 = tw(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ', o1), w2 = tw(c, 'ТОЛЬКО:', o1);
    const km = eio(at(t, k.only - .12, k.only + .3)); if (km > 0) { c.beginPath(); c.roundRect(80 + w1 - 8, 1868 - 30, (w2 + 16) * km, 62, 10); fill(c, '#fde047') }
    c.save(); c.beginPath(); c.rect(70, 1820, (w1 + w2 + 30) * kz, 100); c.clip(); tx(c, 'ПОД ЗАПРЕТ ПОПАДАЮТ ТОЛЬКО:', 80, 1870, o1); c.restore();
    const kv = eo(at(t, k.only + .1, k.veip + .2)), o2 = { f: 'M', w: 800, s: 40, c: I, al: 'left' };
    c.save(); c.beginPath(); c.rect(70, 1925, 900 * kv, 130); c.clip(); tx(c, '• ВЕЙПЫ СО СМЕННЫМИ', 80, 1965, o2); tx(c, 'КАРТРИДЖАМИ', 116, 2020, o2); c.restore();
    const ku = eio(at(t, k.veip, k.cart + .35)); if (ku > 0) { c.beginPath(); c.moveTo(80, 1992); c.lineTo(80 + 470 * cl(ku * 2), 1992); if (ku > .5) { c.moveTo(116, 2047); c.lineTo(116 + 320 * cl(ku * 2 - 1), 2047) } lnW(c, 6, W1.red) }
    // вейп с картриджем: на «сменными» картридж выскакивает, на «картриджами» щёлкает обратно
    const ka = bo(at(t, k.veip - .2, k.veip + .3)); if (ka > 0) {
      const pop = 95 * (eo(at(t, k.smen - .05, k.smen + .25)) - eio(at(t, k.cart, k.cart + .22))) + (t > k.cart + .22 ? 10 * Math.exp(-(t - k.cart - .22) * 9) * Math.sin((t - k.cart - .22) * 40) : 0);
      c.save(); c.translate(470, 2210); c.scale(ka, ka); c.rotate(-.04);
      c.beginPath(); c.roundRect(-250 + 12, -36 + 14, 380, 72, 30); fill(c, 'rgba(30,35,64,.18)');
      c.beginPath(); c.roundRect(-250, -36, 380, 72, 30); fill(c, '#a9b0c4'); lnW(c, 5, I);
      c.save(); c.beginPath(); c.roundRect(-250, -36, 380, 72, 30); c.clip(); c.fillStyle = '#c7ccda'; c.fillRect(-250, -36, 380, 20); dotsRect(c, -250, 10, 380, 26, 12, 2.2, 'rgba(30,35,64,.16)'); c.restore();
      circ(c, -200, 0, 8, '#7dd3fc');
      c.save(); c.translate(130 + pop, 0); c.beginPath(); c.roundRect(-10, -34, 130, 68, 24); fill(c, '#f97316'); lnW(c, 5, I);
      c.beginPath(); c.roundRect(70, -34, 50, 68, 20); fill(c, I); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(6, -24, 52, 10); c.restore();
      const kt = cl(pop / 60); if (kt > .05) plate(c, 'СМЕННЫЙ', 190 + pop, -86, kt, { s: 24, bg: W1.red, c: '#fff', sh: false });
      c.restore();
    }
    [[2340, 820], [2380, 700], [2420, 760]].forEach(([v, L], i) => { const kl = eo(at(t, k.cart + i * .06, k.cart + .4 + i * .06)); if (kl > 0) { c.beginPath(); c.roundRect(80, v - 9, L * kl, 18, 9); fill(c, '#c9ccd8') } });
    // «А цельные одноразовые там…»: строки текста слева, справа — пустой пунктирный контур; «не упомянуты» — штамп
    [2560, 2610, 2660, 2760, 2810, 2860].forEach((v, i) => { const kl = eo(at(t, k.cel - .3 + i * .05, k.cel + .1 + i * .05)); if (kl > 0) { c.beginPath(); c.roundRect(80, v - 9, (330 + 120 * H1(i * 3.3)) * kl, 18, 9); fill(c, '#c9ccd8') } });
    const ko = eio(at(t, k.cel, k.odr + .55)); if (ko > 0) {
      A(c, eo(at(t, k.odr - .1, k.odr + .3)), () => tx(c, 'ОДНОРАЗКИ?', SHOLE.u, SHOLE.v - SHOLE.h / 2 - 50, { f: 'U', w: 800, s: 36, c: W1.red }));
      const kd = at(t, k.poka - .4, k.poka + .3);   // кусок бумаги внутри контура проваливается — открывается дыра
      if (kd > 0) holeInW(c, t);
      if (kd < 1) {
        c.save(); c.translate(SHOLE.u, SHOLE.v + 260 * ei(kd)); c.rotate(.5 * ei(kd)); c.scale(1 - .45 * ei(kd), 1 - .45 * ei(kd)); c.translate(-SHOLE.u, -SHOLE.v);
        holePathS(c); fill(c, mixc(W1.paper, '#cfc6b2', kd));
        const pq = .5 + .5 * Math.sin(t * 5); A(c, (1 - kd) * at(t, k.odr, k.odr + .3) * (1 - at(t, k.upom - .2, k.upom + .2)), () => tx(c, '?', SHOLE.u, SHOLE.v, { f: 'U', w: 800, s: 120, c: rgba(W1.red, .25 + .2 * pq) }));
        c.restore();
      }
      c.save(); c.beginPath(); c.rect(SHOLE.u - 200, SHOLE.v - SHOLE.h / 2 - 30, 400, (SHOLE.h + 60) * ko); c.clip(); holePathS(c); c.setLineDash([22, 14]); c.lineDashOffset = -t * 30; lnW(c, 6, W1.red); c.setLineDash([]); c.restore();
    }
    const ks = spr(at(t, k.upom - .08, k.upom + .4)); if (ks > 0) { c.save(); c.translate(300, 2712); c.rotate(-.13); c.scale(ks * lp(1.6, 1, cl(ks)), ks * lp(1.6, 1, cl(ks))); c.beginPath(); c.roundRect(-200, -42, 400, 84, 12); lnW(c, 7, W1.red); tx(c, 'НЕ УПОМЯНУТЫ', 0, 4, { f: 'U', w: 800, s: 38, c: W1.red }); c.restore() }
  }
  function w2Keys() {   // ключи камеры мира 2 (лист → дыра → карта), в координатах мира 1
    const S = (t, u, v, z, r = 0) => KW('S', t, u, v, z, r), B = (t, x, y, z, r = 0) => KW('B', t, x, y, z, r), C = (t, x, y, z, r = 0) => KW('C', t, x, y, z, r), D = (t, x, y, z, r = 0) => KW('D', t, x, y, z, r);
    return [
      S(22.35, 500, 1640, 1.05), S(23.45, 505, 1830, 1.12, .004), S(24.55, 500, 1960, 1.2, -.004), S(25.7, 495, 2130, 1.3), S(26.95, 540, 2440, 1.2, .006),
      S(28.35, 545, 2650, 1.32, -.004), S(29.3, 650, 2716, 2.4), S(29.95, 719, 2745, 5.0),
      B(30.5, 0, 60, 1.76), B(31.0, 0, -40, 1.9), B(31.55, 0, -200, 1.2), B(32.3, 0, -900, .33), B(33.2, 0, -3000, .62, .01), B(34.1, 60, -2700, .8),
      B(35.95, 170, -2560, .78, -.006), B(36.6, 60, -2250, .6), B(37.4, 0, -700, .47), B(38.15, 0, 650, .5), B(38.9, 0, 500, .68, .006), B(40.6, 60, 520, .74),
      B(42.6, 150, 420, .95, -.004), B(43.3, 150, 560, 2.4), B(43.85, 150, 575, 4.6),
      C(44.6, 0, -60, 1.85), C(45.9, 0, -300, 1.6, .004), C(47.1, 0, -260, 1.3, -.004), C(48.3, 0, -520, 1.15), C(49.6, 0, -1500, 1.0), C(50.5, 350, -2380, .8, .006),
      C(51.45, 900, -2330, .85), C(52.6, 1080, -2300, .92, -.004), C(53.6, 450, -900, .33), C(54.9, -650, -250, .29, .004), C(56.4, 300, -350, .21), C(57.9, 900, -2300, .19, -.004),
      C(59.3, 1900, 500, .42), C(60.6, 1900, -1450, .5, .004), C(61.9, 2950, -1250, .21), C(62.9, 2500, -2500, .3), C(63.7, 1900, -3440, 1.25),
      D(64.35, 0, 30, 2.1), D(65.2, 0, -40, 1.25), D(66.2, 150, 150, .6, .004), D(67.1, 750, -150, .52), D(68.3, -420, -250, .42, -.004), D(68.95, -260, -180, .43), D(69.9, 1500, 350, .42),
      D(70.8, 2700, 450, .45), D(71.9, 4300, 250, .55, .004), D(73.3, 4600, -900, .36), D(75.2, 4800, -1500, .3), D(76.6, 4820, -1700, .28),
    ];
  }
  function holeInW(c, t) {   // дыра в листе: внутри — мир B
    c.save(); holePathS(c); c.clip();
    const n = NEST.B; c.save(); c.translate(n.ox, n.oy); c.scale(n.s, n.s); drawB(c, t, null); c.restore();
    c.save(); holePathS(c); c.lineWidth = 26; c.strokeStyle = 'rgba(8,10,24,.45)'; c.stroke(); c.restore();
    c.restore();
  }
  function tinInit() {   // кадры входа в окна миров
    TINW.B = scanTin('B', 'S', { x0: SHOLE.u - SHOLE.w / 2 + 1, x1: SHOLE.u + SHOLE.w / 2 - 1, y0: SHOLE.v - SHOLE.h / 2 + SHOLE.r, y1: SHOLE.v + SHOLE.h / 2 - SHOLE.r }, 29.5, 31.5);
    TINW.C = scanTin('C', 'B', { x0: COL.x0 + 1, x1: COL.x1 - 1, y0: COL.base - COL.h + 1, y1: COL.base - 1 }, 42.8, 44.6);
    for (let f = Math.floor(63.2 * 30); f < 65 * 30 && TINW.D > 98; f++) {   // пузырь — круг: все четыре угла кадра внутри
      const v = viewRect(camIn('C', camW(f / 30))), r2 = (BUB.r - 2) ** 2;
      if ([[v.x0, v.y0], [v.x1, v.y0], [v.x0, v.y1], [v.x1, v.y1]].every(([x, y]) => (x - BUB.x) ** 2 + (y - BUB.y) ** 2 < r2)) TINW.D = f / 30;
    }
    if (TINW.D > 98) throw new Error('v185: камера не заходит в пузырь');
  }
