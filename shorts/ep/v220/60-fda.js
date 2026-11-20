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
    c.fillStyle = '#F7F6F2'; c.fillRect(280, 270, 520, 360); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(700, 270, 100, 360);
    for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { c.fillStyle = '#7FA2BF'; c.fillRect(300 + i * 70, 330 + r * 70, 46, 44) }
    rr(c, 400, 200, 280, 70, 8); fill(c, '#1F3A66'); tx(c, OBJ.fda, 540, 236, { f: 'M', w: 800, s: 54, c: '#F4F1EA', ls: 10 });
    for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(170 + i * 190, 610, 60 + H1(i * 3) * 30, Math.PI, 0); fill(c, '#5E8C5A') } c.restore();
    c.fillStyle = '#F4F1EA'; c.fillRect(530, 90, 20, 520); c.fillRect(130, 340, 820, 16);
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
  function flavor5(c, kind, x, y, k) {   // значок вкуса над открытой банкой
    if (k <= 0) return; c.save(); c.translate(x, y - 40 * eo(k)); c.scale(bo(k), bo(k));
    if (kind === 'mint') { for (const s of [-1, 1]) { c.save(); c.rotate(s * .5); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-20 * s, -10, -18 * s, -44, 0, -56); c.bezierCurveTo(18 * s, -44, 16 * s, -10, 0, 0); fill(c, '#3FBF7F'); c.beginPath(); c.moveTo(0, -4); c.lineTo(0, -48); lnB(c, 2, '#1E7A4E'); c.restore() } }
    else if (kind === 'lemon') { circ(c, 0, -26, 30, '#F2D04B'); circ(c, 0, -26, 23, '#FBE79A'); for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3; c.beginPath(); c.moveTo(0, -26); c.lineTo(Math.cos(an) * 22, -26 + Math.sin(an) * 22); lnB(c, 2, '#E6B830') } }
    else if (kind === 'coffee') { for (const dx of [-16, 16]) { c.save(); c.translate(dx, -26); c.rotate(dx > 0 ? .4 : -.3); c.beginPath(); c.ellipse(0, 0, 15, 21, 0, 0, TAU); fill(c, '#6B4429'); c.beginPath(); c.moveTo(0, -18); c.quadraticCurveTo(6, 0, 0, 18); lnB(c, 2.5, '#3A2416'); c.restore() } }
    else { for (const dx of [-10, 10]) { c.save(); c.translate(dx, -26); c.rotate(dx * .03); rr(c, -9, -34, 18, 68, 8); fill(c, '#A85A2A'); c.beginPath(); c.moveTo(-5, -30); c.lineTo(-5, 30); lnB(c, 2, '#7A3E1C'); c.restore() } }
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
  function juulRow(c, t) {
    const a = T5, kin = eio(at(t, a.juul - .45, a.juul + .1)), out = eio(at(t, a.s9 - .2, a.dv26 + .2)), cut = at(t, a.zapr - .02, a.zapr + .8); if (kin <= 0 || out >= 1) return;
    c.save(); c.translate(lp(-800, 0, kin) - 900 * out, 0);
    for (let i = 0; i < 4; i++) { const x = 150 + i * 100, y = 1720; castDots(c, x - 14, y - 6, 28, 10, 60, { k: .7 });
      rr(c, x - 15, y - 250, 30, 250, 9); fill(c, '#3A3F4C'); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x - 10, y - 240, 5, 230); c.fillStyle = '#9AA3B5'; c.fillRect(x - 15, y - 250, 30, 6);
      const fall = cut > 0 ? cut : 0, px = x + fall * (30 + i * 12), py = y - 296 + 900 * fall * fall, rot = fall * (i % 2 ? 1.6 : -1.4);
      c.save(); c.translate(px, py); c.rotate(rot); c.globalAlpha *= 1 - at(fall, .6, 1); rr(c, -15, -22, 30, 46, 6); fill(c, rgba(JCOL[i], .9)); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-10, -18, 5, 36); c.restore() }
    // нож: стойки, перекладина, лезвие с гравировкой FDA
    c.fillStyle = '#4A3226'; c.fillRect(60, 1180, 26, 560); c.fillRect(514, 1180, 26, 560); rr(c, 40, 1150, 520, 40, 8); fill(c, '#5A3A26');
    const by = lp(1210, 1390, eio(at(t, a.zapr - .18, a.zapr + .02))), shake = cut > 0 && cut < .15 ? Math.sin(cut * 200) * 4 : 0;
    c.save(); c.translate(shake, 0); poly(c, [90, by, 510, by, 510, by + 70, 90, by + 110]); fill(c, '#C9CED8'); c.save(); poly(c, [90, by, 510, by, 510, by + 70, 90, by + 110]); c.clip();
    c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(90, by + 6, 420, 10); c.fillStyle = '#D6334D'; c.fillRect(90, by, 420, 8); c.restore();
    tx(c, OBJ.fda, 300, by + 48, { f: 'M', w: 800, s: 34, c: 'rgba(40,46,60,.55)', ls: 8 }); poly(c, [90, by, 510, by, 510, by + 70, 90, by + 110]); lnB(c, 2, 'rgba(20,23,51,.5)'); c.restore();
    c.restore();
  }
  // ---------- медальоны ----------
  function organ5(c, k) {
    c.strokeStyle = '#D6334D'; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
    if (k === 'mouth') { c.beginPath(); c.moveTo(-52, 0); c.bezierCurveTo(-30, -26, -12, -22, 0, -12); c.bezierCurveTo(12, -22, 30, -26, 52, 0); c.bezierCurveTo(26, 30, -26, 30, -52, 0); c.closePath(); fill(c, '#E2566A'); c.beginPath(); c.moveTo(-46, 0); c.quadraticCurveTo(0, 10, 46, 0); lnB(c, 4, '#9C2236') }
    else if (k === 'lungs') { c.beginPath(); c.moveTo(0, -50); c.lineTo(0, -10); c.moveTo(0, -12); c.lineTo(-16, 0); c.moveTo(0, -12); c.lineTo(16, 0); c.stroke();
      for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 10, -26); c.bezierCurveTo(s * 50, -40, s * 58, 30, s * 40, 46); c.bezierCurveTo(s * 24, 54, s * 12, 40, s * 10, 20); c.closePath(); fill(c, '#E98A96') } }
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
    tinsRow(c, t); juulRow(c, t); lamp5(c);
    const dim = at(t, a.nizhe - .1, a.nizhe + .4); if (dim > 0) { c.save(); c.globalAlpha *= .6 * dim; c.fillStyle = '#0B1024'; c.fillRect(-1600, -1200, 4800, 4800); c.restore() }
    medals(c, t);
  }
  function fdaPlates(c, t) {
    const a = T5;
    capS(c, TEXT.first, 540, 330, at(t, a.perv - .05, a.perv + .25) * (1 - at(t, a.vkus + .3, a.vkus + .6)), { s: 54 });
    capS(c, TEXT.risk, 540, 330, at(t, a.nizhe - .05, a.nizhe + .25) * (1 - at(t, a.dive0 + .2, a.dive0 + .5)), { s: 54, bg: '#17A86B', c: '#FFFFFF' });
  }
  function fdaShot(c, t) { const q = camObj(camAt(K5, t)); layer(c, q, 1, cc => fdaWorld(cc, t)); fdaPlates(c, t) }
  function fdaCues(Q) {
    const a = T5; Q(a.j + .1, 'whoosh', .35); Q(a.j + .6, 'papers', .4); Q(a.razr - .05, 'stamp', .6); Q(a.razr, 'thud', .4); for (let i = 0; i < 4; i++) Q(a.perv - .8 + i * .14, 'plop', .25, .4 - i * .2);
    [a.mint, a.citr, a.kofe, a.kor].forEach((w, i) => { Q(w - .2, 'drawer', .25, -.3 + i * .2); Q(w, 'plop', .35, -.3 + i * .2) });
    Q(a.juul - .4, 'scuttle', .35, -.4); Q(a.zapr - .2, 'chain', .35); Q(a.zapr, 'blade', .6); Q(a.zapr + .1, 'impact', .4); Q(a.zapr + .4, 'plop', .3);
    Q(a.s9, 'whoosh', .35); Q(a.dv26 + .1, 'papers', .4); Q(a.zinu, 'marker', .4); Q(a.razr9, 'shimmer', .35); Q(a.ayk - .2, 'whoosh', .3); Q(a.nera - .1, 'stamp', .55); Q(a.nera, 'thud', .45);
    Q(a.govor, 'whoosh', .3); Q(a.sig, 'marker', .35); Q(a.nizhe, 'deep', .35); [a.rta, a.legk, a.serd, a.insult].forEach((w, i) => Q(w - .1, 'plop', .4, [-.3, .3, -.3, .3][i])); Q(a.dive0 + .2, 'dive', .55);
  }
