  // ================= глава 5: надписи — по языку ролика (как в главе 4: TEXT — наши плашки, OBJ — надписи на предметах) =================
  // По разбору Gemini 20.11 числа сразу в форматах EN/DE ($16B / 16 MRD. $, 581M / 581 MIO.). Язык — из ролика (v220y-ru → ru) в EP.init → setLang.
  const TEXT_L = {
    ru: {
      notob: 'БЕЗ ТАБАКА', snusTob: 'СНЮС = ТАБАК', nicTob: 'НИКОТИН — ИЗ ТАБАКА', ky: 'КЕНТУККИ', empty: 'ПУСТЫЕ ПОЛКИ',
      soldout: 'РАСКУПИЛИ', ok: 'РАЗРЕШЕНО', first: 'ПЕРВЫЕ', less: 'МЕНЬШЕ ВЕЩЕСТВ', harm: 'МЕНЬШЕ ВРЕДА', no: 'НЕЛЬЗЯ', risk: 'НИЖЕ РИСК',
      kids: 'ШКОЛЬНИКИ США', mg: 'МГ', strength: 'КРЕПОСТЬ', title: 'ЧТО ВЫ ЗНАЕТЕ О НИКОТИНЕ?', titleL: ['ЧТО ВЫ ЗНАЕТЕ', 'О НИКОТИНЕ?'], quit: 'СПОСОБ БРОСИТЬ', yt: 'ЦЕЛИКОМ — НА YOUTUBE',
      card79b: 'СОЛЬ', card20b: 'ЛАЗЕЙКА ОДНОРАЗОК', card24b: '«МАЛЬБОРО»', card14b: 'НАГРЕВАТЕЛИ', card22b: 'СНЮС',
      fPrice: v => '$' + v + ' МЛРД', fCans: v => v + ' МЛН', fPct: v => String(v).replace('.', ',') + ' %',
    },
    en: {
      notob: 'NO TOBACCO', snusTob: 'SNUS = TOBACCO', nicTob: 'NICOTINE — FROM TOBACCO', ky: 'KENTUCKY', empty: 'EMPTY SHELVES',
      soldout: 'SOLD OUT', ok: 'AUTHORIZED', first: 'THE FIRST', less: 'FEWER CHEMICALS', harm: 'LESS HARM', no: 'NOT ALLOWED', risk: 'LOWER RISK',
      kids: 'U.S. STUDENTS', mg: 'MG', strength: 'STRENGTH', title: 'WHAT DO YOU KNOW ABOUT NICOTINE?', titleL: ['WHAT DO YOU KNOW', 'ABOUT NICOTINE?'], quit: 'A WAY TO QUIT', yt: 'FULL VERSION — ON YOUTUBE',
      card79b: 'SALT', card20b: 'THE DISPOSABLE LOOPHOLE', card24b: '“MARLBORO”', card14b: 'HEATED TOBACCO', card22b: 'NICOTINE POUCHES',
      fPrice: v => '$' + v + 'B', fCans: v => v + 'M', fPct: v => v + '%',
    },
    de: {
      notob: 'OHNE TABAK', snusTob: 'SNUS = TABAK', nicTob: 'NIKOTIN – AUS TABAK', ky: 'KENTUCKY', empty: 'LEERE REGALE',
      soldout: 'AUSVERKAUFT', ok: 'ZUGELASSEN', first: 'DIE ERSTEN', less: 'WENIGER SCHADSTOFFE', harm: 'WENIGER SCHÄDLICH', no: 'VERBOTEN', risk: 'GERINGERES RISIKO',
      kids: 'US-SCHÜLER', mg: 'MG', strength: 'STÄRKE', title: 'WAS WISST IHR ÜBER NIKOTIN?', titleL: ['WAS WISST IHR', 'ÜBER NIKOTIN?'], quit: 'EIN WEG ZUM AUFHÖREN', yt: 'KOMPLETT AUF YOUTUBE',
      card79b: 'SALZ', card20b: 'DIE EINWEG-LÜCKE', card24b: '„MARLBORO“', card14b: 'TABAKERHITZER', card22b: 'NIKOTINBEUTEL',
      fPrice: v => v + ' MRD. $', fCans: v => v + ' MIO.', fPct: v => String(v).replace('.', ',') + ' %',
    },
  };
  const OBJ_NAMES = { pm: 'Philip Morris', snus: 'SNUS', marl: 'Marlboro', zyn: 'ZYN', velo: 'VELO', pablo: 'PABLO', juul: 'JUUL', fda: 'FDA', iqos: 'IQOS', rj: 'R.J. REYNOLDS', pmT: 'PHILIP MORRIS' };
  const TEXT = {}, OBJ = {};
  let LANG = 'ru';
  function setLang(l) {
    LANG = TEXT_L[l] ? l : 'ru'; for (const o of [TEXT, OBJ]) for (const k in o) delete o[k];
    Object.assign(TEXT, TEXT_L[LANG]); Object.assign(OBJ, OBJ_NAMES, LANG === 'ru' ? { snus: 'СНЮС' } : {});   // 24.11: в русской версии — без английских слов
  }
  setLang('ru');
  // палитра главы 5 (основа — набор Боба B2; C4 — имена, которыми пользуются помощники из главы 4)
  const C5 = {
    sky0: '#0B1128', sky1: '#16224A', sky2: '#24356A', moon: '#F4EBD0', shore: '#0E1430', lights: '#FFD27A', sea0: '#0F2350', sea1: '#173170', sea2: '#21428C', foam: '#C9DCF2',
    sand: '#3A3550', sandW: '#2B2C4A', tin: '#F4F4F2', tinS: '#D4D7DF', tinD: '#B9BECB', lid: '#FAFAF8', pouch: '#FFFDF8', pouchS: '#E6E1D6',
    office: '#E9E3D8', officeD: '#CFC6B6', table: '#EFE6D2', tableS: '#D9CDB4', tableE: '#BFAF92', sky: '#9FC6E8', city: '#6E86A8', cityD: '#56708F',
    cabin: '#DCD8D0', cabinD: '#B9B3A8', seat: '#3D4A6B', seatD: '#2C3652', gum: '#E8A3A8', gumD: '#C97E86', vessel: '#D6334D', nic: '#FFD23F',
    wood: '#8A5A3A', woodL: '#A5734E', woodD: '#5E3B25', wall: '#E9DCC5', red: '#B3352B', forest: '#2F5B3A', forestD: '#1F4029', lake: '#5C8FC2',
    snusD: '#2A2420', snusB: '#6B4A2E', brown: '#7A5232', leaf: '#6E8B3D', leafD: '#4E6A2A', copper: '#C27A44', glass: 'rgba(190,225,250,.18)',
    gas: '#1C2240', shelf: '#C9CED8', shelfD: '#9EA5B5', neon: '#FF5A5F', fda: '#E7E1D3', lamp: '#FFE7B0',
    mint: '#5ED39B', lemon: '#F2D04B', coffee: '#6B4429', cinn: '#B5652E', green: '#17A86B', grnL: '#5ED39B',
    locker: '#3E5C8A', lockerD: '#2E4770', lockerL: '#5A7BB0', floor: '#C7BFAF', cork: '#b07a4a', board: '#5b3d26',
    iq: '#F4F3EF', iqS: '#C9CBD2', iqD: '#9EA2AD', iqCap: '#2B2F3A', ember: '#FF6A2A', paperL: '#FFFDF8',
  };
  const C4 = C5;
  // наша плашка (как в главе 3): светлая, тёмные буквы
  function cap5(c, s, x, y, k, o = {}) { plate(c, s, x, y, bo(k), { s: o.s || 50, bg: o.bg || '#F4F1EA', c: o.c || '#141010', ls: o.ls ?? 3, w: o.w || 800, r: o.r, a: o.a }) }
  // плашка в экранных координатах (поверх кадра, пока камера едет)
  function capS(c, s, x, y, k, o) { if (k <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); cap5(c, s, x, y, k, o); c.restore() }
  // держатель IQOS 2014 года, горизонтально: центр (x, y), длина L; белый, скруглённый, бок темнее, блик; o.stick — стик торчит справа (0..1), o.cut — разрез (тонкие линии), o.ang — поворот
  function iqos4(c, x, y, L, o = {}) {
    const h = L * .2, r = h * .5; c.save(); c.translate(x, y); if (o.ang) c.rotate(o.ang);
    if (o.shadow !== false) rasterPoly(c, [-L / 2 + 10, h / 2, L / 2, h / 2, L / 2 + h * .9, h * 1.15, -L / 2 + 10 + h * .9, h * 1.15], o.shc || 'rgba(6,8,24,.4)', 9, 2.3);
    const st = o.stick ?? 0;
    if (st > 0) {   // стик: бумага, табачный торец снаружи; o.left — стик торчит слева
      const sl = L * .34 * st, sx = o.left ? -L / 2 + 8 - sl : L / 2 - 8; rr(c, sx, -h * .2, sl, h * .4, 4); fill(c, '#F7F4EC'); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(sx, h * .06, sl, h * .14);
      c.fillStyle = '#C9A266'; const tw0 = Math.min(sl, h * .5); c.fillRect(o.left ? sx : sx + sl - tw0, -h * .2, tw0, h * .4);
      if (o.brand) tx(c, 'Marlboro', sx + sl * .5, 1, { f: 'P', w: 700, st: 'italic', s: h * .26, c: 'rgba(176,18,44,.8)' });
    }
    const body = cc => rr(cc, -L / 2, -h / 2, L, h, r);
    if (o.cut) { body(c); c.fillStyle = 'rgba(190,225,250,.13)'; c.fill(); body(c); lnB(c, 3, 'rgba(220,240,255,.9)'); rr(c, -L / 2 + 12, -h / 2 + 12, L - 24, h - 24, r - 10); lnB(c, 1.6, 'rgba(220,240,255,.45)') }
    else {
      body(c); c.fillStyle = C4.iq; c.fill(); c.save(); body(c); c.clip();
      c.fillStyle = C4.iqS; c.fillRect(-L / 2, h * .16, L, h); c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(-L / 2 + r, -h * .36, L - r * 2, h * .12);
      c.fillStyle = C4.iqCap; c.fillRect(o.left ? -L / 2 + L * .16 - 6 : L / 2 - L * .16, -h, 6, h * 2);   // шов колпачка
      for (let i = 0; i < 3; i++) circ(c, (o.left ? L / 2 - L * .2 - i * 16 : -L / 2 + L * .2 + i * 16), -h * .05, 4, i < (o.leds ?? 3) ? '#CDEBFF' : '#8E95A6');   // огоньки заряда
      c.restore(); body(c); lnB(c, 2.5, 'rgba(20,23,51,.35)');
      if (o.name) tx(c, OBJ.iqos, -L * .08, h * .02, { f: 'M', w: 800, s: h * .3, c: o.glow ? mixc('#7A7F8E', '#1B1A18', o.glow) : '#8A8F9C', ls: 4 });
    }
    c.restore();
  }
  // v22.2: объёмная пачка Marlboro — та же, что в главе 4 (v212): лицо, крыша, бок, шов Flip-Top, откинутая крышка с фольгой и фильтрами
  function pack3(c, x, y, w, h, o = {}) {
    const T = C3, d = o.d ?? w * .4, a = (o.ang ?? 22) * Math.PI / 180, dx = d * Math.cos(a), dy = -d * Math.sin(a), cut = h * .27, lid = o.lid || 0;
    if (o.shadow !== false) castDots(c, x + 6, y + h - 6, w + dx, 12, h * .55, { k: .9, col: o.shc || 'rgba(6,8,24,.5)' });
    // бок (правый): верх — красная крышка, низ — белый в тени; шов крышки — наискосок
    PL(c, [x + w, y + h, x + w + dx, y + h + dy, x + w + dx, y + dy + (lid ? cut : 0), x + w, y + (lid ? cut : 0)], '#C9C2B6');
    if (!lid) { PL(c, [x + w, y, x + w + dx, y + dy, x + w + dx, y + dy + h * .36, x + w, y + h * .36], T.redD); SL(c, [x + w, y + cut, x + w + dx, y + dy + cut * .62], 'rgba(0,0,0,.35)', 1.5) }
    // лицо
    c.fillStyle = T.white; c.fillRect(x, y + (lid ? cut : 0), w, h - (lid ? cut : 0));
    if (!lid) PL(c, [x, y, x + w, y, x + w, y + h * .36, x + w / 2, y + h * .13, x, y + h * .36], T.red);
    else { c.save(); c.beginPath(); c.rect(x, y + cut, w, h); c.clip(); PL(c, [x, y, x + w, y, x + w, y + h * .36, x + w / 2, y + h * .13, x, y + h * .36], T.red); c.restore() }
    const gx = x + w / 2, gy = y + h * .17;
    if (!lid) { c.beginPath(); c.ellipse(gx, gy, w * .1, w * .12, 0, 0, TAU); fill(c, T.gold); c.beginPath(); c.ellipse(gx, gy, w * .065, w * .085, 0, 0, TAU); fill(c, T.white);
      tx(c, 'PM', gx, gy + 1, { f: 'P', w: 700, s: Math.round(w * .07), c: T.red }) }
    c.save(); c.translate(gx, y + h * .56); c.scale(1, 1.18); tx(c, 'Marlboro', 0, -h * .02, { f: 'P', w: 700, s: Math.round(w * .2), c: o.glow ? mixc(T.ink, T.red, o.glow) : T.ink }); c.restore();
    tx(c, o.sub || (LANG === 'ru' ? 'СИГАРЕТЫ С ФИЛЬТРОМ' : LANG === 'de' ? 'FILTERZIGARETTEN' : 'FILTER CIGARETTES'), gx, y + h * .67, { f: 'M', w: 800, s: Math.round(w * .055), c: T.ink, mw: w * .86 });
    if (o.glow) { c.fillStyle = rgba('#FFD27A', .55 * o.glow); c.fillRect(x + w * .1, y + h * .62, w * .8 * o.glow, 5) }
    if (!lid) { SL(c, [x, y + cut, x + w, y + cut], 'rgba(0,0,0,.22)', 1.5);   // шов крышки Flip-Top
      PL(c, [x, y, x + dx, y + dy, x + w + dx, y + dy, x + w, y], '#E0283F'); SL(c, [x + 4, y - 1, x + w - 2, y - 1], 'rgba(255,255,255,.55)', 2) }   // крыша
    else {   // открыта: срез — золотая фольга и пробковые фильтры, крышка откинута назад
      const y1 = y + cut; PL(c, [x, y1, x + dx, y1 + dy, x + w + dx, y1 + dy, x + w, y1], '#D9C27A');
      for (let i = 0; i < 5; i++) { const fx = x + w * (.14 + i * .18) + dx * .45, fy = y1 + dy * .45; c.beginPath(); c.ellipse(fx, fy, w * .075, w * .075 * .5, 0, 0, TAU); fill(c, T.cork) }
      const lh = cut * (1 - lid * .4); PL(c, [x + dx, y1 + dy, x + w + dx, y1 + dy, x + w + dx * 1.2, y1 + dy - lh, x + dx * 1.2, y1 + dy - lh], T.redD);
      SL(c, [x, y1, x + w, y1], 'rgba(0,0,0,.25)', 1.5) }
    SL(c, [x, y + 2, x, y + h - 2], 'rgba(255,255,255,.7)', 2);
  }
  // пачка стиков Marlboro HeatSticks — эталон главы 3 (та же «крыша», ниже и уже обычной пачки)
  function heat4(c, x, y, s, gl = 0) { c.save(); c.translate(x, y); c.scale(s, s); mPack(c, -60, -190, 120, 190, 22, { sub: 'HeatSticks', glow: gl, shc: 'rgba(0,0,0,.3)' }); c.restore() }
  // коробка IQOS для полки
  function box4(c, x, y, w, h, o = {}) {
    rasterPoly(c, [x + w, y + h * .2, x + w + h * .22, y + h * .32, x + w + h * .22, y + h * 1.06, x + w * .25, y + h * 1.06, x, y + h], 'rgba(0,0,0,.28)', 8, 2);
    PL(c, [x - w * .14, y + h * .05, x, y, x, y + h, x - w * .14, y + h - h * .05], '#C9CBD2');
    c.fillStyle = '#F4F3EF'; c.fillRect(x, y, w, h); c.fillStyle = '#E3E4E8'; c.fillRect(x + w * .78, y, w * .22, h);
    tx(c, OBJ.iqos, x + w * .45, y + h * .5, { f: 'M', w: 800, s: w * .2, c: '#3A3F4C', ls: 2 }); c.fillStyle = '#2F6FD6'; c.fillRect(x + w * .2, y + h * .72, w * .5, 4);
  }
  // барабанный счётчик (как в главе 3, #089): строка s в тёмной плашке, цифры в ровных клетках
  function drum4(c, s, x, y, k, o = {}) {
    if (k <= 0) return; const fs = o.s || 76, w = (o.w || 420), h = fs * 1.5;
    c.save(); c.translate(x, y); c.scale(bo(k), bo(k)); rr(c, -w / 2 + 8, -h / 2 + 10, w, h, 16); fill(c, 'rgba(0,0,0,.3)');
    rr(c, -w / 2, -h / 2, w, h, 16); fill(c, o.bg || '#141733'); c.save(); rr(c, -w / 2, -h / 2, w, h, 16); c.clip();
    c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(-w / 2, -h / 2, w, h * .45); num(c, s, 0, 4, { f: 'M', w: 800, s: fs, c: o.c || '#fff' }); c.restore();
    if (o.lab) tx(c, o.lab, 0, h / 2 + fs * .42, { f: 'M', w: 800, s: fs * .34, c: o.lc || '#F4F1EA', ls: 3 }); c.restore();
  }
  // пачка долларов (как настоящие купюры: зелёные, полоска, мелко) — для «съела 300 млн»
  function bills4(c, x, y, w, n, burn = 0) {
    for (let i = 0; i < n; i++) { const yy = y - i * 7, b = cl((burn * n - (n - 1 - i)) / 1.2); if (b >= 1) continue;
      c.save(); c.beginPath(); c.rect(x - w / 2 - 20, yy - 30, w + 40 + 1, 60); c.clip();
      const ww = w * (1 - b); rr(c, x - w / 2, yy - 18, ww, 36, 4); fill(c, mixc('#7FA86A', '#3A3330', b)); c.fillStyle = 'rgba(30,60,30,.35)'; c.fillRect(x - w / 2 + ww * .42, yy - 18, ww * .16, 36);
      if (i === n - 1 && b < .5) { const cx0 = x - w / 2 + ww * .5; c.save(); c.globalAlpha *= 1 - b * 2; c.strokeStyle = 'rgba(30,60,30,.45)'; c.lineWidth = 1.5; c.strokeRect(x - w / 2 + 4, yy - 14, ww - 8, 28);
        c.beginPath(); c.ellipse(cx0, yy, 15, 12, 0, 0, TAU); fill(c, '#A9CC92'); tx(c, '$', cx0, yy + 1, { f: 'M', w: 800, s: 18, c: '#2E5A2A' }); tx(c, '100', x - w / 2 + 18, yy - 7, { f: 'M', w: 800, s: 9, c: '#2E5A2A' }); tx(c, '100', x - w / 2 + ww - 18, yy + 8, { f: 'M', w: 800, s: 9, c: '#2E5A2A' }); c.restore() }   // v21.1: видно, что это доллары
      if (b > 0) { c.fillStyle = C4.ember; c.fillRect(x - w / 2 + ww - 6, yy - 18, 6, 36); c.fillStyle = 'rgba(169,162,160,.9)'; c.fillRect(x - w / 2 + ww, yy - 16, 10, 32) }
      c.restore() }
  }
