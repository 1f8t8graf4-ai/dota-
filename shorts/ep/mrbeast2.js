// MrBeast v3: иллюстрации нейросетью (img/mrbeast/*.png, промты — shots/mrbeast.json) + движение поверх кодом.
(function () {
  const C = { bg: '#101B3B', bg2: '#182A5C', ink: '#0B1430', paper: '#F3EDE2', line: '#F3EDE2', a1: '#3D8BFF', a2: '#FF4E6A', a3: '#FFC53D', skin: '#E9B48F' };
  P = C;
  const I = id => 'img/mrbeast/' + id + '.png';
  const D = {};
  const flyBills = (t, t0, n, x0, y0) => { let s = ''; for (let i = 0; i < n; i++) { const lt = t - t0 - i * .18; if (lt < 0) continue; const k = clamp(lt / 1.6), x = x0 + (rnd(i) - .3) * 700 * EZ.o(k), y = y0 - 1200 * EZ.o(k) + k * k * 300; s += bill(x, y, { w: 170, c: C.ink, r: rnd(i + 5) * 360 * k, op: 1 - clamp((k - .8) * 5) }) } return s };

  D.title = (t, S, T) => pic(I('title'), t, T, { z0: 1.1, z1: 1.18, fy: 700 }) + shade(0, 520, '#000', 0) + g(fill(D_.rr(170, 250, 740, 150, 75), C.ink, .82) + odo(521999880 + t * 37, 540, 360, { s: 92, c: C.a3 }), '', E(t, 0, .4)) + cap(L('What do you know about'), 540, 470, { c: C.paper, op: E(t, .1, .4) }) + rise('MRBEAST?', 540, 1240, t, .2, { f: 'U', w: 800, s: 96, c: C.paper, st: C.ink, sw: 14 });
  D.money = (t, S, T) => pic(I('money'), t, T, { z0: 1.0, z1: 1.12, fy: 1100 }) + flyBills(t, T.a + .2, 9, 420, 1300);
  D.claim = (t, S, T) => { const tc = T.c('country', 0, 1.6), k3 = E(t, T.c('third', 0, .8) - .1, .5, 'back'); return pic(I('claim'), t, T, { z0: 1.0, z1: 1.2, fy: 760 }) + ringWave(540, 700, t, tc, { c: C.paper, r1: 600 }) + (k3 > 0 ? g(ink(D_.circ(0, 0, 105), { f: C.a3, c: C.ink, w: 8 }) + tx('#3', 0, 34, { f: 'O', w: 700, s: 100, c: C.ink }), at(820, 470, k3, -10)) : '') };
  D.subs = (t, S, T) => { const k = E(t, T.v, Math.max(.8, T.c('subscribers', 0, 2) - T.v), 'o5'); return pic(I('subs'), t, T, { z0: 1.0, z1: 1.16, fy: 900 }) + g(fill(D_.rr(110, 420, 860, 230, 40), C.ink, .85) + cap(L('subscribers'), 540, 480, { c: C.a1 }) + odo(522000000 * k, 540, 610, { s: 120, c: C.paper }), '', E(t, T.a, .4)) };
  D.usa = (t, S, T) => {
    const tu = T.c('united', 0, .2), tr = T.c('russia', 0, 2), tf = T.c('fewer', 0, 3);
    let s = pic(I('usa'), t, T, { z0: 1.05, z1: 1.15, fy: 800 });
    const row = (y, lab, val, col, t0) => { const k = E(t, t0, .45, 'o5'); return g(fill(D_.rr(120, y - 70, 840, 120, 60), C.ink, .86) + tx(lab, 170, y + 12, { f: 'O', s: 52, w: 500, c: C.paper, a: 'start' }) + tx(val, 910, y + 14, { f: 'O', s: 70, w: 700, c: col, a: 'end' }), `translate(${R((1 - k) * 900)} 0)`, k) };
    s += row(420, L('USA'), '342M', C.a1, tu) + row(560, '+ ' + L('RUSSIA'), '146M', C.a3, tr) + row(720, 'MRBEAST', '522M', C.a2, tf - .2);
    s += tx('488M < 522M', 540, 900, { f: 'U', s: 70, w: 800, c: C.paper, st: C.ink, sw: 14, op: E(t, tf, .4) });
    return s
  };
  D.rank = (t, S, T) => { const lab = (x, y, s0, n, t0, c0) => { const k = E(t, t0, .45, 'back'); return k > 0 ? g(fill(D_.rr(-150, -50, 300, 100, 50), C.ink, .85) + tx(s0, 0, 18, { f: 'O', s: 50, w: 700, c: c0 }), at(x, y, k)) : '' }; return pic(I('rank'), t, T, { z0: 1.0, z1: 1.1, fy: 900 }) + lab(540, 560, L('1 · INDIA'), 1, T.c('india', 0, .4), C.paper) + lab(250, 700, L('2 · CHINA'), 2, T.c('china', 0, .9), C.paper) + lab(830, 760, '3 · MRBEAST', 3, T.c('china', 0, .9) + .5, C.a2) };
  D.legend = (t, S, T) => {
    const t0 = T.c('counted', 0, 4), th = T.c('hours', 0, 7), kc = t < t0 ? 0 : E(t, t0, Math.max(1, th - t0), 'io');
    let s = pic(I('legend'), t, T, { z0: 1.02, z1: 1.16, fy: 900 });
    s += `<circle cx="120" cy="300" r="13" fill="${C.a2}" opacity="${t % 1 < .6 ? 1 : .15}"/>` + tx('REC', 145, 313, { f: 'O', s: 40, w: 500, c: C.paper, a: 'start' });
    s += cap(L('January 2017'), 540, 380, { c: C.paper, op: E(t, T.c('january', 0, 1), .4) });
    s += g(fill(D_.rr(240, 1060, 600, 150, 75), C.ink, .86) + odo(100000 * kc, 540, 1170, { s: 104, c: C.a3 }), '', E(t, T.v, .4));
    const k40 = E(t, th - .2, .5, 'back'); if (k40 > 0) s += g(ink(D_.rr(-150, -60, 300, 120, 60), { f: C.a2, c: C.paper, w: 7 }) + tx(L('≈ 40 h'), 0, 26, { f: 'O', s: 70, w: 700, c: C.paper }), at(800, 900, k40, 6));
    return s
  };
  D.forest = (t, S, T) => { const tp = T.c('plant', 0, 2.5), k = E(t, tp, Math.max(1, T.c('trees', 0, 4) - tp + .3), 'o5'); return pic(I('forest'), t, T, { z0: 1.0, z1: 1.14, x0: -40, x1: 40, fy: 800 }) + g(fill(D_.rr(150, 300, 780, 200, 40), C.ink, .82) + odo(20000000 * k, 540, 430, { s: 110, c: C.paper }) + cap(L('trees'), 540, 475, { c: C.a3, s: 24 }), '', E(t, T.a, .4)) };
  D.games = (t, S, T) => { const tp = T.s(1), kp = E(t, tp, 1.4, 'o5'); return pic(I('games'), t, T, { z0: 1.0, z1: 1.18, fy: 700 }) + g(fill(D_.rr(150, 1060, 780, 170, 85), C.ink, .88) + (t > tp - .1 ? odo(456000 * kp, 540, 1180, { s: 110, c: C.a3, pre: '$' }) : tx('456', 540, 1180, { f: 'O', s: 110, w: 700, c: C.paper })), '', E(t, T.v, .4)) };
  D.pass = (t, S, T) => pic(I('pass'), t, T, { z0: 1.0, z1: 1.14, fy: 850 }) + stamp(L('SUBSCRIBED'), 560, 900, t, T.c('passport', 0, 1.6) + .3, { c: C.a2, s: 76, r: -12 });
  D.earth = (t, S, T) => pic(I('earth'), t, T, { z0: 1.0, z1: 1.12, fy: 900 }) + g(fill(D_.rr(330, 1100, 420, 150, 75), C.ink, .86) + tx('1 / 16', 540, 1205, { f: 'O', s: 100, w: 700, c: C.a3 }), '', E(t, T.c('16', 0, 1.6) - .2, .4));
  D.anthem = (t, S, T) => { const tc = T.c('cash', 0, 1.6); let s = pic(I('anthem'), t, T, { z0: 1.0, z1: 1.14, fy: 900 }); for (let i = 0; i < 7; i++) { const lt = t - tc - i * .3; if (lt < 0) continue; const k = clamp(lt / 2.2), x = 540 + (rnd(i) - .5) * 600 + wob(t, .8, 40, i), y = 800 - k * 600; s += g(`<ellipse rx="26" ry="20" transform="rotate(-20)" fill="${C.paper}"/><path d="M22 -6V-110L70 -90" stroke="${C.paper}" stroke-width="9" fill="none" stroke-linecap="round"/>`, at(x, y), 1 - k) } return s + burst(540, 1000, t, tc, { c: C.a3, r0: 300, r1: 460, n: 12 }) };
  D.holiday = (t, S, T) => { const th = T.c('holiday', 0, 1.5), fw = (x, y, t0, col) => { let q = ''; const k = P01(t, t0, 1.1); if (k <= 0 || k >= 1) return ''; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r0 = 30 + 170 * EZ.o(k), r1 = r0 + 40 * (1 - k); q += `<path d="M${R(x + Math.cos(a) * r0)} ${R(y + Math.sin(a) * r0 + k * k * 60)}L${R(x + Math.cos(a) * r1)} ${R(y + Math.sin(a) * r1 + k * k * 60)}" stroke="${col}" stroke-width="9" stroke-linecap="round"/>` } return q }; return pic(I('holiday'), t, T, { z0: 1.0, z1: 1.12, fy: 600 }) + fw(250, 380, th - .2, C.a2) + fw(800, 330, th + .15, C.a1) + fw(560, 250, th + .5, C.a3) + fw(220, 280, th + .9, C.a1) };
  D.next = (t, S, T) => pic(I('next'), t, T, { z0: 1.0, z1: 1.1, fy: 700 }) + follow(540, 1150, t, T.v - .1, { f: C.a2 });

  window.EP = {
    P: C, D,
    tr: { title: 'zoom', money: 'push', claim: 'zoom', subs: 'up', usa: 'push', rank: 'iris', legend: 'push', forest: 'wipe', games: 'zoom', pass: 'push', earth: 'iris', anthem: 'push', holiday: 'fade' },
    trAt: { title: [540, 700], claim: [540, 700], rank: [830, 760], earth: [540, 900], games: [540, 700] },
    trCol: { forest: C.a1, rank: C.a2, earth: C.a2 },
    cap: { hi: C.a3 },
  };
})();
