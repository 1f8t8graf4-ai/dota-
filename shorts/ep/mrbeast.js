// MrBeast — «третья по величине страна на Земле». Палитра: ночной синий, электрик, коралл, кремовый, золото.
(function () {
  const C = { bg: '#101B3B', bg2: '#182A5C', ink: '#0B1430', paper: '#F3EDE2', line: '#F3EDE2', a1: '#3D8BFF', a2: '#FF4E6A', a3: '#FFC53D', green: '#4DB37A', teal: '#2BB3A3', skin: '#E9B48F' };
  P = C;
  const cam = (t, T, a = .05, cx = 540, cy = 820) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {};

  // ——— заставка: табло подписчиков в круге
  D.title = (t, S, T) => {
    const k = E(t, 0, .9, 'o5'), cy = 790, r = 330 + 40 * k;
    let s = bg(C.bg) + fill(D_.circ(540, cy, r + 70), C.bg2);
    s += g(dotted(D_.ell(540, cy, r + 150, 120), 1, C.paper, 7, 24), about(540, cy, 1, -18 + t * 6), .5);
    s += ink(D_.circ(540, cy, r), { f: C.a1, c: C.line, w: 8 }) + dots(D_.circ(540, cy, r), { c: C.ink, step: 17, x0: 540 - r * .1, y0: cy - r * .1, x1: 540 + r, y1: cy + r, op: .5 });
    s += shine(540 - r * .62, cy - r * .5, 70, -55, 9, C.paper, .85);
    s += cap(L('What do you know about'), 540, 360, { c: C.paper, op: k });
    s += odo(521999880 + t * 37, 540, cy + 46, { s: 118, c: C.paper });
    s += cap(L('subscribers'), 540, cy + 120, { c: C.ink, s: 28 });
    s += rise('MRBEAST?', 540, 1240, t, .25, { f: 'U', w: 800, s: 96, c: C.paper });
    return g(s, cam(t, T, .06));
  };

  // ——— «раздаёт деньги»: рука с веером купюр, купюры улетают
  D.money = (t, S, T) => {
    let s = bg(C.paper);
    for (let i = 0; i < 14; i++) { // дождь купюр сзади
      const sp = 260 + rnd(i) * 160, y = ((t - T.a) * sp + rnd(i + 7) * 2200) % 2300 - 300, x = 60 + rnd(i + 3) * 960;
      s += bill(x + wob(t, .4, 30, i), y, { w: 150, r: wob(t, .5, 40, i * 2), c: C.ink, op: .35 });
    }
    const hx = 330, hy = 1250, n = 5;
    for (let i = 0; i < n; i++) { // веер
      const lt = (t - T.a - .5 - i * .28), fly = lt > 0 ? EZ.o(clamp(lt / 1.2)) : 0, ang = -38 + i * 17;
      const bx = hx + 70 + fly * (220 + i * 90), by = hy - 230 - fly * (900 + i * 60), rr = ang + fly * (160 + i * 40);
      s += g(bill(0, -150, { w: 300, c: C.ink }), at(bx, by, 1 - fly * .25, rr), 1 - clamp((lt - 1.3) * 2));
    }
    s += hand(hx, hy, -55, { s: 2.3, c: C.ink, f: C.skin, sleeve: C.a1 });
    return g(s, cam(t, T, .05));
  };

  // ——— «третья страна»: глобус, втыкается флаг, медаль №3
  D.claim = (t, S, T) => {
    const tc = T.c('country', 0, 1.6), cy = 860, r = 300;
    let s = bg(C.bg) + fill(D_.circ(540, cy, r + 60), C.bg2);
    s += globe(540, cy, r, t, { f: C.a1, c: C.line, dc: C.ink });
    const k = E(t, tc - .35, .55, 'back'), fy = lerp(-600, 0, clamp(P01(t, tc - .35, .4) * 1.0));
    s += flag(540, cy - r + 18 + (k < 1 ? fy * (1 - k) : 0), t, { f: C.a2, c: C.line, emb: D_.star ? `<path d="${D_.star(0, 0, 34, 14)}" fill="${C.paper}"/>` : '', op: clamp(P01(t, tc - .35, .15)) });
    s += ringWave(540, cy - r, t, tc, { c: C.paper, r1: 520 }) + burst(540, cy - r, t, tc, { c: C.a3, r0: 70, r1: 190 });
    const t3 = T.c('third', 0, .8), k3 = E(t, t3 - .1, .6, 'back');
    if (k3 > 0) s += g(ink(D_.circ(0, 0, 110), { f: C.a3, c: C.line, w: 8 }) + tx('#3', 0, 34, { f: 'O', w: 700, s: 104, c: C.ink }), at(820, 520, k3, -10));
    return g(s, cam(t, T, .05));
  };

  // ——— 522 млн подписчиков: табло + трибуна
  D.subs = (t, S, T) => {
    let s = bg(C.bg);
    const tv = T.v, te = T.c('subscribers', 0, 2), k = E(t, tv, Math.max(.8, te - tv), 'o5');
    s += cap(L('subscribers'), 540, 470, { c: C.a1 });
    s += odo(522000000 * k, 540, 640, { s: 150, c: C.paper });
    for (let row = 0; row < 4; row++) for (let i = 0; i < 9 + row; i++) {
      const n = 9 + row, sp = 1000 / n, x = 40 + sp / 2 + i * sp + (row % 2) * 8, y = 860 + row * 110, sc = .7 + row * .12, id = row * 20 + i;
      const kk = E(t, tv + .1 + id * .015, .4, 'back'); if (kk <= 0) continue;
      const col = [C.a1, C.paper, C.a2, C.a3][(id * 7) % 4];
      s += g(ink(D_.circ(0, -78, 30), { f: col, c: C.line, w: 6, dx: 6, dy: 5 }) + ink('M-52 0C-52 -40 -30 -46 0 -46C30 -46 52 -40 52 0Z', { f: col, c: C.line, w: 6, dx: 6, dy: 5 }), at(x, y + wob(t, 1.3, 6, id) * (row < 2 ? 1 : .6), sc * kk));
    }
    return g(s, cam(t, T, .04));
  };

  // ——— США + Россия меньше: столбики
  D.usa = (t, S, T) => {
    let s = bg(C.paper);
    const base = 1180, px = 1.3, bars = [];
    const tu = T.c('united', 0, .2), tr = T.c('russia', 0, 2), tf = T.c('fewer', 0, 3);
    const hb = 522 * px * E(t, T.a, .7, 'o5'), hu = 342 * px * E(t, tu, .7, 'o5'), hr = 146 * px * E(t, tr, .6, 'back');
    s += line(`M80 ${base}H1000`, 1, { c: C.ink, w: 8 });
    // MrBeast
    s += ink(D_.rr(620, base - hb, 260, hb, 6), { f: C.a2, c: C.ink, w: 7 }) + dots(D_.rr(620, base - hb, 260, hb, 6), { c: C.ink, step: 15, x0: 880, y0: base, x1: 620, y1: base - hb, op: .35, bb: [620, base - hb, 260, hb] });
    s += tx('522M', 750, base - hb - 30, { f: 'O', s: 70, c: C.ink, w: 700, op: clamp(hb / 100) }) + tx('MRBEAST', 750, base + 64, { f: 'O', s: 44, c: C.ink, w: 500 });
    // США и Россия стопкой
    if (hu > 1) s += ink(D_.rr(200, base - hu, 260, hu, 6), { f: C.a1, c: C.ink, w: 7 }) + tx('342M', 330, base - hu / 2 + 24, { f: 'O', s: 64, c: C.paper, w: 700 });
    if (hr > 1) s += ink(D_.rr(200, base - hu - hr, 260, hr, 6), { f: C.a3, c: C.ink, w: 7 }) + tx('+146M', 330, base - hu - hr / 2 + 22, { f: 'O', s: 56, c: C.ink, w: 700 });
    s += tx(L('USA') + (hr > 1 ? ' + ' + L('RUSSIA') : ''), 330, base + 64, { f: 'O', s: 44, c: C.ink, w: 500 });
    const kf = E(t, tf - .2, .5);
    if (kf > 0) {
      const y = base - 522 * px;
      s += line(`M180 ${y}H900`, kf, { c: C.ink, w: 6, da: '4 18' });
      const gy = base - 488 * px;
      s += g(line(`M330 ${gy - 6}V${y + 6}`, 1, { c: C.a2, w: 8 }) + tx('−34M', 330, (y + gy) / 2 + 16, { f: 'O', s: 46, c: C.a2, w: 700, a: 'middle', st: C.paper, sw: 14 }), '', kf);
    }
    s += cap(L('people'), 540, 360, { c: C.ink });
    return g(s, cam(t, T, .04, 540, 900));
  };

  // ——— рейтинг стран
  D.rank = (t, S, T) => {
    let s = bg(C.bg);
    const rows = [['1', L('India'), '1.46B'], ['2', L('China'), '1.41B'], ['3', 'MrBeast', '522M'], ['4', L('USA'), '342M']];
    const ti = T.c('india', 0, .4), tc2 = T.c('china', 0, .9);
    rows.forEach((r, i) => {
      const y = 430 + i * 200, k = E(t, T.a + .05 + i * .12, .6, 'o5'), x = lerp(700, 0, k), hi = i === 2;
      const pulse = i === 0 ? E(t, ti, .3) * (1 - E(t, ti + .4, .4)) : i === 1 ? E(t, tc2, .3) * (1 - E(t, tc2 + .4, .4)) : 0;
      let q = '';
      if (hi) q += ink(D_.rr(80, y - 95, 920, 150, 75), { f: C.a2, c: C.line, w: 7 });
      else q += fill(D_.rr(80, y - 95, 920, 150, 75), C.bg2, .9);
      q += tx(r[0], 175, y + 28, { f: 'O', s: 110, w: 700, c: hi ? C.paper : C.a1 });
      q += tx(r[1], 270, y + 18, { s: 60, w: 800, c: C.paper, a: 'start' });
      q += tx(r[2], 960, y + 22, { f: 'O', s: 72, w: 500, c: hi ? C.paper : C.a3, a: 'end' });
      s += g(q, `translate(${R(x)} 0)` + (pulse ? ' ' + about(540, y, 1 + pulse * .04) : ''), k);
    });
    s += cap(L('population'), 540, 300, { c: C.a1 });
    return g(s, cam(t, T, .04));
  };

  // ——— легенда: в видоискателе камеры подросток считает до 100 000, за окном дни и ночи
  D.legend = (t, S, T) => {
    const t0 = T.c('counted', 0, 4), th = T.c('hours', 0, 7), lt = Math.max(0, t - t0), cyc = lt * .42, day = (Math.sin(cyc * Math.PI * 2 - 1.6) + 1) / 2;
    const kc = t < t0 ? 0 : E(t, t0, Math.max(1, th - t0), 'io');
    const sky = `rgb(${R(lerp(18, 150, day))},${R(lerp(30, 196, day))},${R(lerp(66, 244, day))})`;
    const vf = D_.rr(80, 300, 920, 940, 34), id = uid();
    let s = bg('#0B1430');
    let room = bg(C.bg2) + dots('M80 300H1000V1240H80Z', { c: C.ink, step: 20, x0: 540, y0: 300, x1: 540, y1: 1240, op: .25 });
    const sx = 150 + (cyc % 1) * 300, sy = 470 - Math.sin((cyc % 1) * Math.PI) * 120;
    room += windowF(300, 560, { w: 300, h: 340, sky, inner: `<circle cx="${R(sx - 300)}" cy="${R(sy - 560)}" r="40" fill="${day > .5 ? C.a3 : C.paper}"/>`, c: C.line });
    room += ink(D_.rr(690, 430, 210, 280, 10), { f: C.a2, c: C.line, w: 6 }) + tx('100K', 795, 600, { f: 'O', s: 64, w: 700, c: C.paper });
    const tired = kc > .55 ? .45 : 0, bl = (t % 3.1 < .12) ? 1 : tired;
    room += bust(540, 1250, { s: .96, f: C.a1, hairC: '#6B4426', blink: bl, talk: t > t0 && t < th + .3 ? (Math.sin(t * 19) + 1) / 2 : 0, brows: kc > .55 ? .5 : 0 });
    room += fill(D_.rr(330, 1080, 420, 120, 60), C.ink, .9) + odo(100000 * kc, 540, 1170, { s: 96, c: C.a3 });
    s += `<clipPath id="${id}"><path d="${vf}"/></clipPath><g clip-path="url(#${id})">${room}</g>` + line(vf, 1, { c: C.line, w: 6, op: .6 });
    for (const [x, y, sx2, sy2] of [[110, 330, 1, 1], [970, 330, -1, 1], [110, 1210, 1, -1], [970, 1210, -1, -1]]) s += line(`M${x} ${y + sy2 * 70}V${y}H${x + sx2 * 70}`, 1, { c: C.paper, w: 9 });
    s += `<circle cx="150" cy="380" r="13" fill="${C.a2}" opacity="${t % 1 < .6 ? 1 : .15}"/>` + tx('REC', 175, 393, { f: 'O', s: 40, w: 500, c: C.paper, a: 'start' });
    const hrs = 40 * kc, hh = Math.floor(hrs), mm = Math.floor((hrs % 1) * 60), ss = Math.floor(((hrs * 60) % 1) * 60);
    s += tx(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`, 940, 393, { f: 'O', s: 40, w: 500, c: C.paper, a: 'end' });
    s += tx(L('JAN 2017'), 540, 393, { f: 'O', s: 40, w: 500, c: C.a3, op: E(t, T.c('january', 0, 1), .4), ls: 3 });
    const k40 = E(t, th - .2, .5, 'back');
    if (k40 > 0) s += g(ink(D_.rr(-150, -60, 300, 120, 60), { f: C.a2, c: C.line, w: 7 }) + tx(L('≈ 40 h', '≈ 40 ч'), 0, 26, { f: 'O', s: 70, w: 700, c: C.paper }), at(800, 900, k40, 6));
    return g(s, cam(t, T, .05));
  };

  // ——— лес: 20 млн деревьев (сажают всё быстрее)
  D.forest = (t, S, T) => {
    let s = bg('#BFDCEB') + fill(D_.circ(840, 470, 110), '#FFE6A8') + fill(D_.circ(840, 470, 150), '#FFE6A8', .35);
    s += fill('M0 1000C300 950 700 980 1080 940V1920H0Z', '#7CC08F') + fill('M0 1120C320 1080 760 1110 1080 1080V1920H0Z', '#5DAA74');
    s += dots('M0 1120C320 1080 760 1110 1080 1080V1400H0Z', { c: '#2E6B45', step: 16, x0: 540, y0: 1080, x1: 540, y1: 1400, op: .5 });
    const rows = [[18, 985, .42], [11, 1070, .62], [7, 1215, .92]], all = [];
    rows.forEach(([n, y, sc], ri) => { for (let i = 0; i < n; i++) all.push({ x: (i + .5) * 1080 / n + (ri % 2 ? 22 : 0), y, sc, id: ri * 30 + i }) });
    const ord = all.map((q, i) => [rnd(q.id * 3.1), i]).sort((a, b) => a[0] - b[0]);
    const t0 = T.a + .3, t1 = T.c('trees', 0, 4) + .2;
    let planted = 0;
    ord.forEach(([_, i], j) => { const q = all[i]; q.t = t0 + (t1 - t0) * Math.pow(j / all.length, .55); });
    for (const q of all) { const k = E(t, q.t, .45, 'back'); if (k > 0) { planted++; s += tree(q.x, q.y + rnd(q.id) * 14, q.sc * k, { c: C.ink, f: ['#4FA36B', '#3E9460', '#62B47A'][q.id % 3] }) } }
    s += odo(20000000 * EZ.io(planted / all.length), 540, 430, { s: 128, c: C.ink });
    s += cap(L('trees'), 540, 500, { c: C.ink });
    return g(s, cam(t, T, .04, 540, 1000));
  };

  // ——— игры: 456 игроков, $456 000
  D.games = (t, S, T) => {
    let s = bg(C.bg);
    const cols = 24, rows = 19, sp = 36, x0 = 540 - (cols - 1) * sp / 2, y0 = 470, tv = T.v, tp = T.s(1);
    let n = 0;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const id = j * cols + i, k = E(t, tv + id * .0025, .25, 'back'), win = id === 233;
      const gone = !win && t > tp + .2 + rnd(id) * 2.2;
      if (k <= 0 || gone) continue;
      n++;
      s += `<circle cx="${R(x0 + i * sp)}" cy="${R(y0 + j * sp)}" r="${R(12 * k * (win && t > tp + 1.8 ? 1.6 : 1))}" fill="${win && t > tp ? C.a3 : C.teal}"/>`;
    }
    const ks = E(t, T.c('squid', 0, 1.5) - .1, .7);
    s += g(line(D_.circ(-170, 0, 50), ks, { c: C.a2, w: 10 }) + line(D_.poly([[0, -52], [56, 44], [-56, 44]]), ks, { c: C.a2, w: 10 }) + line(D_.rr(120, -50, 100, 100, 4), ks, { c: C.a2, w: 10 }), at(540, 340));
    if (t > tp - .1) {
      const kp = E(t, tp, 1.4, 'o5');
      s += fill(D_.rr(90, 1090, 900, 170, 85), C.ink, .92) + odo(456000 * kp, 540, 1210, { s: 120, c: C.a3, pre: '$' });
    } else s += tx(String(n), 540, 1215, { f: 'O', s: 120, w: 700, c: C.paper });
    return g(s, cam(t, T, .04));
  };

  // ——— паспорт
  D.pass = (t, S, T) => {
    let s = bg(C.paper);
    const tp = T.c('passport', 0, 1.6), ko = E(t, tp - .15, .7, 'io'), cx = 540, cy = 800;
    // внутренняя страница
    s += ink(D_.rr(cx - 300, cy - 380, 600, 760, 22), { f: '#FBF7EE', c: C.ink, w: 7 });
    s += ink(D_.rr(cx - 240, cy - 300, 210, 260, 14), { f: '#DCE8F7', c: C.ink, w: 6 }) + g(ink(D_.circ(0, -40, 46), { f: C.ink, c: null, dx: 0, dy: 0 }) + fill('M-88 70C-88 10 -50 0 0 0C50 0 88 10 88 70Z', C.ink), at(cx - 135, cy - 140));
    for (let i = 0; i < 5; i++) s += line(`M${cx + 10} ${cy - 270 + i * 50}H${cx + 240 - (i % 2) * 60}`, 1, { c: C.ink, w: 8, op: .3 });
    s += tx('MB · 00522000000', cx, cy + 300, { f: 'O', s: 40, w: 500, c: C.ink, op: .55, ls: 3 });
    s += stamp(L('SUBSCRIBED'), cx + 60, cy + 120, t, tp + .7, { c: C.a2, s: 70, r: -12 });
    // обложка открывается (сжимается к левому краю)
    const sx = lerp(1, -1, ko);
    if (sx > -.98) {
      const front = sx > 0;
      let cov = ink(D_.rr(0, -380, 600, 760, 22), { f: front ? C.bg2 : '#22336B', c: C.ink, w: 7 });
      if (front) cov += line(D_.circ(300, -60, 110), 1, { c: C.a3, w: 6 }) + line('M190 -60H410M300 -170C250 -120 250 0 300 50C350 0 350 -120 300 -170', 1, { c: C.a3, w: 5 }) + tx(L('PASSPORT'), 300, 160, { f: 'O', s: 64, w: 500, c: C.a3, ls: 8 });
      s += g(cov, `translate(${cx - 300} ${cy}) scale(${R(Math.abs(sx) * 1000) / 1000} 1)`);
    }
    return g(s, cam(t, T, .05));
  };

  // ——— 1 из 16
  D.earth = (t, S, T) => {
    let s = bg(C.bg);
    const t1 = T.c('one', 0, .4), th = T.c('16', 0, 1.6);
    for (let i = 0; i < 16; i++) {
      const x = 225 + (i % 4) * 210, y = 470 + Math.floor(i / 4) * 200, k = E(t, T.a + i * .05, .45, 'back'), hi = i === 9;
      const col = hi && t > th - .2 ? C.a2 : C.bg2;
      s += g(ink(D_.circ(0, -58, 34), { f: col, c: C.line, w: 6, dx: 6, dy: 5 }) + ink('M-62 30C-62 -18 -34 -22 0 -22C34 -22 62 -18 62 30Z', { f: col, c: C.line, w: 6, dx: 6, dy: 5 }), at(x, y + (hi ? -E(t, th, .4, 'back') * 16 : 0), k * (hi && t > th ? 1.15 : 1)));
    }
    s += odo(1, 410, 1290, { s: 100, c: C.a2, a: 'end' }) + tx('/ 16', 440, 1290, { f: 'O', s: 100, w: 700, c: C.paper, a: 'start', op: E(t, t1, .4) });
    return g(s, cam(t, T, .04));
  };

  // ——— гимн: касса
  D.anthem = (t, S, T) => {
    const tc = T.c('cash', 0, 1.6), ko = E(t, tc, .35, 'back'), cx = 540, cy = 860;
    let s = bg(C.a1) + dots('M0 300H1080V1300H0Z', { c: C.ink, step: 22, x0: 540, y0: 1300, x1: 540, y1: 300, op: .16 });
    for (let i = 0; i < 7; i++) { // ноты
      const lt = t - tc - i * .32; if (lt < 0) continue;
      const k = clamp(lt / 2.2), x = cx + (rnd(i) - .5) * 600 + wob(t, .8, 40, i), y = cy - 260 - k * 700;
      s += g(`<ellipse cx="0" cy="0" rx="26" ry="20" transform="rotate(-20)" fill="${C.paper}"/><path d="M22 -6V-110L70 -90" stroke="${C.paper}" stroke-width="9" fill="none" stroke-linecap="round"/>`, at(x, y, 1, wob(t, .6, 14, i)), 1 - k);
    }
    let reg = ink('M-300 -160L300 -160L340 200L-340 200Z', { f: C.paper, c: C.ink, w: 8 });
    reg += ink(D_.rr(-220, -380, 440, 170, 18), { f: C.ink, c: C.ink, w: 8 }) + tx('$$$', 0, -270, { f: 'O', s: 80, w: 700, c: C.a3 });
    for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) reg += ink(D_.rr(-250 + i * 104, -120 + j * 92, 84, 64, 12), { f: (i + j) % 4 ? '#E7DFD0' : C.a2, c: C.ink, w: 5, dx: 4, dy: 4 });
    reg += ink(D_.rr(-360, 200 + ko * 70, 720, 120, 12), { f: '#D9CFBD', c: C.ink, w: 8 }) + fill(D_.rr(-60, 240 + ko * 70, 120, 26, 13), C.ink);
    for (let i = 0; i < 6; i++) { const lt = t - tc - i * .07; if (lt < 0) continue; const k = clamp(lt / .9), x = (i - 2.5) * 110 * k, y = 230 - Math.sin(k * Math.PI) * 420 + k * 120; reg += g(ink(D_.circ(0, 0, 34), { f: C.a3, c: C.ink, w: 6, dx: 4, dy: 4 }) + tx('$', 0, 14, { f: 'O', s: 40, w: 700, c: C.ink }), at(x, y, 1, k * 360), 1 - clamp((k - .85) * 6)) }
    s += g(reg, at(cx, cy + wob(t, 6, ko * (1 - E(t, tc + .3, .5)) * 6)));
    s += burst(cx, cy + 260, t, tc, { c: C.a3, r0: 300, r1: 470, n: 12 });
    return g(s, cam(t, T, .05));
  };

  // ——— праздник: календарь и салют
  D.holiday = (t, S, T) => {
    let s = bg(C.paper);
    const th = T.c('holiday', 0, 1.5), cx = 540, cy = 860;
    const fw = (x, y, t0, col) => { let q = ''; const k = P01(t, t0, 1.1); if (k <= 0 || k >= 1) return ''; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r0 = 30 + 170 * EZ.o(k), r1 = r0 + 40 * (1 - k); q += `<path d="M${R(x + Math.cos(a) * r0)} ${R(y + Math.sin(a) * r0 + k * k * 60)}L${R(x + Math.cos(a) * r1)} ${R(y + Math.sin(a) * r1 + k * k * 60)}" stroke="${col}" stroke-width="9" stroke-linecap="round"/>` } return q };
    s += fw(250, 380, th - .2, C.a2) + fw(800, 330, th + .15, C.a1) + fw(560, 250, th + .5, C.a3) + fw(220, 280, th + .9, C.a1);
    s += ink(D_.rr(cx - 330, cy - 330, 660, 700, 26), { f: '#FFFFFF', c: C.ink, w: 8 }) + ink(D_.rr(cx - 330, cy - 330, 660, 150, 26), { f: C.a2, c: C.ink, w: 8 });
    s += tx(L('UPLOAD DAY'), cx, cy - 235, { f: 'O', s: 64, w: 700, c: C.paper, ls: 4 });
    for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) {
      const d = j * 6 + i + 1, x = cx - 250 + i * 100, y = cy - 90 + j * 115, on = (d * 7) % 5 === 1;
      s += tx(String(d), x, y + 18, { f: 'O', s: 52, w: 500, c: C.ink, op: .75 });
      if (on) s += line(D_.ell(x, y, 46, 40), E(t, th - .3 + d * .03, .4), { c: C.a2, w: 7 });
    }
    return g(s, cam(t, T, .05));
  };

  // ——— финал
  D.next = (t, S, T) => {
    let s = bg(C.bg) + fill(D_.circ(540, 760, 380), C.bg2);
    s += flag(330, 1000, t, { f: C.a2, c: C.line, s: 1.35, emb: `<path d="${D_.star(0, 0, 34, 14)}" fill="${C.paper}"/>` });
    s += follow(600, 1100, t, T.v - .1, { f: C.a2 });
    s += cap(L('citizens first'), 540, 420, { c: C.a1, op: E(t, T.v, .5) });
    return g(s, cam(t, T, .05));
  };

  window.EP = {
    P: C, D,
    tr: { title: 'wipe', money: 'zoom', claim: 'push', subs: 'up', usa: 'push', rank: 'iris', legend: 'push', forest: 'wipe', games: 'zoom', pass: 'push', earth: 'iris', anthem: 'push', holiday: 'fade' },
    trAt: { money: [600, 700], rank: [540, 830], earth: [645, 870], games: [540, 900] },
    trCol: { title: C.a2, forest: C.a1, rank: C.a2, earth: C.a2 },
    cap: { hi: C.a3 },
  };
})();
