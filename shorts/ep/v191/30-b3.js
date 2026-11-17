  // ================= блок 3 (20,9–38,8 с): лист разворачивается → «только для сменных картриджей» → «цельные одноразовые — НЕ УПОМЯНУТЫ» →
  // рывок вправо к полке «Джула»: вкусы уходят, в нижней дыре ТАБАК и МЕНТОЛ → полка проворачивается барабаном (валики, Соболев #112) →
  // цех в Шэньчжэне, коробки PUFF BAR / HQD / ELF BAR → лента изгибается в волну (Instagram #007) и накрывает магазин в США =================
  let T3 = null;
  // v19.1: лист ниже (на месте гильотины), лезвие сворачивается в валики (Соболев #112) и раскатывает указ;
  // на «Пока «Джул»…» камера ныряет сквозь дыру в бумаге «ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ» — мир H (полка, цех, волна, график, бак) лежит в дыре:
  // точка H (x, y) = O (HX3 + x·HS3, HY3 + y·HS3). Полка не переворачивается барабаном: её средняя доска вытягивается в ленту конвейера.
  const DY3 = -790, HOLE3 = { x: 440, y: 1840 + DY3, w: 400, h: 120 }, HS3 = .068, HX3 = 640 - 2700 * HS3, HY3 = 1110 - 1100 * HS3;
  const KH = (t, x, y, z) => KO2(t, HX3 + x * HS3, HY3 + y * HS3, z / HS3);
  const camH = o => ({ x: (o.x - HX3) / HS3, y: (o.y - HY3) / HS3, z: o.z * HS3, r: o.r });
  let THIN3 = 99;
  const PG3 = { x0: 210, x1: 870, y0: 1350, y1: 2260 }, SHF = { x0: 2190, x1: 3210, y0: 240, y1: 1960, cy: 1100 }, BELT = 1300, USS = { x0: 4020, x1: 4520, g: 1480 };
  const BOX3 = [['PUFF BAR', '#b65bd6', 2440], ['HQD', '#2f80ed', 2700], ['ELF BAR', '#16c09a', 2960]];
  function b3Words() {
    const w = Wd; T3 = { unf: w('разверните'), zap: w('запрет'), only: w('только'), smen: w('сменными'), cart: w('картриджами'), cel: w('цельные'), odn: w('одноразовые'),
      upom: w('упомянуты'), poka: w('пока'), ubir: w('убирал'), flip: 31.5, shen: w('шэньчжэне'), conv: w('конвейеры'), box: [w('puff bar'), w('hqd'), w('elf bar')],
      wave: 36.0, nakr: w('накрыли'), am: w('америку'), voln: w('волной'), end: w('всего') + .02 };
    T3.rl = T2.chop + .33; T3.rp0 = T3.unf - .2; T3.rp1 = T3.unf + .5; T3.rx = T3.rp1 + .05;
    T2.fin = T3.end;
  }
  function b3Keys() {
    if (!T3) b3Words();
    return [KO2(21.4, 540, 1015, .98), KO2(22.45, 540, 980, 1.04), KO2(25.9, 545, 1000, 1.07), KO2(T3.upom - .05, 540, 1010, 1.08), KO2(T3.upom + .2, 540, 1010, 1.08),
      KO2(T3.poka - .4, 610, 1060, 1.12), KH(T3.poka + .45, 2700, 1100, 1.17), KH(T3.flip - .2, 2700, 1100, 1.2), KH(T3.flip + .85, 2640, 1030, 1.0), KH(T3.wave - .05, 2730, 1070, 1.04),
      KH(T3.wave + .5, 2950, 1080, 1.06), KH(T3.am + .05, 4180, 1060, 1.05), KH(T3.voln + .25, 4260, 1080, 1.0), KH(T3.end, 4270, 1090, .99), ...(typeof b4Keys === 'function' ? b4Keys() : [])];
  }
  // ---------- развёрнутый лист ----------
  function podIcon(c, x, y, t, pale) {   // вейп со сменным картриджем: картридж выскакивает и встаёт обратно
    if (pale) { c.setLineDash([12, 10]); rr(c, x - 38, y - 110, 76, 220, 26); lnB(c, 4, '#b9b2a2'); c.setLineDash([]); return }
    const u = ((t - T3.smen) % 1.1 + 1.1) % 1.1, up = t > T3.smen ? 40 * Math.sin(Math.PI * cl(u / .5)) : 0;
    rr(c, x - 36, y - 60, 72, 170, 18); cel(c, x - 36, y - 60, 72, 170, B2.ind, { hw: .14 }); rr(c, x - 36, y - 60, 72, 170, 18); lnB(c, 4, B2.ink);
    rr(c, x - 30, y - 112 - up, 60, 60, 14); cel(c, x - 30, y - 112 - up, 60, 60, B2.mango, { hw: .14 }); rr(c, x - 30, y - 112 - up, 60, 60, 14); lnB(c, 4, B2.ink);
  }
  function pageBody(c, t) {   // содержимое указа в координатах листа (как в v19.0), сдвиг DY3 снаружи
    const { x0, x1, y0, y1 } = PG3, w = x1 - x0, h = y1 - y0;
    castDots(c, x0, y0, w, h, 140, { st: 16 });
    rr(c, x0, y0, w, h, 8); cel(c, x0, y0, w, h, B2.cream, { hw: .03, sw: .12, gr: .12 }); rr(c, x0, y0, w, h, 8); lnB(c, 4, '#c9c1ae');
    const kt = eo(at(t, T3.zap - .1, T3.zap + .7)); c.save(); c.beginPath(); c.rect(x0, y0, w * kt + 1, 200); c.clip(); tx(c, 'ЗАПРЕТ — ТОЛЬКО ДЛЯ:', 540, 1440, { f: 'U', w: 800, s: 44, c: B2.ink, mw: 590 }); c.restore();
    c.fillStyle = B2.ink; c.fillRect(260, 1490, 560 * kt, 5);
    const ka = bo(at(t, T3.only - .15, T3.only + .3)); if (ka > 0) { c.save(); c.translate(330, 1640); c.scale(ka, ka); podIcon(c, 0, 0, t, false); c.restore();
      const km = eo(at(t, T3.only, T3.cart + .3)); c.fillStyle = 'rgba(253,224,71,.85)'; c.fillRect(440, 1585, 400 * km, 46); c.fillRect(440, 1645, 290 * cl(km * 1.3 - .3), 46);
      tx(c, 'ВЕЙПОВ СО СМЕННЫМИ', 640, 1610, { f: 'M', w: 800, s: 34, c: B2.ink, mw: 390 }); tx(c, 'КАРТРИДЖАМИ', 585, 1670, { f: 'M', w: 800, s: 34, c: B2.ink });
      const kc = bo(at(t, T3.cart + .2, T3.cart + .5)); if (kc > 0) { c.save(); c.translate(800, 1680); c.scale(kc, kc); circ(c, 0, 0, 30, '#16a34a'); c.beginPath(); c.moveTo(-13, 0); c.lineTo(-3, 11); c.lineTo(14, -10); lnB(c, 7, '#fff'); c.restore() } }
    const kb = bo(at(t, T3.cel - .15, T3.cel + .3)); if (kb > 0) { c.save(); c.translate(330, 1900); c.scale(kb, kb); podIcon(c, 0, 0, t, true); tx(c, '?', 0, 0, { f: 'M', w: 800, s: 80, c: '#b9b2a2' }); c.restore();
      hole3(c, t, kb) }
    const ks = at(t, T3.upom - .1, T3.upom + .02); if (ks > 0) { const s = lp(2.4, 1, eo(ks)); c.save(); c.translate(545, 2110); c.rotate(-.08); c.scale(s, s); c.globalAlpha *= cl(ks * 3);
      rr(c, -260, -54, 520, 108, 12); fill(c, 'rgba(214,51,77,.08)'); rr(c, -260, -54, 520, 108, 12); lnB(c, 9, B2.red); tx(c, 'НЕ УПОМЯНУТЫ', 0, 4, { f: 'U', w: 800, s: 56, c: B2.red, ls: 2, mw: 470 }); c.restore() }
  }
  function hole3(c, t, kb) {   // пустая клетка «ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ»: на «Пока…» бумага в ней проваливается люком, в дыре — полка «Джула»
    const x = 440, y = 1840, w = 400, h = 120, kh = eio(at(t, T3.poka - .5, T3.poka - .1));
    if (kh > 0) { c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.translate(HX3, HY3 - DY3); c.scale(HS3, HS3); innerW(c, t); c.restore() }
    if (kh < 1) { const ch = Math.cos(kh * Math.PI / 2); c.save(); c.translate(0, y); c.scale(1, Math.max(.001, ch)); c.translate(0, -y);
      rr(c, x, y, w, h, 10); fill(c, mixc(B2.cream, '#8d8572', kh));
      const pl = .6 + .4 * Math.sin((t - T3.cel) * 7); c.setLineDash([14, 10]); rr(c, x, y, w, h, 10); lnB(c, 4, mixc('#cfc8b8', '#9a937f', pl)); c.setLineDash([]);
      tx(c, 'ЦЕЛЬНЫЕ', 640, 1872, { f: 'M', w: 800, s: 34, c: '#a8a190' }); tx(c, 'ОДНОРАЗОВЫЕ', 640, 1926, { f: 'M', w: 800, s: 34, c: '#a8a190' }); c.restore() }
    if (kh > 0) { rr(c, x, y, w, h, 10); lnB(c, 5, B2.ink); c.fillStyle = 'rgba(20,23,51,.5)'; c.fillRect(x, y, w, 10 * kh) }   // край дыры
  }
  function roller3(c, y, x0, x1, kh = 1) {   // серый валик с жёлтыми ручками (Соболев #112)
    const r = 42; rr(c, x0, y - r, x1 - x0, r * 2, r); cel(c, x0, y - r, x1 - x0, r * 2, '#a3a9bd', { hw: .1, sw: .3 }); c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(x0 + 20, y - r + 14, x1 - x0 - 40, 8); rr(c, x0, y - r, x1 - x0, r * 2, r); lnB(c, 4);
    if (kh > 0) [[x0, -1], [x1, 1]].forEach(([xe, sd]) => { c.fillStyle = '#4b5068'; c.fillRect(sd > 0 ? xe : xe - 22 * kh, y - 8, 22 * kh, 16); rr(c, sd > 0 ? xe + 18 * kh : xe - 18 * kh - 30, y - 34, 30, 68, 12); cel(c, sd > 0 ? xe + 18 * kh : xe - 18 * kh - 30, y - 34, 30, 68, '#f2b84b', { hw: .14 }); rr(c, sd > 0 ? xe + 18 * kh : xe - 18 * kh - 30, y - 34, 30, 68, 12); lnB(c, 3) });
  }
  function page3(c, t) {   // мир O: лезвие → валик → два валика расходятся вверх и вниз, между ними — указ
    if (t < T3.rl) return;
    const ym = (PG3.y0 + PG3.y1) / 2 + DY3, H2 = (PG3.y1 - PG3.y0) / 2, ku = eio(at(t, T3.rp0, T3.rp1)), hh = H2 * ku, kx = ei(at(t, T3.rx, T3.rx + .45));
    if (ku > 0) { c.save(); c.beginPath(); c.rect(PG3.x0 - 30, ym - hh, PG3.x1 - PG3.x0 + 60, hh * 2); c.clip(); c.translate(0, DY3); pageBody(c, t); c.restore() }
    if (kx >= 1) return;
    const km = eio(at(t, T3.rl, T3.rl + .42)), by = bladeY(T3.rl);
    if (km < 1) {   // косое лезвие сворачивается в цилиндр и поднимается к середине листа
      const B = [[BLD2.x0, BLD2.top + by], [BLD2.x1, BLD2.top + by], [BLD2.x1, BLD2.br + by], [BLD2.x0, BLD2.bl + by]], Rc = [[180, ym - 42], [900, ym - 42], [900, ym + 42], [180, ym + 42]];
      const P = B.map((p, i) => [lp(p[0], Rc[i][0], km), lp(p[1], Rc[i][1], km)]); poly(c, P.flat());
      cel(c, Math.min(...P.map(p => p[0])), Math.min(...P.map(p => p[1])), 720, Math.max(...P.map(p => p[1])) - Math.min(...P.map(p => p[1])), mixc(B2.steel, '#a3a9bd', km), { hw: .08, sw: .25 }); poly(c, P.flat()); lnB(c, 4, mixc('#ffffff', B2.ln, km));
      return }
    const yT = ym - hh - 1300 * kx * kx, yB = ym + hh + 1300 * kx * kx;
    roller3(c, yB, 180, 900, 1); roller3(c, yT, 180, 900, 1);
  }
  function innerW(c, t) {   // мир H: тёмная глубина, полка «Джула» → её доска вытягивается в ленту → цех, волна, график, бак
    c.fillStyle = '#14172e'; c.fillRect(-3000, -2000, 12000, 7000);
    const kc = eio(at(t, T3.flip - .1, T3.flip + .8));
    if (kc > 0) factory(c, t, kc);
    if (kc < 1) shelfCollapse(c, t, kc);
  }
  function shelfCollapse(c, t, kc) {   // полка сжимается к средней доске, доска вытягивается в стальную ленту конвейера (#182)
    const yP = 1320;
    c.save(); c.translate(0, yP + 17); c.scale(1, Math.max(.001, 1 - kc)); c.translate(0, -yP - 17); shelfFront(c, t, kc > 0); c.restore();
    if (kc <= 0) return;
    const L = lp(2330, 1700, kc), Rr = lp(3070, 3500, kc), h = lp(34, 10, kc), y = lp(yP, BELT - 5, kc);
    for (let x = 1760; x < 3500; x += 120) if (x > L && x < Rr) { const r = 26 * ss(.4, 1, kc); if (r > 1) { circ(c, x, BELT + 40, r, '#3a3f66'); ring(c, x, BELT + 40, r, B2.ln, 3) } }
    rr(c, L, y, Rr - L, h, 6); cel(c, L, y, Rr - L, h, mixc(B2.wood, B2.ln, kc), { hw: .03 }); rr(c, L, y, Rr - L, h, 6); lnB(c, 3);
  }
  // ---------- полка «Джула» (лицевая сторона барабана) ----------
  const PODC = [B2.mango, B2.coral, '#f19ac2', B2.mint, '#b65bd6', '#f2d24b', B2.ice2, '#9a6a44'];
  function pod3(c, x, y, col, lab) {
    rr(c, x - 30, y - 100, 60, 100, 12); cel(c, x - 30, y - 100, 60, 100, col, { hw: .14 }); rr(c, x - 30, y - 100, 60, 34, 12); fill(c, '#2d3142'); rr(c, x - 30, y - 100, 60, 100, 12); lnB(c, 3);
    if (lab) { rr(c, x - 50, y + 10, 100, 34, 6); fill(c, B2.cream); tx(c, lab, x, y + 28, { f: 'M', w: 800, s: 20, c: B2.ink, mw: 92 }) }
  }
  function shelfFront(c, t, skip) {
    const { x0, x1, y0, y1 } = SHF; c.fillStyle = '#2d3156'; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.05)'; c.fillRect(x0 + i * 115, y0, 115, y1 - y0) }
    rr(c, 2380, 450, 640, 110, 12); fill(c, B2.ink); rr(c, 2380, 450, 640, 110, 12); lnB(c, 4); tx(c, '«ДЖУЛ» · ВКУСЫ', 2700, 508, { f: 'U', w: 800, s: 52, c: B2.cream, ls: 2 });
    const rows = [700, 1010, 1320], L = 2330, R = 3070;
    rows.forEach((y, r) => { for (let i = 0; i < 9; i++) { const x = L + 50 + i * 80, d = T3.ubir + (r * 9 + i) * .045, k = ei(at(t, d, d + .35)); if (k < 1) { c.save(); c.translate(0, -1400 * k); pod3(c, x, y, PODC[(i + r * 3) % 8]); c.restore() } }
      if (!(skip && r === 2)) { rr(c, L, y, R - L, 34, 6); cel(c, L, y, R - L, 34, B2.wood, { hw: .03 }); rr(c, L, y, R - L, 34, 6); lnB(c, 3) }
      if (t > T3.ubir + .3 + r * .4) for (let i = 0; i < 3; i++) { rr(c, L + 80 + i * 230, y + 44, 110, 34, 6); fill(c, '#e2504f'); tx(c, 'НЕТ', L + 135 + i * 230, y + 62, { f: 'M', w: 800, s: 22, c: '#fff' }) } });
    rr(c, 2370, 1450, 660, 230, 14); fill(c, '#14172e'); rr(c, 2370, 1450, 660, 230, 14); lnB(c, 4, '#5a5f8a');   // дыра на нижней полке
    pod3(c, 2520, 1640, '#9a6a44', 'ТАБАК'); pod3(c, 2880, 1640, B2.ice2, 'МЕНТОЛ');
    rr(c, L, 1680, R - L, 34, 6); cel(c, L, 1680, R - L, 34, B2.wood, { hw: .03 }); rr(c, L, 1680, R - L, 34, 6); lnB(c, 3);
    c.beginPath(); c.rect(2300, 260, 800, 1680); lnB(c, 6, '#4a4f7d');
  }
  // ---------- цех в Шэньчжэне ----------
  function box3(c, x, y, s, col, lab, rot = 0) {   // коробка в 3D: лицо, верх, бок
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    poly(c, [-90, -180, 90, -180, 130, -220, -50, -220]); fill(c, lit(col, .3)); poly(c, [-90, -180, 90, -180, 130, -220, -50, -220]); lnB(c, 3);
    poly(c, [90, -180, 130, -220, 130, -40, 90, 0]); fill(c, shd(col, .35)); poly(c, [90, -180, 130, -220, 130, -40, 90, 0]); lnB(c, 3);
    rr(c, -90, -180, 180, 180, 4); cel(c, -90, -180, 180, 180, col, { hw: .08, sw: .0001 }); rr(c, -90, -180, 180, 180, 4); lnB(c, 3);
    tx(c, lab, 0, -96, { f: 'U', w: 800, s: 36, c: '#fff', mw: 160 }); c.restore();
  }
  function beltY(x, t) { const A = 70 * eo(at(t, T3.wave, T3.wave + .45)); return BELT + A * Math.sin((x - 2000) / 150 - (t - T3.wave) * 7) }
  function factory(c, t, kc = 1) {
    c.fillStyle = '#1b1f3a'; c.fillRect(1500, -600, 4200, 3200);
    poly(c, [1500, 1700, 2600, -600, 3300, -600, 2200, 1700]); fill(c, '#21264a');
    // США справа: ночное небо через косой разрез
    poly(c, [3500, 2600, 3900, -600, 5800, -600, 5800, 2600]); fill(c, '#151a36');
    for (let i = 0; i < 26; i++) circ(c, 3950 + H1(i * 4.4) * 1500, -300 + H1(i * 6.6) * 900, 2 + H1(i) * 2, rgba('#e2e8f0', .35 + .25 * Math.sin(t * 1.7 + i)));
    usStore(c, t);
    // балка с лебёдками (Кола #067)
    c.fillStyle = '#f2b84b'; c.fillRect(1700, 470, 1900, 50); c.save(); c.beginPath(); c.rect(1700, 470, 1900, 50); c.clip(); for (let i = 0; i < 40; i++) { poly(c, [1700 + i * 60, 520, 1730 + i * 60, 520, 1760 + i * 60, 470, 1730 + i * 60, 470]); fill(c, B2.ink) } c.restore();
    c.beginPath(); c.rect(1700, 470, 1900, 50); lnB(c, 3);
    for (let j = 0; j < 3; j++) { const x = 1900 + ((t * 120 + j * 520) % 1560), cy = 760 + 60 * Math.sin(t * 1.3 + j);
      c.fillStyle = '#2c3048'; c.fillRect(x - 40, 515, 80, 40); c.beginPath(); c.moveTo(x - 20, 555); c.lineTo(x - 50, cy); c.moveTo(x + 20, 555); c.lineTo(x + 50, cy); lnB(c, 4, B2.steel);
      box3(c, x, cy + 130, .55, ['#b65bd6', '#2f80ed', '#16c09a'][j], ['PUFF', 'HQD', 'ELF'][j]) }
    neonTxt(c, 'ШЭНЬЧЖЭНЬ', 2620, 650, t, T3.shen);
    // конвейер: лента — линия, которая на «волной» изгибается
    const x0 = 1700, x1 = T3 && t > T3.wave ? 6000 : 3500;
    if (kc >= 1) for (let x = 1760; x < 3500; x += 120) { const y = beltY(x, t); circ(c, x, y + 40, 26, '#3a3f66'); ring(c, x, y + 40, 26, B2.ln, 3); c.save(); c.translate(x, y + 40); c.rotate(t * 6); c.beginPath(); c.moveTo(-20, 0); c.lineTo(20, 0); lnB(c, 3); c.restore() }
    if (kc >= 1) { c.beginPath(); for (let x = x0; x <= Math.min(x1, 3500); x += 20) c.lineTo(x, beltY(x, t)); lnB(c, 10, B2.ln) }
    if (kc >= 1) for (let i = 0; i < 9; i++) { const x = 1760 + ((t - 30) * 140 + i * 200) % 1700; if (x > 3450) continue; c.save(); c.translate(x, beltY(x, t)); c.rotate(Math.atan(Math.cos((x - 2000) / 150 - (t - T3.wave) * 7) * 70 * eo(at(t, T3.wave, T3.wave + .45)) / 150)); rr(c, -30, -50, 60, 50, 6); cel(c, -30, -50, 60, 50, '#8d94b8', { hw: .1 }); rr(c, -30, -50, 60, 50, 6); lnB(c, 2.5); c.restore() }
    BOX3.forEach(([lab, col, x], i) => { const tb = T3.box[i]; if (t < tb - .32) return; const kk = cl((t - tb + .32) / .32), sq = t > tb ? .14 * Math.sin(Math.PI * cl((t - tb) / .28)) : 0, by = beltY(x, t);   // v19.1: коробки падают сверху на ленту
      c.save(); c.translate(x, by - 1100 + 1100 * kk * kk); c.scale(1 + sq, 1 - sq);
      castDots(c, -90, -180, 180, 180, 90, { st: 13 }); box3(c, 0, 0, 1, col, lab, .06 * Math.sin(t * 3 + i)); c.restore() });
    if (t > T3.end - .5 && typeof chart4 === 'function') { if (!T4) b4Words(); chart4(c, t) }
    if (t > T3.wave) wave3(c, t);
    if (T4 && t > T4.dive - .3) { c.save(); c.translate(4300, 500 - 1000 * TS4); c.scale(TS4, TS4); tank4(c, t); c.restore() }
  }
  function neonTxt(c, s, x, y, t, t0) { const on = at(t, t0 - .2, t0) * (t < t0 + .3 ? (Math.sin(t * 80) > -.3 ? 1 : .4) : 1);
    rr(c, x - 220, y - 60, 440, 120, 14); fill(c, B2.ink); rr(c, x - 220, y - 60, 440, 120, 14); lnB(c, 4); if (on > 0) glow(c, x, y, 260, '#ff5d6c', .3 * on);
    tx(c, s, x, y + 4, { f: 'U', w: 800, s: 56, c: mixc('#5a2f3a', '#ff6b78', on), ls: 3 }) }
  function usStore(c, t) {
    const { x0, x1, g } = USS; c.save(); c.translate(0, 1200 * ei(at(t, T3.voln + .25, T3.end + .5))); c.fillStyle = '#10142a'; c.fillRect(3700, g, 2200, 900); c.beginPath(); c.moveTo(3700, g); c.lineTo(5900, g); lnB(c, 4);
    rr(c, x0, g - 560, x1 - x0, 560, 6); cel(c, x0, g - 560, x1 - x0, 560, '#33386a', { hw: .05, gr: .08 }); rr(c, x0, g - 560, x1 - x0, 560, 6); lnB(c, 4);
    for (let s = 0; s < 6; s++) { c.beginPath(); const sx = x0 + 10 + s * 80; c.moveTo(sx, g - 380); c.lineTo(sx + 80, g - 380); c.arc(sx + 40, g - 380, 40, 0, Math.PI); c.closePath(); fill(c, s % 2 ? B2.cream : B2.red); lnB(c, 3) }
    rr(c, x0 + 30, g - 330, 300, 250, 6); fill(c, '#1b1f3d'); for (let s = 0; s < 4; s++) { rr(c, x0 + 55 + s * 66, g - 280, 36, 70, 10); fill(c, PODC[s]) } rr(c, x0 + 30, g - 330, 300, 250, 6); lnB(c, 4);
    rr(c, x0 + 370, g - 330, 100, 330, 6); fill(c, '#1b1f3d'); rr(c, x0 + 370, g - 330, 100, 330, 6); lnB(c, 4);
    rr(c, x0 + 20, g - 520, 460, 100, 10); fill(c, B2.ink); rr(c, x0 + 20, g - 520, 460, 100, 10); lnB(c, 4); tx(c, 'ВЕЙПЫ · США', (x0 + x1) / 2, g - 467, { f: 'U', w: 800, s: 52, c: B2.cream, ls: 2 });
    c.fillStyle = '#2f4a9a'; c.fillRect(x1 + 60, g - 700, 8, 700); c.fillStyle = B2.cream; for (let i = 0; i < 5; i++) { c.fillStyle = i % 2 ? B2.cream : B2.red; c.fillRect(x1 + 68, g - 700 + i * 24, 170, 24) } c.fillStyle = '#2f4a9a'; c.fillRect(x1 + 68, g - 700, 70, 72); c.restore();
  }
  // волна (Instagram #007): лента поднимается, сверху красная полоса, белый гребень, тело синее; фронт бежит вправо и накрывает магазин
  function wave3(c, t) {
    const kz = eio(at(t, T3.end - .3, T3.end + .7)), kh = eio(at(t, T3.wave + .3, T3.wave + 1.0)) * (1 - .8 * kz), front = lp(3400, 5300, eio(at(t, T3.wave + .35, T3.voln + .2))) + 900 * kz, lvl = lp(lp(BELT, 760, eio(at(t, T3.wave + .3, T3.wave + 1.0))), LVL4 - 20, kz);
    const top = x => lp(lvl - 110 * Math.exp(-Math.pow((front - 520 - x) / 260, 2)) * kh, 2700, ss(front - 480, front, x)) + 34 * Math.sin(x / 120 - t * 4) * kh;
    const P = []; for (let x = 1600; x <= front + 20; x += 20) P.push(x, x > 3500 ? top(x) : Math.min(beltY(x, t), top(x)));
    const body = (dy, col) => { c.beginPath(); c.moveTo(1600, 2600); for (let i = 0; i < P.length; i += 2) c.lineTo(P[i], P[i + 1] + dy); c.lineTo(front + 40, 2600); c.closePath(); fill(c, col) };
    body(0, B2.red); body(46, B2.cream); body(80, B2.blue); body(240, '#1f4fa8'); body(520, B2.navy);
    c.save(); c.beginPath(); c.moveTo(1600, 2600); for (let i = 0; i < P.length; i += 2) c.lineTo(P[i], P[i + 1] + 240); c.lineTo(front + 40, 2600); c.closePath(); c.clip(); dotsField(c, 1600, lvl + 200, front - 1500, 900, 22, 'rgba(255,255,255,.12)', 2); c.restore();
    const fx = front - 520, fy = top(fx); for (let i = 0; i < 12; i++) { const u = ((t * 1.3 + i / 12) % 1); circ(c, fx - 160 + H1(i) * 360, fy - 30 - u * 150, (8 + H1(i * 3) * 10) * (1 - u), B2.cream) }   // брызги над гребнем
    BOX3.forEach(([lab, col], i) => { const x = lp(2440 + i * 260, front - 300 - i * 260, eio(at(t, T3.wave + .4, T3.voln))); c.save(); c.translate(x, top(x) - 10); c.rotate(.12 * Math.sin(t * 3 + i)); box3(c, 0, 0, .9, col, lab); c.restore() });
  }
  function b3Draw(c, t) { if (!T3) b3Words(); page3(c, t) }
