// Никотин — «придуман, чтобы убивать жуков». Палитра: табачная зелень, янтарь, красный, кремовый.
(function () {
  const C = { bg: '#13241F', bg2: '#1D3B32', ink: '#0C1814', paper: '#F2ECDD', line: '#F2ECDD', a1: '#E9A23B', a2: '#E2574C', a3: '#7FC48A', leaf: '#5E9E5A', leaf2: '#3F7A45', smoke: '#C9D3CE', skin: '#E9B48F', mango: '#FFB238' };
  P = C;
  const cam = (t, T, a = .05, cx = 540, cy = 820) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {};
  // формы для перетекания: лист → сигарета → вейп
  const LEAF = D_.leaf(250, 1180, 960, 300, -62, .1);
  const CIG = D_.tf(D_.rrp(860, 96, 40), 540, 820, -28);
  const VAPE = D_.tf(D_.rrp(230, 640, 70), 540, 800, 0);
  const veins = (k = 1, c = C.line) => { // жилки листа
    const a = -62 * Math.PI / 180, cx = Math.cos(a), sy = Math.sin(a), bx = 250, by = 1180;
    let d = `M${bx} ${by}Q${R(bx + cx * 480 + 30)} ${R(by + sy * 480)} ${R(bx + cx * 960)} ${R(by + sy * 960)}`;
    for (let i = 1; i < 7; i++) { const u = i / 7.5, px = bx + cx * 960 * u + 10, py = by + sy * 960 * u, l = 230 * Math.sin(u * Math.PI) + 40; d += `M${R(px)} ${R(py)}Q${R(px + 60)} ${R(py - 10)} ${R(px + l * .9)} ${R(py + l * .25)}M${R(px)} ${R(py)}Q${R(px - 50)} ${R(py - 40)} ${R(px - l * .55)} ${R(py - l * .6)}` }
    return line(d, k, { c, w: 6, op: .75 })
  };
  const leafFull = (k = 1, fk = 1) => ink(LEAF, { f: C.leaf, c: C.line, w: 8, k, fk }) + (fk > 0 ? dots(LEAF, { c: C.leaf2, step: 16, x0: 900, y0: 400, x1: 300, y1: 1100, op: .7 * fk }) : '') + veins(clamp(k * 1.2 - .2));
  // жук сверху: k — шаг ног, flip — перевёрнут (0..1)
  function bug(x, y, s, t, o = {}) {
    const step = o.walk ? Math.sin(t * 14) : 0, fl = o.flip || 0, col = fl > .5 ? '#C98D5E' : (o.f || '#2F7D5B');
    let q = '';
    for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) {
      const yy = -30 + i * 38, sw = (i % 2 ? 1 : -1) * sd * step * 14 * (1 - fl), kn = sd * (fl > .5 ? 70 + Math.sin(t * 20 + i) * 8 * (o.twitch || 0) : 78);
      q += line(`M${sd * 40} ${yy}L${R(sd * 84)} ${R(yy - 18 + sw)}L${R(sd * 104 + (fl > .5 ? 0 : 0))} ${R(yy + 26 + sw)}`, 1, { c: C.line, w: 7 });
    }
    q += line('M-14 -86C-30 -130 -54 -140 -70 -150M14 -86C30 -130 54 -140 70 -150', 1, { c: C.line, w: 6 });
    q += ink(D_.ell(0, 10, 62, 84), { f: col, c: C.line, w: 7, dx: 6, dy: 5 }) + ink(D_.circ(0, -82, 30), { f: fl > .5 ? '#A9714A' : C.ink, c: C.line, w: 6, dx: 4, dy: 3 });
    if (fl <= .5) q += line('M0 -72V92', 1, { c: C.line, w: 5 }) + shine(-30, -30, 30, -80, 6, C.paper, .8) + dots(D_.ell(0, 10, 62, 84), { c: C.ink, step: 12, x0: -60, y0: -60, x1: 60, y1: 90, op: .45 });
    else q += line('M-30 -20H30M-34 20H34M-28 58H28', 1, { c: '#7A4A2C', w: 5 });
    return g(q, at(x, y, s * (fl > 0 && fl < 1 ? Math.abs(1 - 2 * fl) * .3 + .7 : 1), o.r || 0))
  }
  const smoke = (x, y, t, n = 3, sc = 1, c = C.smoke) => { let s = ''; for (let i = 0; i < n; i++) { const ph = (t * .6 + i / n) % 1, yy = y - ph * 300 * sc, xx = x + Math.sin(ph * 6 + i) * 30 * sc; s += `<circle cx="${R(xx)}" cy="${R(yy)}" r="${R((18 + ph * 40) * sc)}" fill="${c}" opacity="${R((1 - ph) * 50) / 100}"/>` } return s };

  D.title = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(720, 640, 420), C.bg2);
    const k = clamp(.35 + t / 1.2);
    s += g(leafFull(EZ.o(k), E(t, .2, .8)), about(540, 800, 1, wob(t, .25, 1.5)));
    s += cap(L('What do you know about', 'Что вы знаете о'), 540, 268, { c: C.paper, op: E(t, 0, .5) });
    s += rise(L('NICOTINE?', 'НИКОТИНЕ?'), 540, 1250, t, .2, { f: 'U', w: 800, s: L(108, 96), c: C.a1 });
    return g(s, cam(t, T, .06));
  };

  D.vape = (t, S, T) => {
    const t1 = T.c(L('cigarettes', 'сигаретах'), 0, .3), t2 = T.c(L('vapes', 'одноразках'), 0, 1.1);
    const k1 = E(t, t1 - .15, .45, 'io'), k2 = E(t, t2 - .15, .45, 'io');
    let s = bg(C.bg) + fill(D_.circ(720, 640, 420), C.bg2);
    if (k1 <= 0) return g(s + leafFull(1, 1), cam(t, T, .05));
    let d = k2 > 0 ? morph(CIG, VAPE, k2) : morph(LEAF, CIG, k1);
    const col = k2 > 0 ? (k2 > .5 ? '#2C2F3A' : C.paper) : (k1 > .5 ? C.paper : C.leaf);
    s += ink(d, { f: col, c: C.line, w: 8 });
    if (k1 >= 1 && k2 <= 0) { // сигарета: фильтр, пепел, дым
      const a = -28 * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a);
      s += g(fill(D_.rr(-430, -48, 250, 96, 30), C.a1) + line('M-180 -48V48', 1, { c: C.line, w: 6 }) + dots(D_.rr(-430, -48, 250, 96, 30), { c: '#B26F1F', step: 12, op: .6 }) + fill(D_.rr(380, -48, 50, 96, 22), '#8A8F96') + `<circle cx="430" cy="0" r="22" fill="${C.a2}" opacity="${R((.6 + Math.sin(t * 9) * .3) * 100) / 100}"/>` + line(D_.rr(-430, -48, 860, 96, 40), 1, { c: C.line, w: 8 }), `translate(540 820) rotate(-28)`);
      s += smoke(540 + cs * 440, 820 + sn * 440 - 20, t, 4, 1.1);
    }
    if (k2 >= 1) { // вейп: окошко, диод, наклейка
      s += fill(D_.rr(470, 560, 140, 260, 24), C.a1, .85) + line(D_.rr(470, 560, 140, 260, 24), 1, { c: C.line, w: 6 }) + tx(L('MANGO', 'МАНГО'), 540, 900, { f: 'O', s: 44, w: 700, c: C.mango, ls: 3 }) + `<circle cx="540" cy="1050" r="14" fill="${C.a3}" opacity="${R((.4 + Math.sin(t * 5) * .4) * 100) / 100}"/>` + ink('M480 480L600 480L585 410L495 410Z', { f: '#2C2F3A', c: C.line, w: 7 });
      s += smoke(540, 400, t, 5, 1.6);
    }
    return g(s, cam(t, T, .05));
  };

  D.claim = (t, S, T) => {
    const tb = T.c(L('bugs', 'жуков'), 0, 2.4), tk = T.c(L('kill', 'убивать'), 0, 1.8);
    let s = bg(C.bg) + fill(D_.circ(720, 640, 420), C.bg2);
    const km = E(t, T.a, .5, 'io');
    s += km < 1 ? ink(morph(VAPE, LEAF, km), { f: km > .5 ? C.leaf : '#2C2F3A', c: C.line, w: 8 }) : leafFull();
    const walk = clamp((t - T.a - .3) / 1.6), bx = lerp(1180, 720, EZ.o(walk)), stop = t > tk;
    s += bug(bx, 640 + (1 - walk) * 80, 1.25, t, { walk: !stop && walk < 1, r: -110, flip: E(t, tb, .5, 'back'), twitch: 1 });
    s += stamp(L('INSECTICIDE', 'ИНСЕКТИЦИД'), 540, 1180, t, tb + .1, { c: C.a2, s: 80, r: -7 });
    s += ringWave(720, 640, t, tb, { c: C.a1, r1: 560 });
    return g(s, cam(t, T, .05));
  };

  D.plant = (t, S, T) => {
    let s = bg(C.paper);
    const k = E(t, T.a, 1.6, 'o'), C2 = { line: C.ink };
    s += fill('M0 1260H1080V1920H0Z', '#D9CFBA') + line('M0 1260H1080', 1, { c: C.ink, w: 8 });
    s += line('M360 1260C350 1060 380 820 360 470', k, { c: C.ink, w: 14 });
    const lv = [[360, 1150, 300, 120, -20], [360, 1080, 300, 110, -160], [362, 940, 260, 100, -30], [360, 860, 250, 95, -150], [365, 720, 200, 80, -40], [362, 640, 190, 75, -140]];
    lv.forEach(([x, y, l, w0, a], i) => { const kk = E(t, T.a + .2 + i * .18, .5, 'back'); if (kk > 0) { const d = D_.leaf(x, y, l * kk, w0 * kk, a, .15); s += ink(d, { f: i % 2 ? C.leaf : '#6FB06A', c: C.ink, w: 6 }) + dots(d, { c: C.leaf2, step: 13, op: .55 }) } });
    for (let i = 0; i < 5; i++) { const kk = E(t, T.a + 1.2 + i * .1, .4, 'back'); if (kk > 0) s += g(ink('M0 0L-18 -60L18 -60Z', { f: '#F49AB5', c: C.ink, w: 5, dx: 3, dy: 3 }) + ink(D_.star(0, -70, 30, 14, 5), { f: '#F7B8CB', c: C.ink, w: 5, dx: 3, dy: 3 }), at(320 + i * 22, 470 + (i % 2) * 20, kk, -30 + i * 15)) }
    // молекула никотина
    const km = E(t, T.c(L('invented', 'придумал'), 0, .8) - .2, 1.2, 'io'), hx = 720, hy = 860;
    const hex = D_.poly([...Array(6)].map((_, i) => [hx + Math.cos((i * 60 - 90) * Math.PI / 180) * 80, hy + Math.sin((i * 60 - 90) * Math.PI / 180) * 80]));
    const pc = [hx + 210, hy - 30], pen = D_.poly([...Array(5)].map((_, i) => [pc[0] + Math.cos((i * 72 + 162) * Math.PI / 180) * 70, pc[1] + Math.sin((i * 72 + 162) * Math.PI / 180) * 70]));
    s += line(hex, km, { c: C.ink, w: 9 }) + line(`M${hx + 69} ${hy - 40}L${pc[0] - 67} ${pc[1] + 22}`, km, { c: C.ink, w: 9 }) + line(pen, km, { c: C.ink, w: 9 }) + line(`M${pc[0] + 57} ${pc[1] + 41}L${pc[0] + 110} ${pc[1] + 100}`, km, { c: C.ink, w: 9 });
    s += line(`M${hx - 48} ${hy - 28}L${hx - 48} ${hy + 28}M${hx + 48} ${hy - 28}L${hx} ${hy + 56}`, km, { c: C.ink, w: 6, op: .7 });
    const kn = E(t, T.a + 1.4, .4);
    s += g(`<circle cx="${hx}" cy="${hy + 80}" r="30" fill="${C.a1}"/>` + tx('N', hx, hy + 96, { f: 'O', s: 42, w: 700, c: C.ink }) + `<circle cx="${R(pc[0] + 57)}" cy="${R(pc[1] + 41)}" r="30" fill="${C.a1}"/>` + tx('N', pc[0] + 57, pc[1] + 57, { f: 'O', s: 42, w: 700, c: C.ink }), '', kn);
    s += tx('C₁₀H₁₄N₂', 800, 1080, { f: 'O', s: 64, w: 500, c: C.ink, op: kn });
    return g(s, cam(t, T, .04, 540, 900));
  };

  D.bite = (t, S, T) => {
    const tb = T.c(L('bites', 'кусает'), 0, .4), tn = T.c(L('nerves', 'нервам'), 0, 1.6), tf = T.c(L('freezes', 'замирает'), 0, 3.2);
    let s = bg(C.bg) + fill(D_.circ(540, 820, 470), C.bg2);
    const id = uid(), bites = t > tb + .2 ? [D_.circ(680, 610, 70), D_.circ(640, 560, 55)].join('') : '';
    s += `<mask id="${id}"><rect width="1080" height="1920" fill="#fff"/><path d="${bites}" fill="#000"/></mask><g mask="url(#${id})">${leafFull()}</g>`;
    const walk = clamp((t - T.a) / Math.max(.3, tb - T.a));
    const fr = t > tf ? 1 : 0, fl = E(t, tf + .3, .6, 'back');
    s += bug(lerp(1100, 760, EZ.o(walk)), lerp(380, 520, EZ.o(walk)), 1.35, t, { walk: walk < 1 && !fr, r: -140, flip: fl, twitch: fr ? .3 : 0 });
    if (t > tn - .1 && t < tf + .4) { // разряды по нервам
      let z = ''; for (let i = 0; i < 5; i++) { const a = rnd(Math.floor(t * 14) + i) * Math.PI * 2, r0 = 40; let d = `M${R(760 + Math.cos(a) * r0)} ${R(520 + Math.sin(a) * r0)}`; for (let j = 1; j < 5; j++) d += `L${R(760 + Math.cos(a) * (r0 + j * 34) + (rnd(i * 9 + j + Math.floor(t * 14)) - .5) * 40)} ${R(520 + Math.sin(a) * (r0 + j * 34) + (rnd(i * 7 + j) - .5) * 40)}`; z += line(d, 1, { c: C.a1, w: 7 }) }
      s += z;
    }
    if (fr) s += g(tx('ZZZ', 0, 0, { f: 'O', s: 60, w: 700, c: C.paper, op: 0 }), '') + tx(L('frozen', 'замер'), 760, 820, { f: 'O', s: 56, w: 500, c: C.a1, op: E(t, tf + .2, .3), ls: 4 });
    return g(s, cam(t, T, .06, 760, 560));
  };

  D.farm = (t, S, T) => {
    let s = bg('#CFE5DA');
    const ty = T.c('1690', 0, 2.2);
    s += fill('M0 1150H1080V1920H0Z', '#8A6646') + dots('M0 1150H1080V1500H0Z', { c: '#5B3F28', step: 16, x0: 540, y0: 1150, x1: 540, y1: 1500, op: .6 });
    for (let i = 0; i < 5; i++) { const x = 140 + i * 200, k = E(t, T.a + i * .1, .5, 'back'); s += g(ink(D_.circ(0, -40, 70), { f: '#7FC48A', c: C.ink, w: 6 }) + ink(D_.circ(-30, -60, 40), { f: '#9AD3A0', c: C.ink, w: 5 }) + line('M0 -40C10 -70 30 -80 50 -90M0 -40C-20 -60 -10 -90 -30 -100', 1, { c: C.ink, w: 4, op: .6 }), at(x, 1170, k)) }
    // лейка
    const tilt = -25 - E(t, T.a + .6, .6) * 12, cx = 620, cy = 620;
    s += g(ink('M-180 -110L120 -110L150 120L-150 120Z', { f: C.a1, c: C.ink, w: 8 }) + ink('M120 -40L330 -170L350 -150L150 20Z', { f: C.a1, c: C.ink, w: 8 }) + ink(D_.ell(340, -165, 46, 26), { f: '#C17E21', c: C.ink, w: 6 }) + line('M-150 -130C-150 -260 90 -260 90 -130', 1, { c: C.ink, w: 14 }) + dots('M-180 -110L120 -110L150 120L-150 120Z', { c: '#B26F1F', step: 14, op: .5 }), at(cx, cy, 1, tilt));
    for (let i = 0; i < 16; i++) { const ph = ((t * 1.4 + i / 16) % 1), x = 900 + (rnd(i) - .5) * 120 + ph * 30, y = 520 + ph * 600; if (t > T.a + .7) s += `<path d="${D_.drop(x, y, 16)}" fill="#8B5A2B" opacity="${R((1 - ph * .6) * 100) / 100}"/>` }
    s += g(ink(D_.rr(-150, -64, 300, 128, 64), { f: C.ink, c: C.ink, w: 6 }) + tx('1690', 0, 32, { f: 'O', s: 96, w: 700, c: C.a1 }), at(260, 420, E(t, ty - .1, .5, 'back'), -6));
    return g(s, cam(t, T, .05));
  };

  D.bottle = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(540, 760, 430), C.bg2);
    const cx = 540, cy = 780, k = E(t, T.a, .6, 'back');
    const body = 'M-150 -170C-150 -230 -60 -240 -60 -300L-60 -380L60 -380L60 -300C60 -240 150 -230 150 -170L150 330C150 370 120 390 80 390L-80 390C-120 390 -150 370 -150 330Z';
    let b = ink(body, { f: '#6B4423', c: C.line, w: 8 }) + dots(body, { c: C.ink, step: 15, x0: 150, y0: 300, x1: -60, y1: -100, op: .5 });
    b += ink(D_.rr(-70, -440, 140, 70, 12), { f: C.ink, c: C.line, w: 7 }) + ink(D_.rr(-125, -80, 250, 300, 14), { f: '#E7DEC6', c: C.line, w: 6 });
    b += g(ink(D_.leaf(0, 40, 140, 50, -90, .1), { f: '#1B1B1B', c: '#1B1B1B', w: 4, dx: 0, dy: 0 }), at(0, -20, .9)) + tx('BLACK LEAF', 0, 110, { f: 'O', s: 38, w: 700, c: '#1B1B1B', ls: 2 }) + tx('40', 0, 180, { f: 'O', s: 72, w: 700, c: C.a2 });
    b += shine(-110, -140, 160, -90, 9, C.paper, .5);
    s += g(b, at(cx, cy, k, wob(t, .3, 2)));
    const ty = T.c('1992', 0, 3.4), ky = E(t, T.a + .4, Math.max(.5, ty - T.a - .3), 'io');
    s += fill(D_.rr(240, 1185, 600, 120, 60), C.ink, .9) + tx('1910 —', 470, 1268, { f: 'O', s: 72, w: 500, c: C.paper, a: 'end' }) + odo(1910 + 82 * ky, 500, 1268, { s: 72, w: 700, c: C.a1, a: 'start', sep: '' });
    if (S.sents.length > 1) { const k2 = E(t, T.s(1), .5); s += g(tx(L('aphids', 'тля'), 0, 0, { f: 'O', s: 48, w: 500, c: C.a3, ls: 4 }), at(840, 520), k2) + bug(840, 420, .5 * k2, t, { walk: 1, r: wob(t, .5, 20), f: '#7FC48A' }) }
    return g(s, cam(t, T, .05));
  };

  D.nicot = (t, S, T) => {
    let s = bg(C.paper);
    const tp = T.c(L('paris', 'париж'), 0, 3.5), A = [230, 980], B = [830, 470];
    s += dots('M0 0H1080V1920H0Z', { c: '#CDBF9F', step: 26, x0: 0, y0: 0, x1: 1080, y1: 1920, op: .35, bb: [0, 200, 1080, 1200] });
    const path = `M${A[0]} ${A[1]}C${A[0] + 60} ${A[1] - 380} ${B[0] - 400} ${B[1] - 60} ${B[0]} ${B[1]}`;
    const kp = E(t, T.a + .5, Math.max(.6, tp - T.a - .5), 'io');
    s += dotted(path, kp, C.ink, 8, 26);
    s += `<circle cx="${A[0]}" cy="${A[1]}" r="18" fill="${C.a2}"/>` + tx(L('LISBON', 'ЛИССАБОН'), A[0] + 10, A[1] + 70, { f: 'O', s: 46, w: 500, c: C.ink, ls: 3 });
    s += `<circle cx="${B[0]}" cy="${B[1]}" r="18" fill="${C.a2}"/>` + tx(L('PARIS', 'ПАРИЖ'), B[0], B[1] + 70, { f: 'O', s: 46, w: 500, c: C.ink, ls: 3 });
    const pp = pts(path, 120)[Math.min(119, Math.floor(kp * 119))];
    const env = ink(D_.rr(-110, -70, 220, 140, 10), { f: '#FFFFFF', c: C.ink, w: 6 }) + line('M-110 -70L0 10L110 -70', 1, { c: C.ink, w: 6 }) + `<circle cx="0" cy="12" r="22" fill="${C.a2}"/>` + g(ink(D_.leaf(0, 0, 90, 30, -90), { f: C.leaf, c: C.ink, w: 4, dx: 2, dy: 2 }), at(-60, -60, .9, -30));
    s += g(env, at(pp[0], pp[1] - 110, 1.1, wob(t, .7, 6)));
    const kn = E(t, tp + .2, .6, 'o5');
    s += g(cap(L('around', 'около'), 540, 1060, { c: C.ink }) + tx('1560', 540, 1190, { f: 'O', s: 130, w: 700, c: C.a2 }), '', E(t, T.a + .1, .4) * (1 - kn));
    if (kn > 0) { const A1 = L('NICOT', 'НИКО'), B1 = L(' → NICOTINE', ' → НИКОТИН'), sz = 66, w1 = tw(A1, { f: 'U', w: 800, s: sz }), w2 = tw(B1, { f: 'U', w: 800, s: sz }), x0 = 540 - (w1 + w2) / 2; s += tx(A1, x0, 1190, { f: 'U', s: sz, w: 800, c: C.ink, a: 'start', op: kn }) + tx(B1, x0 + w1, 1190, { f: 'U', s: sz, w: 800, c: C.a1, a: 'start', op: E(t, tp + .6, .5) }) }
    return g(s, cam(t, T, .05, 540, 820));
  };

  D.neo = (t, S, T) => {
    let s = bg(C.bg) + fill('M0 1000H1080V1920H0Z', C.bg2);
    for (let i = 0; i < 5; i++) { const x = 160 + i * 190, k = E(t, T.a + i * .08, .5, 'back'); s += g(ink('M-70 -230L50 -230L80 -190L80 0L-70 0Z', { f: [C.a1, C.a3, C.a2, '#6FA8DC', C.a1][i], c: C.line, w: 6 }) + ink(D_.rr(-30, -280, 50, 50, 8), { f: C.ink, c: C.line, w: 5 }) + fill(D_.rr(-50, -160, 110, 90, 8), C.paper, .9) + line('M-34 -130H44M-34 -104H30', 1, { c: C.ink, w: 6, op: .5 }), at(x, 990, k * .95)) }
    const tn = T.c(L('neonicotinoids', 'неоникотиноиды'), 0, 2.5), kw = E(t, tn - .1, .5, 'o5');
    if (kw > 0) {
      const parts = L(['neo', 'NICOTIN', 'oids'], ['нео', 'НИКОТИН', 'оиды']), sz = L(92, 84);
      const ws = parts.map(p => tw(p, { f: 'U', w: 800, s: sz })), tot = ws.reduce((a, b) => a + b, 0); let x = 540 - tot / 2;
      parts.forEach((p, i) => { s += tx(p, x, 560 + (1 - kw) * 60, { f: 'U', w: 800, s: sz, c: i === 1 ? C.a1 : C.paper, a: 'start', op: kw }); x += ws[i] });
      s += line(`M${R(540 - tot / 2 + ws[0])} 600H${R(540 - tot / 2 + ws[0] + ws[1])}`, E(t, tn + .3, .4), { c: C.a1, w: 10 });
    }
    if (S.sents.length > 1) { // запрет ЕС ради пчёл
      const tb = T.s(1), kb = E(t, tb, .5, 'back');
      if (kb > 0) {
        for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; s += D_.star ? `<path d="${D_.star(540 + Math.cos(a) * 150, 330 + Math.sin(a) * 150, 16, 7)}" fill="${C.a1}" opacity="${R(kb * 100) / 100}"/>` : '' }
        const bx = 540 + Math.cos(t * 2) * 60, by = 330 + Math.sin(t * 3) * 30;
        s += g(ink(D_.ell(0, 0, 40, 30), { f: C.a1, c: C.line, w: 5, dx: 3, dy: 3 }) + line('M-12 -26V26M10 -28V28', 1, { c: C.ink, w: 7 }) + fill(D_.ell(-12, -40, 26, 16), C.paper, .8) + fill(D_.ell(14, -42, 26, 16), C.paper, .8), at(bx, by, kb));
      }
    }
    return g(s, cam(t, T, .04));
  };

  D.brain = (t, S, T) => {
    let s = bg(C.bg);
    const hx = 470, hy = 860, sc = 2.05, t1 = T.v + .2, ts2 = T.s(1);
    s += g(ink(HEAD, { f: C.bg2, c: C.line, w: 4 }), at(hx, hy, sc));
    const kp = E(t, t1, 1.1, 'io'), path = `M${hx + 205 * sc - 20} ${hy + 60 * sc}C${hx + 300} ${hy + 40} ${hx + 120} ${hy - 50} ${hx + 20} ${hy - 150}`;
    s += dotted(path, kp, C.a1, 9, 24);
    const fade = ts2 ? E(t, ts2, 1.4, 'io') : 0, glow = kp >= 1 ? 1 - fade * .8 : kp * .3;
    s += brain(hx + 20, hy - 170, { s: 1.15, f: '#F2A7B5', glow, gc: C.a1 });
    const ks = E(t, T.c(L('seconds', 'секунды'), 0, 1.2) - .1, .5, 'back');
    if (ks > 0) s += g(ink(D_.rr(-130, -56, 260, 112, 56), { f: C.a1, c: C.line, w: 7 }) + tx(L('≈ 10 s', '≈ 10 с'), 0, 24, { f: 'O', s: 64, w: 700, c: C.ink }), at(830, 470, ks, 5));
    // «ещё»: столбик уровня падает
    if (t > ts2) {
      const lv = 1 - fade, mx = 880, my = 1150;
      s += ink(D_.rr(mx - 50, my - 330, 100, 330, 50), { f: C.ink, c: C.line, w: 6 }) + fill(D_.rr(mx - 38, my - 18 - 294 * lv, 76, 294 * lv + 6, 38), C.a1);
      const km = E(t, T.c(L('more', 'ещё'), 0, 2.6), .5, 'back');
      if (km > 0) s += g(ink(D_.rr(-140, -56, 280, 112, 56), { f: C.a2, c: C.line, w: 7 }) + tx(L('MORE', 'ЕЩЁ'), 0, 24, { f: 'O', s: 66, w: 700, c: C.paper, ls: 4 }), at(560, 1200, km, -4));
    }
    return g(s, cam(t, T, .04));
  };

  D.pod = (t, S, T) => {
    let s = bg(C.paper);
    const tp = T.c(L('pack', 'пачке'), 0, 2.5), lev = 1 - E(t, tp - .2, .8, 'back'), ang = lev * 14 + wob(t, .5, 1.2), cx = 540, cy = 640;
    s += ink('M-160 640L160 640L60 560L-60 560Z', { f: C.bg2, c: C.ink, w: 8 }, 0);
    s = bg(C.paper) + g(ink('M-170 0L170 0L60 -80L-60 -80Z', { f: C.bg2, c: C.ink, w: 8 }) + line('M0 -80V-560', 1, { c: C.ink, w: 16 }), at(cx, 1240));
    const a = ang * Math.PI / 180, ex = Math.cos(a) * 380, ey = Math.sin(a) * 380, top = 1240 - 560;
    s += line(`M${R(cx - ex)} ${R(top - ey)}L${R(cx + ex)} ${R(top + ey)}`, 1, { c: C.ink, w: 14 }) + `<circle cx="${cx}" cy="${top}" r="20" fill="${C.a2}"/>`;
    const pan = (x, y, inner) => line(`M${x} ${y}L${x - 120} ${y + 260}M${x} ${y}L${x + 120} ${y + 260}`, 1, { c: C.ink, w: 5 }) + ink(`M${x - 160} ${y + 260}H${x + 160}C${x + 140} ${y + 330} ${x - 140} ${y + 330} ${x - 160} ${y + 260}Z`, { f: '#D9CFBA', c: C.ink, w: 7 }) + g(inner, at(x, y + 262));
    const pod = ink(D_.rr(-55, -150, 110, 150, 22), { f: '#2C2F3A', c: C.ink, w: 7 }) + fill(D_.rr(-35, -110, 70, 70, 10), C.a1, .9);
    let pack = ink(D_.rr(-110, -230, 220, 230, 10), { f: '#FFFFFF', c: C.ink, w: 7 }) + fill(D_.rr(-110, -230, 220, 70, 10), C.a2) + tx('20', 0, -50, { f: 'O', s: 70, w: 700, c: C.ink });
    for (let i = 0; i < 5; i++) pack += `<circle cx="${-80 + i * 40}" cy="-250" r="17" fill="${C.a1}" stroke="${C.ink}" stroke-width="4"/>`;
    s += pan(cx - ex, top - ey, pod) + pan(cx + ex, top + ey, pack);
    s += tx('=', cx, 520, { f: 'O', s: 120, w: 700, c: C.a2, op: E(t, tp, .4) });
    return g(s, cam(t, T, .04, 540, 900));
  };

  D.toll = (t, S, T) => {
    let s = bg('#0E1512');
    const t5 = T.c(L('five', 'пять'), 0, 3.5), per = 5;
    for (let j = 0; j < 9; j++) for (let i = 0; i < 9; i++) {
      const id = j * 9 + i, x = 140 + i * 100, y = 420 + j * 90, k = E(t, T.a + id * .006, .3);
      const gone = t > T.a + .8 + rnd(id) * 6 && rnd(id + 5) < .5;
      s += g(fill(D_.circ(0, -26, 16), gone ? '#2B3A34' : C.paper) + fill('M-28 14C-28 -8 -16 -10 0 -10C16 -10 28 -8 28 14Z', gone ? '#2B3A34' : C.paper), at(x, y, k));
    }
    s += odo(7000000 * E(t, T.a, 1.6, 'o5'), 540, 1290, { s: 110, c: C.a2, post: '+' });
    const lt = Math.max(0, t - (t5 - 2)), kr = (lt % per) / per;
    s += line(D_.arc(540, 400, 0, 0, 0), 0) + line(`M540 1330`, 0);
    s += g(line(D_.circ(0, 0, 70), 1, { c: '#2B3A34', w: 14 }) + line(D_.arc(0, 0, 70, -90, -90 + 359.9 * kr), 1, { c: C.a1, w: 14 }) + tx('5s', 0, 18, { f: 'O', s: 48, w: 700, c: C.paper }), at(900, 300, E(t, t5 - .3, .4, 'back')));
    return g(s, cam(t, T, .03));
  };

  D.end = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(720, 640, 420), C.bg2) + leafFull();
    const kw = clamp((t - T.a - .6) / 2.2);
    s += bug(lerp(720, 1250, EZ.i(kw)), lerp(600, 380, kw), 1.1, t, { walk: kw > 0 && kw < 1, r: 60 });
    return g(s, cam(t, T, .05));
  };

  D.end2 = (t, S, T) => {
    const km = E(t, T.a + .1, .6, 'io');
    let s = bg(C.bg) + fill(D_.circ(720, 640, 420), C.bg2);
    s += ink(morph(LEAF, VAPE, km), { f: km > .5 ? '#2C2F3A' : C.leaf, c: C.line, w: 8 });
    if (km >= 1) {
      const tm = T.c(L('mango', 'манго'), 0, 1);
      s += fill(D_.rr(470, 560, 140, 260, 24), C.a1, .85) + line(D_.rr(470, 560, 140, 260, 24), 1, { c: C.line, w: 6 }) + ink('M480 480L600 480L585 410L495 410Z', { f: '#2C2F3A', c: C.line, w: 7 }) + `<circle cx="540" cy="1050" r="14" fill="${C.a3}"/>`;
      s += g(ink(D_.ell(0, 0, 110, 80), { f: C.mango, c: C.line, w: 7 }) + fill(D_.ell(-20, -18, 50, 30), '#FFD27A') + ink(D_.leaf(60, -60, 80, 30, -40), { f: C.a3, c: C.line, w: 5, dx: 3, dy: 3 }), at(780, 700, E(t, tm - .1, .5, 'back'), -15));
      for (let i = 0; i < 6; i++) { const ph = (t * .35 + i / 6) % 1; s += `<circle cx="${R(540 + Math.sin(ph * 5 + i) * 70)}" cy="${R(400 - ph * 320)}" r="${R(26 + ph * 60)}" fill="${C.smoke}" opacity="${R((1 - ph) * 45) / 100}"/>` }
    }
    return g(s, cam(t, T, .05));
  };

  window.EP = {
    P: C, D,
    tr: { title: 'cut', vape: 'cut', claim: 'push', plant: 'push', bite: 'wipe', farm: 'push', bottle: 'push', nicot: 'up', neo: 'push', brain: 'iris', pod: 'push', toll: 'fade', end: 'cut' },
    trAt: { brain: [490, 680] }, trCol: { bite: C.a1, brain: C.a1 },
    cap: { hi: C.a1, st: '#08110E' },
  };
})();
