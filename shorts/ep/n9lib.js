// shorts/ep/n9lib.js — общие предметы роликов v9–v10 про никотин (вынесено из ep/nics.js 09.11): палитра, фоны, одноразка, сигарета, досье,
//   записка, машинка, люди (подросток 70-х, химик, студенты, школьники), лаборатория, «Джул», пачка, манго, яблоко, кнопки и нить.
//   Грузится после v8.js для эпизодов nicsa / nicsb / nicsc (stage.html). Использование: const { C, vape, … } = N9;
(function () {
  'use strict';
  const C = {
    night: '#0A101D', slate: '#131C30', slate2: '#1B2946', slate3: '#2A3D66', steel: '#4B6496', fog: '#93A7CC',
    line: '#5FD9C5', line2: '#2A8E86', paper: '#F5EDDC', paper2: '#E4D7BA', paper3: '#C3B28E', ink: '#272F3E', ink2: '#5A6478',
    red: '#EE4B40', red2: '#B4312A', mango: '#FFB829', mango2: '#FF8719', apple: '#97DC53', skin: '#EFBE9A', skin2: '#D59C78',
    smoke: '#E7EEF8', folder: '#E6BC6E', folder2: '#C99B4B', wood: '#3A2820', wood2: '#553B2C', mustard: '#D9A43B', brown: '#2A1D18',
  };
  P = { bg: C.night, paper: C.paper, ink: C.night, line: C.paper, a1: C.mango, a2: C.red };
  const MONO = 'FreeMono, Liberation Mono, monospace';
  const FY = 800; // центр внимания (ниже — субтитры)

  // ---------- основа ----------
  const G2 = (d, c1, c2, o = {}) => gfill(d, c1, c2, o.x1 ?? 0, o.y1 ?? 0, o.x2 ?? 0, o.y2 ?? 1, o.op ?? 1);
  const sh = (d, o = {}) => F(d, o.c || '#04070D', { op: o.op ?? .38, tr: `translate(${o.dx ?? 14} ${o.dy ?? 18})` });
  const BIG = '<rect x="-3000" y="-3000" width="7080" height="7920"';
  function bgG(c0, c1, L) {
    const [id, d] = lgrad([[0, c0], [1, c1]], 0, 0, 0, 1920, true);
    let s = d + `${BIG} fill="${c1}"/><rect x="-3000" y="-3000" width="7080" height="3010" fill="${c0}"/><rect x="-3000" y="0" width="7080" height="1920" fill="url(#${id})"/>`;
    if (L) s += glow(L[0], L[1], L[2], L[3] || '#fff', L[4] ?? .14);
    return s
  }
  const dotBg = (op = .5, id = 'd9') => `${BIG} fill="url(#${id})" opacity="${op}"/>`;
  const cam = (t, T, a = .06, cx = 540, cy = FY, dx = 0, dy = 0) => { const k = EZ.io(P01(t, T.a, T.b - T.a + .3)); return `translate(${R(dx * k)} ${R(dy * k)}) ` + about(cx, cy, 1 + a * k) };
  const pop9 = (inner, x, y, t, t0, o = {}) => { const k = P01(t, t0, o.d ?? .45); if (k <= 0) return ''; let out = 1; if (o.out != null) { out = 1 - E(t, o.out, o.od ?? .3, 'i'); if (out <= 0) return '' } return g(inner, at(x, y, (o.s ?? 1) * lerp(o.from ?? .6, 1, (o.soft ? EZ.o : EZ.back)(k)), o.r || 0), Math.min(clamp(k * 3), out)) };
  const T9 = (s, x, y, o = {}) => tx(s, x, y, { f: 'O', w: 700, s: 60, c: C.paper, ...o });
  const mono = (s, x, y, o = {}) => `<text x="${R(x)}" y="${R(y)}" font-family="${MONO}" font-weight="${o.w || 700}" font-size="${o.s || 30}" fill="${o.c || C.ink}" text-anchor="${o.a || 'start'}"${o.op != null && o.op < 1 ? ` opacity="${R(o.op * 100) / 100}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${esc(s)}</text>`;
  // строка целиком выезжает снизу из-под маски (с разрядкой букв)
  function wipeTx(str, x, y, t, t0, o = {}) {
    const k = E(t, t0, o.d ?? .6, 'o5'); if (k <= 0) return '';
    const sz = o.s || 40, w0 = tw(str, { f: o.f || 'M', w: o.w || 800, s: sz }) + (o.ls || 0) * str.length + 60, id = uid();
    return `<clipPath id="${id}"><rect x="${R(x - w0 / 2)}" y="${R(y - sz * 1.05)}" width="${R(w0)}" height="${R(sz * 1.4)}"/></clipPath><g clip-path="url(#${id})">` + tx(str, x, y + (1 - k) * sz * 1.3, o) + '</g>'
  }
  // год крупно: цифры выезжают из-под маски по одной
  function year(str, x, y, t, t0, o = {}) {
    const sz = o.s || 300, f = o.f || 'U', w = o.w || 800, c = o.c || C.paper, ls = o.ls ?? -6;
    const ws = [...str].map(ch => tw(ch, { f, w, s: sz }) + ls), tot = ws.reduce((a, b) => a + b, 0);
    let cx = x - tot / 2, s = ''; const id = uid();
    s += `<clipPath id="${id}"><rect x="${R(x - tot / 2 - 40)}" y="${R(y - sz * .82)}" width="${R(tot + 80)}" height="${R(sz * .98)}"/></clipPath><g clip-path="url(#${id})">`;
    [...str].forEach((ch, i) => { const k = E(t, t0 + i * (o.stag ?? .07), o.d ?? .5, 'o5'); if (k > 0) s += tx(ch, cx + ws[i] / 2, y + (1 - k) * sz * (i % 2 ? -1 : 1), { f, w, s: sz, c }); cx += ws[i] });
    return s + '</g>'
  }
  // красный штамп (двойная рамка), удар с отскоком; текст — моно
  function stamp9(str, x, y, t, t0, o = {}) {
    const k = P01(t, t0, .3); if (k <= 0) return '';
    const sz = o.s || 70, c = o.c || C.red, w0 = tw(str, { f: 'O', w: 700, s: sz, ls: 5 }) + 80, h0 = sz * 1.5;
    const sc = lerp(2.2, 1, EZ.o5(k));
    return g(`<path d="${D_.rr(-w0 / 2, -h0 / 2, w0, h0, 12)}" fill="${o.bg || 'none'}" stroke="${c}" stroke-width="10"/><path d="${D_.rr(-w0 / 2 + 14, -h0 / 2 + 14, w0 - 28, h0 - 28, 6)}" fill="none" stroke="${c}" stroke-width="3"/>`
      + tx(str, 0, sz * .36, { f: 'O', w: 700, s: sz, c, ls: 5 }), at(x, y, sc * (o.sc || 1), o.r ?? -9), clamp(k * 4) * (o.op ?? .92))
  }

  // ---------- предметы ----------
  // ОДНОРАЗКА: центр (0,0), стоит вертикально
  const VW = 190, VH = 500;
  const VBODY = D_.rr(-VW / 2, -VH / 2, VW, VH, 48);
  const VMOUTH = `M${-VW * .21} ${-VH / 2 + 8}C${-VW * .21} ${-VH / 2 - 44} ${-VW * .13} ${-VH / 2 - 84} ${-VW * .1} ${-VH / 2 - 98}H${VW * .1}C${VW * .13} ${-VH / 2 - 84} ${VW * .21} ${-VH / 2 - 44} ${VW * .21} ${-VH / 2 + 8}Z`;
  function vape(o = {}) {
    const c1 = o.c1 || C.mango, c2 = o.c2 || C.mango2, led = o.led ?? 1;
    let s = o.shadow === false ? '' : sh(VBODY, { op: .42, dx: 20, dy: 24 }) + sh(VMOUTH, { op: .42, dx: 20, dy: 24 });
    s += G2(VMOUTH, o.m1 || '#414A5E', o.m2 || '#1E2330') + F(D_.rr(-VW * .1, -VH / 2 - 98, VW * .2, 9, 4), '#6A758C');
    s += G2(VBODY, c1, c2);
    s += F(D_.rr(-VW / 2 + 16, -VH / 2 + 22, 24, VH - 70, 12), '#fff', { op: .26 });
    s += F(`M${-VW / 2} ${VH / 2 - 150}H${VW / 2}V${VH / 2 - 48}A48 48 0 0 1 ${VW / 2 - 48} ${VH / 2}H${-VW / 2 + 48}A48 48 0 0 1 ${-VW / 2} ${VH / 2 - 48}Z`, '#000', { op: .12 });
    s += F(D_.rr(-VW / 2, -VH / 2 + 74, VW, 9, 0), '#fff', { op: .4 });
    s += F(D_.circ(0, VH / 2 - 62, 17), '#000', { op: .22 }) + F(D_.circ(0, VH / 2 - 62, 11), '#fff', { op: .3 + .7 * led });
    if (o.mark) s += o.mark;
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // чертёж одноразки (линии появляются по k): корпус, мундштук, бак с жидкостью, спираль, батарея
  function vapeLine(k, o = {}) {
    const c = o.c || C.line, w = o.w || 5, q = (a, b) => clamp((k - a) / (b - a));
    let s = Ln(VBODY, q(0, .5), { c, w: w + 1 }) + Ln(VMOUTH, q(.2, .6), { c, w });
    s += Ln(D_.rr(-56, -VH / 2 + 104, 112, 170, 18), q(.3, .7), { c, w: w - 1 });                       // бак
    s += Ln(`M-40 ${-VH / 2 + 300}h14l8 -14l12 28l12 -28l12 28l8 -14h14`, q(.45, .8), { c, w: w - 1 }); // спираль
    s += Ln(D_.rr(-62, 78, 124, 130, 14), q(.5, .9), { c, w: w - 1 }) + Ln('M-30 110H30M-30 140H30M-30 170H10', q(.6, 1), { c, w: 3, op: .6 }); // батарея
    s += Ln(`M0 ${-VH / 2 - 98}V${-VH / 2 + 104}`, q(.5, .9), { c, w: 3, op: .5, da: '10 12' });        // канал
    return s
  }
  // ОБЛАКО
  const CLB = [[0, 0, 74], [-86, 22, 54], [84, 20, 58], [-34, -42, 56], [44, -38, 50], [-140, 40, 34], [142, 38, 36]];
  const cloud = (x, y, s = 1, o = {}) => g(CLB.map(([cx, cy, r]) => F(D_.circ(cx, cy, r), o.c || C.smoke)).join('') + F(D_.rr(-150, 24, 300, 50, 25), o.c || C.smoke)
    + CLB.slice(0, 5).map(([cx, cy, r]) => F(D_.circ(cx - r * .25, cy - r * .25, r * .55), '#fff', { op: .5 })).join(''), at(x, y, s, o.r || 0), o.op ?? .92);
  // дымок: тонкая вьющаяся линия вверх
  const curl9 = (x, y, t, h = 240, c = C.smoke, w = 7, op = .7) => { let d = `M${x} ${y}`; for (let i = 1; i <= 14; i++) { const u = i / 14; d += `L${R(x + Math.sin(u * 5 + t * 1.6) * 26 * u)} ${R(y - u * h)}` } return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>` };
  // СИГАРЕТА: горизонтально, центр (0,0)
  function cig(o = {}) {
    const L0 = o.len || 520, h = o.h || 62, x0 = -L0 / 2, body = D_.rr(x0, -h / 2, L0, h, 8);
    let s = (o.shadow === false ? '' : sh(body, { op: .4 })) + G2(body, '#FFFDF6', '#E4DDCF') + G2(D_.rr(x0, -h / 2, L0 * .28, h, 8), '#F0A04A', '#D27B26');
    for (let i = 0; i < 6; i++) s += F(D_.circ(x0 + 20 + rnd(i) * L0 * .22, -h / 2 + 8 + rnd(i + 9) * (h - 16), 3), '#B4631C', { op: .5 });
    s += F(D_.rr(x0 + L0 * .28, -h / 2, 7, h, 0), '#C9A24A') + F(D_.rr(x0 + L0 - 34, -h / 2, 34, h, 8), '#5B5550') + F(D_.rr(x0 + L0 - 34, -h / 2, 12, h, 2), C.red) + F(D_.rr(x0 + L0 - 24, -h / 2, 6, h, 2), C.mango);
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // ПАПКА-ДОСЬЕ (предмет, который идёт через весь ролик): центр (0,0), 380×270
  function folder(o = {}) {
    const w = 380, h = 270, c1 = o.c1 || C.folder, c2 = o.c2 || C.folder2;
    const back = `M${-w / 2} ${-h / 2 + 34}a14 14 0 0 1 14 -14h120l30 -30h${w / 2 - 20}a14 14 0 0 1 14 14V${h / 2 - 14}a14 14 0 0 1 -14 14H${-w / 2 + 14}a14 14 0 0 1 -14 -14Z`;
    const front = D_.rr(-w / 2, -h / 2 + 34, w, h - 34, 14);
    let s = (o.shadow === false ? '' : sh(back, { op: .4 })) + F(back, c2);
    if (o.sheet !== false) s += F(D_.rr(-w / 2 + 22, -h / 2 + 4, w - 44, 80, 4), C.paper) + F(D_.rr(-w / 2 + 34, -h / 2 + 16, w - 110, 6, 3), C.paper3);
    s += G2(front, c1, c2) + F(D_.rr(-w / 2, -h / 2 + 34, w, 8, 4), '#fff', { op: .25 });
    if (o.label) s += F(D_.rr(-w / 2 + 28, -h / 2 + 62, 150, 54, 6), C.paper) + tx(o.label, -w / 2 + 103, -h / 2 + 104, { f: 'O', w: 700, s: 40, c: C.ink });
    if (o.stamp) s += g(`<path d="${D_.rr(-92, -30, 184, 60, 8)}" fill="none" stroke="${C.red}" stroke-width="6"/>` + tx(o.stamp, 0, 13, { f: 'O', w: 700, s: 34, c: C.red, ls: 3 }), at(64, 62, 1, -10), .9);
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // ЛИСТ БУМАГИ с «строчками»: n строк, hi — номер выделенной
  function sheet(w, h, o = {}) {
    const p = D_.rr(-w / 2, -h / 2, w, h, 6);
    let s = (o.shadow === false ? '' : sh(p, { op: .35, dx: 12, dy: 16 })) + G2(p, o.c1 || '#FBF5E7', o.c2 || C.paper2);
    const n = o.n ?? 8, y0 = -h / 2 + (o.top ?? 70), dy = o.dy ?? 38, k = o.k ?? 1;
    for (let i = 0; i < n; i++) { const q = clamp(k * n - i); if (q <= 0) break; const lw = (w - 90) * (i === n - 1 ? .55 : .82 + rnd(i + (o.seed || 0)) * .18) * q; s += F(D_.rr(-w / 2 + 45, y0 + i * dy, lw, 9, 4), o.lc || '#8C8572', { op: .55 }) }
    return s
  }
  // КРИСТАЛЛ СОЛИ (шестигранник с бликом)
  const hex = (r) => D_.poly([...Array(6)].map((_, i) => [Math.cos(i * PI / 3 + PI / 6) * r, Math.sin(i * PI / 3 + PI / 6) * r]));
  const crystal = (x, y, r, o = {}) => g(F(hex(r), o.c || '#FFF4CC') + F(D_.poly([[0, 0], [Math.cos(-PI / 2) * r, Math.sin(-PI / 2) * r], [Math.cos(-PI / 6) * r, Math.sin(-PI / 6) * r]]), '#fff', { op: .7 })
    + F(D_.poly([[0, 0], [Math.cos(PI / 2) * r, Math.sin(PI / 2) * r], [Math.cos(5 * PI / 6) * r, Math.sin(5 * PI / 6) * r]]), o.c2 || C.mango, { op: .45 }), at(x, y, 1, o.r || 0), o.op ?? 1);

  function lerp2(a, b, k) { const p = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)), A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k))).toString(16).padStart(2, '0')).join('') }

  // =================== предметы сцен 3–11 ===================
  // ПРОФИЛЬ подростка 70-х (смотрит вправо), центр головы (0,0); рот ≈ (136,48)
  const PROF = 'M-92 150C-96 90 -126 40 -124 -30C-122 -140 -44 -196 34 -188C104 -180 134 -122 130 -64C130 -44 138 -30 152 -10L164 16C154 24 142 24 138 30C142 40 142 48 134 54C140 62 136 74 126 78C122 98 104 112 72 112C60 114 52 122 48 150Z';
  const HAIR70 = 'M-134 -10C-160 -170 -40 -236 52 -204C124 -180 152 -118 126 -76C92 -118 34 -128 -6 -106C-26 -56 -36 24 -56 84C-76 136 -112 156 -152 146C-172 86 -144 46 -134 -10Z';
  const THROAT = 'M134 46C110 52 70 60 40 96C20 130 10 170 6 240';
  function teen70(o = {}) {
    const sk = o.skin || C.skin, sk2 = o.skin2 || C.skin2, hair = o.hair || '#5A3A22', shirt = o.shirt || '#C8553D';
    const torso = 'M-280 640C-270 340 -180 210 -66 168L86 168C200 210 280 340 290 640Z';
    let s = G2(torso, shirt, o.shirt2 || '#93372A');
    let st = ''; for (let i = 0; i < 7; i++) st += F(D_.rr(-300, 230 + i * 60, 600, 20, 0), '#fff', { op: .12 });
    s += clip(torso, st) + F('M-46 168L24 250L94 168Z', o.collar || '#F2E6CF') + F('M-46 168L24 250L-10 168Z', '#000', { op: .1 });
    s += F(D_.rr(-74, 70, 126, 120, 34), sk2);
    s += G2(PROF, sk2, sk, { x1: 0, x2: 1, y1: 0, y2: 0 });
    if (o.throat) s += o.throat;
    s += F(D_.ell(-30, -8, 22, 34), sk2) + F(D_.ell(-27, -6, 11, 20), '#A86C50', { op: .5 });
    s += F(HAIR70, hair) + F('M44 -198C96 -186 132 -148 130 -102C108 -132 70 -150 28 -150Z', '#fff', { op: .1 });
    const sq = o.squint || 0;
    if (sq > .5) s += Ln('M64 -40Q80 -32 96 -42', 1, { c: C.ink, w: 7 });
    else s += F(D_.ell(82, -40, 8, 11), C.ink) + F(D_.circ(85, -44, 3), '#fff', { op: .8 });
    s += Ln(`M60 ${R(-70 + sq * 10)}L104 ${R(-74 - sq * 2)}`, 1, { c: hair, w: 10 });
    if (o.open) s += F(D_.ell(136, 50, 10, 4 + o.open * 9), '#5A2A2A');
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // горло-трубка: k — сколько прорисовано, hot 0..1 — дерёт (красное, с зазубринами)
  function throat(k, hot, t) {
    let s = Ln(THROAT, 1, { c: '#000', w: 34, op: .22 }) + Ln(THROAT, k, { c: lerp2('#9FD4E8', '#FF5A3C', hot), w: 18, op: .95 });
    if (hot > .05 && k > .2) {
      const P0 = pts(THROAT, 22); let z = '';
      P0.forEach(([x, y], i) => { if (i / 22 > k) return; const a = i ? Math.atan2(y - P0[i - 1][1], x - P0[i - 1][0]) : 0, n = (i % 2 ? 1 : -1) * 20 * hot * (1 + .3 * Math.sin(t * 30 + i)); z += (z ? 'L' : 'M') + R(x - Math.sin(a) * n) + ' ' + R(y + Math.cos(a) * n) });
      s += `<path d="${z}" fill="none" stroke="${C.red}" stroke-width="7" stroke-linejoin="miter" opacity="${R(hot * 100) / 100}"/>` + glow(60, 120, 160, C.red, .35 * hot);
    }
    return s
  }
  // ХИМИК (молодой, очки, халат), бюст анфас; низ — (0,0)
  function chemist(t, o = {}) {
    const sk = C.skin, sk2 = C.skin2, hair = '#3A2A20', lk = o.look || 0;
    let s = sh('M-250 0C-246 -170 -160 -250 -60 -270L60 -270C160 -250 246 -170 250 0Z', { op: .3 });
    s += G2('M-250 0C-246 -170 -160 -250 -60 -270L60 -270C160 -250 246 -170 250 0Z', '#F4F2EC', '#CFCBC0');
    s += F('M-60 -270L0 -150L60 -270Z', '#6D8BB5') + F('M-14 -230L0 -120L14 -230L0 -250Z', '#7A2E2E');
    s += F('M-60 -270L-10 -150L-110 -40L-120 -200Z', '#E3E0D8') + F('M60 -270L10 -150L110 -40L120 -200Z', '#E3E0D8');
    s += F(D_.rr(-44, -340, 88, 90, 22), sk2);
    s += G2(D_.ell(0, -430, 108, 128), sk, sk2, { x1: 0, x2: 1, y1: 0, y2: 0 }) + F(D_.ell(-110, -420, 22, 32), sk2) + F(D_.ell(110, -420, 22, 32), sk2);
    s += F('M-112 -440C-130 -600 130 -610 112 -450C96 -520 40 -546 -10 -530C-60 -520 -96 -496 -112 -440Z', hair);
    const bl = blink(t, 3) > .5, ey = -432, br = o.brow || 0;
    for (const sx of [-1, 1]) {
      const ex = sx * 44 + lk * 14;
      s += bl ? Ln(`M${ex - 12} ${ey}H${ex + 12}`, 1, { c: C.ink, w: 6 }) : F(D_.ell(ex, ey, 8, 10), C.ink);
      s += `<circle cx="${ex}" cy="${ey}" r="30" fill="#fff" fill-opacity=".12" stroke="#2A2F3A" stroke-width="6"/>`;
      s += Ln(`M${ex - 24} ${ey - 46 - br * 12}L${ex + 24} ${ey - 46 - br * 12 - sx * br * 4}`, 1, { c: hair, w: 8 });
    }
    s += Ln(`M-14 ${ey}H14`, 1, { c: '#2A2F3A', w: 5 });
    s += o.smile ? Ln(`M${-20 + lk * 8} -370Q${lk * 8} ${-356 + o.smile * -6} ${20 + lk * 8} -370`, 1, { c: '#7A3B32', w: 6 }) : Ln(`M${-16 + lk * 8} -368H${16 + lk * 8}`, 1, { c: '#7A3B32', w: 6 });
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // СТУДЕНТ со спины (сидит), низ — (0,0)
  function backPerson(o = {}) {
    const c1 = o.c1 || '#4A5A7A', c2 = o.c2 || '#33405A', hair = o.hair || '#2E2219';
    const body = 'M-210 0C-206 -150 -150 -240 -50 -256L50 -256C150 -240 206 -150 210 0Z';
    let s = G2(body, c1, c2) + F('M-70 -250C-60 -190 60 -190 70 -250Z', '#000', { op: .12 });
    s += F(D_.rr(-40, -300, 80, 70, 20), o.skin2 || C.skin2);
    s += F(D_.ell(0, -370, 96, 110), o.skin2 || C.skin2) + F(D_.ell(-96, -366, 18, 28), o.skin2 || C.skin2) + F(D_.ell(96, -366, 18, 28), o.skin2 || C.skin2);
    s += F(o.hairD || 'M-98 -350C-120 -520 120 -520 98 -350C80 -390 -80 -390 -98 -350Z', hair);
    if (o.light) s += F(D_.ell(0, -380, 96, 110), o.light, { op: .16 });
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // РУКА с одноразкой (снизу кадра, от зрителя): кисть обхватывает корпус; (0,0) — центр корпуса
  function handVape(o = {}) {
    const sk = o.skin || '#E9B08A', sk2 = '#C88A66';
    let s = G2('M-118 950L-102 362C-98 314 -60 286 0 286C60 286 98 314 102 362L118 950Z', o.sleeve || '#2B3550', o.sleeve2 || '#1C2438');
    s += F(D_.rr(-108, 278, 216, 46, 20), '#3A4766') + F(D_.rr(-108, 278, 216, 10, 5), '#fff', { op: .12 });
    s += G2('M-96 292C-122 192 -112 70 -92 0L92 0C112 70 122 192 96 292Z', sk2, sk, { x1: 0, x2: 1, y1: 0, y2: 0 });
    s += vape({ x: 0, y: -80, s: .62, c1: o.c1, c2: o.c2, led: o.led ?? 1, shadow: false });
    for (let i = 0; i < 4; i++) { const y = -20 + i * 52, w = 150 - i * 6; s += G2(D_.rr(-112, y, w, 48, 24), sk, sk2, { x1: 0, x2: 1, y1: 0, y2: 0 }) + F(D_.rr(-112 + w - 30, y + 9, 22, 30, 10), '#F3C9AB', { op: .7 }) + F(D_.rr(-112, y + 38, w, 7, 3), '#000', { op: .1 }) }
    s += G2('M60 -70C108 -84 136 -40 124 6C116 42 88 64 64 50Z', sk, sk2) + F('M96 -58C112 -60 122 -46 118 -32C108 -40 100 -46 94 -48Z', '#F3C9AB', { op: .7 });
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // КАЛЕНДАРЬ отрывной (как «1790» у Google)
  function calendar(str, mon) {
    const p = D_.rr(-280, -240, 560, 480, 28);
    let s = sh(p, { op: .45, dx: 22, dy: 26 }) + G2(p, '#FBF4E6', '#E6D9BE') + clip(p, F(D_.rr(-280, -240, 560, 116, 0), C.red) + F(D_.rr(-280, -128, 560, 8, 0), '#000', { op: .15 }));
    s += F(D_.rr(-160, -272, 28, 74, 13), '#3A4458') + F(D_.rr(132, -272, 28, 74, 13), '#3A4458');
    s += tx(mon, 0, -162, { f: 'O', w: 700, s: 46, c: '#FFE9DF', ls: 10 }) + tx(str, 0, 130, { f: 'U', w: 800, s: 196, c: C.red, ls: -6 });
    return s
  }
  // ПИШУЩАЯ МАШИНКА (анфас), (0,0) — середина валика
  function typewriter() {
    const body = 'M-300 70C-300 30 -270 10 -230 10H230C270 10 300 30 300 70L332 240C336 266 320 282 294 282H-294C-320 282 -336 266 -332 240Z';
    let s = sh(body, { op: .45, dx: 18, dy: 26 }) + G2(body, '#E2B04A', '#A9771F') + F('M-300 70C-300 30 -270 10 -230 10H230C270 10 300 30 300 70L304 90H-304Z', '#fff', { op: .14 });
    for (let r = 0; r < 3; r++) for (let i = 0; i < 10 - r; i++) { const x = -216 + r * 24 + i * 48, y = 128 + r * 44; s += F(D_.circ(x, y + 4, 18), '#000', { op: .3 }) + F(D_.circ(x, y, 17), '#1E1F24') + F(D_.circ(x, y - 3, 12), '#454852') }
    s += F(D_.rr(-140, 250, 280, 22, 11), '#1E1F24');
    s += F(D_.rr(-350, -28, 700, 56, 28), '#22252D') + F(D_.rr(-350, -20, 700, 10, 5), '#fff', { op: .16 });
    s += F(D_.circ(-372, 0, 32), '#2C2F38') + F(D_.circ(372, 0, 32), '#2C2F38') + F(D_.circ(372, 0, 12), '#9AA1AE');
    s += F(D_.rr(-420, -66, 120, 18, 9), '#B9BDC6');
    return s
  }
  // ДОСЬЕ сверху (раскрытое/закрытое) — то же, что folder(), но крупно и с листом отчёта
  const REPORT = ['ОТЧЁТ · СОЛИ НИКОТИНА', '30 ОБРАЗЦОВ', 'МАКС. ВЫДЕЛЕНИЕ', 'НИКОТИНА', '', '18.01.1979'];
  function report(w, h, k = 1) {
    let s = sheet(w, h, { n: 0 });
    REPORT.forEach((l, i) => { const q = clamp(k * REPORT.length - i); if (q > 0 && l) s += mono(l.slice(0, Math.ceil(l.length * q)), -w / 2 + 40, -h / 2 + 70 + i * 40, { s: 24, c: C.ink }) });
    s += Ln(`M${-w / 2 + 40} ${h / 2 - 150}C${-w / 2 + 120} ${h / 2 - 260} ${-w / 2 + 200} ${h / 2 - 120} ${-w / 2 + 280} ${h / 2 - 220}S${w / 2 - 60} ${h / 2 - 130} ${w / 2 - 40} ${h / 2 - 190}`, k, { c: C.red2, w: 4 });
    s += Ln(`M${-w / 2 + 40} ${h / 2 - 260}V${h / 2 - 100}H${w / 2 - 40}`, k, { c: C.ink2, w: 3 });
    return s
  }
  // ЛАБОРАТОРНЫЕ сосуды
  const FLASK = 'M-34 -250H34V-120C110 -96 160 -30 160 50C160 150 88 210 0 210C-88 210 -160 150 -160 50C-160 -30 -110 -96 -34 -120Z';
  const BEAKER = 'M-80 -110H86L80 -96V110C80 122 72 130 60 130H-60C-72 130 -80 122 -80 110V-96Z';
  function glassFill(d, lvl, c, bb) { const [x, y, w, h] = bb; return clip(d, F(D_.rr(x - 20, y + h * (1 - lvl), w + 40, h * lvl + 20, 0), c, { op: .9 }) + F(D_.rr(x - 20, y + h * (1 - lvl), w + 40, 10, 0), '#fff', { op: .35 })) }
  const glass = (d) => F(d, '#DDEFF6', { op: .18 }) + Ln(d, 1, { c: '#DDEFF6', w: 6, op: .85 }) + Ln('M-110 20C-110 -20 -90 -60 -60 -80', 1, { c: '#fff', w: 7, op: .45 });
  function vial(lvl, c, o = {}) { const d = 'M-18 -70H18V40C18 58 10 66 0 66C-10 66 -18 58 -18 40Z'; return F(d, '#DDEFF6', { op: .2 }) + clip(d, F(D_.rr(-30, 66 - 136 * lvl, 60, 140, 0), c, { op: .9 })) + Ln(d, 1, { c: '#DDEFF6', w: 4, op: .8 }) + F(D_.rr(-22, -84, 44, 16, 6), o.cap || '#8A93A6') }
  // ФЛЕШКА и «Джул» (без логотипов), горизонтально, центр (0,0)
  function flashDrive() { return sh(D_.rr(-190, -64, 300, 128, 22), { op: .4 }) + G2(D_.rr(-190, -64, 300, 128, 22), '#2E3340', '#171A22') + G2(D_.rr(100, -44, 120, 88, 6), '#E3E7EE', '#9EA5B2') + F(D_.rr(140, -24, 22, 16, 2), '#3A3F4A') + F(D_.rr(176, -24, 22, 16, 2), '#3A3F4A') + F(D_.rr(-170, -52, 240, 14, 7), '#fff', { op: .12 }) }
  function juulDev(o = {}) {
    const body = D_.rr(-260, -46, 380, 92, 22), pod = D_.rr(110, -46, 170, 92, 22);
    let s = sh(D_.rr(-260, -46, 540, 92, 22), { op: .42 }) + G2(body, '#5A606E', '#2E323C') + F(D_.rr(-240, -36, 330, 12, 6), '#fff', { op: .18 });
    s += G2(pod, o.p1 || '#D7DEE6', o.p2 || '#9BA6B4') + F(D_.rr(124, -26, 120, 52, 12), o.liq || C.mango, { op: .55 }) + F(D_.rr(264, -30, 16, 60, 6), '#2A2E37');
    s += F(D_.circ(-170, 0, 9), '#fff', { op: .25 + .75 * (o.led ?? 1) }) + F(D_.circ(-170, 0, 22), C.line, { op: .18 * (o.led ?? 1) });
    if (o.salt) for (let i = 0; i < 6; i++) { const q = clamp(o.salt * 6 - i); if (q > 0) s += crystal(140 + (i % 3) * 36, -14 + Math.floor(i / 3) * 30, 13 * EZ.back(q), { r: i * 17 }) }
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // ПАЧКА сигарет (без логотипа: белая, красный верх); open — крышка
  function pack(o = {}) {
    const p = D_.rr(-100, -140, 200, 280, 12);
    let s = sh(p, { op: .4 }) + G2(p, '#FBFBF7', '#D8D6CE') + F(D_.rr(-100, -140, 200, 92, 12), o.top || '#D6312A') + F('M-100 -60L0 -100L100 -60V-48H-100Z', o.top || '#D6312A') + F(D_.rr(-100, -60, 200, 8, 0), '#000', { op: .12 });
    if (o.n) for (let i = 0; i < 10; i++) s += F(D_.circ(-72 + (i % 5) * 36, -150 - (i < 5 ? 0 : 22), 15), '#E9A04E');
    s += F(D_.rr(-86, -128, 30, 240, 15), '#fff', { op: .2 });
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0), o.op ?? 1)
  }
  // МАНГО
  const mango = (x, y, s = 1) => g(G2('M-110 0C-118 -80 -40 -130 30 -110C110 -88 140 -10 110 60C80 120 -20 130 -70 90C-96 70 -106 40 -110 0Z', '#FFD34A', '#FF7A1A', { x1: 0, y1: 0, x2: 1, y2: 1 })
    + F('M-60 -40C-40 -80 0 -96 30 -90', '#fff', { op: .0 }) + Ln('M-56 -50C-30 -86 6 -96 34 -92', 1, { c: '#fff', w: 10, op: .5 }) + F('M20 -112C40 -170 110 -176 130 -150C90 -150 60 -130 34 -106Z', '#4CAF50'), at(x, y, s));
  // ЯБЛОКО (зелёное)
  const apple = (x, y, s = 1) => g(G2('M0 -70C-40 -110 -130 -90 -130 0C-130 80 -70 130 -30 120C-12 116 -6 110 0 110C6 110 12 116 30 120C70 130 130 80 130 0C130 -90 40 -110 0 -70Z', '#B8F06A', '#5DA829', { x1: 0, y1: 0, x2: 1, y2: 1 })
    + Ln('M0 -70C0 -100 10 -120 26 -136', 1, { c: '#5A3A22', w: 10 }) + F('M14 -110C40 -150 90 -150 104 -128C70 -120 40 -104 14 -110Z', '#3E9152') + Ln('M-80 -30C-84 -10 -80 10 -70 26', 1, { c: '#fff', w: 12, op: .45 }), at(x, y, s));
  // КАНЦЕЛЯРСКАЯ КНОПКА и нить
  const pin = (x, y, c = C.red) => F(D_.circ(x + 4, y + 6, 14), '#000', { op: .3 }) + F(D_.circ(x, y, 14), c) + F(D_.circ(x - 4, y - 4, 5), '#fff', { op: .6 });
  const thread = (p, k, o = {}) => Ln(D_.poly(p, false), k, { c: o.c || C.red, w: o.w || 6 });

  const QUOTE = ['ЧТОБЫ ВЫЖИТЬ,', 'МЫ ДОЛЖНЫ ПОЛУЧИТЬ', 'СВОЮ ДОЛЮ', 'МОЛОДЁЖНОГО РЫНКА.'];
  const QN = QUOTE.join('').length;
  const LIT = new Set([2, 5, 11, 12]);
  const TEEN_C = ['#C8553D', '#4F6FB3', '#3E9152', '#8E5BB8', '#D9A43B', '#2F8E9E', '#B9405E', '#6B7690'];
  const SKINS = [['#EFC09A', '#D59C78'], ['#C98E66', '#A86F4E'], ['#8D5A3C', '#6E432C'], ['#F2CDB0', '#DDAA88']];
  function teenBust(i, lit, t, kl) {
    const c1 = TEEN_C[i % 8], [sk, sk2] = SKINS[(i * 3) % 4], hair = ['#2E2219', '#5A3A22', '#C9A26A', '#141414'][(i * 5) % 4];
    let s = G2('M-120 0C-116 -96 -80 -140 -26 -150L26 -150C80 -140 116 -96 120 0Z', c1, lerp2(c1, '#000000', .35));
    s += F(D_.rr(-24, -190, 48, 50, 14), sk2) + G2(D_.ell(0, -232, 60, 70), sk, sk2, { x1: 0, x2: 1, y1: 0, y2: 0 });
    s += F(['M-62 -236C-74 -330 74 -336 62 -240C50 -280 -50 -280 -62 -236Z', 'M-66 -200C-80 -330 80 -330 66 -200L58 -230C40 -276 -40 -276 -58 -230Z', 'M-60 -246C-70 -316 70 -322 60 -248C30 -276 -20 -280 -60 -246Z'][i % 3], hair);
    s += F(D_.ell(-20, -232, 6, 8), C.ink) + F(D_.ell(20, -232, 6, 8), C.ink) + Ln('M-12 -200H12', 1, { c: '#7A3B32', w: 4 });
    if (lit && kl > 0) s = glow(0, -150, 200, C.mango, .4 * kl) + s + g(vape({ s: .18, c1: C.mango, c2: C.mango2, shadow: false }), at(54, -196, 1, 20), kl) + cloud(70 + 20 * kl, -300 - 30 * kl, .45 * kl, { c: '#FFE3B0', op: .85 * kl });
    return s
  }
  const SHELF_C = [['#FF7A6B', '#D94A3C'], ['#6FD3B1', '#3E9E83'], ['#9B6BDF', '#6B44A8'], ['#FFB829', '#FF8719'], ['#4F86E8', '#2E5DB3'], ['#F29CAB', '#C9657C'], ['#B8F06A', '#5DA829'], ['#E9E4D8', '#B9B2A2'], ['#FFD34A', '#E0A21A']];
  window.N9 = { C, MONO, FY, G2, sh, BIG, bgG, dotBg, cam, pop9, T9, mono, wipeTx, year, stamp9, VW, VH, VBODY, VMOUTH, vape, vapeLine, CLB, cloud, curl9, cig, folder, sheet, hex, crystal, lerp2, PROF, HAIR70, THROAT, teen70, throat, chemist, backPerson, handVape, calendar, typewriter, REPORT, report, FLASK, BEAKER, glassFill, glass, vial, flashDrive, juulDev, pack, mango, apple, pin, thread, QUOTE, QN, LIT, TEEN_C, SKINS, teenBust, SHELF_C };
})();
