// СПИД — «вирусу около ста лет». Палитра: чернильный синий, красный (лента), розовый, бирюза (лечение), кремовый.
(function () {
  const C = { bg: '#151629', bg2: '#22254D', ink: '#0D0E1C', paper: '#F5EFE6', line: '#F5EFE6', a1: '#E63946', a2: '#F4A3A8', a3: '#3DBFA8', gold: '#F2C14E', skin: '#D9A27A' };
  P = C;
  const cam = (t, T, a = .05, cx = 540, cy = 820) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {};
  const RIB = 'M370 1190L540 860C650 660 670 520 610 452C568 404 512 404 470 452C410 520 430 660 540 860L710 1190';
  function ribbon(k = 1, o = {}) {
    const d = o.d || RIB, L0 = plen(d) + 2, da = k < 1 ? ` stroke-dasharray="${R(L0)} ${R(L0)}" stroke-dashoffset="${R(L0 * (1 - k))}"` : '';
    return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${o.w ? o.w + 14 : 98}" stroke-linejoin="round" transform="translate(14 12)" opacity=".7"${da}/>` +
      `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="${o.w ? o.w + 14 : 98}" stroke-linejoin="round"${da}/><path d="${d}" fill="none" stroke="${o.c || C.a1}" stroke-width="${o.w || 84}" stroke-linejoin="round"${da}/>`
  }
  function virus(x, y, r, t, o = {}) {
    let q = '';
    const n = 14, rot = t * (o.sp ?? 12);
    for (let i = 0; i < n; i++) { const a = (i / n * 360 + rot) * Math.PI / 180, c0 = Math.cos(a), s0 = Math.sin(a); q += line(`M${R(c0 * r)} ${R(s0 * r)}L${R(c0 * (r + r * .28))} ${R(s0 * (r + r * .28))}`, 1, { c: C.line, w: Math.max(4, r * .06) }) + ink(D_.circ(c0 * (r + r * .34), s0 * (r + r * .34), r * .12), { f: o.k || C.a1, c: C.line, w: Math.max(3, r * .04), dx: 3, dy: 3 }) }
    q += ink(D_.circ(0, 0, r), { f: o.f || C.a2, c: C.line, w: Math.max(4, r * .05) }) + dots(D_.circ(0, 0, r), { c: C.ink, step: Math.max(8, r * .12), x0: -r * .3, y0: -r * .3, x1: r, y1: r, op: .35 });
    q += g(ink(`M${-r * .28} ${-r * .5}L${r * .28} ${-r * .5}L${r * .12} ${r * .5}L${-r * .12} ${r * .5}Z`, { f: o.core || C.a1, c: C.line, w: Math.max(3, r * .04), dx: 3, dy: 3 }), `rotate(${R(rot * .5)})`);
    q += shine(-r * .55, -r * .45, r * .3, -50, Math.max(4, r * .05), C.paper, .7);
    return g(q, at(x, y, o.s || 1), o.op ?? 1)
  }
  function chimp(x, y, s, t) {
    const fur = '#4A3426', face = '#D9A27A', c = C.line, bl = (t % 3.3 < .13) ? 1 : 0;
    let q = ink(D_.circ(-160, -10, 62), { f: fur, c, w: 7 }) + ink(D_.circ(160, -10, 62), { f: fur, c, w: 7 }) + fill(D_.circ(-160, -10, 30), face) + fill(D_.circ(160, -10, 30), face);
    q += ink(D_.ell(0, -30, 165, 178), { f: fur, c, w: 8 });
    q += ink('M-112 -40C-122 -132 -18 -142 0 -98C18 -142 122 -132 112 -40C132 44 92 146 0 146C-92 146 -132 44 -112 -40Z', { f: face, c, w: 7 });
    q += line('M-92 -72Q-46 -98 -6 -74M6 -74Q46 -98 92 -72', 1, { c: C.ink, w: 9 });
    for (const sx of [-1, 1]) q += `<ellipse cx="${sx * 46}" cy="-40" rx="13" ry="${R(15 * (1 - bl) + 1)}" fill="${C.ink}"/>`;
    q += `<ellipse cx="-15" cy="34" rx="8" ry="6" fill="${C.ink}"/><ellipse cx="15" cy="34" rx="8" ry="6" fill="${C.ink}"/>` + line('M-52 90Q0 110 52 90', 1, { c: C.ink, w: 8 });
    return g(q, at(x, y, s))
  }
  const jungle = (t, a = 1) => {
    let s = '';
    const L1 = [[60, 1250, 520, 190, -70], [1020, 1250, 560, 200, -112], [200, 1300, 420, 150, -40], [880, 1320, 420, 150, -140], [-40, 900, 380, 130, -20], [1120, 860, 380, 130, -160]];
    L1.forEach(([x, y, l, w0, an], i) => { const d = D_.leaf(x, y, l, w0, an + wob(t, .25, 2.5, i), .1); s += ink(d, { f: i % 2 ? '#2F6B4A' : '#3E8A5E', c: C.line, w: 7 }) + dots(d, { c: '#1B3D2B', step: 15, op: .6 }) + line(`M${x} ${y}L${R(x + Math.cos(an * Math.PI / 180) * l * .9)} ${R(y + Math.sin(an * Math.PI / 180) * l * .9)}`, 1, { c: C.line, w: 5, op: .5 }) });
    return g(s, '', a)
  };

  D.title = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(540, 800, 430), C.bg2);
    s += ribbon(clamp(.25 + t / .9));
    s += cap('What do you know about', 540, 300, { c: C.paper, op: E(t, 0, .4) });
    s += rise('AIDS?', 540, 1300, t, .15, { f: 'U', w: 800, s: 130, c: C.paper });
    return g(s, cam(t, T, .06));
  };

  D.eighties = (t, S, T) => {
    let s = bg(C.bg2);
    const k = E(t, T.a, .5, 'back'), cx = 540, cy = 820;
    let tv = ink(D_.rr(-330, -260, 660, 520, 50), { f: '#8A5A3C', c: C.line, w: 8 }) + dots(D_.rr(-330, -260, 660, 520, 50), { c: C.ink, step: 15, op: .4 });
    const scr = D_.rr(-280, -210, 430, 420, 60), id = uid();
    tv += fill(scr, '#1E2A36') + `<clipPath id="${id}"><path d="${scr}"/></clipPath><g clip-path="url(#${id})">`;
    for (let y = -210; y < 210; y += 12) tv += `<rect x="-280" y="${y + ((t * 60) % 12)}" width="430" height="5" fill="#000" opacity=".25"/>`;
    tv += tx('1981', -65, 40, { f: 'O', s: 150, w: 700, c: C.a2, op: .85 + Math.sin(t * 30) * .1 }) + '</g>' + line(scr, 1, { c: C.line, w: 7 });
    tv += ink(D_.circ(240, -120, 36), { f: C.gold, c: C.line, w: 6 }) + ink(D_.circ(240, -10, 36), { f: C.gold, c: C.line, w: 6 }) + line('M195 80H285M195 120H285M195 160H285', 1, { c: C.line, w: 6 });
    tv += line('M-60 -260L-200 -430M60 -260L140 -440', 1, { c: C.line, w: 8 }) + `<circle cx="-200" cy="-430" r="14" fill="${C.line}"/><circle cx="140" cy="-440" r="14" fill="${C.line}"/>`;
    tv += line('M-250 260L-280 330M250 260L280 330', 1, { c: C.line, w: 10 });
    s += g(tv, at(cx, cy, k));
    return g(s, cam(t, T, .05));
  };

  D.claim = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(540, 760, 420), C.bg2);
    const th = T.c('hundred', 0, 2.6), kb = E(t, T.a + .2, Math.max(.6, th - T.a - .2), 'io');
    s += virus(540, 760, 230, t, { s: E(t, T.a, .6, 'back') });
    s += fill(D_.rr(240, 1120, 600, 150, 75), C.ink, .92) + odo(1981 - 61 * kb, 540, 1232, { s: 110, c: C.gold, sep: '' });
    s += stamp('~100', 860, 440, t, th - .05, { c: C.a1, s: 96, r: 10 });
    s += ringWave(540, 760, t, th, { c: C.a1, r1: 640 });
    return g(s, cam(t, T, .05));
  };

  D.forest = (t, S, T) => {
    let s = bg('#10261C') + fill(D_.circ(540, 760, 470), '#173527');
    for (let i = 0; i < 4; i++) s += fill(`M0 ${560 + i * 60}C300 ${520 + i * 60} 700 ${600 + i * 60} 1080 ${540 + i * 60}V${600 + i * 60}H0Z`, C.paper, .04);
    const tc = T.c('chimpanzees', 0, 2), kc = E(t, tc - .4, .7, 'o5');
    s += chimp(540, 1000 - kc * 220, 1.25, t);
    s += jungle(t);
    s += cap(L('Cameroon'), 540, 340, { c: C.a3, op: E(t, T.c('cameroon', 0, 1), .4) });
    for (let i = 0; i < 6; i++) { const ph = (t * .2 + i / 6) % 1; s += virus(200 + rnd(i) * 680, 700 - ph * 300, 22, t, { op: Math.sin(ph * Math.PI) * kc * .9 }) }
    return g(s, cam(t, T, .05));
  };

  D.hunter = (t, S, T) => {
    let s = bg(C.bg);
    const tcut = T.c('cut', 0, 1.2), tb = T.c('blood', 0, 2.2);
    s += hand(330, 900, -8, { s: 2.6, c: C.line, f: C.skin, sleeve: '#6B5B3E' });
    s += line('M560 760L700 820', E(t, tcut - .05, .25), { c: C.a1, w: 10 });
    const kd = clamp((t - tb + .3) / .9), dy = 840 + EZ.i(kd) * 380;
    if (t > tcut) {
      const drop = D_.drop(650, Math.min(dy, 1200), 44);
      if (kd < 1) s += ink(drop, { f: C.a1, c: C.line, w: 6 });
      else { const km = E(t, tb + .6, .6, 'io'); s += ink(morph(D_.drop(650, 1200, 44), D_.circ(650, 1150, 60), km), { f: km > .5 ? C.a2 : C.a1, c: C.line, w: 6 }); if (km >= 1) s += virus(650, 1150, 60, t) + ringWave(650, 1150, t, tb + 1.2, { c: C.a1 }) }
    }
    s += cap(L('most likely'), 540, 330, { c: C.a2, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .05, 600, 900));
  };

  D.kin = (t, S, T) => {
    let s = bg('#E9E1D3');
    const river = 'M-60 1160C200 1100 330 980 520 960C700 940 820 820 1140 760', city = [520, 960];
    s += `<path d="${river}" fill="none" stroke="#7FB7D9" stroke-width="90" stroke-linecap="round"/>` + `<path d="${river}" fill="none" stroke="#5E9BC4" stroke-width="40" stroke-linecap="round" opacity=".5"/>`;
    const tr = T.c('railways', 0, 3), rails = ['M520 960C520 800 470 650 380 420', 'M520 960C640 1000 800 1080 1000 1180', 'M520 960C420 930 260 860 80 760', 'M520 960C560 820 720 640 900 470'];
    rails.forEach((d, i) => { const k = E(t, tr + i * .25, 1.2, 'io'); s += line(d, k, { c: '#6B5B3E', w: 26 }) + line(d, k, { c: '#E9E1D3', w: 10 }) + line(d, k, { c: '#3A3226', w: 30, da: '5 26' }); if (k >= 1) { for (let j = 0; j < 3; j++) { const ph = (t * .25 + j / 3 + i * .1) % 1, p = pts(d, 100)[Math.floor(ph * 99)]; s += virus(p[0], p[1], 16, t, { op: .9 }) } } });
    const tbt = T.c('boats', 0, 4);
    if (t > tbt - .3) for (let j = 0; j < 3; j++) { const ph = ((t - tbt) * .12 + j / 3) % 1, P2 = pts(river, 120), p = P2[Math.floor(ph * 119)]; s += g(ink('M-50 -10L50 -10L36 16L-36 16Z', { f: '#8A5A3C', c: C.ink, w: 5, dx: 3, dy: 3 }) + line('M0 -10V-56', 1, { c: C.ink, w: 5 }) + fill('M0 -56L30 -24H0Z', C.paper), at(p[0], p[1] - 20)) }
    const kc = E(t, T.a, .5, 'back');
    s += g(ink(D_.circ(0, 0, 40), { f: C.a1, c: C.ink, w: 7 }) + `<circle r="14" fill="${C.paper}"/>`, at(city[0], city[1], kc));
    s += g(fill(D_.rr(-300, -64, 600, 128, 64), C.ink) + tx('KINSHASA', -40, 20, { f: 'O', s: 60, w: 700, c: C.paper, ls: 4 }) + tx('1920', 200, 20, { f: 'O', s: 60, w: 700, c: C.a1 }), at(540, 1180, kc));
    s += ringWave(520, 960, t, T.c('kinshasa', 0, 1), { c: C.a1, r1: 400 });
    return g(s, cam(t, T, .04, 520, 960));
  };

  D.sample = (t, S, T) => {
    let s = bg(C.bg2);
    const k = E(t, T.a, .5, 'back'), t59 = T.c('1959', 0, 2.5);
    let rack = ink(D_.rr(-360, 80, 720, 70, 14), { f: '#8A5A3C', c: C.line, w: 7 });
    for (let i = 0; i < 5; i++) {
      const x = -260 + i * 130, main = i === 2, h = main ? 520 : 420, y0 = 100 - h;
      const tube = `M${x - 42} ${y0}V${100 - 42}A42 42 0 0 0 ${x + 42} ${100 - 42}V${y0}Z`;
      rack += ink(tube, { f: '#DDE7F0', c: C.line, w: 7 }) + fill(`M${x - 42} ${100 - h * .45}V${100 - 42}A42 42 0 0 0 ${x + 42} ${100 - 42}V${100 - h * .45}Z`, main ? C.a1 : '#B3424C', main ? 1 : .6) + fill(D_.rr(x - 50, y0 - 40, 100, 50, 10), main ? C.gold : '#5B6B8A') + shine(x - 22, y0 + 40, 120, 90, 7, C.paper, .6);
    }
    s += g(rack, at(540, 1100, k));
    const kt = E(t, t59 - .2, .5, 'back');
    if (kt > 0) s += g(ink(D_.rr(-170, -70, 340, 140, 20), { f: C.paper, c: C.ink, w: 7 }) + tx('1959', 0, 36, { f: 'O', s: 100, w: 700, c: C.ink }) + line('M-170 0L-300 60', 1, { c: C.paper, w: 5 }), at(760, 440, kt, 8));
    s += cap(L('oldest sample'), 540, 330, { c: C.a2, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .05, 540, 900));
  };

  D.la = (t, S, T) => {
    let s = bg('#F3D9B8') + fill(D_.circ(540, 1240, 520), '#F2A65A', .5);
    const palm = (x, y, sc, ph) => { let q = line(`M0 0C10 -150 -20 -300 20 -420`, 1, { c: C.ink, w: 22 }); for (let i = 0; i < 6; i++) q += ink(D_.leaf(20, -420, 190, 48, -170 + i * 36 + wob(t, .4, 3, ph + i), .2), { f: '#3E8A5E', c: C.ink, w: 5, dx: 4, dy: 3 }); return g(q, at(x, y, sc)) };
    s += palm(110, 1300, 1, 0) + palm(980, 1250, .8, 2);
    const td = T.c('reported', 0, 2.5);
    let d = doc(0, 0, { w: 520, h: 640, f: '#FFFDF7', c: C.ink, lines: 0, title: 'JUNE 5, 1981', tc: C.ink, ts: 42 });
    for (let i = 0; i < 5; i++) { const k = E(t, td + .25 + i * .22, .3, 'back'); d += g(`<circle cx="-170" cy="${-150 + i * 80}" r="${R(18 * k)}" fill="${C.a1}"/>`) + line(`M-130 ${-150 + i * 80}H${180 - (i % 2) * 40}`, k, { c: C.ink, w: 9, op: .4 }) }
    d += line('M-200 -230H200', 1, { c: C.ink, w: 5, op: .5 });
    s += g(d, at(540, 760, E(t, T.a, .5, 'back'), -3));
    const tw2 = T.c('noticed', 0, 5);
    for (let i = 0; i < 6; i++) { const k = E(t, tw2 - .4 + i * .08, .6, 'back'); if (k <= 0) continue; const a = i / 6 * Math.PI * 2 + .4, x = 540 + Math.cos(a) * 400, y = 760 + Math.sin(a) * 470; s += g(ink(D_.rr(-110, -80, 220, 160, 8), { f: C.paper, c: C.ink, w: 5 }) + fill(D_.rr(-90, -60, 180, 26, 4), C.ink, .8) + line('M-90 -10H90M-90 20H60M-90 50H80', 1, { c: C.ink, w: 6, op: .35 }), at(x, y, k * .9, (i - 3) * 9)) }
    s += cap('Los Angeles', 540, 330, { c: C.ink, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .05));
  };

  D.zero = (t, S, T) => {
    let s = bg(C.bg) + `<path d="M380 0H700L900 1500H180Z" fill="${C.paper}" opacity=".06"/>`;
    const k = E(t, T.a, .5, 'back');
    let f0 = ink('M-340 -300H-120L-80 -350H340V360H-340Z', { f: '#C9A36B', c: C.line, w: 8 }) + ink(D_.rr(-300, -230, 600, 560, 14), { f: '#E8D3A9', c: C.line, w: 6 });
    f0 += ink(D_.rr(-240, -180, 200, 250, 12), { f: '#B9C2D6', c: C.ink, w: 6 }) + g(fill(D_.circ(0, -40, 44), '#55607A') + fill('M-80 70C-80 10 -46 0 0 0C46 0 80 10 80 70Z', '#55607A'), at(-140, -40));
    f0 += tx('PATIENT', 140, -60, { f: 'O', s: 64, w: 700, c: C.ink }) + tx('0', 140, 90, { f: 'O', s: 170, w: 700, c: C.a1 });
    s += g(f0, at(540, 820, k));
    s += stamp(L('BLAMED'), 640, 1150, t, T.c('blamed', 0, 1.2), { c: C.a1, s: 80, r: -8 });
    return g(s, cam(t, T, .06, 640, 800));
  };

  D.o = (t, S, T) => {
    let s = bg('#E8D3A9');
    const to = T.c('outside', 0, 1.6), tz = T.c('zero', 0, 4.5);
    const O = D_.circ(540, 700, 170), Z = D_.ell(540, 700, 104, 176);
    const km = E(t, tz - .1, .6, 'io');
    s += tx('PATIENT', 540, 420, { f: 'O', s: 70, w: 700, c: C.ink, ls: 6 });
    s += `<path d="${km > 0 ? morph(O, Z, km) : O}" fill="none" stroke="${C.ink}" stroke-width="${R(lerp(56, 46, km))}"/>`;
    if (km > .6) s += line('M610 590L470 810', E(t, tz + .35, .3), { c: C.ink, w: 14 });
    const ko = E(t, to - .05, .6, 'o5') * (1 - km);
    if (ko > 0) s += rise(L('OUTSIDE CALIFORNIA'), 540, 1010, t, to - .05, { f: 'O', s: 78, w: 700, c: C.a1, op: 1 - km });
    if (km > 0) s += tx(L('read as a zero'), 540, 1010, { f: 'O', s: 70, w: 700, c: C.a1, op: km, ls: 3 });
    return g(s, cam(t, T, .05, 540, 700));
  };

  D.dna = (t, S, T) => {
    let s = bg(C.bg);
    const ty = T.c('1971', 0, 3), kd = E(t, T.a, .6);
    for (let i = 0; i < 26; i++) { // спираль ДНК
      const y = 330 + i * 30, ph = t * 2.2 + i * .45, x1 = 230 + Math.sin(ph) * 90, x2 = 230 - Math.sin(ph) * 90, front = Math.cos(ph) > 0;
      s += line(`M${R(x1)} ${y}L${R(x2)} ${y}`, kd, { c: i % 2 ? C.a3 : C.a2, w: 7, op: .8 });
      s += `<circle cx="${R(x1)}" cy="${y}" r="${front ? 13 : 9}" fill="${C.paper}" opacity="${kd}"/><circle cx="${R(x2)}" cy="${y}" r="${front ? 9 : 13}" fill="${C.a1}" opacity="${kd}"/>`;
    }
    const A = [470, 1000], B = [870, 520], path = `M${A[0]} ${A[1]}C${A[0] + 120} ${A[1] - 300} ${B[0] - 160} ${B[1] + 60} ${B[0]} ${B[1]}`;
    const kp = E(t, T.a + .8, Math.max(.8, ty - T.a - .6), 'io');
    s += dotted(path, kp, C.gold, 8, 24);
    s += `<circle cx="${A[0]}" cy="${A[1]}" r="18" fill="${C.a1}"/>` + tx(L('CARIBBEAN'), A[0] + 20, A[1] + 70, { f: 'O', s: 44, w: 500, c: C.paper, ls: 3 });
    s += `<circle cx="${B[0]}" cy="${B[1]}" r="18" fill="${C.a1}"/>` + tx('NEW YORK', B[0] - 20, B[1] - 40, { f: 'O', s: 44, w: 500, c: C.paper, ls: 3 });
    const kt = E(t, ty, .5, 'back');
    if (kt > 0) {
      let tl = line('M-380 0H380', 1, { c: C.paper, w: 7 });
      tl += `<circle cx="-280" cy="0" r="22" fill="${C.a3}"/>` + tx('1971', -280, -46, { f: 'O', s: 64, w: 700, c: C.a3 }) + `<circle cx="280" cy="0" r="22" fill="${C.a1}"/>` + tx('1981', 280, -46, { f: 'O', s: 64, w: 700, c: C.a1 });
      tl += line('M-250 40Q0 120 250 40', E(t, T.c('before', 0, 6) - .2, .5), { c: C.gold, w: 7, da: '2 16' }) + tx(L('10 years'), 0, 140, { f: 'O', s: 52, w: 500, c: C.gold, op: E(t, T.c('years', 0, 6), .4) });
      s += g(tl, at(540, 1150, kt));
    }
    return g(s, cam(t, T, .04));
  };

  D.pill = (t, S, T) => {
    let s = bg(C.paper);
    const tt = T.c('today', 0, 2.6), tu = T.c('undetectable', 0, 4.8), x0 = 160, x1 = 960, yb = 1150, yt = 520;
    s += line(`M${x0} ${yt - 40}V${yb}H${x1}`, 1, { c: C.ink, w: 8 }) + tx(L('VIRUS'), x0 - 10, yt - 70, { f: 'O', s: 44, w: 700, c: C.ink, a: 'start' });
    const kd = E(t, tt + .3, 1.3, 'io'), xd = 470;
    let d = `M${x0} ${yt + 60}`;
    for (let x = x0; x <= x1; x += 10) { const y = x < xd ? yt + 60 + Math.sin(x / 30 + t * 2) * 12 : lerp(yt + 60, yb - 30, EZ.io(clamp((x - xd) / 220))) + Math.sin(x / 30) * 4 * (1 - clamp((x - xd) / 220)); if (x > xd + (x1 - xd) * kd && x > xd) break; d += `L${x} ${R(y)}` }
    s += line(d, E(t, T.a, .9), { c: C.a1, w: 12 });
    s += line(`M${x0} ${yb - 30}H${x1}`, E(t, tu - .3, .6), { c: C.a3, w: 6, da: '4 16' });
    if (t > tu - .2) s += tx(L('UNDETECTABLE'), x1, yb - 60, { f: 'O', s: 52, w: 700, c: C.a3, a: 'end', op: E(t, tu - .2, .4) });
    s += tx(L('1990s'), 300, yt - 10, { f: 'O', s: 48, w: 500, c: C.a1, op: E(t, T.a, .4) });
    const kp = clamp((t - tt + .3) / .7);
    if (kp > 0) s += capsule(lerp(500, 520, kp), lerp(260, 470, EZ.back(Math.min(1, kp))), { f: C.paper, f2: C.a3, c: C.ink, r: lerp(-40, 20, kp), s: .9 });
    return g(s, cam(t, T, .04, 540, 860));
  };

  D.uu = (t, S, T) => {
    let s = bg(C.a3);
    const k = E(t, T.a, .6, 'back');
    s += dots('M0 0H1080V1920H0Z', { c: '#2A8F7E', step: 22, x0: 540, y0: 1400, x1: 540, y1: 300, op: .6, bb: [0, 300, 1080, 1100] });
    s += g(ink(D_.circ(-110, 0, 210), { f: C.paper, c: C.ink, w: 9 }) + ink(D_.circ(110, 0, 210), { f: C.a2, c: C.ink, w: 9 }) + line(D_.circ(-110, 0, 210), 1, { c: C.ink, w: 9 }) + tx('U = U', 0, 50, { f: 'U', s: 120, w: 800, c: C.ink }), at(540, 800, k));
    s += cap(L('undetectable = untransmittable'), 540, 1180, { c: C.ink, s: 30, ls: 3, op: E(t, T.a + .5, .5) });
    return g(s, cam(t, T, .05));
  };

  D.shot = (t, S, T) => {
    let s = bg(C.bg);
    const tt = T.c('twice', 0, 2.5), M = L(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']);
    s += tx('2025', 540, 380, { f: 'O', s: 90, w: 700, c: C.gold, op: E(t, T.a, .4) });
    M.forEach((m, i) => {
      const x = 240 + (i % 3) * 300, y = 520 + Math.floor(i / 3) * 170, on = i === 0 || i === 6, k = E(t, T.a + i * .04, .4, 'back'), ko = on ? E(t, tt - .1 + (i ? .25 : 0), .4, 'back') : 0;
      s += g(ink(D_.rr(-120, -64, 240, 128, 18), { f: ko > 0 ? C.a3 : C.bg2, c: C.line, w: 6 }) + tx(m, 0, 18, { f: 'O', s: 52, w: 500, c: C.paper }), at(x, y, k * (1 + ko * .1)));
      if (ko > 0) s += g(ink(D_.rr(-14, -90, 28, 140, 8), { f: C.paper, c: C.ink, w: 5, dx: 3, dy: 3 }) + fill(D_.rr(-10, -40, 20, 70, 4), C.a3) + line('M0 50V90M-24 -90H24', 1, { c: C.ink, w: 6 }), at(x + 110, y - 60, ko, 35));
    });
    s += tx('2× / ' + L('YEAR'), 540, 1250, { f: 'O', s: 80, w: 700, c: C.a3, op: E(t, tt + .4, .4) });
    return g(s, cam(t, T, .04));
  };

  D.count = (t, S, T) => {
    let s = bg(C.bg);
    const k = E(t, T.a + .2, 1.8, 'o5');
    for (let i = 0; i < 41; i++) { const x = 170 + (i % 8) * 106, y = 470 + Math.floor(i / 8) * 120, kk = E(t, T.a + i * .03, .35, 'back'); s += g(fill(D_.circ(0, -28, 22), i % 5 === 2 ? C.a2 : C.paper) + fill('M-38 20C-38 -8 -22 -12 0 -12C22 -12 38 -8 38 20Z', i % 5 === 2 ? C.a2 : C.paper), at(x, y, kk)) }
    s += odo(41000000 * k, 540, 1230, { s: 120, c: C.a1 });
    s += cap(L('1 icon = 1 million'), 540, 1290, { c: C.paper, s: 24, op: .7 });
    return g(s, cam(t, T, .04));
  };

  D.end = (t, S, T) => {
    let s = bg(C.bg2);
    const glasses = line('M-86 -446m-40 0a40 34 0 1 0 80 0a40 34 0 1 0 -80 0M86 -446m-40 0a40 34 0 1 0 80 0a40 34 0 1 0 -80 0M-46 -446H46', 1, { c: C.ink, w: 7 });
    s += bust(420, 1250, { s: 1, f: '#9C6FB5', hair: 'long', hairC: '#D7D9DE', mood: 'smile', skin: '#EBC3A0', extra: glasses });
    s += g(ribbon(1, { d: 'M-90 230L0 60C60 -50 70 -120 36 -160C14 -186 -14 -186 -36 -160C-70 -120 -60 -50 0 60L90 230', w: 46 }), at(820, 640, E(t, T.a + .3, .5, 'back')));
    s += cap(L('older than grandma'), 540, 330, { c: C.paper, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .05));
  };

  D.end2 = (t, S, T) => {
    let s = bg('#F3E3C8');
    const ts = T.c('sign', 0, 2.6), k = E(t, ts - .3, .7, 'back');
    s += line('M540 1300V560', 1, { c: C.ink, w: 26 });
    s += g(ink('M-300 -80H230L300 0L230 80H-300Z', { f: C.a3, c: C.ink, w: 9 }) + tx(L('GET TESTED'), -30, 26, { f: 'O', s: 74, w: 700, c: C.ink, ls: 3 }), at(540, 640, k, -4 + wob(t, .5, 1.5)));
    s += g(ink(D_.rr(-70, -170, 140, 340, 30), { f: C.paper, c: C.ink, w: 8 }) + fill(D_.rr(-40, -110, 80, 120, 12), '#DDE7F0') + line('M-20 -60H20', 1, { c: C.a1, w: 8 }) + line('M-20 -30H20', 1, { c: C.a1, w: 8, op: .25 }) + ink(D_.circ(0, 80, 26), { f: '#DDE7F0', c: C.ink, w: 5, dx: 0, dy: 0 }), at(830, 1010, E(t, T.a + .2, .5, 'back'), 12));
    s += fill(D_.ell(540, 1300, 220, 34), C.ink, .25);
    return g(s, cam(t, T, .05));
  };

  window.EP = {
    P: C, D,
    tr: { title: 'zoom', eighties: 'flash', claim: 'iris', forest: 'push', hunter: 'zoom', kin: 'push', sample: 'wipe', la: 'push', zero: 'zoom', o: 'push', dna: 'up', pill: 'iris', uu: 'push', shot: 'push', count: 'fade', end: 'push' },
    trAt: { title: [540, 700], hunter: [650, 1150], zero: [680, 840], claim: [540, 760], pill: [500, 470] },
    trCol: { claim: C.a1, sample: C.a1, pill: C.a3 },
    cap: { hi: C.gold, st: '#0D0E1C' },
  };
})();
