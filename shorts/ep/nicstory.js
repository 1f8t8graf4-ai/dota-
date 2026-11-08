// Макс и счётчик (второй формат, как klin_situation): «сколько он может без никотина» → «дней без никотина».
(function () {
  const C = { bg: '#161A26', bg2: '#232A45', ink: '#0C0F18', paper: '#F2EEE6', line: '#F2EEE6', a1: '#F2A33A', a2: '#E5484D', a3: '#2EC4A6', mango: '#FFB238', hood: '#5468FF', skin: '#E9B48F', hair: '#3B2A20', brick: '#8E4B3A', tile: '#9FB7C9' };
  P = C;
  const cam = (t, T, a = .05, cx = 540, cy = 860) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {}; let K = {};
  const max = (x, y, s, t, o = {}) => bust(x, y, Object.assign({ s, f: C.hood, hairC: C.hair, blink: (t % 3.4 < .12) ? 1 : 0 }, o));
  const vape = (x, y, s, r = 0) => g(ink(D_.rr(-48, -140, 96, 280, 30), { f: '#2C2F3A', c: C.line, w: 6 }) + fill(D_.rr(-30, -100, 60, 120, 14), C.mango) + ink('M-38 -140H38L32 -190H-32Z', { f: '#2C2F3A', c: C.line, w: 6 }) + `<circle cx="0" cy="100" r="9" fill="${C.a3}"/>`, at(x, y, s, r));
  const puff = (x, y, t, t0, n = 7, sc = 1) => { let s = ''; for (let i = 0; i < n; i++) { const k = clamp((t - t0 - i * .05) / 1.4); if (k <= 0 || k >= 1) continue; const a = rnd(i) * Math.PI * 2; s += `<circle cx="${R(x + Math.cos(a) * 120 * k * sc)}" cy="${R(y - 60 * k * sc + Math.sin(a) * 60 * k * sc)}" r="${R((30 + 60 * k) * sc)}" fill="#C9D3CE" opacity="${R((1 - k) * 60) / 100}"/>` } return s };
  const day = (n, t, t0, o = {}) => { const k = E(t, t0, .45, 'o5'); return k > 0 ? g(cap(L('day', 'день'), 0, -70, { c: o.c || C.a1, s: 30 }) + tx(String(n), 0, 30, { f: 'O', s: 110, w: 700, c: o.c2 || C.paper }), at(o.x || 200, o.y || 380), k) : '' };
  const room = () => bg(C.bg2) + dots('M0 0H1080V1300H0Z', { c: C.ink, step: 22, x0: 540, y0: 1300, x1: 540, y1: 0, op: .25, bb: [0, 0, 1080, 1300] });

  D.intro = (t, S, T) => {
    let s = room();
    s += windowF(260, 560, { w: 300, h: 360, sky: '#3D4A7A', inner: `<circle cx="60" cy="-60" r="40" fill="${C.paper}"/>`, c: C.line });
    s += max(560, 1300, 1.1, t, { mood: 'calm', look: .3 });
    const tn = T.c(L('number', 'цифра'), 0, 2.2), ka = E(t, tn, .5);
    if (ka > 0 && t < T.s(1) + .3) s += line('M760 520Q860 470 860 420', ka, { c: C.a1, w: 7, da: '2 16' });
    s += cap(L('Max, 15', 'Макс, 15'), 280, 1000, { c: C.paper, op: E(t, T.c('max', 0, .3), .4) });
    return g(s, cam(t, T, .05));
  };

  D.d1 = (t, S, T) => {
    let s = bg('#5A2E26');
    for (let r = 0; r < 18; r++) for (let i = -1; i < 7; i++) { const x = i * 170 + (r % 2 ? 85 : 0), y = r * 74; s += `<rect x="${x + 4}" y="${y + 4}" width="162" height="66" rx="6" fill="${(r * 7 + i) % 5 ? C.brick : '#A05846'}"/>` }
    s += dots('M0 0H1080V1400H0Z', { c: C.ink, step: 18, x0: 0, y0: 0, x1: 1080, y1: 1300, op: .35, bb: [0, 0, 1080, 1400] });
    const tc = T.c(L('coughs', 'кашляет'), 0, 3.2), ts = T.c(L('spins', 'кружится'), 0, 3.8), tl = T.c(L('laughs', 'ржут'), 0, 4.5);
    const spin = t > ts ? (t - ts) * 260 : 0;
    s += max(420, 1300, 1.05, t, { mood: t > tc ? 'o' : 'calm', look: .4, r: t > ts ? wob(t, 1.4, 4) : 0, sweat: t > tc ? t * 2 : 0 });
    if (t > ts) for (let i = 0; i < 3; i++) { const a = (spin + i * 120) * Math.PI / 180; s += `<path d="${D_.star(420 + Math.cos(a) * 170, 640 + Math.sin(a) * 50, 22, 9)}" fill="${C.mango}"/>` }
    const kh = E(t, T.c(L('passes', 'даёт'), 0, 1.2) - .3, .7, 'o5');
    s += g(hand(0, 0, 0, { s: 1.6, c: C.line, f: '#C98D6A', sleeve: '#2B3A55' }) + vape(170, -20, .9, 90), `translate(${R(lerp(1300, 860, kh))} 820) scale(-1 1)`);
    s += puff(560, 860, t, tc, 8, 1.2);
    for (let i = 0; i < 3; i++) { const k = E(t, tl + i * .18, .35, 'back'); if (k > 0) s += g(tx(L('HA', 'ХА'), 0, 0, { f: 'U', s: 70, w: 800, c: C.paper }), at([860, 960, 820][i], [420, 560, 650][i], k, [-10, 8, -4][i])) }
    s += day(1, t, T.v);
    return g(s, cam(t, T, .05));
  };

  D.brain = (t, S, T) => {
    let s = bg(C.bg);
    const hx = 470, hy = 900, sc = 2.05, td = T.c(L('dopamine', 'дофамина'), 0, 1.8), tn = T.c(L('note', 'пометку'), 0, 3.5);
    s += g(ink(HEAD, { f: C.bg2, c: C.line, w: 4 }), at(hx, hy, sc));
    s += brain(hx + 20, hy - 170, { s: 1.15, f: '#F2A7B5', glow: E(t, td - .2, .4) * (1 - E(t, td + 1.2, 1)) + .15, gc: C.mango });
    for (let i = 0; i < 18; i++) { const k = clamp((t - td - rnd(i) * .3) / 1.2); if (k <= 0 || k >= 1) continue; const a = rnd(i + 4) * Math.PI * 2; s += `<circle cx="${R(hx + 20 + Math.cos(a) * 280 * EZ.o(k))}" cy="${R(hy - 170 + Math.sin(a) * 200 * EZ.o(k))}" r="${R(14 * (1 - k))}" fill="${C.mango}"/>` }
    const kn = E(t, tn - .2, .5, 'back');
    if (kn > 0) { let note = ink(D_.rr(-170, -110, 340, 220, 14), { f: '#FFF6C9', c: C.ink, w: 6 }); note += tx(L('VAPE =', 'ВЕЙП ='), 0, -20, { f: 'O', s: 52, w: 700, c: C.ink }) + tx(L('GOOD ✓', 'КАЙФ ✓'), 0, 56, { f: 'O', s: 56, w: 700, c: C.a2 }); s += g(note, at(790, 600, kn, 8)) }
    return g(s, cam(t, T, .04));
  };

  D.d10 = (t, S, T) => {
    let s = room();
    const kb = E(t, T.v + .4, .6, 'o5');
    s += fill('M0 1060H1080V1920H0Z', '#3A3352') + line('M0 1060H1080', 1, { c: C.line, w: 6, op: .5 });
    s += vape(540, 930 - (1 - kb) * 300, 1.1, -8) + g(ink(D_.rr(-110, -70, 220, 140, 14), { f: C.a1, c: C.line, w: 6 }) + fill(D_.rr(-110, -40, 220, 26, 0), C.ink) + fill(D_.rr(-80, 20, 60, 30, 6), '#E7DEC6'), at(800, 1000, kb, 12));
    const ts2 = T.s(1);
    if (t > ts2 - .2) { // календарь: признаки зависимости — уже через несколько дней
      let cal = ''; for (let i = 0; i < 10; i++) { const x = -360 + (i % 5) * 180, y = -80 + Math.floor(i / 5) * 160, on = i === 1, k = E(t, ts2 + i * .05, .3, 'back'); cal += g(ink(D_.rr(-70, -60, 140, 120, 14), { f: on ? C.a2 : '#E7DEC6', c: C.line, w: 5 }) + tx(String(i + 1), 0, 22, { f: 'O', s: 56, w: 700, c: on ? C.paper : C.ink }), at(x, y, k)) }
      s += g(fill(D_.rr(-460, -190, 920, 400, 30), C.ink, .92) + cal, at(540, 650, E(t, ts2 - .2, .4)));
      s += stamp(L('DAYS', 'ДНИ'), 860, 880, t, T.c(L('days', 'несколько'), 0, 4), { c: C.a2, s: 60, r: 8 });
    }
    s += day(10, t, T.v);
    return g(s, cam(t, T, .04));
  };

  D.d30 = (t, S, T) => {
    let s = bg('#2B3150');
    const ts2 = T.s(1);
    if (t < ts2 - .1) { // тумбочка сверху: телефон и вейп, рука тянется к вейпу
      s += fill(D_.rr(120, 380, 840, 860, 40), '#7A5236') + dots(D_.rr(120, 380, 840, 860, 40), { c: '#4A311F', step: 16, op: .5 });
      s += phone(380, 820, { w: 220, scr: '#1E2A44', content: (w0, h0) => tx('07:00', 0, -h0 * .2, { f: 'O', s: 64, w: 700, c: C.paper }), r: -6 });
      s += vape(720, 820, 1.2, 10);
      const kr = E(t, T.v + .3, 1, 'io');
      s += hand(lerp(1250, 700, kr), lerp(1400, 980, kr), -120, { s: 1.6, c: C.line, f: C.skin, sleeve: C.hood });
      s += tx('07:00', 540, 330, { f: 'O', s: 70, w: 700, c: C.a1, op: E(t, T.a, .4) });
    } else {
      s += max(540, 1300, 1.1, t, { mood: 'tense', look: wob(t, .8, .6), sweat: t * 2 });
      for (let i = 0; i < 8; i++) { const a = (i / 8 * 360 + t * 30) * Math.PI / 180, r0 = 330 + Math.sin(t * 8 + i) * 12; s += line(`M${R(540 + Math.cos(a) * r0)} ${R(820 + Math.sin(a) * r0)}L${R(540 + Math.cos(a) * (r0 + 50))} ${R(820 + Math.sin(a) * (r0 + 50))}`, 1, { c: C.a2, w: 8 }) }
    }
    s += day(30, t, T.v);
    return g(s, cam(t, T, .04));
  };

  D.half = (t, S, T) => {
    let s = bg(C.bg);
    const x0 = 170, yb = 1150, h0 = 600, k = E(t, T.a + .2, 2.6, 'io');
    s += line(`M${x0} 470V${yb}H${x0 + 760}`, 1, { c: C.line, w: 7 });
    for (let i = 0; i < 5; i++) { const kk = clamp(k * 5 - i), h = h0 / Math.pow(2, i) * EZ.back(kk); if (kk <= 0) continue; s += ink(D_.rr(x0 + 40 + i * 150, yb - h, 110, h, 10), { f: i ? C.a1 : C.mango, c: C.line, w: 6 }) + tx(i * 2 + L(' h', ' ч'), x0 + 95 + i * 150, yb + 60, { f: 'O', s: 46, w: 500, c: C.paper }) + (i ? tx('½', x0 + 95 + i * 150, yb - h - 26, { f: 'O', s: 46, w: 700, c: C.a1 }) : '') }
    s += cap(L('nicotine in blood', 'никотин в крови'), 470, 520, { c: C.a1, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .04));
  };

  D.d90 = (t, S, T) => {
    let s = bg('#E8E2D2') + fill('M0 1130H1080V1920H0Z', '#B9A98C');
    const tp = T.c(L('prison', 'срок'), 0, 3.5);
    s += clock(540, 520, 190, 10, 15 + (t - T.a) * 1.2, { f: '#FFFFFF', c: C.ink, hand: C.ink, hand2: C.a2 });
    s += ink(D_.rr(90, 860, 900, 60, 8), { f: '#2E5C46', c: C.ink, w: 6 });
    s += max(540, 1400, .95, t, { mood: 'tense', sweat: t * 2.4, c: C.ink });
    const kb = E(t, tp - .1, .4, 'o5');
    if (kb > 0) for (let i = 0; i < 7; i++) s += fill(D_.rr(60 + i * 150, -40 + (1 - kb) * -1900, 34, 2000, 17), C.ink, .9);
    s += day(90, t, T.v, { c: C.a2, c2: C.ink, x: 170, y: 330 });
    return g(s, cam(t, T, .05));
  };

  D.d120 = (t, S, T) => {
    let s = bg('#C5D6E2');
    for (let r = 0; r < 26; r++) for (let i = 0; i < 12; i++) s += `<rect x="${i * 92 + 3}" y="${r * 92 + 3}" width="86" height="86" fill="${(r + i) % 2 ? C.tile : '#B2C7D6'}"/>`;
    s += ink('M220 520H860V1500H220Z', { f: '#5E7F99', c: C.ink, w: 9 }) + line('M260 560H820V1480H260Z', 1, { c: C.ink, w: 5, op: .5 }) + ink(D_.rr(760, 960, 34, 90, 10), { f: '#C9D3DE', c: C.ink, w: 5 });
    s += fill('M220 460H860V520H220Z', '#4B6884');
    for (let i = 0; i < 6; i++) { const ph = (t * .45 + i / 6) % 1; s += `<circle cx="${R(540 + Math.sin(ph * 5 + i) * 90)}" cy="${R(470 - ph * 360)}" r="${R(30 + ph * 70)}" fill="#E8EEF2" opacity="${R((1 - ph) * 75) / 100}"/>` }
    s += day(120, t, T.v, { c: C.a2, c2: C.ink, x: 190, y: 300 });
    return g(s, cam(t, T, .04));
  };

  D.quit = (t, S, T) => {
    let s = bg('#F2C48D') + fill(D_.circ(540, 1150, 520), '#F7D9A8') + fill(D_.circ(540, 1150, 330), '#FBE6BF');
    const tdn = T.c(L('done', 'хватит'), 0, 1.8), kt = clamp((t - tdn + .1) / .7);
    s += max(400, 1350, 1.05, t, { mood: 'calm', brows: -.6, c: C.ink });
    if (kt > 0) s += vape(lerp(560, 900, kt), lerp(800, 1180, kt) - Math.sin(kt * Math.PI) * 300, .8, kt * 400);
    s += g(ink('M-90 -110H90L70 120H-70Z', { f: '#8A8F96', c: C.ink, w: 7 }) + line('M-40 -80V90M0 -80V90M40 -80V90', 1, { c: C.ink, w: 5, op: .5 }) + ink(D_.rr(-110, -140, 220, 36, 10), { f: '#A7ADB5', c: C.ink, w: 6 }), at(900, 1230));
    return g(s, cam(t, T, .04));
  };

  D.flip = (t, S, T) => bg(C.bg) + ringWave(540, 760, t, T.v + .25, { c: C.a3, r1: 700 });

  D.q1 = (t, S, T) => {
    let s = bg('#3A1E26');
    s += max(540, 1300, 1.1, t, { mood: 'tense', brows: -1, look: wob(t, 1.2, .8) });
    const ic = [[180, 520, '?'], [900, 460, '!'], [170, 900, '…'], [910, 860, '?!']];
    ic.forEach(([x, y, q], i) => { const k = E(t, T.a + .15 + i * .15, .4, 'back'); if (k > 0) s += g(ink(D_.rr(-80, -60, 160, 120, 40), { f: '#FFFFFF', c: C.ink, w: 6 }) + fill(`M-30 60L-50 100L10 60Z`, '#FFFFFF') + tx(q, 0, 26, { f: 'O', s: 70, w: 700, c: C.a2 }), at(x + wob(t, 2, 6, i), y, k)) });
    s += day(1, t, T.a, { c: C.a3, x: 540, y: 300 });
    return g(s, cam(t, T, .05));
  };

  D.q3 = (t, S, T) => {
    let s = bg(C.bg);
    const x0 = 140, x1 = 940, yb = 1120, k = E(t, T.a, 1, 'io');
    let d = ''; for (let i = 0; i <= 100; i++) { const u = i / 100; if (u > k) break; const v = u < .1 ? u / .1 * .9 : Math.exp(-(u - .1) * 4.2) * .9 + .1 * Math.exp(-u * 3); d += (d ? 'L' : 'M') + R(x0 + u * (x1 - x0)) + ' ' + R(yb - v * 560) }
    s += line(`M${x0} 480V${yb}H${x1}`, 1, { c: C.line, w: 6, op: .6 }) + (d ? line(d, 1, { c: C.a2, w: 12 }) : '');
    const px = x0 + .1 * (x1 - x0), py = yb - .9 * 560, kp = E(t, T.a + .4, .4, 'back');
    s += g(`<circle r="22" fill="${C.a2}"/>` + line('M0 -26V-130', 1, { c: C.line, w: 5 }) + ink(D_.rr(-160, -210, 320, 90, 45), { f: C.paper, c: C.ink, w: 6 }) + tx(L('DAY 3', 'ДЕНЬ 3'), 0, -150, { f: 'O', s: 52, w: 700, c: C.ink }), at(px + 60, py, kp));
    s += tx(L('withdrawal', 'ломка'), x1, yb + 70, { f: 'O', s: 46, w: 500, c: C.paper, a: 'end', op: .7 });
    return g(s, cam(t, T, .04));
  };

  D.wave = (t, S, T) => {
    let s = bg('#14303A');
    const tm = T.c(L('minutes', 'минут'), 0, 2.6), k = E(t, T.a, Math.max(1, tm - T.a + .3), 'io');
    const crest = Math.sin(clamp(k * 1.15) * Math.PI) * (1 - E(t, tm, .6));
    let d = 'M0 1300'; for (let x = 0; x <= 1080; x += 12) { const u = x / 1080, h = crest * 520 * Math.exp(-Math.pow((u - k) / .18, 2)); d += `L${x} ${R(1100 - h + Math.sin(x / 60 + t * 3) * 14)}` } d += 'L1080 1300Z';
    s += fill(d, '#2E8FA8') + line(d.replace(/L1080 1300Z$/, ''), 1, { c: C.line, w: 7 }) + dots(d, { c: '#1D6378', step: 16, op: .5, x0: 540, y0: 1300, x1: 540, y1: 600 });
    s += fill('M0 1290H1080V1920H0Z', '#14303A');
    const kr = E(t, T.a + .3, Math.max(.5, tm - T.a), 'l');
    s += g(line(D_.circ(0, 0, 80), 1, { c: '#2B4E5A', w: 14 }) + line(D_.arc(0, 0, 80, -90, -90 + 359.9 * kr), 1, { c: C.a3, w: 14 }) + tx(L('3–5 min', '3–5 мин'), 0, 140, { f: 'O', s: 44, w: 500, c: C.paper }), at(250, 560));
    s += cap(L('craving', 'тяга'), 540, 330, { c: C.a3, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .03));
  };

  D.q14 = (t, S, T) => {
    let s = bg(C.bg2);
    for (let i = 0; i < 14; i++) { const x = 190 + (i % 5) * 175, y = 600 + Math.floor(i / 5) * 200, k = E(t, T.a + i * .04, .35, 'back'), n = Math.max(0, 5 - Math.floor(i / 3)); let q = ink(D_.rr(-74, -70, 148, 140, 16), { f: '#2E3658', c: C.line, w: 5 }) + tx(String(i + 1), -42, -26, { f: 'O', s: 34, w: 500, c: C.paper, op: .7 }); for (let j = 0; j < n; j++) q += `<circle cx="${-36 + (j % 3) * 36}" cy="${12 + Math.floor(j / 3) * 34}" r="11" fill="${C.a2}"/>`; s += g(q, at(x, y, k)) }
    s += day(14, t, T.a, { c: C.a3, x: 540, y: 330 });
    return g(s, cam(t, T, .04));
  };

  D.q30 = (t, S, T) => {
    let s = bg('#101530') + fill(D_.circ(820, 430, 90), '#F5EFD6') + fill(D_.circ(860, 410, 80), '#101530');
    for (let i = 0; i < 20; i++) s += `<circle cx="${R(rnd(i) * 1080)}" cy="${R(220 + rnd(i + 30) * 500)}" r="${R(2 + rnd(i + 7) * 3)}" fill="${C.paper}" opacity="${R((.4 + .4 * Math.sin(t * 2 + i)) * 100) / 100}"/>`;
    s += ink(D_.rr(120, 980, 840, 220, 90), { f: '#E7E1F5', c: C.line, w: 7 });
    s += max(540, 1500, 1, t, { mood: 'sleep', blink: 1, r: -6 });
    s += ink('M60 1220H1020V1500H60Z', { f: '#3B4E8C', c: C.line, w: 7 }) + dots('M60 1220H1020V1500H60Z', { c: C.ink, step: 16, op: .4 });
    for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; s += tx('Z', 760 + ph * 120, 760 - ph * 260, { f: 'U', s: 50 + ph * 40, w: 800, c: C.paper, op: Math.sin(ph * Math.PI) }) }
    s += day(30, t, T.a, { c: C.a3, x: 200, y: 330 });
    return g(s, cam(t, T, .04));
  };

  D.end = (t, S, T) => {
    let s = bg(C.bg);
    const k = E(t, T.v + .4, 1.4, 'back');
    s += line('M540 900C540 820 530 760 540 690', k, { c: C.a3, w: 12 }) + ink(D_.leaf(540, 760, 140 * k, 50 * k, -30), { f: C.a3, c: C.line, w: 6 }) + ink(D_.leaf(540, 720, 120 * k, 44 * k, -150), { f: '#5FD3BC', c: C.line, w: 6 });
    return g(s, cam(t, T, .04));
  };

  // счётчик в углу — поверх всех сцен
  function hudVal(t) {
    const v = [[0, '∞'], [K.d10 && K.d10.v, L('1 day', '1 день')], [K.d30 && K.d30.T.s(1), L('6 h', '6 ч')], [K.d90 && K.d90.v, L('90 min', '90 мин')], [K.d120 && K.d120.v, L('40 min', '40 мин')],
      [K.flip && K.flip.v + .45, '0'], [K.q1 && K.q1.a, '1'], [K.q3 && K.q3.a, '3'], [K.q14 && K.q14.a, '14'], [K.q30 && K.q30.a, '30']].filter(x => x[0] != null);
    let i = 0; while (i < v.length - 1 && t >= v[i + 1][0]) i++;
    return { cur: v[i][1], prev: i ? v[i - 1][1] : null, k: i ? E(t, v[i][0], .35, 'io') : 1 }
  }
  function over(t) {
    if (!K.intro) return '';
    const tShow = K.intro.T.c(L('number', 'цифра'), 0, 2), kin = E(t, tShow - .2, .45, 'back');
    if (kin <= 0) return '';
    const tf = K.flip ? K.flip.v : 1e9, after = t > tf + .45;
    const toC = E(t, tf - .5, .5, 'io') * (1 - E(t, (K.q1 ? K.q1.a : tf + 1.4) - .1, .5, 'io'));
    const flipK = E(t, tf + .15, .6, 'io'), sy = Math.abs(Math.cos(flipK * Math.PI));
    const cx = lerp(830, 540, toC), cy = lerp(330, 760, toC), sc = lerp(1, 1.9, toC) * kin * (K.end && t > K.end.v ? 1 + E(t, K.end.v, .8, 'back') * .5 : 1);
    const ey = K.end && t > K.end.v ? E(t, K.end.v, .8, 'io') : 0;
    const col = after ? C.a3 : C.a1, lab = after ? L('days free', 'дней без никотина') : L('can go without it', 'может без никотина');
    let h = hudVal(t), body = '';
    const id = uid();
    body += ink(D_.rr(-180, -90, 360, 180, 26), { f: C.ink, c: col, w: 6, dx: 7, dy: 6 }) + cap(lab, 0, -42, { c: col, s: 20, ls: L(4, 1.5) });
    body += `<clipPath id="${id}"><rect x="-170" y="-30" width="340" height="110"/></clipPath><g clip-path="url(#${id})">`;
    if (h.prev != null && h.k < 1) body += tx(h.prev, 0, 54 - h.k * 100, { f: 'O', s: 84, w: 700, c: C.paper });
    body += tx(h.cur, 0, 54 + (1 - h.k) * 100, { f: 'O', s: 84, w: 700, c: C.paper }) + '</g>';
    return g(body, `translate(${R(lerp(cx, 540, ey))} ${R(lerp(cy, 980, ey))}) scale(${R(sc * (ey ? 1 : 1) * 1000) / 1000} ${R(sc * (t > tf + .15 && t < tf + .75 ? Math.max(.04, sy) : 1) * 1000) / 1000})`)
  }

  window.EP = {
    P: C, D, over,
    init(TL, SC) { K = {}; SC.forEach(S => { if (!K[S.key]) K[S.key] = S }) },
    tr: { intro: 'push', d1: 'zoom', brain: 'push', d10: 'push', d30: 'push', half: 'up', d90: 'push', d120: 'wipe', quit: 'fade', flip: 'cut', q1: 'push', q3: 'push', wave: 'push', q14: 'push', q30: 'fade' },
    trAt: { d1: [470, 760] }, trCol: { d120: C.a3 },
    cap: { hi: C.a1, st: '#0C0F18' },
  };
})();
