  // ================= глава 4: надписи — по языку ролика (Андрей, 20.11: «текст зависит от типа ролика: русский ролик — на русском, английский — англ, дойч — дойч») =================
  // TEXT — наши плашки, OBJ — надписи на предметах. Названия (The Times, The Sun, Daily Mirror, Marlboro, IQOS, Philip Morris, R.J. Reynolds, Premier, FDA, JAMA) — как в жизни.
  // Язык берётся из ролика (v210y-ru → ru) в EP.init → setLang.
  const TEXT_L = {
    ru: {
      promise: 'НОВОГОДНЕЕ ОБЕЩАНИЕ', nagoya: 'НАГОЯ', milan: 'МИЛАН', nofire: 'НЕ ГОРИТ', half: 'ВДВОЕ ХОЛОДНЕЕ', soldout: 'РАСКУПИЛИ',
      noharm: 'БЕЗ ВРЕДА?', vapor: 'ПАР', smoke: 'ДЫМ', onemore: 'ОДНОГО БОЛЬШЕ', nicL: 'НИКОТИН', title: 'ДЫМ ПОД ДРУГИМ ИМЕНЕМ',
      less: 'МЕНЬШЕ ВЕЩЕСТВ', harm: 'МЕНЬШЕ ВРЕДА', no: 'НЕЛЬЗЯ', memo: 'МЕМОРАНДУМ', memoDate: '2 ФЕВРАЛЯ 1973', secret: 'СЕКРЕТНО',
      quote: [['МЫ', 'ДОЛЖНЫ', 'ПОЛУЧИТЬ'], ['СВОЮ', 'ДОЛЮ'], ['МОЛОДЁЖНОГО', 'РЫНКА']], sign: 'К. ТИГ · ОТДЕЛ ИССЛЕДОВАНИЙ',
      premier: '−$300 МЛН', itc: 'ТОРГОВАЯ КОМИССИЯ США', ban: 'ЗАПРЕТ', users: '32 МЛН', usersL: 'ПОЛЬЗОВАТЕЛЕЙ', cigs: '617 МЛРД', cigsL: 'СИГАРЕТ',
      pct: '+0,6 %', pctL: 'ЗА ГОД', price: '$16 МЛРД', notob: 'БЕЗ ТАБАКА', part5: 'Часть 5 →', fire: 'ОГОНЬ', blade: 'НАГРЕВ',
      card79b: 'СОЛЬ', card20b: 'ЛАЗЕЙКА ОДНОРАЗОК', card24b: '«МАЛЬБОРО»', card14b: 'НАГРЕВАТЕЛИ', card22b: 'СНЮС',
      fPrem: v => '−$' + v + ' МЛН', fUsers: v => v + ' МЛН', fCigs: v => v + ' МЛРД', fPrice: v => '$' + v + ' МЛРД', fPctN: v => v + ' %',
    },
    en: {
      promise: 'NEW YEAR’S RESOLUTION', nagoya: 'NAGOYA', milan: 'MILAN', nofire: 'WON’T LIGHT', half: 'HALF AS HOT', soldout: 'SOLD OUT',
      noharm: 'NO HARM?', vapor: 'VAPOR', smoke: 'SMOKE', onemore: 'ONE EVEN HIGHER', nicL: 'NICOTINE', title: 'SMOKE BY ANY OTHER NAME',
      less: 'FEWER CHEMICALS', harm: 'LESS HARM', no: 'NOT ALLOWED', memo: 'MEMORANDUM', memoDate: 'FEBRUARY 2, 1973', secret: 'SECRET',
      quote: [['WE', 'MUST', 'GET'], ['OUR', 'SHARE', 'OF THE'], ['YOUTH', 'MARKET']], sign: 'C. TEAGUE · RESEARCH DEPARTMENT',
      premier: '−$300M', itc: 'U.S. TRADE COMMISSION', ban: 'BANNED', users: '32M', usersL: 'USERS', cigs: '617B', cigsL: 'CIGARETTES',
      pct: '+0.6%', pctL: 'IN A YEAR', price: '$16B', notob: 'NO TOBACCO', part5: 'Part 5 →', fire: 'FLAME', blade: 'HEATER',
      card79b: 'SALT', card20b: 'THE DISPOSABLE LOOPHOLE', card24b: '“MARLBORO”', card14b: 'HEATERS', card22b: 'NICOTINE POUCHES',
      fPrem: v => '−$' + v + 'M', fUsers: v => v + 'M', fCigs: v => v + 'B', fPrice: v => '$' + v + 'B', fPctN: v => v + '%',
    },
    de: {
      promise: 'NEUJAHRSVORSATZ', nagoya: 'NAGOYA', milan: 'MAILAND', nofire: 'BRENNT NICHT', half: 'HALB SO HEISS', soldout: 'AUSVERKAUFT',
      noharm: 'HARMLOS?', vapor: 'DAMPF', smoke: 'RAUCH', onemore: 'EINER SOGAR HÖHER', nicL: 'NIKOTIN', title: 'RAUCH UNTER ANDEREM NAMEN',
      less: 'WENIGER SCHADSTOFFE', harm: 'WENIGER SCHADEN', no: 'VERBOTEN', memo: 'MEMORANDUM', memoDate: '2. FEBRUAR 1973', secret: 'GEHEIM',
      quote: [['WIR', 'MÜSSEN', 'UNSEREN'], ['ANTEIL', 'AM'], ['JUGENDMARKT'], ['BEKOMMEN']], sign: 'C. TEAGUE · FORSCHUNGSABTEILUNG',
      premier: '−300 MIO. $', itc: 'US-HANDELSKOMMISSION', ban: 'VERBOT', users: '32 MIO.', usersL: 'NUTZER', cigs: '617 MRD.', cigsL: 'ZIGARETTEN',
      pct: '+0,6 %', pctL: 'IN EINEM JAHR', price: '16 MRD. $', notob: 'OHNE TABAK', part5: 'Teil 5 →', fire: 'FLAMME', blade: 'ERHITZER',
      card79b: 'SALZ', card20b: 'DIE EINWEG-LÜCKE', card24b: '„MARLBORO“', card14b: 'ERHITZER', card22b: 'NIKOTINBEUTEL',
      fPrem: v => '−' + v + ' MIO. $', fUsers: v => v + ' MIO.', fCigs: v => v + ' MRD.', fPrice: v => v + ' MRD. $', fPctN: v => v + ' %',
    },
  };
  const OBJ_NAMES = { ad3: 'Philip Morris Limited', heads: ['The Times', 'The Sun', 'Daily Mirror'], journal: 'JAMA Internal Medicine', fda: 'FDA', rj: 'R.J. REYNOLDS TOBACCO COMPANY',
    premier: 'Premier', rjs: 'R.J. Reynolds', iqos: 'IQOS' };
  const OBJ_L = {   // текст рекламы — как в газетах 2018 года (Our New Year’s resolution. We’re trying to give up cigarettes.), переведён
    ru: { ad1L: ['Наше новогоднее', 'обещание'], ad2L: ['Мы пытаемся бросить', 'сигареты.'], news: 'НОВОСТИ', jtitle1: 'Табачные нагреватели:', jtitle2: 'дым под другим именем',
      patent: 'ПАТЕНТ', fig: 'РИС. 1', mapUS: 'США', mapOcean: ['АТЛАНТИЧЕСКИЙ', 'ОКЕАН'] },
    en: { ad1L: ['Our New', 'Year’s resolution'], ad2L: ['We’re trying to', 'give up cigarettes.'], news: 'NEWS', jtitle1: 'Heat-Not-Burn Tobacco Cigarettes:', jtitle2: 'Smoke by Any Other Name',
      patent: 'PATENT', fig: 'FIG. 1', mapUS: 'USA', mapOcean: ['ATLANTIC', 'OCEAN'] },
    de: { ad1L: ['Unser', 'Neujahrsvorsatz'], ad2L: ['Wir versuchen, die', 'Zigaretten aufzugeben.'], news: 'NACHRICHTEN', jtitle1: 'Tabakerhitzer:', jtitle2: 'Rauch unter anderem Namen',
      patent: 'PATENT', fig: 'ABB. 1', mapUS: 'USA', mapOcean: ['ATLANTISCHER', 'OZEAN'] },
  };
  const TEXT = {}, OBJ = {};
  let LANG = 'ru';
  function setLang(l) {
    LANG = TEXT_L[l] ? l : 'ru'; for (const o of [TEXT, OBJ]) for (const k in o) delete o[k];
    Object.assign(TEXT, TEXT_L[LANG]); Object.assign(OBJ, OBJ_NAMES, OBJ_L[LANG]);
  }
  setLang('ru');
  // палитра главы 4 (основа — набор Боба B2 и палитра главы 3 C3)
  const C4 = {
    night: '#1e2138', navy: '#141733', ink: '#141010', cream: '#F4F1EA', paper: '#F3EFE6', paperD: '#DDD6C8', paperL: '#FFFDF8', inkN: '#1B1A18',
    wall: '#2A2233', wallD: '#211B29', wood: '#5A3A26', woodL: '#7A5135', woodD: '#3E2718', woodE: '#2E1D14',
    dawn: ['#1F2A4A', '#2E3563', '#5A4775', '#A05D6E', '#D98A5E', '#F2B26B'], ben: '#191B38', roofs: '#232547',
    iq: '#F4F3EF', iqS: '#C9CBD2', iqD: '#9EA2AD', iqCap: '#2B2F3A', ember: '#FF6A2A', heat: '#FFB36A',
    graph: '#2B2E36', graph2: '#343844', lab: '#123A3E', labD: '#0B2427', labL: '#1F4E52', teal: '#7ED6CF',
    green: '#17A86B', red: '#C8102E', redD: '#93091F', gold: '#C9A24A', blue: '#2F6FD6', bp: '#1D3F8F', bpL: '#2E58B8', ocean: '#1F3D7A', oceanL: '#2C5296',
  };
  // наша плашка (как в главе 3): светлая, тёмные буквы
  function cap4(c, s, x, y, k, o = {}) { plate(c, s, x, y, bo(k), { s: o.s || 50, bg: o.bg || '#F4F1EA', c: o.c || '#141010', ls: o.ls ?? 3, w: o.w || 800, r: o.r, a: o.a }) }
  // плашка в экранных координатах (поверх кадра, пока камера едет)
  function capS(c, s, x, y, k, o) { if (k <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); cap4(c, s, x, y, k, o); c.restore() }
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
  // шаги камеры по ключам удобнее писать так: K(t, x, y, z)
  const shot4 = (K, t, fn) => fn(camObj(camAt(K, t)));
