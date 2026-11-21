  // ================= мир 5: кабинет FDA (строки 7–9) =================
  // Стык с улицей: улица — это фото на столе FDA (A вложен в B): камера отъезжает от фото, видно стол, окно со зданием FDA, лампу.
  // Строка 7: бланк на банку, «разрешил» — зелёный штамп; «первыми» — плашка; четыре банки с цветными крышками въезжают в ряд, на «мята / цитрус /
  // кофе / корица» крышки откидываются по очереди. Строка 8: банки уезжают вправо, слева четыре «Джула» с цветными картриджами — на «запретили»
  // падает нож с гравировкой FDA и срезает картриджи, банки целы. Строка 9: слева бланк айкоса (НЕЛЬЗЯ — как в главе 4), справа бланк банки:
  // на «Зину» на крышке печатается ZYN, «разрешили» — зелёная галочка у «МЕНЬШЕ ВРЕДА»; «айкосу не разрешают» — камера к бланку айкоса, красный
  // штамп; «о риске» — назад; «ниже риск» — стол темнеет, четыре медальона 2×2 (рот, лёгкие, сердце, мозг). Нырок в круг мозга — мир школы (N6).
  let T5 = null, K5 = null, N5 = null;
  const PH5 = { x: -260, y: 1320, w: 270, h: 480, r: -.08 }, FZ = { x: 780, y: 1230 }, FI = { x: 270, y: 1230 }, FW = 380, FH = 520;
  const TINS5 = [{ cap: C5.mint, f: 'mint' }, { cap: C5.lemon, f: 'lemon' }, { cap: C5.coffee, f: 'coffee' }, { cap: C5.cinn, f: 'cinn' }];
  const MED = [{ k: 'mouth', x: 630, y: 850 }, { k: 'lungs', x: 930, y: 850 }, { k: 'heart', x: 630, y: 1150 }, { k: 'brain', x: 930, y: 1150 }], MR = 120;
  const N6 = { x: 930, y: 1150, m: .108 };
  function fdaInit() {
    const w7 = q => Ws('s7', q), w8 = q => Ws('s8', q), w9 = q => Ws('s9', q);
    T5 = { j: T3.junk, s7: SA('s7'), dvadc: w7('двадцать'), regul: w7('регулятор'), razr: w7('разрешил'), prod: w7('продавать'), perv: w7('первыми'), vkus: w7('вкусами'),
      mint: w7('мята'), citr: w7('цитрус'), kofe: w7('кофе'), kor: w7('корица'), s8: SA('s8'), pyat: w8('пять'), juul: w8('джулу'), takie: w8('такие'), zapr: w8('запретили'),
      s9: SA('s9'), dv26: w9('двадцать'), zinu: w9('зину'), razr9: w9('разрешили'), ayk: w9('айкосу'), nera: w9('разрешают'), pory: w9('пор'), govor: w9('говорить'), risk: w9('риске'),
      zin2: w9('зин'), vmesto: w9('вместо'), sig: w9('сигарет'), nizhe: w9('ниже'), rta: w9('рта'), legk: w9('лёгких'), serd: w9('сердца'), insult: w9('инсульта'), s10: SA('s10') };
    const a = T5; a.jdive = a.s10 + .12; a.dive0 = a.jdive - .95;
    { const cr = Math.cos(PH5.r), sr = Math.sin(PH5.r), m = PH5.w / (1080 / .4), dx = (2960 - 540) * m, dy = (3060 - 960) * m;
      N5 = { x: PH5.x - (dx * cr - dy * sr), y: PH5.y - (dx * sr + dy * cr), m, r: PH5.r } }   // кадр улицы в момент стыка (2960, 3060, z .4) = фото на столе
    K5 = [KY(a.j + .55, -150, 1290, 1.5, .04), KY(a.j + 1.25, 250, 1240, 1.1, .01), KY(a.regul, 660, 1230, 1.2), KY(a.razr, 720, 1225, 1.3), KY(a.perv - .3, 640, 1430, 1.0), KY(a.vkus, 640, 1620, 1.25),
      KY(a.kor + .4, 640, 1620, 1.2), KY(a.juul, 520, 1560, 1.05), KY(a.zapr + .3, 420, 1540, 1.15), KY(a.dv26, 540, 1260, 1.0), KY(a.zinu, 760, 1230, 1.3),
      KY(a.ayk, 300, 1240, 1.3), KY(a.pory, 300, 1240, 1.32), KY(a.govor + .1, 760, 1230, 1.3), KY(a.zin2, 780, 1220, 1.25), KY(a.nizhe + .3, 780, 1020, .95),
      KY(a.insult + .1, 790, 1010, .95), KY(a.dive0 + .3, 900, 1120, 1.5), KY(a.jdive, N6.x, N6.y, 1 / N6.m)];
    linkK(K3, K5, N5, false);
  }
  // ---------- комната и стол ----------
  function fdaRoom(c, t) {
    c.fillStyle = '#D9D3C7'; c.fillRect(-1600, -1200, 4800, 1900); c.fillStyle = 'rgba(0,0,0,.04)'; for (let x = -1600; x < 3200; x += 160) c.fillRect(x, -1200, 5, 1900);
    rr(c, 110, 70, 860, 560, 10); fill(c, '#F4F1EA'); vgrad(c, 130, 90, 820, 520, ['#B9D7EE', '#E3EEF6']);   // окно: здание FDA
    c.save(); c.beginPath(); c.rect(130, 90, 820, 520); c.clip();
    c.fillStyle = '#9DB6C9'; for (let i = 0; i < 6; i++) c.fillRect(140 + i * 140, 430 - H1(i) * 120, 110, 300);
    c.fillStyle = '#F7F6F2'; c.fillRect(400, 270, 520, 360); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(820, 270, 100, 360);   // v22.2: здание и вывеска правее — плашка 2026 их не задевает
    for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { c.fillStyle = '#7FA2BF'; c.fillRect(420 + i * 70, 330 + r * 70, 46, 44) }
    rr(c, 560, 200, 280, 70, 8); fill(c, '#1F3A66'); tx(c, OBJ.fda, 700, 236, { f: 'M', w: 800, s: 54, c: '#F4F1EA', ls: 10 });
    for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(170 + i * 190, 610, 60 + H1(i * 3) * 30, Math.PI, 0); fill(c, '#5E8C5A') } c.restore();
    c.fillStyle = '#F4F1EA'; c.fillRect(330, 90, 20, 520); c.fillRect(130, 340, 200, 16);
    c.fillStyle = '#5A3A26'; c.fillRect(-1600, 660, 4800, 3000); c.fillStyle = 'rgba(255,235,200,.18)'; c.fillRect(-1600, 660, 4800, 8);   // стол
    rr(c, -1500, 720, 4600, 2900, 18); fill(c, '#2F5444'); rr(c, -1480, 740, 4560, 2860, 14); lnB(c, 3, 'rgba(201,162,74,.55)');   // зелёное сукно с золотой каймой
    glow(c, 980, 980, 620, '#FFE7B0', .16);   // свет лампы на сукне
  }
  function lamp5(c) {   // банкирская лампа справа: латунь, зелёный абажур
    c.save(); c.translate(1010, 860); castDots(c, -60, 40, 120, 16, 80, { k: .7 });
    rr(c, -70, 26, 140, 24, 10); fill(c, '#B8913E'); c.fillStyle = '#9C7A30'; c.fillRect(-6, -150, 12, 180);
    c.beginPath(); c.moveTo(-120, -150); c.lineTo(120, -150); c.quadraticCurveTo(126, -210, 90, -230); c.lineTo(-90, -230); c.quadraticCurveTo(-126, -210, -120, -150); c.closePath(); fill(c, '#1E6B4A');
    c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(-80, -226, 14, 70); c.fillStyle = '#FFE7B0'; c.fillRect(-110, -152, 220, 8); c.restore();
  }
  function streetPhoto(c, t) {   // фото улицы на столе (кадр стыка): бумага, тень, внутри — мир улицы
    const P = PH5; c.save(); c.translate(P.x, P.y); c.rotate(P.r);
    c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(-P.w / 2 - 14 + 10, -P.h / 2 - 14 + 14, P.w + 28, P.h + 28); c.fillStyle = '#F7F4EC'; c.fillRect(-P.w / 2 - 14, -P.h / 2 - 14, P.w + 28, P.h + 28);
    c.beginPath(); c.rect(-P.w / 2, -P.h / 2, P.w, P.h); c.clip(); c.rotate(-P.r); c.translate(-P.x, -P.y); inNest(c, N5, cc => tableWorld(cc, Math.min(t, T3.junk + .2))); c.restore();
  }
  // ---------- бланки ----------
  function stamp5(c, s, x, y, k, col, r = -.14) {   // штамп: падает сверху и печатается
    if (k <= 0) return; const e = k < 1 ? lp(1.7, 1, eo(k)) : 1; c.save(); c.translate(x, y); c.rotate(r); c.scale(e, e); c.globalAlpha *= Math.min(1, k * 2.2) * .92;
    const w = tw(c, s, { f: 'M', w: 800, s: 44, ls: 4 }) + 54; rr(c, -w / 2, -40, w, 80, 12); lnB(c, 7, col); rr(c, -w / 2 + 9, -31, w - 18, 62, 8); lnB(c, 2.5, col);
    tx(c, s, 0, 3, { f: 'M', w: 800, s: 44, c: col, ls: 4 }); c.restore();
  }
  function check5(c, x, y, k, col = '#17A86B') { if (k <= 0) return; c.save(); c.translate(x, y); c.beginPath(); const e = eo(k); c.moveTo(-14, 0); c.lineTo(lp(-14, -3, cl(e * 2)), lp(0, 12, cl(e * 2))); if (e > .5) c.lineTo(lp(-3, 18, (e - .5) * 2), lp(12, -14, (e - .5) * 2)); lnB(c, 6, col); c.restore() }
  function form5(c, t, x, y, o) {   // бланк FDA: шапка, картинка продукта, строки «МЕНЬШЕ ВЕЩЕСТВ», «МЕНЬШЕ ВРЕДА»
    c.save(); c.translate(x, y); if (o.r) c.rotate(o.r); castDots(c, -FW / 2, -FH / 2 + 20, FW, FH, 80, { k: .8 });
    rr(c, -FW / 2, -FH / 2, FW, FH, 6); fill(c, '#FBFAF6'); c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(FW / 2 - 70, -FH / 2, 70, FH);
    rr(c, -FW / 2 + 22, -FH / 2 + 22, 96, 44, 6); fill(c, '#1F3A66'); tx(c, OBJ.fda, -FW / 2 + 70, -FH / 2 + 45, { f: 'M', w: 800, s: 26, c: '#F4F1EA', ls: 4 });
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(60,70,90,.25)'; c.fillRect(-FW / 2 + 134, -FH / 2 + 26 + i * 15, 190 - i * 40, 7) }
    c.fillStyle = 'rgba(60,70,90,.12)'; rr(c, -FW / 2 + 24, -FH / 2 + 86, FW - 48, 200, 8); c.fill();
    if (o.pic === 'iqos') iqos4(c, 0, -FH / 2 + 186, 250, { name: true, shadow: false });
    else tin5(c, 0, -FH / 2 + 160, 92, .55, 0, { name: o.name > 0 ? OBJ.zyn : null, nameC: rgba('#1F2A44', Math.min(1, o.name * 1.5)), shc: 'rgba(6,10,30,.18)' });
    const L = (yy, s, ok, no) => { tx(c, s, -FW / 2 + 30, yy, { f: 'M', w: 800, s: 25, c: '#1F2A44', al: 'left', ls: 1, mw: FW - 110 }); rr(c, FW / 2 - 62, yy - 18, 36, 36, 6); lnB(c, 3, '#1F2A44');
      if (ok) check5(c, FW / 2 - 44, yy, ok) };
    if (o.less !== undefined) L(-FH / 2 + 330, TEXT.less, o.less);
    L(-FH / 2 + (o.less !== undefined ? 400 : 340), TEXT.harm, o.harm || 0);
    for (let i = 0; i < 2; i++) { c.fillStyle = 'rgba(60,70,90,.18)'; c.fillRect(-FW / 2 + 30, FH / 2 - 70 + i * 22, 260 - i * 80, 8) }
    if (o.no) stamp5(c, TEXT.no, 20, -FH / 2 + (o.less !== undefined ? 400 : 340), o.no, '#D6334D', -.1);
    if (o.ok) stamp5(c, TEXT.ok, 0, FH / 2 - 110, o.ok, '#17A86B');
    c.restore();
  }
  // ---------- вкусы ----------
  function flavor5(c, kind, x, y, k) {   // v22.2: вкусы узнаваемо и в объёме — лист мяты, долька цитруса с сегментами, кофейные зёрна, палочка корицы
    if (k <= 0) return; c.save(); c.translate(x, y - 64 * eo(k)); c.scale(bo(k) * 1.7, bo(k) * 1.7);
    if (kind === 'mint') {
      for (const [ang, sc, col] of [[-.55, .82, '#2E9E63'], [.35, 1, '#3FBF7F']]) { c.save(); c.translate(0, -8); c.rotate(ang); c.scale(sc, sc);
        c.beginPath(); c.moveTo(0, 6); for (let i = 0; i <= 12; i++) { const u = i / 12, yy = -u * 64, w = 26 * Math.sin(Math.PI * Math.pow(u, .8)) * (1 + (i % 2 ? .1 : 0)); c.lineTo(-w, yy) } for (let i = 12; i >= 0; i--) { const u = i / 12, yy = -u * 64, w = 26 * Math.sin(Math.PI * Math.pow(u, .8)) * (1 + (i % 2 ? .1 : 0)); c.lineTo(w, yy) } c.closePath();
        fill(c, col); c.save(); c.clip(); c.fillStyle = shd(col, .3); c.fillRect(0, -70, 40, 80); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(-18, -54, 5, 40); c.restore();
        c.beginPath(); c.moveTo(0, 6); c.lineTo(0, -60); for (let i = 1; i < 5; i++) { c.moveTo(0, -i * 12); c.lineTo(-16, -i * 12 - 10); c.moveTo(0, -i * 12); c.lineTo(16, -i * 12 - 10) } lnB(c, 2, 'rgba(20,80,50,.7)'); c.restore() }
    } else if (kind === 'lemon') {
      c.save(); c.translate(0, -30); circ(c, 3, 5, 36, 'rgba(0,0,0,.22)'); circ(c, 0, 0, 36, '#E8B730'); circ(c, 0, 0, 31, '#FFF6D6');
      for (let i = 0; i < 8; i++) { const a0 = i * TAU / 8 + .06, a1 = (i + 1) * TAU / 8 - .06; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 27, a0, a1); c.closePath(); fill(c, i % 2 ? '#F6D54A' : '#F2CC3A') }
      circ(c, 0, 0, 4, '#FFF6D6'); c.beginPath(); c.arc(0, 0, 33, Math.PI * 1.1, Math.PI * 1.5); lnB(c, 3, 'rgba(255,255,255,.7)'); c.restore();
    } else if (kind === 'coffee') {
      for (const [dx, dy, r] of [[-17, -24, -.4], [16, -30, .5]]) { c.save(); c.translate(dx, dy); c.rotate(r); c.beginPath(); c.ellipse(2, 3, 16, 22, 0, 0, TAU); fill(c, 'rgba(0,0,0,.25)');
        c.beginPath(); c.ellipse(0, 0, 16, 22, 0, 0, TAU); fill(c, '#6B4429'); c.save(); c.beginPath(); c.ellipse(0, 0, 16, 22, 0, 0, TAU); c.clip(); c.fillStyle = '#4A2C18'; c.fillRect(4, -24, 14, 48); c.restore();
        c.beginPath(); c.moveTo(0, -19); c.bezierCurveTo(6, -6, -6, 6, 0, 19); lnB(c, 3, '#2A180C'); c.beginPath(); c.ellipse(-7, -8, 3, 8, .2, 0, TAU); fill(c, 'rgba(255,220,180,.35)'); c.restore() }
    } else {
      c.save(); c.translate(0, -28); c.rotate(-.35); castDots(c, -40, 10, 80, 8, 20, { k: .5 });
      for (const off of [-6, 6]) { rr(c, -42, off - 9, 84, 18, 8); fill(c, '#A85A2A'); c.fillStyle = '#7E3F1C'; c.fillRect(-42, off + 2, 84, 7); c.fillStyle = 'rgba(255,210,170,.3)'; c.fillRect(-36, off - 7, 70, 3) }
      for (const sx of [-1, 1]) { c.save(); c.translate(sx * 42, 0); c.beginPath(); c.ellipse(0, 0, 6, 15, 0, 0, TAU); fill(c, '#8A4A22'); c.beginPath(); for (let i = 0; i < 30; i++) { const a = i * .45, r = 1 + i * .45; c.lineTo(Math.cos(a) * r * .38, Math.sin(a) * r) } lnB(c, 1.6, '#5A2C12'); c.restore() }
      c.restore();
    }
    c.restore();
  }
  function tinsRow(c, t) {
    const a = T5, kin = eo(at(t, a.perv - .9, a.perv - .1)), shift = eio(at(t, a.pyat - .1, a.juul)), out = eio(at(t, a.s9 - .2, a.dv26 + .3)); if (kin <= 0 || out >= 1) return;
    const W = [a.mint, a.citr, a.kofe, a.kor];
    TINS5.forEach((T, i) => { const x = lp(1700 + i * 200, 340 + i * 200, kin) + 330 * shift + 700 * out, y = 1720, lid = eio(at(t, W[i] - .25, W[i] + .05));
      tin5(c, x, y, 92, .55, lid, { cap: T.cap, h: .6, n: 8 }); flavor5(c, T.f, x, y - 70, at(t, W[i] - .05, W[i] + .3)) });
  }
  // ---------- «Джул» и нож ----------
  const JCOL = ['#7FD3A8', '#F6A03A', '#E9D8B4', '#E7739A'];
  // v22.2: узнаваемые «Джулы» (графитовый корпус, светодиод, цветной под с окошком и мундштуком) и строгая стальная гильотина:
  // стойки из стали, косое лезвие с красной кромкой и гравировкой FDA срезает поды со стола
  function juul5(c, x, y, i, cut) {
    castDots(c, x - 18, y - 6, 36, 10, 60, { k: .7 });
    rr(c, x - 18, y - 236, 36, 236, 8); fill(c, '#3A3F4C'); c.save(); rr(c, x - 18, y - 236, 36, 236, 8); c.clip(); c.fillStyle = '#2A2E38'; c.fillRect(x + 6, y - 240, 14, 240); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(x - 13, y - 228, 4, 220); c.restore();
    circ(c, x, y - 150, 3.5, i % 2 ? '#7FD3FF' : '#9CF2C2'); c.fillStyle = '#9AA3B5'; c.fillRect(x - 18, y - 240, 36, 6);
    const fall = cut, px = x + fall * (36 + i * 14), py = y - 272 + 900 * fall * fall, rot = fall * (i % 2 ? 1.7 : -1.5); if (fall >= 1) return;
    c.save(); c.translate(px, py); c.rotate(rot); c.globalAlpha *= 1 - at(fall, .6, 1);
    rr(c, -18, -34, 36, 66, 7); fill(c, rgba(JCOL[i], .92)); rr(c, -11, -56, 22, 26, 6); fill(c, rgba(shd(JCOL[i], .1), .95));   // под и мундштук
    rr(c, -10, -18, 20, 36, 4); fill(c, 'rgba(255,255,255,.35)'); c.fillStyle = rgba(shd(JCOL[i], .35), .9); c.fillRect(-10, -18 + 36 * (.35 + i * .1), 20, 36 * (.65 - i * .1));   // окошко с жидкостью
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(6, -34, 12, 66); c.restore();
  }
  function juulRow(c, t) {
    const a = T5, kin = eio(at(t, a.juul - .45, a.juul + .1)), out = eio(at(t, a.s9 - .2, a.dv26 + .2)), cut = at(t, a.zapr - .02, a.zapr + .8); if (kin <= 0 || out >= 1) return;
    c.save(); c.translate(lp(-800, 0, kin) - 900 * out, 0);
    for (let i = 0; i < 4; i++) juul5(c, 150 + i * 100, 1720, i, cut > 0 ? cut : 0);
    // стойки и перекладина — сталь
    for (const px of [62, 518]) { const g = c.createLinearGradient(px - 14, 0, px + 14, 0); g.addColorStop(0, '#D4D8E2'); g.addColorStop(.4, '#8F95A8'); g.addColorStop(1, '#3B4155');
      c.fillStyle = g; c.fillRect(px - 14, 1170, 28, 572); c.fillStyle = '#2C3142'; c.fillRect(px - 4, 1190, 8, 540); for (let k = 0; k < 4; k++) circ(c, px, 1200 + k * 160, 4, '#C9CED8') }
    PL(c, [40, 1150, 540, 1150, 540, 1186, 40, 1186], '#5C6379'); SL(c, [42, 1151, 538, 1151], 'rgba(255,255,255,.4)', 2); PL(c, [30, 1736, 550, 1736, 550, 1752, 30, 1752], '#3F4559');
    // лезвие: падает на «запретили»
    const by = lp(1196, 1404, eio(at(t, a.zapr - .18, a.zapr + .02))), shake = cut > 0 && cut < .15 ? Math.sin(cut * 200) * 4 : 0;
    c.save(); c.translate(shake, 0); const B = [76, by, 504, by, 504, by + 46, 76, by + 120];
    poly(c, B); const g = c.createLinearGradient(0, by, 0, by + 120); g.addColorStop(0, '#E1E5EC'); g.addColorStop(1, '#9AA1B2'); c.fillStyle = g; c.fill();
    c.save(); poly(c, B); c.clip(); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(76, by + 8, 428, 6); poly(c, [76, by + 106, 504, by + 34, 504, by + 46, 76, by + 120]); fill(c, '#C8102E'); c.restore();
    tx(c, OBJ.fda, 290, by + 44, { f: 'M', w: 800, s: 38, c: 'rgba(40,46,60,.5)', ls: 10 }); tx(c, OBJ.fda, 291, by + 45, { f: 'M', w: 800, s: 38, c: 'rgba(255,255,255,.35)', ls: 10 });
    poly(c, B); lnB(c, 2, 'rgba(20,23,51,.5)'); c.restore();
    c.restore();
  }
  // ---------- медальоны ----------
  function organ5(c, k) {
    c.strokeStyle = '#D6334D'; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
    if (k === 'mouth') { c.beginPath(); c.moveTo(-52, 0); c.bezierCurveTo(-30, -26, -12, -22, 0, -12); c.bezierCurveTo(12, -22, 30, -26, 52, 0); c.bezierCurveTo(26, 30, -26, 30, -52, 0); c.closePath(); fill(c, '#E2566A'); c.beginPath(); c.moveTo(-46, 0); c.quadraticCurveTo(0, 10, 46, 0); lnB(c, 4, '#9C2236') }
    else if (k === 'lungs') {   // v22.2: лёгкие узнаваемо — трахея, бронхи, две доли с вырезкой под сердце, 3 тона
      for (const s of [-1, 1]) { const P = () => { c.beginPath(); c.moveTo(s * 9, -38); c.bezierCurveTo(s * 30, -50, s * 52, -26, s * 56, 8); c.bezierCurveTo(s * 60, 40, s * 48, 58, s * 26, 56);
          c.bezierCurveTo(s * 12, 55, s * (s < 0 ? 8 : 16), 44, s * (s < 0 ? 8 : 16), 26); c.bezierCurveTo(s * (s < 0 ? 8 : 22), 12, s * 10, -6, s * 9, -38); c.closePath() };
        P(); fill(c, '#E98A96'); c.save(); P(); c.clip(); c.fillStyle = s > 0 ? '#C9677A' : '#D97A8A'; c.fillRect(s > 0 ? 34 : -60, -60, 30, 130); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(s > 0 ? 18 : -48, -30, 6, 60); c.restore();
        P(); lnB(c, 2.5, '#B84A60'); c.beginPath(); c.moveTo(s * 30, -14); c.quadraticCurveTo(s * 44, 6, s * 54, 18); lnB(c, 2, 'rgba(160,50,70,.6)') }
      c.beginPath(); c.moveTo(0, -58); c.lineTo(0, -22); c.moveTo(0, -24); c.quadraticCurveTo(-10, -16, -22, -8); c.moveTo(0, -24); c.quadraticCurveTo(10, -16, 22, -8); lnB(c, 7, '#D6334D');
      for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(-5, -54 + i * 8, 10, 2.5) } }
    else if (k === 'heart') { c.beginPath(); c.moveTo(0, 46); c.bezierCurveTo(-60, 6, -50, -46, 0, -22); c.bezierCurveTo(50, -46, 60, 6, 0, 46); fill(c, '#E2414F') }
    else { for (const s of [-1, 1]) { c.beginPath(); c.moveTo(0, -40); c.bezierCurveTo(s * 40, -50, s * 60, -10, s * 48, 18); c.bezierCurveTo(s * 40, 40, s * 10, 40, 0, 30); c.closePath(); fill(c, '#F2A6B4') }
      c.beginPath(); c.moveTo(0, -38); c.lineTo(0, 30); c.moveTo(-34, -20); c.quadraticCurveTo(-20, -8, -30, 6); c.moveTo(34, -20); c.quadraticCurveTo(20, -8, 30, 6); c.moveTo(-14, 14); c.quadraticCurveTo(-26, 22, -40, 16); c.moveTo(14, 14); c.quadraticCurveTo(26, 22, 40, 16); lnB(c, 4, '#B84A60') }
  }
  function medal5(c, t, M, k, ic) {   // медальон: белый круг, орган, зелёная стрелка «ниже»
    if (k <= 0) return; c.save(); c.translate(M.x, M.y); c.scale(bo(k), bo(k)); circ(c, 8, 12, MR, 'rgba(0,0,0,.3)'); circ(c, 0, 0, MR, '#F7F5F0'); ring(c, 0, 0, MR, '#17A86B', 7); ring(c, 0, 0, MR - 12, 'rgba(23,168,107,.35)', 2);
    if (ic > 0) { c.save(); c.globalAlpha *= ic; organ5(c, M.k); c.restore();
      c.save(); c.globalAlpha *= ic; circ(c, MR * .66, MR * .62, 30, '#17A86B'); c.beginPath(); c.moveTo(MR * .66, MR * .62 - 16); c.lineTo(MR * .66, MR * .62 + 14); c.moveTo(MR * .66 - 12, MR * .62 + 2); c.lineTo(MR * .66, MR * .62 + 15); c.lineTo(MR * .66 + 12, MR * .62 + 2); lnB(c, 5, '#FFFFFF'); c.restore() }
    c.restore();
  }
  function medals(c, t) {
    const a = T5, W = [a.rta, a.legk, a.serd, a.insult];
    MED.forEach((M, i) => { const k = at(t, W[i] - .2, W[i] + .25); if (k <= 0) return;
      if (M.k === 'brain' && t > a.dive0) {   // мозг: круг становится круглым окном двери — за ним школа (N6)
        const e = at(t, a.dive0, a.dive0 + .5); circ(c, M.x + 8, M.y + 12, MR, 'rgba(0,0,0,.3)');
        c.save(); c.beginPath(); c.arc(M.x, M.y, MR, 0, TAU); c.clip(); inNest(c, N6, cc => { if (typeof schoolWorld === 'function') schoolWorld(cc, t); else { cc.fillStyle = '#3E5C8A'; cc.fillRect(0, 0, 1080, 1920) } });
        if (e < 1) { c.globalAlpha = 1 - e; circ(c, M.x, M.y, MR, '#F7F5F0'); c.save(); c.translate(M.x, M.y); organ5(c, M.k); c.restore() } c.restore();
        ring(c, M.x, M.y, MR, mixc('#17A86B', '#8E95A6', e), 7 + 5 * e); ring(c, M.x, M.y, MR + 8, rgba('#C9CED8', e), 4); return }
      medal5(c, t, M, k, 1) });
  }
  // ---------- мир 5 ----------
  function fdaWorld(c, t) {
    const a = T5; fdaRoom(c, t); streetPhoto(c, t);
    const kz = eo(at(t, a.razr - .2, a.razr + .15)), zn = at(t, a.zinu - .05, a.zinu + .35), ok9 = at(t, a.razr9 - .05, a.razr9 + .35);
    const inI = eio(at(t, a.s9 - .1, a.dv26 + .3));
    if (inI > 0) form5(c, t, lp(-500, FI.x, inI), FI.y, { pic: 'iqos', less: 1, harm: 0, no: at(t, a.nera - .2, a.nera + .1), r: .03 });
    form5(c, t, FZ.x, FZ.y, { pic: 'tin', harm: ok9, ok: kz * (1 - at(t, a.s9 - .2, a.s9 + .2)), name: zn, r: -.02 });
    if (t > a.zin2 - .3 && t < a.nizhe + .3) { const k = at(t, a.zin2 - .3, a.zin2 + .1) * (1 - at(t, a.nizhe - .1, a.nizhe + .3));   // «Зин вместо сигарет»: сигарета перечёркнута у бланка
      c.save(); c.globalAlpha *= k; cigar(c, FZ.x - 140, FZ.y + 300, FZ.x + 40, FZ.y + 300, 14, { filt: C3.filt, ember: 1 }); const kx = eo(at(t, a.sig - .05, a.sig + .25)); c.beginPath(); c.moveTo(FZ.x - 150, FZ.y + 330); c.lineTo(lp(FZ.x - 150, FZ.x + 50, kx), lp(FZ.y + 330, FZ.y + 270, kx)); lnB(c, 7, '#D6334D'); c.restore() }
    cap5(c, TEXT.first, FZ.x + 104, FZ.y - FH / 2 + 2, at(t, a.perv - .05, a.perv + .25) * (1 - at(t, a.vkus + .3, a.vkus + .6)), { s: 44, r: .07 });   // v22.2: наклейкой на углу бланка — логотип FDA открыт
    tinsRow(c, t); juulRow(c, t); lamp5(c);
    const dim = at(t, a.nizhe - .1, a.nizhe + .4); if (dim > 0) { c.save(); c.globalAlpha *= .6 * dim; c.fillStyle = '#0B1024'; c.fillRect(-1600, -1200, 4800, 4800); c.restore() }
    medals(c, t);
    cap5(c, TEXT.risk, 780, 664, at(t, a.nizhe - .05, a.nizhe + .25) * (1 - at(t, a.dive0 + .2, a.dive0 + .5)), { s: 50, bg: '#17A86B', c: '#FFFFFF' });   // v22.2: над сеткой медальонов, лёгкие не закрывает
  }
  function fdaPlates(c, t) {
    const a = T5;

  }
  function fdaShot(c, t) { const q = camObj(camAt(K5, t)); layer(c, q, 1, cc => fdaWorld(cc, t)); fdaPlates(c, t) }
  function fdaCues(Q) {
    const a = T5; Q(a.j + .1, 'whoosh', .35); Q(a.j + .6, 'papers', .4); Q(a.razr - .05, 'stamp', .6); Q(a.razr, 'thud', .4); for (let i = 0; i < 4; i++) Q(a.perv - .8 + i * .14, 'plop', .25, .4 - i * .2);
    [a.mint, a.citr, a.kofe, a.kor].forEach((w, i) => { Q(w - .2, 'drawer', .25, -.3 + i * .2); Q(w, 'plop', .35, -.3 + i * .2) });
    Q(a.juul - .4, 'scuttle', .35, -.4); Q(a.zapr - .2, 'chain', .35); Q(a.zapr, 'blade', .6); Q(a.zapr + .1, 'impact', .4); Q(a.zapr + .4, 'plop', .3);
    Q(a.s9, 'whoosh', .35); Q(a.dv26 + .1, 'papers', .4); Q(a.zinu, 'marker', .4); Q(a.razr9, 'shimmer', .35); Q(a.ayk - .2, 'whoosh', .3); Q(a.nera - .1, 'stamp', .55); Q(a.nera, 'thud', .45);
    Q(a.govor, 'whoosh', .3); Q(a.sig, 'marker', .35); Q(a.nizhe, 'deep', .35); [a.rta, a.legk, a.serd, a.insult].forEach((w, i) => Q(w - .1, 'plop', .4, [-.3, .3, -.3, .3][i])); Q(a.dive0 + .2, 'dive', .55);
  }
