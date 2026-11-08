// MrBeast v3: «он тихо строит свою страну». Иллюстрации — нейросеть (img/mrbeast/*.jpg, промты shots/mrbeast.json),
// поверх кодом: медленная камера, частицы и свет, табло с ключевыми числами, штампы, переходы.
(function () {
  const C = { bg: '#101B3B', bg2: '#182A5C', ink: '#0B1430', paper: '#F3EDE2', line: '#F3EDE2', a1: '#3D8BFF', a2: '#FF4E6A', a3: '#FFC53D', skin: '#E9B48F' };
  P = C;
  const I = id => 'img/mrbeast/' + id + '.jpg';
  const D = {};
  // пылинки в луче света — кадр живёт
  const motes = (t, n = 18, col = '#FFF6DD', y0 = 200, y1 = 1300) => { let s = ''; for (let i = 0; i < n; i++) { const ph = (t * (.04 + rnd(i) * .05) + rnd(i + 3)) % 1, x = 80 + rnd(i + 7) * 920 + Math.sin(t * .7 + i) * 20, y = y1 - ph * (y1 - y0); s += `<circle cx="${R(x)}" cy="${R(y)}" r="${R(2 + rnd(i + 11) * 4)}" fill="${col}" opacity="${R(Math.sin(ph * Math.PI) * 55) / 100}"/>` } return s };
  const panel = (x, y, w0, h0, inner, k = 1) => k > 0 ? g(fill(D_.rr(x - w0 / 2, y - h0 / 2, w0, h0, h0 / 2), C.ink, .86) + inner, '', k) : '';
  const big = (str, x, y, s0, col, o = {}) => tx(str, x, y, { f: 'O', s: s0, w: 700, c: col, st: C.ink, sw: 16, ...o });

  D.title = (t, S, T) => pic(I('title'), t, T, { z0: 1.12, z1: 1.2, fy: 600, y0: -30, y1: 0 }) + motes(t, 14, '#FFF6DD', 100, 900)
    + panel(540, 330, 760, 150, odo(521999880 + t * 37, 540, 372, { s: 90, c: C.a3 }), E(t, 0, .35))
    + cap(L('What do you know about'), 540, 1120, { c: C.paper, st: C.ink, op: E(t, .1, .4) }) + rise('MRBEAST?', 540, 1245, t, .15, { f: 'U', w: 800, s: 100, c: C.paper, st: C.ink, sw: 16 });

  D.money = (t, S, T) => pic(I('money'), t, T, { z0: 1.0, z1: 1.14, fy: 1100, y0: 40, y1: -20 }) + motes(t, 10, '#FFFFFF', 200, 1300);

  D.claim = (t, S, T) => { const tc = T.c('country', 0, 2); return pic(I('claim'), t, T, { z0: 1.0, z1: 1.28, fy: 620 }) + motes(t, 22, '#FFFFFF', 0, 1400) + ringWave(560, 520, t, tc, { c: C.paper, r1: 640 }) + burst(560, 520, t, tc, { c: C.a3, r0: 140, r1: 280 }) };

  D.census = (t, S, T) => {
    const t0 = T.c('counted', 0, 4), th = T.c('hours', 0, 7), kc = t < t0 ? 0 : E(t, t0, Math.max(1, th - t0), 'io');
    const kx = E(t, th - .4, 1.2, 'io');
    let s = pic(I('census_a'), t, T, { z0: 1.04, z1: 1.2, fy: 900, x0: 30, x1: -30 });
    if (kx > 0) s += g(pic(I('census_b'), t, T, { z0: 1.04, z1: 1.2, fy: 900, x0: 30, x1: -30 }), '', kx);
    s += `<circle cx="110" cy="300" r="13" fill="${C.a2}" opacity="${t % 1 < .6 ? 1 : .15}"/>` + tx('REC', 135, 313, { f: 'O', s: 40, w: 500, c: C.paper, a: 'start', st: C.ink, sw: 8 });
    const hrs = 40 * kc, hh = Math.floor(hrs), mm = Math.floor((hrs % 1) * 60), ss = Math.floor(((hrs * 60) % 1) * 60);
    s += tx(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`, 970, 313, { f: 'O', s: 40, w: 500, c: C.paper, a: 'end', st: C.ink, sw: 8 });
    s += cap('2017', 540, 313, { c: C.a3, s: 34, st: C.ink, op: E(t, T.c('2017', 0, 1), .4) });
    s += panel(540, 1160, 600, 150, odo(100000 * kc, 540, 1205, { s: 104, c: C.a3 }), E(t, T.v + .3, .4));
    const kt = E(t, T.c('training', 0, 9) - .1, .4, 'back');
    if (kt > 0) s += stamp('CENSUS', 760, 640, t, T.c('census', 1, 9) - .1, { c: C.a2, s: 78, r: -10 });
    return s
  };

  D.people = (t, S, T) => { const k = E(t, T.v, Math.max(.8, T.c('people', 0, 2.5) - T.v), 'o5'), kc = E(t, T.c('combined', 0, 5) - .1, .45, 'back'); return pic(I('people'), t, T, { z0: 1.0, z1: 1.22, fy: 1000 }) + panel(540, 330, 860, 170, odo(522000000 * k, 540, 380, { s: 110, c: C.paper }), E(t, T.a, .4)) + (kc > 0 ? g(fill(D_.rr(-300, -60, 600, 120, 60), C.a2) + tx('> USA + RUSSIA', 0, 22, { f: 'O', s: 56, w: 700, c: C.paper }), at(540, 520, kc, -3)) : '') };

  D.land = (t, S, T) => pic(I('land'), t, T, { z0: 1.0, z1: 1.25, fy: 760, x0: -40, x1: 40 }) + big('2022', 540, 330, 96, C.paper, { op: E(t, T.c('2022', 0, 1.2), .4) });

  D.forest = (t, S, T) => { const tp = T.c('plant', 0, 1.6), k = E(t, tp - .2, Math.max(1, T.c('trees', 0, 3) - tp + .4), 'o5'); return pic(I('forest'), t, T, { z0: 1.0, z1: 1.16, fy: 700, x0: 50, x1: -50 }) + panel(540, 330, 760, 160, odo(20000000 * k, 540, 376, { s: 100, c: C.ink }) , 0) + g(fill(D_.rr(160, 250, 760, 160, 80), '#FFFFFF', .88) + odo(20000000 * k, 540, 360, { s: 100, c: C.ink }) + cap(L('trees'), 540, 395, { c: '#2E6B45', s: 22 }), '', E(t, T.a, .4)) };

  D.water = (t, S, T) => pic(I('water'), t, T, { z0: 1.0, z1: 1.18, fy: 760 }) + g(fill(D_.rr(330, 250, 420, 160, 80), C.ink, .86) + tx('100', 540, 355, { f: 'O', s: 100, w: 700, c: '#7FD3F5' }), '', E(t, T.c('hundred', 0, 1.2) - .1, .4));

  D.army = (t, S, T) => { const t1 = T.c('thousand', 0, 1.5), t5 = T.c('five', 0, 3.5); return pic(I('army'), t, T, { z0: 1.0, z1: 1.2, fy: 700 }) + motes(t, 20, '#BFF3EC', 0, 1300) + panel(540, 1120, 520, 140, odo(1000 * E(t, t1 - .2, .8, 'o5'), 540, 1165, { s: 96, c: C.paper }), E(t, t1 - .2, .3)) + panel(540, 330, 760, 160, odo(5000000 * E(t, t5 - .2, 1.2, 'o5'), 540, 380, { s: 104, c: C.a3, pre: '$' }), E(t, t5 - .2, .3)) };

  D.anthem = (t, S, T) => { const tc = T.c('register', 0, 2); let s = pic(I('anthem'), t, T, { z0: 1.0, z1: 1.16, fy: 900 }); for (let i = 0; i < 8; i++) { const lt = t - T.a - .3 - i * .35; if (lt < 0) continue; const k = clamp(lt / 2.4), x = 640 + (rnd(i) - .5) * 520 + wob(t, .8, 40, i), y = 700 - k * 520; s += g(`<ellipse rx="24" ry="18" transform="rotate(-20)" fill="${C.a3}"/><path d="M20 -6V-100L64 -82" stroke="${C.a3}" stroke-width="9" fill="none" stroke-linecap="round"/>`, at(x, y), 1 - k) } return s + burst(640, 980, t, tc, { c: C.a3, r0: 220, r1: 380, n: 12 }) };

  D.button = (t, S, T) => { const tp = T.c('press', 0, 2.5), tz = T.c('citizen', 0, 4.5); let s = pic(I('button'), t, T, { z0: 1.0, z1: 1.3, fy: 760 }); s += ringWave(540, 780, t, tp, { c: C.a2, r1: 520 }) + ringWave(540, 780, t, tp + .3, { c: C.a2, r1: 640 }); const k = E(t, tz - .1, .45, 'back'); if (k > 0) s += g(fill(D_.rr(-260, -64, 520, 128, 64), C.a2) + tx(L('CITIZEN ✓'), 0, 24, { f: 'O', s: 64, w: 700, c: C.paper }), at(540, 1150, k, -3)); return s };

  D.you = (t, S, T) => { const glow = .5 + .5 * Math.sin(t * 3); return pic(I('you'), t, T, { z0: 1.0, z1: 1.12, fy: 600, x0: 20, x1: -20 }) + `<circle cx="770" cy="420" r="${R(180 + glow * 30)}" fill="${C.a2}" opacity="${R(.12 * glow * 100) / 100}"/>` + rise(L('BE HONEST.'), 540, 1200, t, T.v - .05, { f: 'U', w: 800, s: 90, c: C.paper, st: C.ink, sw: 16 }) };

  window.EP = {
    P: C, D,
    tr: { title: 'zoom', money: 'push', claim: 'zoom', census: 'push', people: 'zoom', land: 'push', forest: 'push', water: 'push', army: 'zoom', anthem: 'push', button: 'zoom' },
    trAt: { title: [540, 600], claim: [560, 520], people: [540, 1000], army: [540, 700], button: [540, 780] },
    trCol: {},
    cap: { hi: C.a3 },
  };
})();
