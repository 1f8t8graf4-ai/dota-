// Никотин v10 · ролик A (nicsa, голос Alex Bell): анимация «Досье на доске».
//   Вся история — одна пробковая доска. Камера едет от улики к улике, красная нить тянется следом (сюжет связан буквально).
//   На «Формула вернулась домой» камера отъезжает: нить по доске оказывается контуром одноразки («если соединить точки…», как
//   пентаграмма у Starbucks). Финал — в середине контура карточка «ВЫ» с рукой и одноразкой. Предметы — ep/n9lib.js.
(function () {
  'use strict';
  const { C, MONO, G2, sh, BIG, mono, year, stamp9, vape, vapeLine, cloud, curl9, cig, folder, sheet, crystal, lerp2, THROAT, teen70, chemist, backPerson,
    handVape, calendar, FLASK, glassFill, glass, vial, flashDrive, juulDev, pack, mango, apple, QUOTE, QN, LIT, teenBust, SHELF_C } = N9;
  P = { bg: C.night, paper: C.paper, ink: C.night, line: C.paper, a1: C.mango, a2: C.red };
  const D = {};
  let Q = null, SHOTS = [], CONT = null;

  // ---------- доска, карточки ----------
  const CORK = '#8E6A48', CORK2 = '#7A5A3C';
  // контур одноразки (по нему идёт нить): мундштук сверху, корпус со скруглёнными углами
  const CONTOUR = 'M1500 300H1800L1950 1000H2150A450 450 0 0 1 2600 1450V5150A450 450 0 0 1 2150 5600H850A450 450 0 0 1 400 5150V1450A450 450 0 0 1 850 1000H1050L1200 300Z';
  // булавки станций (по порядку сюжета), снапаются на контур
  const PIN0 = { title: [1500, 300], claim: [2100, 1000], memo: [2600, 1800], harsh: [2600, 2950], lab: [2600, 4000], stamp: [2468, 5468],
    archive: [1500, 5600], juul: [400, 4800], teens: [400, 3600], deal: [400, 2400] };
  const ORDER = ['title', 'claim', 'memo', 'harsh', 'lab', 'stamp', 'archive', 'juul', 'teens', 'deal'];
  function contour() {
    if (CONT) return CONT;
    const p = pts(CONTOUR, 900), cum = [0];
    for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
    const total = cum[cum.length - 1] + Math.hypot(p[0][0] - p[p.length - 1][0], p[0][1] - p[p.length - 1][1]);
    const at = {};
    for (const k of ORDER) { const [x, y] = PIN0[k]; let bi = 0, bd = 1e18; p.forEach(([u, v], i) => { const d = (u - x) ** 2 + (v - y) ** 2; if (d < bd) { bd = d; bi = i } }); at[k] = { i: bi, s: cum[bi], x: p[bi][0], y: p[bi][1] } }
    return (CONT = { p, cum, total, at })
  }
  // нить по контуру от длины s0 до s1 (s1 может «перейти через ноль» — замыкание)
  function contourThread(s0, s1, w) {
    const { p, cum, total } = contour();
    const pick = (a, b) => { const out = []; for (let i = 0; i < p.length; i++) if (cum[i] >= a && cum[i] <= b) out.push(p[i]); return out };
    const pt = s => { s = ((s % total) + total) % total; let i = 0; while (i < cum.length - 1 && cum[i + 1] < s) i++; const j = (i + 1) % p.length, seg = (i + 1 < cum.length ? cum[i + 1] : total) - cum[i], q = seg ? (s - cum[i]) / seg : 0; return [lerp(p[i][0], p[j][0], q), lerp(p[i][1], p[j][1], q)] };
    let L = [pt(s0)];
    if (s1 <= total) L = L.concat(pick(s0, s1), [pt(s1)]);
    else L = L.concat(pick(s0, total), [p[0]], pick(0, s1 - total), [pt(s1)]);
    return L.length > 1 ? `<path d="${D_.poly(L, false)}" fill="none" stroke="${C.red}" stroke-width="${R(w)}" stroke-linecap="round" stroke-linejoin="round"/>` : ''
  }
  const tack = (x, y, s = 1, c = C.red) => F(D_.circ(x + 5 * s, y + 8 * s, 18 * s), '#000', { op: .35 }) + F(D_.circ(x, y, 18 * s), c) + F(D_.circ(x - 5 * s, y - 5 * s, 6 * s), '#fff', { op: .6 });
  const tape = (x, y, r = 0, w = 150) => F(D_.rr(-w / 2, -22, w, 44, 3), '#F3EBD3', { op: .82, tr: `translate(${x} ${y}) rotate(${r})` });
  // карточка: появляется «прикалыванием» в момент ta; inner(x0,y0,w,h) рисует содержимое в локальных координатах (центр 0,0)
  function card(cx, cy, w, h, rot, t, ta, inner, o = {}) {
    const k = P01(t, ta, .5); if (k <= 0) return '';
    const e = EZ.back(k), s = lerp(1.18, 1, e), dr = (1 - EZ.o(k)) * 8;
    const box = D_.rr(-w / 2, -h / 2, w, h, o.r ?? 6);
    let c = F(box, '#000', { op: .32 * clamp(k * 2), tr: `translate(${R(18 * s)} ${R(26 * s)})` }) + inner(w, h);
    if (o.pin !== false) c += tack(0, -h / 2 + 34);
    if (o.tape) c += tape(-w / 2 + 40, -h / 2 + 10, -30) + tape(w / 2 - 40, -h / 2 + 10, 30);
    return g(c, at(cx, cy, s, rot + dr), clamp(k * 3))
  }
  // полароид: белая рамка, фото (clip), подпись внизу
  function polaroid(photo, cap) {
    return (w, h) => {
      const pw = w - 56, ph = h - 150, fy = -h / 2 + 28 + ph / 2;
      let s = G2(D_.rr(-w / 2, -h / 2, w, h, 6), '#FBFAF6', '#E9E5DA');
      s += clip(D_.rr(-pw / 2, fy - ph / 2, pw, ph, 2), g(photo(pw, ph), `translate(0 ${R(fy)})`));
      if (cap) s += tx(cap, 0, h / 2 - 46, { f: 'O', w: 700, s: 40, c: '#2A2F3A', ls: 3 });
      return s
    }
  }
  const paper = (fill) => (w, h) => G2(D_.rr(-w / 2, -h / 2, w, h, 4), '#FBF5E7', C.paper2) + fill(w, h);
  const sticky = (fill, c = '#F6D365') => (w, h) => F(D_.rr(-w / 2, -h / 2, w, h, 4), c) + F(D_.rr(-w / 2, -h / 2, w, 40, 4), '#000', { op: .06 }) + fill(w, h);
  const darkPhoto = (c0, c1) => (w, h) => { const [id, d] = lgrad([[0, c0], [1, c1]], 0, 0, 0, 1); return d + `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="url(#${id})"/>` };

  // ---------- содержимое карточек ----------
  function world(t) {
    const q = Q; let s = '';
    s += `<rect x="-2000" y="-2000" width="7000" height="10400" fill="${CORK}"/><rect x="-2000" y="-2000" width="7000" height="10400" fill="url(#cork)"/>` + glow(1500, 3000, 3200, '#F2C277', .18);
    // 1. заставка: полароид с одноразкой, полоска-заголовок, стикер-счётчик
    s += card(1500, 680, 620, 760, -2, t, -1, polaroid((w, h) => darkPhoto('#203566', '#0B1028')(w, h) + glow(0, 0, 300, C.mango, .28) + vape({ s: .82, r: -8 + fl(t, 1.5, .2) }) + curl9(34, -268, t, 160, C.smoke, 6, .5), 'НИКОТИН'));
    s += card(1500, 1185, 800, 200, 1.5, t, -1, paper((w, h) => mono('ЧТО ВЫ ЗНАЕТЕ О', -w / 2 + 40, -30, { s: 34, c: C.ink2 }) + tx('НИКОТИНЕ?', 0, 66, { f: 'U', w: 800, s: 84, c: C.ink })), { pin: false, tape: true });
    s += card(2050, 520, 330, 300, 5, t, q.bil - .2, sticky((w, h) => mono('ПОЛЬЗУЮТСЯ:', -w / 2 + 26, -60, { s: 22, c: '#5A4A20' }) + g(odo(1.25e9 * E(t, q.bil, 1.6, 'o'), 0, 0, { f: 'O', w: 700, s: 46, c: '#2A2F3A', sep: ' ' }), at(0, 30)) + tx('ЧЕЛОВЕК', 0, 100, { f: 'O', w: 700, s: 30, c: '#5A4A20', ls: 4 })));
    // 2. тезис: рентгеновский снимок — в баке соль; год 2026 → 1973; внутри проступает сигарета
    s += card(2100, 1360, 560, 720, 3, t, q.claim - .25, (w, h) => {
      let c = F(D_.rr(-w / 2, -h / 2, w, h, 16), '#16264A') + F(D_.rr(-w / 2, -h / 2, w, h, 16), '#5FD9C5', { op: .06 });
      for (let i = -3; i <= 3; i++) c += `<path d="M${i * 80} ${-h / 2}V${h / 2}M${-w / 2} ${i * 100}H${w / 2}" stroke="#5FD9C5" stroke-width="1.5" opacity=".12"/>`;
      const kx = E(t, q.salt - .1, .8), kc = E(t, q.comp - .1, .7);
      c += g(vapeLine(clamp(.4 + kx), { w: 6 }) + (kx > .3 ? [...Array(7)].map((_, i) => crystal(-32 + (i % 3) * 32, -VHh + 250 - Math.floor(i / 3) * 34, 15 * EZ.back(clamp(kx * 7 - i * .7 - 1.5)), { r: i * 20 })).join('') : ''), at(0, -40, .85, -6), 1 - .6 * kc);
      if (kc > 0) c += g(cig({ len: 420, h: 52, r: -90, shadow: false }), at(0, -40, 1), kc) + curl9(0, -270, t, 140, C.smoke, 5, .6 * kc);
      const ky = E(t, q.y50 - .2, 1.2, 'io5');
      if (ky > 0) c += tx(String(Math.round(lerp(2026, 1973, ky))), 0, h / 2 - 50, { f: 'U', w: 800, s: 76, c: ky >= 1 ? C.red : '#CFE9FF' });
      return c
    }, { pin: true });
    // 3. записка 1973 + календарь
    s += card(2230, 1830, 380, 330, -6, t, q.memo - .25, (w, h) => g(calendar('1973', 'ФЕВРАЛЬ'), at(0, 6, .62)), { pin: false, tape: true });
    s += card(2600, 2220, 640, 840, -2, t, q.memo + .2, paper((w, h) => {
      let c = mono('R.J. REYNOLDS TOBACCO CO.', -w / 2 + 44, -h / 2 + 90, { s: 22, c: C.ink2 }) + mono('2 ФЕВРАЛЯ 1973 · ЗАПИСКА', -w / 2 + 44, -h / 2 + 124, { s: 22, c: C.ink2 });
      const kq = clamp((t - q.quote) / (q.quoteE - q.quote - .2)); let n = Math.round(QN * kq), yy = -150;
      for (const l of QUOTE) { const m = Math.min(n, l.length); if (m > 0) c += mono(l.slice(0, m), -w / 2 + 44, yy, { s: 33, c: C.ink }); n -= m; yy += 62 }
      c += Ln('M-290 54C-150 82 230 82 290 54C334 32 322 -2 236 -6C90 -12 -236 -10 -306 22C-330 36 -318 54 -284 60', E(t, q.mol - .05, .6), { c: C.red, w: 8 });
      c += stamp9('СЕКРЕТНО', 150, -h / 2 + 200, t, q.zap - .1, { s: 34, r: -10 });
      return c
    }));
    // 4. «дерёт горло»: полароид подростка 70-х, кашель
    s += card(2600, 3300, 600, 740, 2, t, q.harsh - .25, polaroid((w, h) => {
      const hot = E(t, q.deret - .15, .35), cough = P01(t, q.deret + .4, .9), sk = shake(t, q.deret + .35, 6, .8, 32);
      let c = darkPhoto('#4A2A35', '#1A1018')(w, h);
      const th = Ln(THROAT, 1, { c: '#000', w: 34, op: .22 }) + Ln(THROAT, 1, { c: lerp2('#9FD4E8', '#FF5A3C', hot), w: 18, op: .95 }) + (hot > .05 ? [6, 10, 14].map((i, j) => { const P0 = pts(THROAT, 20), [x, y] = P0[i], qq = clamp(hot * 3 - j * .6), d = `M${R(x - 30)} ${R(y - 12)}L${R(x + 30)} ${R(y + 12)}`; return qq > 0 ? Ln(d, qq, { c: '#FFF1E8', w: 9 }) + Ln(d, qq, { c: C.red, w: 5 }) : '' }).join('') + glow(40, 140, 170, C.red, .3 * hot) : '');
      c += teen70({ x: -90 + sk, y: 30, s: .95, squint: hot > .5 ? 1 : 0, open: cough > 0 && cough < 1 ? .6 : 0, throat: th });
      c += g(cig({ len: 230, h: 28, shadow: false }), at(-90 + 136 * .95 + 115 * .95 + sk, 30 + 48 * .95, .95, -6), 1 - E(t, q.deret + .5, .3));
      for (let i = 0; i < 3; i++) { const p = P01(t, q.deret + .45 + i * .2, 1); if (p > 0 && p < 1) c += cloud(70 + p * 160, 60 - p * 120 - i * 30, .25 + p * .35, { op: (1 - p) * .9 }) }
      return c
    }, 'ДЕРЁТ ГОРЛО'));
    // 5. лаборатория: колба (никотин + кислота = соль), химик с 30 пробирками, яблоко
    s += card(2600, 4340, 580, 720, -2, t, q.lab - .25, polaroid((w, h) => {
      let c = darkPhoto('#22324A', '#141E2E')(w, h);
      for (let x = -w / 2; x < w / 2; x += 70) for (let y = -h / 2; y < h / 2; y += 70) c += F(D_.rr(x + 3, y + 3, 64, 64, 4), '#2A3C58');
      const pour = clamp((t - q.lab) / 1.6), kc = E(t, q.kis + .2, .9, 'o');
      c += g(glassFill(FLASK, .15 + .5 * pour, lerp2('#F2B35A', '#F5E6B8', kc), [-160, -250, 320, 460]) + glass(FLASK), at(0, 40, .8));
      if (kc > 0) for (let i = 0; i < 12; i++) { const qq = clamp(kc * 12 - i * .8); if (qq > 0) c += crystal(-70 + (i % 4) * 46, 150 - Math.floor(i / 4) * 40, 16 * EZ.back(qq), { r: i * 23 }) }
      if (t > q.salt2 - .2) c += g(F(D_.rr(-100, -28, 200, 56, 10), C.paper) + tx('СОЛЬ', 0, 18, { f: 'O', w: 700, s: 40, c: C.red2, ls: 6 }), at(0, -230), E(t, q.salt2 - .2, .4));
      return c
    }, 'НИКОТИН + КИСЛОТА'));
    s += card(2110, 4180, 520, 660, 3, t, q.chem - .3, polaroid((w, h) => {
      let c = darkPhoto('#2A3346', '#151B28')(w, h);
      const nv = Math.floor(clamp((t - q.t30 + .2) / 1.0) * 12);
      for (let i = 0; i < nv; i++) { const green = i === 6, kg = green ? E(t, q.apple - .4, .4) : 0; c += g(vial(.6, green ? lerp2('#F2B35A', C.apple, kg) : ['#F2B35A', '#E8C27A', '#F5D27E'][i % 3]), at(40 + (i % 4) * 44, -90 + Math.floor(i / 4) * 110, .62)) }
      c += chemist(t, { x: -110, y: h / 2, s: .72, look: t > q.apple ? 1 : 0, brow: E(t, q.apple, .3), smile: E(t, q.apple + .3, .4) });
      if (nv > 0) c += tx(`${Math.round(30 * clamp((t - q.t30 + .2) / 1.0))}`, 120, -h / 2 + 70, { f: 'O', w: 700, s: 54, c: C.paper });
      return c
    }, '30 ВАРИАНТОВ'));
    s += card(2300, 3880, 230, 230, 0, t, q.apple - .1, (w, h) => F(D_.circ(0, 0, 112), '#fff') + F(D_.circ(0, 0, 100), '#EAF7D6') + apple(0, 6, .62), { pin: false });
    // 6. 1979: досье «Конфиденциально»
    s += card(2380, 5700, 620, 450, -4, t, q.stamp - .25, (w, h) => folder({ s: 1.0, label: '№ 1979', sheet: true }) + stamp9('КОНФИДЕНЦИАЛЬНО', 10, 70, t, q.konf - .05, { s: 46, r: -8 }), { pin: true, r: 14 });
    // 7. 1998: газетная вырезка; 2005: студенты
    s += card(1500, 5830, 740, 430, 2, t, q.arch - .25, (w, h) => {
      let c = F(D_.rr(-w / 2, -h / 2, w, h, 2), '#EAE6DA') + F(D_.rr(-w / 2 + 30, -h / 2 + 30, w - 60, 6, 0), '#2A2F3A');
      c += tx('1998', -w / 2 + 40, -h / 2 + 96, { f: 'U', w: 800, s: 52, c: C.red, a: 'start' }) + tx('ТАБАЧНИКИ ОТКРЫВАЮТ', -w / 2 + 40, -h / 2 + 160, { f: 'O', w: 700, s: 44, c: '#1E2230', a: 'start' }) + tx('СЕКРЕТНЫЕ АРХИВЫ', -w / 2 + 40, -h / 2 + 212, { f: 'O', w: 700, s: 44, c: '#1E2230', a: 'start' });
      for (let i = 0; i < 4; i++) c += F(D_.rr(-w / 2 + 40, -h / 2 + 250 + i * 34, i % 2 ? 420 : 640, 12, 4), '#8C877A', { op: .7 });
      return c
    }, { pin: true });
    s += card(1450, 5130, 600, 640, -2, t, q.stud - .3, polaroid((w, h) => {
      let c = darkPhoto('#101830', '#070B16')(w, h) + glow(0, -40, 300, '#5FB4E8', .25);
      c += F(D_.rr(-170, -170, 340, 230, 10), '#2A2E37') + F(D_.rr(-158, -158, 316, 206, 6), '#E9EEF5') + g(sheet(110, 150, { n: 5, shadow: false, top: 40, dy: 22 }), at(-80, -55)) + Ln('M10 0C40 -10 60 -80 90 -90S130 -40 150 -110', clamp((t - q.stud) / 1.4), { c: C.red, w: 5 });
      c += backPerson({ x: -120, y: h / 2 + 30, s: .62, c1: '#5C6B8C', c2: '#3B4763' }) + backPerson({ x: 130, y: h / 2 + 40, s: .64, c1: '#9A4B3C', c2: '#6B3328', hair: '#C9A26A' });
      return c
    }, 'СТЭНФОРД · 2005'));
    // 8. «Джул»: фото устройства и флешки, патент со ссылкой на «Рейнольдс», «картридж = пачка», манго
    s += card(430, 5130, 600, 640, 3, t, q.juul - .25, polaroid((w, h) => {
      let c = darkPhoto('#1C4656', '#0B1A26')(w, h) + glow(0, 0, 320, '#7FF0DA', .2);
      c += g(juulDev({ led: .6 + .4 * Math.sin(t * 3) }), at(0, -60, .62, -8), E(t, q.juul - .1, .5));
      c += g(flashDrive(), at(20, 120, .62, -8), E(t, q.fl - .2, .5)) + tx('≈', 0, 50, { f: 'U', w: 800, s: 60, c: C.line, op: E(t, q.fl + .2, .3) });
      return c
    }, '2015'));
    s += card(820, 4560, 540, 720, -3, t, q.pat - .25, paper((w, h) => {
      let c = tx('ПАТЕНТ США', 0, -h / 2 + 80, { f: 'O', w: 700, s: 44, c: C.ink, ls: 4 }) + mono('2015 · НИКОТИНОВАЯ СОЛЬ', -w / 2 + 40, -h / 2 + 124, { s: 21, c: C.ink2 });
      for (let i = 0; i < 9; i++) c += F(D_.rr(-w / 2 + 40, -h / 2 + 170 + i * 36, i % 3 === 2 ? 300 : 440, 10, 4), '#8C8572', { op: .55 });
      const kh = E(t, q.rey - .3, .45);
      c += F(D_.rr(-w / 2 + 26, h / 2 - 170, w - 52, 76, 8), C.mango, { op: .45 * kh }) + mono('R.J. REYNOLDS · 1989', -w / 2 + 44, h / 2 - 120, { s: 27, c: C.ink }) + Ln(D_.rr(-w / 2 + 22, h / 2 - 174, w - 44, 84, 10), kh, { c: C.red, w: 7 });
      return c
    }));
    s += card(1000, 3990, 480, 400, 4, t, q.pod - .25, paper((w, h) => {
      const kb = E(t, q.pachk - .2, .5);
      let c = g(F(D_.rr(-70, -40, 140, 64, 18), '#D7DEE6') + F(D_.rr(-56, -30, 90, 40, 10), C.mango, { op: .6 }), at(-120, 0, 1.1)) + g(pack({ n: 1, s: .5 }), at(120, 10));
      c += tx('=', 0, 30, { f: 'U', w: 800, s: 90, c: C.red, op: kb }) + tx('1 КАРТРИДЖ = 1 ПАЧКА', 0, h / 2 - 50, { f: 'O', w: 700, s: 30, c: C.ink, op: kb });
      return c
    }));
    s += card(1250, 3800, 230, 230, 0, t, q.mango - .1, (w, h) => F(D_.circ(0, 0, 112), '#fff') + F(D_.circ(0, 0, 100), '#FFF1D6') + mango(0, 8, .62), { pin: false });
    // 9. школьники: фото класса, каждый четвёртый обведён
    s += card(430, 3950, 620, 700, -2, t, q.teens - .25, polaroid((w, h) => {
      let c = darkPhoto('#2A3A55', '#121A2A')(w, h);
      for (let i = 0; i < 6; i++) c += F(D_.rr(-w / 2 + i * 96, -h / 2, 90, h * .6, 4), i % 2 ? '#3B5A86' : '#36557F');
      const kl = E(t, q.chetv - .2, .4, 'back');
      for (let r = 0; r < 3; r++) for (let cc = 0; cc < 4; cc++) {
        const i = r * 4 + cc, lit = LIT.has(i), x = -200 + cc * 135 + (r % 2 ? 20 : -20), y = -80 + r * 120;
        c += g(teenBust(i, lit, t, kl), at(x, y + 60, .42));
        if (lit && kl > 0) c += Ln(D_.circ(x, y - 40, 56), kl, { c: C.red, w: 6 });
      }
      return c
    }, 'США · КАЖДЫЙ 4-Й'));
    // 10. сделка: пачка, «1/3», 12,8 млрд
    s += card(430, 2740, 560, 660, -3, t, q.deal - .25, polaroid((w, h) => darkPhoto('#3A1F24', '#140A0E')(w, h) + glow(0, 0, 260, C.red, .22) + g(pack({ n: 1, s: 1.05 }), at(0, 30)), 'ПРОИЗВОДИТЕЛЬ «МАЛЬБОРО»'));
    s += card(880, 2950, 360, 360, 4, t, q.deal + .4, paper((w, h) => {
      const sl = (a0, a1) => `M0 0L${R(Math.cos(a0) * 130)} ${R(Math.sin(a0) * 130)}A130 130 0 0 1 ${R(Math.cos(a1) * 130)} ${R(Math.sin(a1) * 130)}Z`;
      return Ln(D_.circ(0, -10, 130), 1, { c: C.ink2, w: 5 }) + F(sl(-PI / 2, -PI / 2 + 2 * PI / 3), C.red, { op: .85, tr: 'translate(0 -10)' }) + tx('1/3', 0, 160, { f: 'U', w: 800, s: 40, c: C.ink })
    }), { pin: false, tape: true });
    s += card(930, 2540, 400, 300, 5, t, q.trin - .3, sticky((w, h) => g(odo(12.8e9 * E(t, q.trin, 1.3, 'o'), 0, 0, { f: 'O', w: 700, s: 40, c: '#2A2F3A', pre: '$', sep: ' ' }), at(0, 20)) + mono('ЗА ТРЕТЬ «ДЖУЛА»', -w / 2 + 26, h / 2 - 40, { s: 20, c: '#5A4A20' })));
    // 11. ВЫ: полка одноразок и рамка «ВЫ» с рукой
    s += card(1560, 1880, 660, 430, -1, t, q.you - .25, polaroid((w, h) => {
      let c = darkPhoto('#1A2232', '#0A0E16')(w, h);
      for (let r = 0; r < 2; r++) for (let cc = 0; cc < 6; cc++) { const i = r * 6 + cc, [c1, c2] = SHELF_C[(i * 4) % SHELF_C.length]; c += g(vape({ s: .22, c1, c2, led: 0, shadow: false }), at(-240 + cc * 96, -50 + r * 130)); if (t > q.you + .4 + (i % 6) * .08 && i !== 5) c += crystal(-240 + cc * 96, -54 + r * 130, 13, { r: i * 20 }) }
      return c
    }, 'СОЛЬ — В БОЛЬШИНСТВЕ'), { pin: false, tape: true });
    s += card(1560, 2760, 720, 900, 1, t, q.sami - .3, (w, h) => {
      let c = F(D_.rr(-w / 2, -h / 2, w, h, 10), '#2B2016') + F(D_.rr(-w / 2 + 34, -h / 2 + 34, w - 68, h - 68, 6), '#121826') + glow(0, -60, 340, '#FFE3B0', .14);
      c += clip(D_.rr(-w / 2 + 34, -h / 2 + 34, w - 68, h - 68, 6), handVape({ x: 0, y: 40, s: .82, c1: C.mango, c2: C.mango2, led: t > q.end ? .5 + .5 * Math.sin((t - q.end) * 5) : 1 }));
      c += F(D_.rr(-110, h / 2 - 30, 220, 66, 8), C.paper) + tx('ВЫ', 0, h / 2 + 22, { f: 'O', w: 700, s: 54, c: C.ink, ls: 8 });
      const kx = E(t, q.ran + .3, .7, 'o5');
      if (kx > 0) { const r = lerp(420, 250, kx); c += Ln(D_.circ(0, -20, r), 1, { c: C.red, w: 7, op: kx }) + Ln(`M${-r - 40} -20H${-r + 50}M${r - 50} -20H${r + 40}M0 ${-r - 60}V${-r + 30}M0 ${r - 70}V${r + 20}`, 1, { c: C.red, w: 7, op: kx }) }
      return c
    }, { pin: true });

    // ---------- нить по контуру (основная), побочные нити ----------
    const CT = contour(), tot = CT.total;
    // докуда дотянута основная нить: от станции к станции, к «домой» — замыкание круга
    let sEnd = 0;
    ORDER.forEach((k, i) => { if (i === 0) return; const a = CT.at[ORDER[i - 1]].s, b = CT.at[k].s, tk = q[k === 'archive' ? 'arch' : k], kk = E(t, tk - .55, .85, 'io'); if (kk > 0) sEnd = lerp(a, b, kk) });
    const kh = E(t, q.home - .1, (q.domoy + .15) - (q.home - .1), 'io');
    if (kh > 0) sEnd = lerp(CT.at.deal.s, tot + CT.at.title.s, kh);
    const zoomW = 9 / Math.max(.3, camZ(t));
    if (sEnd > CT.at.title.s) s += contourThread(CT.at.title.s, sEnd, Math.max(9, zoomW));
    if (kh >= 1) { const pz = 1 - P01(t, q.domoy, 1.0); if (pz > 0) s += `<path d="${CONTOUR}" fill="none" stroke="#FF8A7A" stroke-width="${R(Math.max(9, zoomW) * (1 + 2.5 * pz))}" opacity="${R(.45 * pz)}" stroke-linejoin="round"/>` }
    // булавки станций — на контуре
    ORDER.forEach(k => { const st = CT.at[k], tk = k === 'title' ? -1 : q[k === 'archive' ? 'arch' : k] - .3; if (t > tk) s += tack(st.x, st.y, 1.3) });
    // побочные нити: патент → записка, класс → записка, записка → «ВЫ»
    const side = (a, b, t0, d = .8) => { const k = E(t, t0, d, 'io'); return k > 0 ? Ln(`M${a[0]} ${a[1]}L${R(lerp(a[0], b[0], k))} ${R(lerp(a[1], b[1], k))}`, 1, { c: C.red, w: Math.max(7, zoomW * .8) }) + tack(a[0], a[1], 1.1) + (k >= 1 ? tack(b[0], b[1], 1.1) : '') : '' };
    s += side([820, 4250], [2520, 2280], q.rey + .1, 1.0);
    s += side([430, 3650], [2420, 2300], q.pay + .1, 1.0);
    s += side([2380, 2300], [1560, 2380], q.ran + .1, .9);
    return s
  }

  // ---------- камера: снимки (время, центр, зум), переезды с плавностью ----------
  function camAt(t) {
    let a = SHOTS[0];
    for (let i = 1; i < SHOTS.length; i++) {
      const b = SHOTS[i], t0 = b[0] - (b[4] ?? .35), d = b[5] ?? .9;
      if (t < t0) break;
      const k = EZ.io5(clamp((t - t0) / d)), dip = Math.sin(k * PI) * (b[6] ?? .12);
      const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k)) * (1 - dip);
      a = [b[0], lerp(a[1], b[1], k), lerp(a[2], b[2], k), z, b[4], b[5], b[6]];
    }
    return a
  }
  const camZ = t => camAt(t)[3];
  function view(t) {
    const [, cx, cy, z] = camAt(t), drift = fl(t, 6, .07), dz = 1 + .012 * Math.sin(t * .7);
    return `translate(540 ${R(800 + drift)}) scale(${R(z * dz * 1000) / 1000}) translate(${R(-cx)} ${R(-cy)})`
  }
  const VHh = 250;

  const draw = (t) => `<rect width="1080" height="1920" fill="${CORK2}"/>` + g(world(t), view(t));
  for (const k of ORDER.concat(['you'])) D[k] = (t) => draw(t);

  window.EP = {
    P, D, clean: true, lead: .12,
    cap: { size: 60, top: 1372, hi: C.mango, st: '#120C08' },
    defs: () => V8DEFS() + `<pattern id="cork" width="64" height="64" patternUnits="userSpaceOnUse">${[...Array(18)].map((_, i) => `<circle cx="${R(rnd(i) * 64)}" cy="${R(rnd(i + 40) * 64)}" r="${R(1.5 + rnd(i + 80) * 3)}" fill="${i % 3 ? '#5E432B' : '#B08A62'}" opacity=".55"/>`).join('')}</pattern>`,
    tr: {}, trDef: 'cut',
    init(tl, SC) {
      const K = {}; SC.forEach(S => K[S.key] = S.T);
      Q = {
        bil: K.title.s(1), claim: K.claim.a + .1, salt: K.claim.c('солевой'), y50: K.claim.c('пятьдесят'), comp: K.claim.s(1),
        memo: K.memo.a + .1, zap: K.memo.c('записку'), quote: K.memo.s(1), quoteE: K.memo.se(1), mol: K.memo.c('молодёжного'),
        harsh: K.harsh.a + .1, deret: K.harsh.c('дерёт'),
        lab: K.lab.a + .1, kis: K.lab.c('кислотой'), salt2: K.lab.s(1), chem: K.lab.s(2), t30: K.lab.c('тридцать'), apple: K.lab.c('яблоком'),
        stamp: K.stamp.a + .1, konf: K.stamp.c('Конфиденциально'),
        arch: K.archive.a + .1, stud: K.archive.s(1),
        juul: K.juul.a + .1, dj: K.juul.c('Джул'), fl: K.juul.c('флешку'), pat: K.juul.s(1), rey: K.juul.c('Рейнольдс'), pod: K.juul.s(2), pachk: K.juul.c('пачке'), mango: K.juul.c('манго'),
        teens: K.teens.a + .1, chetv: K.teens.c('четвёртый'), pay: K.teens.s(1),
        deal: K.deal.a + .1, trin: K.deal.c('тринадцать'), home: K.deal.s(1), domoy: K.deal.c('домой'),
        you: K.you.a + .1, sami: K.you.s(1), ran: K.you.s(2), end: K.you.s(3), dur: tl.dur,
      };
      Q.title = -1;
      // [время, cx, cy, зум, заранее, длительность переезда, «отъезд» в середине]
      SHOTS = [
        [0, 1500, 880, 1.02], [Q.bil, 1720, 800, .96],
        [Q.claim, 2100, 1360, 1.24], [Q.comp, 2100, 1300, 1.38, .3, .7, .02],
        [Q.memo, 2440, 2040, .98], [Q.quote, 2600, 2260, 1.42, .3, .8, .02],
        [Q.harsh, 2600, 3300, 1.3], [Q.lab, 2600, 4340, 1.3], [Q.chem, 2240, 4100, 1.16, .3, .8, .04],
        [Q.stamp, 2380, 5700, 1.3], [Q.arch, 1500, 5820, 1.22], [Q.stud, 1450, 5130, 1.3, .3, .8, .04],
        [Q.juul, 430, 5130, 1.3], [Q.pat, 820, 4560, 1.28, .3, .8, .04], [Q.rey + .15, 1560, 3420, .42, .05, 1.0, 0], [Q.pod, 1060, 3940, 1.3, .2, .9, 0],
        [Q.teens, 430, 3950, 1.28], [Q.pay, 1450, 3000, .5, .2, .9, 0],
        [Q.deal, 640, 2720, .98], [Q.home, 1500, 3250, .31, .45, .8, 0],
        [Q.you, 1560, 1880, 1.36, .05, 1.0, 0], [Q.sami, 1560, 2700, 1.12, .3, .9, .03], [Q.ran, 1950, 2450, .62, .2, .8, 0], [Q.end, 1560, 2760, 1.5, .25, .9, 0],
      ];
      // звуки: булавки на новых карточках, штамп, удар на «домой», сердце в финале
      for (const k of ['claim', 'memo', 'harsh', 'lab', 'stamp', 'arch', 'juul', 'teens', 'deal']) cue(Q[k] - .3, 'pin', .45);
      cue(Q.zap - .1, 'stamp', .6); cue(Q.konf - .05, 'stamp', 1.0); cue(Q.rey + .1, 'swish', .6); cue(Q.pay + .1, 'swish', .6);
      cue(Q.trin, 'coins', .6); cue(Q.home, 'whoosh', .6); cue(Q.domoy, 'impact', .8); cue(Q.ran + .2, 'heart', .9); cue(Q.end + .2, 'heart', .9);
      cue(Q.deret + .45, 'puff', .7); cue(Q.apple, 'pin', .7); cue(Q.kis + .25, 'shimmer', .6); cue(Q.comp - .1, 'whoosh', .45);
      const st = document.createElement('style'), c = '#120C08';
      st.textContent = `#cap{font-weight:800!important;letter-spacing:0!important;text-shadow:${[...Array(16)].map((_, i) => `${(Math.cos(i * PI / 8) * 6).toFixed(1)}px ${(Math.sin(i * PI / 8) * 6).toFixed(1)}px 0 ${c}`).join(',')},0 8px 22px rgba(0,0,0,.5)!important}#cap .u{color:#EFE9DC!important;opacity:1!important}`;
      document.head.appendChild(st);
    }
  };
})();
