// Мифы о ВИЧ (второй формат, как ролик про касаток): светлая «газетная» подача, крупный текст, штамп FALSE.
(function () {
  const C = { bg: '#F4EFE6', bg2: '#E9E1D2', ink: '#17182B', paper: '#FFFFFF', line: '#17182B', a1: '#E5383B', a2: '#2A9D8F', a3: '#F2B134', pink: '#F4A3A8', skin: '#E9B48F' };
  P = C;
  const cam = (t, T, a = .04, cx = 540, cy = 820) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {};
  function wrap(str, maxW, o) { const ws = str.split(' '), out = []; let cur = ''; for (const w of ws) { const nx = cur ? cur + ' ' + w : w; if (tw(nx, o) > maxW && cur) { out.push(cur); cur = w } else cur = nx } if (cur) out.push(cur); return out }
  // плашка-миф: номер, текст с маркером; strike — зачёркнуто
  function card(n, text, t, t0, o = {}) {
    const y0 = o.y ?? 470, fo = { f: 'M', w: 800, s: o.s || 78 }, lines = wrap(text, 860, fo), lh = fo.s * 1.18;
    let s = tx('0' + n, 110, y0 - 40, { f: 'O', s: 120, w: 700, c: C.a1, a: 'start', op: E(t, t0, .35) }) + cap(L('myth'), 250, y0 - 70, { c: C.ink, a: 'start', op: E(t, t0 + .1, .35), s: 28 });
    lines.forEach((ln, i) => { const y = y0 + 110 + i * lh, wv = tw(ln, fo), km = E(t, t0 + .25 + i * .18, .45, 'o5'); s += fill(D_.rr(100 - 10, y - fo.s * .62, (wv + 20) * km, fo.s * .7, 6), C.a3, .85); s += tx(ln, 100, y, { ...fo, c: C.ink, a: 'start', op: E(t, t0 + .1 + i * .12, .3) }) });
    if (o.strike) lines.forEach((ln, i) => { const y = y0 + 110 + i * lh - fo.s * .3, wv = tw(ln, fo); s += line(`M90 ${R(y)}L${R(110 + wv)} ${R(y + 6)}`, clamp(o.strike * lines.length - i), { c: C.a1, w: 10 }) });
    return { s, h: 110 + lines.length * lh, y0 }
  }
  function mosquito(x, y, s, t) {
    let q = '';
    for (const sx of [-1, 1]) q += ink(D_.ell(sx * 70, -40 + Math.sin(t * 40) * 6, 90, 34), { f: '#DCE8F2', c: C.ink, w: 5, dx: 3, dy: 3, op: .9 });
    q += line('M-40 20L-120 110L-130 170M0 30L-30 140L-20 200M40 20L110 110L140 160', 1, { c: C.ink, w: 5 });
    q += ink(D_.ell(0, 30, 30, 120), { f: '#3A3A4E', c: C.ink, w: 6, dx: 3, dy: 3 }) + ink(D_.circ(0, -110, 32), { f: '#3A3A4E', c: C.ink, w: 6, dx: 3, dy: 3 }) + line('M0 -140L0 -260', 1, { c: C.ink, w: 6 }) + line('M-50 60H50M-46 100H46M-40 130H40', 1, { c: '#8C8FA8', w: 5 });
    return g(q, at(x, y, s))
  }
  const lips = (x, y, s) => g(ink('M-120 0C-80 -60 -30 -40 0 -20C30 -40 80 -60 120 0C80 70 -80 70 -120 0Z', { f: C.a1, c: C.ink, w: 7 }) + line('M-120 0C-60 16 60 16 120 0', 1, { c: C.ink, w: 6 }), at(x, y, s));
  const cup = (x, y, s) => g(ink('M-70 -90H70L56 90H-56Z', { f: '#FFFFFF', c: C.ink, w: 7 }) + ink('M64 -40C130 -40 130 40 60 40', { f: 'none', c: C.ink, w: 9, dx: 0, dy: 0 }) + fill('M-62 -30H62L56 20H-56Z', C.a2, .5), at(x, y, s));
  const seat = (x, y, s) => g(ink(D_.ell(0, 0, 110, 140), { f: '#FFFFFF', c: C.ink, w: 8 }) + ink(D_.ell(0, 10, 60, 86), { f: C.bg, c: C.ink, w: 6, dx: 0, dy: 0 }) + ink(D_.rr(-80, -200, 160, 70, 14), { f: '#FFFFFF', c: C.ink, w: 7 }), at(x, y, s));
  const hug = (x, y, s) => g(ink(D_.circ(-40, -90, 44), { f: C.skin, c: C.ink, w: 6 }) + ink(D_.circ(50, -80, 44), { f: '#B98A6A', c: C.ink, w: 6 }) + ink('M-110 80C-110 -20 -70 -36 -40 -36C-10 -36 30 -30 40 80Z', { f: C.a2, c: C.ink, w: 6 }) + ink('M-10 80C0 -20 30 -30 50 -30C90 -30 120 -10 120 80Z', { f: C.pink, c: C.ink, w: 6 }) + line('M-70 10C-20 40 60 40 100 0', 1, { c: C.ink, w: 7 }), at(x, y, s));
  const drop = (x, y, s, col, lab) => g(ink(D_.drop(0, 0, 60), { f: col, c: C.ink, w: 6 }) + tx(lab, 0, 120, { f: 'O', s: 40, w: 500, c: C.ink }), at(x, y, s));
  const check = (x, y, k, ok = true) => k > 0 ? g(ink(D_.circ(0, 0, 34), { f: ok ? C.a2 : C.a1, c: C.ink, w: 5, dx: 3, dy: 3 }) + line(ok ? 'M-14 0L-4 12L16 -12' : 'M-12 -12L12 12M12 -12L-12 12', 1, { c: '#FFFFFF', w: 7 }), at(x, y, EZ.back(k))) : '';
  const FALSE_ = (t, t0, y = 560) => stamp(L('FALSE'), 760, y, t, t0, { c: C.a1, s: 104, r: -10 });

  D.hook = (t, S, T) => {
    let s = bg(C.bg) + dots('M0 0H1080V1920H0Z', { c: '#D8CDB8', step: 24, x0: 540, y0: 1400, x1: 540, y1: 200, op: .6, bb: [0, 200, 1080, 1200] });
    const tk = T.c('knows', 0, 3.6);
    for (let i = 0; i < 4; i++) { const k = E(t, T.a + .2 + i * .22, .45, 'back'); s += g(ink(D_.rr(-150, -210, 300, 420, 22), { f: '#FFFFFF', c: C.ink, w: 7 }) + fill(D_.rr(-150, -210, 300, 80, 22), C.a1) + tx(L('MYTH'), 0, -152, { f: 'O', s: 48, w: 700, c: '#FFFFFF', ls: 4 }) + tx('0' + (i + 1), 0, 80, { f: 'O', s: 160, w: 700, c: C.ink }), at(250 + i * 75, 780 + i * 26, k, -12 + i * 6)) }
    const kq = E(t, tk - .3, .5, 'back');
    s += g(ink(D_.rr(-150, -210, 300, 420, 22), { f: C.a2, c: C.ink, w: 7 }) + tx('?', 0, 70, { f: 'U', s: 200, w: 800, c: '#FFFFFF' }), at(820, 800, kq, 10));
    s += tx('HIV', 540, 400, { f: 'U', s: 110, w: 800, c: C.ink, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .05));
  };

  const mythScene = (n, text, art) => (t, S, T) => {
    let s = bg(C.bg);
    const c = card(n, text, t, T.a);
    s += c.s + art(t, T, c.y0 + c.h + 60);
    return g(s, cam(t, T, .04))
  };
  D.m1 = mythScene(1, L('Mosquitoes can spread HIV.'), (t, T, y) => mosquito(540, y + 230, 1.3 * E(t, T.a + .3, .5, 'back'), t));
  D.m2 = mythScene(2, L('You can get it from a kiss, a hug or a toilet seat.'), (t, T, y) => lips(230, y + 150, E(t, T.c('kiss', 0, .6), .4, 'back')) + hug(560, y + 190, E(t, T.c('hug', 0, 1), .4, 'back')) + seat(870, y + 170, .8 * E(t, T.c('toilet', 0, 1.5), .4, 'back')));
  D.m3 = mythScene(3, L('You can tell by looking.'), (t, T, y) => { let q = ''; const k = E(t, T.a + .2, .5, 'back'); q += bust(540, y + 520, { s: .8 * k, f: C.a2, c: C.ink, skin: C.skin, mood: 'smile', hairC: '#2E2018', hair: 'curly' }); const kl = E(t, T.a + .5, .6, 'io'); q += g(line(D_.circ(0, 0, 120), 1, { c: C.ink, w: 16 }) + line('M85 85L190 190', 1, { c: C.ink, w: 30 }), at(lerp(900, 640, kl), y + 160)); return q });
  D.m4 = mythScene(4, L("It's a death sentence."), (t, T, y) => { const k = E(t, T.a + .2, .5, 'back'); return g(ink('M-120 -170H120V-140C120 -60 30 -30 30 0C30 30 120 60 120 140V170H-120V140C-120 60 -30 30 -30 0C-30 -30 -120 -60 -120 -140Z', { f: '#FFFFFF', c: C.ink, w: 8 }) + fill(`M-90 ${R(-140 + E(t, T.a, 2) * 100)}H90C80 -70 20 -40 0 -10C-20 -40 -80 -70 -90 ${R(-140 + E(t, T.a, 2) * 100)}Z`, C.a3) + fill(`M-80 150H80C60 ${R(120 - E(t, T.a, 2) * 80)} -60 ${R(120 - E(t, T.a, 2) * 80)} -80 150Z`, C.a3), at(540, y + 220, k, wob(t, .4, 3))) });

  const factScene = (n, text, art) => (t, S, T) => {
    let s = bg(C.bg);
    const ku = E(t, T.a + .1, .5, 'io'), c = card(n, text, t, -10, { strike: E(t, T.a + .45, .5), s: lerp(78, 54, ku), y: lerp(470, 360, ku) });
    s += c.s + FALSE_(t, T.a + .05, lerp(560, 430, ku)) + art(t, T, c.y0 + c.h + 70);
    return g(s, cam(t, T, .04))
  };
  D.m1f = factScene(1, L('Mosquitoes can spread HIV.'), (t, T, y) => {
    let q = mosquito(320, y + 260, 1.05, t);
    const kb = E(t, T.c('inject', 0, 1.4), .5), kv = E(t, T.c('multiply', 0, 4), .5);
    q += g(line('M0 0H200', kb, { c: C.ink, w: 8 }) + fill('M200 -18L236 0L200 18Z', C.ink, kb) + tx(L('no blood back'), 250, 14, { f: 'O', s: 46, w: 500, c: C.ink, a: 'start', op: kb }), at(420, y + 140)) + check(420 + 0, y + 140, kb, false);
    q += g(virusMini(0, 0, 50, t) + tx(L("can't multiply"), 80, 16, { f: 'O', s: 46, w: 500, c: C.ink, a: 'start' }), at(500, y + 380), kv) + check(500, y + 380 - 70, kv, false);
    return q
  });
  D.m2f = factScene(2, L('You can get it from a kiss, a hug or a toilet seat.'), (t, T, y) => {
    let q = ''; const it = [[200, L('saliva'), '#BFE3F2'], [420, L('sweat'), '#D8EEF7'], [640, L('tears'), '#9AD3F5']];
    it.forEach(([x, lab, col], i) => { const k = E(t, T.c(['saliva', 'sweat', 'tears'][i], 0, 1 + i * .5), .4, 'back'); q += g(drop(0, 0, 1, col, lab), at(x, y + 200, k)) + check(x + 60, y + 130, k) });
    const kc = E(t, T.c('cups', 0, 3.5), .4, 'back'); q += g(cup(0, 0, 1), at(880, y + 210, kc)) + check(940, y + 110, kc);
    return q
  });
  function virusMini(x, y, r, t) { let q = ''; for (let i = 0; i < 10; i++) { const a = (i / 10 * 360 + t * 15) * Math.PI / 180; q += `<circle cx="${R(x + Math.cos(a) * r * 1.3)}" cy="${R(y + Math.sin(a) * r * 1.3)}" r="${R(r * .16)}" fill="${C.a1}"/>` } return q + ink(D_.circ(x, y, r), { f: C.pink, c: C.ink, w: 5, dx: 3, dy: 3 }) }
  D.m3f = factScene(3, L('You can tell by looking.'), (t, T, y) => {
    let q = ''; const tn = T.c('ten', 0, 3);
    for (let i = 0; i < 10; i++) { const x = 160 + (i % 5) * 190, yy = y + 120 + Math.floor(i / 5) * 250, k = E(t, T.a + .6 + i * .05, .35, 'back'), hi = i === 7 && t > tn - .2; q += g(ink(D_.circ(0, -60, 40), { f: hi ? C.a1 : '#FFFFFF', c: C.ink, w: 6 }) + ink('M-66 50C-66 -10 -36 -16 0 -16C36 -16 66 -10 66 50Z', { f: hi ? C.a1 : '#FFFFFF', c: C.ink, w: 6 }) + (hi ? tx('?', 60, -80, { f: 'U', s: 60, w: 800, c: C.a1 }) : ''), at(x, yy, k)) }
    q += tx(L('1 in 10+ don’t know'), 540, y + 650, { f: 'O', s: 64, w: 700, c: C.a1, op: E(t, tn, .4) });
    return q
  });
  D.m4f = factScene(4, L("It's a death sentence."), (t, T, y) => {
    let q = ''; const kl = E(t, T.c('live', 0, 3), 1.4, 'io');
    q += tx(L('life expectancy'), 100, y + 40, { f: 'O', s: 46, w: 500, c: C.ink, a: 'start' });
    q += ink(D_.rr(100, y + 90, 860 * kl, 90, 45), { f: C.a2, c: C.ink, w: 6 }) + tx(L('with treatment'), 130, y + 150, { f: 'M', s: 36, w: 800, c: '#FFFFFF', a: 'start', op: kl });
    q += ink(D_.rr(100, y + 220, 880 * kl, 90, 45), { f: '#C9C2B4', c: C.ink, w: 6 }) + tx(L('everyone else'), 130, y + 280, { f: 'M', s: 36, w: 800, c: C.ink, a: 'start', op: kl });
    q += capsule(800, y + 470, { f: '#FFFFFF', f2: C.a2, c: C.ink, s: E(t, T.c('treatment', 0, 2), .5, 'back'), r: -20 });
    return q
  });

  D.uu = (t, S, T) => {
    let s = bg(C.a2);
    const k = E(t, T.a, .6, 'back');
    s += dots('M0 0H1080V1920H0Z', { c: '#1F7D72', step: 22, x0: 540, y0: 1400, x1: 540, y1: 300, op: .5, bb: [0, 300, 1080, 1100] });
    s += g(ink(D_.circ(-110, 0, 210), { f: '#FFFFFF', c: C.ink, w: 9 }) + ink(D_.circ(110, 0, 210), { f: C.pink, c: C.ink, w: 9 }) + line(D_.circ(-110, 0, 210), 1, { c: C.ink, w: 9 }) + tx('U = U', 0, 50, { f: 'U', s: 120, w: 800, c: C.ink }), at(540, 760, k));
    s += cap(L('undetectable = untransmittable'), 540, 1120, { c: C.ink, s: 30, ls: 3, op: E(t, T.c('U', 0, 4), .5) });
    return g(s, cam(t, T, .05));
  };

  D.true = (t, S, T) => {
    let s = bg(C.bg) + dots('M0 0H1080V1920H0Z', { c: '#D8CDB8', step: 24, x0: 540, y0: 1400, x1: 540, y1: 200, op: .6, bb: [0, 200, 1080, 1200] });
    const kf = E(t, T.a + .4, .8, 'io'), sx = Math.abs(Math.cos(kf * Math.PI)), back = kf < .5;
    s += g(ink(D_.rr(-220, -310, 440, 620, 30), { f: back ? C.a2 : '#FFFFFF', c: C.ink, w: 8 }) + (back ? tx('?', 0, 100, { f: 'U', s: 280, w: 800, c: '#FFFFFF' }) : tx(L('FACT'), 0, -200, { f: 'O', s: 60, w: 700, c: C.a2, ls: 6 }) + tx('PEP', 0, 80, { f: 'U', s: 150, w: 800, c: C.ink })), `translate(540 820) scale(${R(Math.max(.02, sx) * 1000) / 1000} 1)`);
    return g(s, cam(t, T, .05));
  };

  D.pep = (t, S, T) => {
    let s = bg(C.bg);
    const t72 = T.c('72', 0, 3), kc = E(t, t72 - .2, .5, 'back');
    let bot = ink(D_.rr(-130, -170, 260, 340, 30), { f: '#FFFFFF', c: C.ink, w: 8 }) + ink(D_.rr(-150, -230, 300, 80, 16), { f: C.a2, c: C.ink, w: 7 }) + fill(D_.rr(-100, -90, 200, 150, 12), C.bg2) + tx('PEP', 0, 10, { f: 'U', s: 70, w: 800, c: C.ink }) + tx(L('28 days'), 0, 60, { f: 'O', s: 34, w: 500, c: C.ink });
    s += g(bot, at(300, 820, E(t, T.c('pep', 0, 2) - .1, .5, 'back'), -6));
    const left = clamp(1 - Math.max(0, t - t72) / 6);
    s += g(line(D_.circ(0, 0, 190), 1, { c: '#D8CDB8', w: 30 }) + line(D_.arc(0, 0, 190, -90, -90 + 359.9 * left), 1, { c: C.a1, w: 30 }) + tx(String(Math.ceil(72 * left)), 0, 30, { f: 'O', s: 140, w: 700, c: C.ink }) + tx(L('hours'), 0, 100, { f: 'O', s: 44, w: 500, c: C.ink }), at(770, 820, kc));
    s += tx(L('the sooner, the better'), 540, 1210, { f: 'O', s: 60, w: 700, c: C.a1, op: E(t, T.c('sooner', 0, 6), .4) });
    s += cap(L('emergency pills'), 540, 400, { c: C.ink, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .04));
  };

  D.end = (t, S, T) => {
    let s = bg(C.a3);
    const k = E(t, T.a, .5, 'back'), tap = E(t, T.c('save', 0, .2) + .5, .2) * (1 - E(t, T.c('save', 0, .2) + .75, .3));
    s += g(ink('M-120 -170H120V190L0 100L-120 190Z', { f: tap > .1 || t > T.c('save', 0, .2) + .7 ? '#FFFFFF' : C.ink, c: C.ink, w: 10 }), at(540, 800, k * (1 - tap * .12)));
    s += tx(L('SAVE'), 540, 1150, { f: 'U', s: 110, w: 800, c: C.ink, op: E(t, T.a + .2, .4) });
    return g(s, cam(t, T, .05));
  };

  window.EP = {
    P: C, D,
    tr: { hook: 'push', m1: 'cut', m1f: 'push', m2: 'cut', m2f: 'push', m3: 'cut', m3f: 'push', m4: 'cut', m4f: 'iris', uu: 'push', true: 'cut', pep: 'push' },
    trAt: { m4f: [540, 760] }, trCol: { m4f: C.a2 },
    cap: { hi: C.a1, st: '#17182B' },
  };
})();
