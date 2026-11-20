  // ================= глава 4: наши надписи — одним словарём (Андрей, 19.11: «надписи — в словарь TEXT в шапке кода»; по нему — английская и немецкая версии) =================
  // Надписи на предметах (Marlboro, IQOS, Philip Morris, R.J. Reynolds, Premier, FDA, JAMA Internal Medicine, текст рекламы) — не переводим: это вещи из жизни.
  const TEXT = {
    promise: 'НОВОГОДНЕЕ ОБЕЩАНИЕ', nagoya: 'НАГОЯ', milan: 'МИЛАН', nofire: 'НЕ ГОРИТ', half: 'ВДВОЕ ХОЛОДНЕЕ', soldout: 'РАСКУПИЛИ',
    noharm: 'БЕЗ ВРЕДА?', vapor: 'ПАР', smoke: 'ДЫМ', onemore: 'ОДНОГО БОЛЬШЕ', nic: '84 %', nicL: 'НИКОТИН', title: 'ДЫМ ПОД ДРУГИМ ИМЕНЕМ',
    less: 'МЕНЬШЕ ВЕЩЕСТВ', harm: 'МЕНЬШЕ ВРЕДА', no: 'НЕЛЬЗЯ', memo: 'МЕМОРАНДУМ', memoDate: '2 ФЕВРАЛЯ 1973', secret: 'СЕКРЕТНО',
    quote: [['МЫ', 'ДОЛЖНЫ', 'ПОЛУЧИТЬ'], ['СВОЮ', 'ДОЛЮ'], ['МОЛОДЁЖНОГО', 'РЫНКА']], sign: 'К. ТИГ · ОТДЕЛ ИССЛЕДОВАНИЙ',
    premier: '−$300 МЛН', itc: 'ТОРГОВАЯ КОМИССИЯ США', ban: 'ЗАПРЕТ', users: '32 МЛН', usersL: 'ПОЛЬЗОВАТЕЛЕЙ', cigs: '617 МЛРД', cigsL: 'СИГАРЕТ', pct: '+0,6 %',
    price: '$16 МЛРД', notob: 'БЕЗ ТАБАКА', card14a: '2014', card14b: 'НАГРЕВАТЕЛИ', card22a: '2022', part5: 'Часть 5 →',
    fire: 'ОГОНЬ', blade: 'НАГРЕВ',
  };
  const OBJ = {   // на предметах — как в жизни, латиницей
    ad1: 'Our New Year’s resolution', ad2: 'We’re trying to give up cigarettes.', ad3: 'Philip Morris Limited', heads: ['The Times', 'The Sun', 'Daily Mirror'],
    journal: 'JAMA Internal Medicine', jtitle1: 'Heat-Not-Burn Tobacco Cigarettes:', jtitle2: 'Smoke by Any Other Name', fda: 'FDA', rj: 'R.J. REYNOLDS TOBACCO COMPANY',
    premier: 'Premier', patent: 'PATENT', rjs: 'R.J. Reynolds', iqos: 'IQOS',
  };
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
      if (b > 0) { c.fillStyle = C4.ember; c.fillRect(x - w / 2 + ww - 6, yy - 18, 6, 36); c.fillStyle = 'rgba(169,162,160,.9)'; c.fillRect(x - w / 2 + ww, yy - 16, 10, 32) }
      c.restore() }
  }
  // шаги камеры по ключам удобнее писать так: K(t, x, y, z)
  const shot4 = (K, t, fn) => fn(camObj(camAt(K, t)));
