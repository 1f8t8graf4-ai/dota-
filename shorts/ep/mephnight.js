// «Представь: суббота, 23:00» — ночь и неделя на мефе по часам (второй формат). Неон, часы сверху поверх всех сцен.
(function () {
  const C = { bg: '#0E0B1A', bg2: '#1C1633', ink: '#07050F', paper: '#F3EEF9', line: '#F3EEF9', a1: '#FF4FA3', a2: '#41E2FF', a3: '#FFD23F', grey: '#8C8AA3', skin: '#E9B48F' };
  P = C;
  const cam = (t, T, a = .05, cx = 540, cy = 860) => about(cx, cy, 1 + a * EZ.io(P01(t, T.a, T.b - T.a + .5)));
  const D = {}; let K = {};
  const crowd = (t, y, n, col, k = 1) => { let s = ''; for (let i = 0; i < n; i++) { const x = (i + .5) * 1080 / n, h = 1 + rnd(i) * .3, bob = Math.max(0, Math.sin(t * 6 + i * 1.3)) * 18; s += g(fill(D_.circ(0, -150 * h, 46), col) + fill(`M-80 0C-80 ${-90 * h} -50 ${-110 * h} 0 ${-110 * h}C50 ${-110 * h} 80 ${-90 * h} 80 0Z`, col), at(x, y - bob * k)) } return s };
  const beams = (t, a = 1) => { let s = ''; for (let i = 0; i < 6; i++) { const ang = (60 + i * 12 + Math.sin(t * 1.5 + i) * 12) * Math.PI / 180, ang2 = ang + .06, sx = i % 2 ? 1 : -1; s += `<path d="M540 260L${R(540 + Math.cos(ang) * 1800 * sx)} ${R(260 + Math.sin(ang) * 1800)}L${R(540 + Math.cos(ang2) * 1800 * sx)} ${R(260 + Math.sin(ang2) * 1800)}Z" fill="${[C.a1, C.a2, C.a3][i % 3]}" opacity="${R(a * 10) / 100}"/>` } return s };

  D.hook = (t, S, T) => {
    let s = bg(C.bg) + beams(t, E(t, T.a, .6));
    s += crowd(t, 1350, 7, '#241C40', .4);
    s += g(ink(D_.rr(-300, -90, 600, 180, 90), { f: C.ink, c: C.a1, w: 8, dx: 0, dy: 0 }) + tx(L('SATURDAY', 'СУББОТА'), 0, 30, { f: 'U', s: 70, w: 800, c: C.a1, op: .8 + Math.sin(t * 20) * .2 * (t < 1 ? 1 : 0) }), at(540, 760, E(t, T.a + .2, .5, 'back')));
    const k1 = E(t, T.c(L('first', 'впервые'), 0, 3), .5, 'back');
    if (k1 > 0) s += g(ink(D_.circ(0, 0, 70), { f: C.a3, c: C.line, w: 6 }) + tx(L('1st', '1-й'), 0, 22, { f: 'O', s: 56, w: 700, c: C.ink }), at(820, 1000, k1, 8));
    return g(s, cam(t, T, .05));
  };

  D.t1115 = (t, S, T) => {
    let s = bg(C.bg2) + beams(t, .9);
    const kh = E(t, T.c(L('heart', 'сердце'), 0, 1), 2.4, 'io'), bpm = 72 + 58 * kh, beat = Math.max(0, Math.sin(t * bpm / 60 * Math.PI * 2)) ** 4;
    s += g(ink(HEART2, { f: C.a1, c: C.line, w: 8 }), at(540, 640, .95 * (1 + beat * .08)));
    s += odo(bpm, 540, 920, { s: 110, c: C.paper, sep: '' }) + tx('BPM', 700, 920, { f: 'O', s: 44, w: 500, c: C.a1, a: 'start' });
    s += crowd(t, 1380, 7, '#3A2E66', 1);
    const tl = T.c(L('love', 'любишь'), 0, 2.6);
    for (let i = 0; i < 7; i++) { const k = E(t, tl + i * .08, .4, 'back'); if (k > 0) s += g(fill(D_.heart(0, 0, 22), [C.a1, C.a3, C.a2][i % 3]), at((i + .5) * 1080 / 7, 1110 - Math.max(0, Math.sin(t * 6 + i * 1.3)) * 18, k)) }
    const tg = T.c(L('gold', 'огонь'), 0, 4.5);
    s += burst(820, 470, t, tg, { c: C.a3, r0: 60, r1: 170, n: 12 }) + g(fill(D_.star(0, 0, 70, 30), C.a3), at(820, 470, E(t, tg, .4, 'back'), t * 40));
    return g(s, cam(t, T, .04));
  };

  D.t0000 = (t, S, T) => {
    let s = bg(C.bg);
    const tp = T.c(L('pupils', 'зрачки'), 0, 1.6), kp = E(t, tp - .1, .9, 'o5'), tj = T.c(L('jaw', 'челюсть'), 0, .6), tw2 = T.c(L('wet', 'мокрая'), 0, 3);
    // глаз
    let eye = ink('M-300 0C-180 -170 180 -170 300 0C180 170 -180 170 -300 0Z', { f: '#FFFFFF', c: C.line, w: 8 });
    eye += fill(D_.circ(0, 0, 130), C.a2) + dots(D_.circ(0, 0, 130), { c: '#1E7F99', step: 12, op: .6, x0: 0, y0: 0, x1: 130, y1: 130 }) + fill(D_.circ(0, 0, lerp(40, 112, kp)), C.ink) + fill(D_.circ(-40, -40, 22), '#FFFFFF', .9);
    s += g(eye, at(540, 700, 1));
    let jaw = ink(D_.rr(-170, -90, 340, 80, 30), { f: C.paper, c: C.line, w: 6 }) + ink(D_.rr(-170, 10, 340, 80, 30), { f: C.paper, c: C.line, w: 6 }); for (let i = -3; i <= 3; i++) jaw += line(`M${i * 46} -86V-14M${i * 46} 14V86`, 1, { c: C.ink, w: 4, op: .5 });
    s += g(jaw, at(330, 1100, E(t, tj - .1, .4, 'back'), wob(t, 9, 1.5)));
    for (let i = 0; i < 4; i++) { const k = E(t, tw2 - .2 + i * .1, .4, 'back'), ph = (t * .8 + i / 4) % 1; if (k > 0) s += g(ink(D_.drop(0, 0, 34), { f: '#9AD3F5', c: C.line, w: 5, dx: 3, dy: 3 }), at(720 + i * 70, 1040 + ph * 120 + i * 20, k)) }
    return g(s, cam(t, T, .04));
  };

  D.t0040 = (t, S, T) => {
    let s = bg(C.bg2);
    const tf = T.c(L('fading', 'отпускает'), 0, 1), lv = 1 - E(t, tf - .2, 1.6, 'io'), tn = T.c(L('now', 'сейчас'), 0, 4.5);
    let bat = ink(D_.rr(-140, -280, 280, 560, 40), { f: C.ink, c: C.line, w: 8 }) + ink(D_.rr(-60, -320, 120, 50, 12), { f: C.ink, c: C.line, w: 6 }) + fill(D_.rr(-110, 250 - 500 * lv, 220, 500 * lv + .1, 26), lv > .3 ? C.a2 : C.a1);
    s += g(bat, at(330, 800));
    s += brain(760, 760, { s: .95, f: '#F2A7B5', glow: (1 - lv) * (.5 + .5 * Math.sin(t * 10)), gc: C.a1 });
    const kn = E(t, tn - .1, .35, 'back');
    if (kn > 0) s += g(ink(D_.rr(-170, -70, 340, 140, 70), { f: C.a1, c: C.line, w: 7 }) + tx(L('NOW', 'СЕЙЧАС'), 0, 28, { f: 'U', s: L(76, 56), w: 800, c: C.paper }), at(760, 1120, kn * (1 + Math.max(0, Math.sin((t - tn) * 12)) * .05), -5));
    return g(s, cam(t, T, .04));
  };

  D.t0300 = (t, S, T) => {
    let s = bg(C.bg);
    for (let i = 0; i < 4; i++) { const k = E(t, T.a + .3 + i * .55, .4, 'back'); if (k > 0) { const lab = L('last one', 'последний раз'), w0 = tw(lab, { f: 'M', w: 800, s: 56 }) + 80; s += g(ink(D_.rr(-w0 / 2, -60, w0, 120, 60), { f: i === 3 ? C.a1 : C.bg2, c: C.line, w: 6 }) + fill('M-40 60L-70 110L10 60Z', i === 3 ? C.a1 : C.bg2) + tx(lab, 0, 20, { f: 'M', s: 56, w: 800, c: C.paper }), at(540 + (i % 2 ? 120 : -120), 500 + i * 170, k, (i % 2 ? 4 : -4))) } }
    const kt = E(t, T.c(L('times', 'раза'), 0, 2.5), .5);
    s += line('M330 1260V1160M380 1260V1160M430 1260V1160M480 1260V1160M310 1240L500 1180', kt, { c: C.a3, w: 12 });
    return g(s, cam(t, T, .05));
  };

  D.t0500 = (t, S, T) => {
    const dawn = E(t, T.a, 3, 'io');
    let s = bg(`rgb(${R(lerp(28, 70, dawn))},${R(lerp(22, 48, dawn))},${R(lerp(51, 90, dawn))})`);
    const sky = `rgb(${R(lerp(40, 250, dawn))},${R(lerp(30, 170, dawn))},${R(lerp(80, 130, dawn))})`;
    let inner = fill(D_.circ(0, 150, 90), C.a3); for (let i = 0; i < 4; i++) { const x = -150 + ((t * 60 + i * 90) % 360), y = -80 + i * 30 + Math.sin(t * 4 + i) * 10; inner += line(`M${R(x - 22)} ${R(y)}Q${R(x - 11)} ${R(y - 14)} ${R(x)} ${R(y)}Q${R(x + 11)} ${R(y - 14)} ${R(x + 22)} ${R(y)}`, 1, { c: C.ink, w: 5 }) }
    s += windowF(540, 500, { w: 460, h: 420, sky, inner, c: C.line });
    const bounce = Math.abs(Math.sin(t * 5)) * 40;
    s += g(ink(D_.rr(-380, -60, 760, 140, 30), { f: '#4B3F7A', c: C.line, w: 7 }) + ink(D_.rr(-340, -120 - bounce * .3, 220, 70, 30), { f: '#E7E1F5', c: C.line, w: 6 }) + line('M-380 80V160M380 80V160', 1, { c: C.line, w: 12 }), at(540, 1050 - bounce * .5, 1 + bounce * .002));
    s += ecg(160, 920, 1240, t, { sp: 2.2, amp: 70, per: 140, c: C.a1 });
    return g(s, cam(t, T, .04));
  };

  D.t0700 = (t, S, T) => {
    let s = bg('#2A2448');
    s += ink(D_.rr(160, 600, 760, 420, 120), { f: '#E7E1F5', c: C.line, w: 7 });
    s += bust(540, 1330, { s: .9, mood: 'calm', blink: 0, f: '#5B4C99', r: 0, brows: .6 });
    for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i / 3) % 1; s += `<circle cx="300" cy="780" r="${R(40 + ph * 300)}" fill="none" stroke="${C.a1}" stroke-width="${R(8 * (1 - ph))}" opacity="${R((1 - ph) * 90) / 100}"/>` }
    s += g(fill(D_.heart(0, 0, 40), C.a1), at(300, 780, 1 + Math.max(0, Math.sin(t * 1.6 * Math.PI * 2)) ** 4 * .25));
    return g(s, cam(t, T, .04));
  };

  D.t0900 = (t, S, T) => {
    let s = bg(C.bg2);
    const tm = T.c(L('messages', 'сообщений'), 0, 1);
    s += phone(540, 830, { w: 470, scr: '#141024', content: (w0, h0) => { let q = ''; for (let i = 0; i < 7; i++) { const k = E(t, tm - .3 + i * .18, .3, 'back'); if (k <= 0) continue; const y = -h0 / 2 + 90 + i * 118, mine = i % 3 !== 1, bw = 180 + rnd(i) * 140; q += g(fill(D_.rr(mine ? w0 / 2 - 30 - bw : -w0 / 2 + 30, y, bw, 84, 28), mine ? C.a1 : '#3A3360') + line(`M${mine ? w0 / 2 - bw : -w0 / 2 + 54} ${y + 32}H${mine ? w0 / 2 - 60 : -w0 / 2 + bw}`, 1, { c: C.paper, w: 8, op: .6 }) + (mine ? tx('03:' + String(10 + i * 7).padStart(2, '0'), w0 / 2 - 40, y + 76, { f: 'M', s: 18, w: 800, c: C.paper, a: 'end', op: .7 }) : ''), '', k) } return q } });
    const kq = E(t, T.c(L('remember', 'помнишь'), 0, 3), .4, 'back');
    s += g(tx('?', 0, 0, { f: 'U', s: 160, w: 800, c: C.a3 }), at(880, 520, kq, 12)) + g(tx('?', 0, 0, { f: 'U', s: 110, w: 800, c: C.a3 }), at(200, 640, kq, -14));
    return g(s, cam(t, T, .04));
  };

  D.sun = (t, S, T) => {
    let s = bg('#2E2A3E');
    const k1 = E(t, T.v, .4, 'back'), k2 = E(t, T.c(L('sleep', 'сна'), 0, 1.2), .4, 'back'), k3 = E(t, T.c(L('chest', 'груди'), 0, 2.2), .4, 'back');
    s += g(ink(D_.circ(0, 0, 150), { f: '#FFFFFF', c: C.line, w: 7 }) + ink(D_.circ(0, 0, 100), { f: '#ECE6F5', c: C.line, w: 4, dx: 0, dy: 0 }) + ink(D_.ell(-20, 10, 46, 30), { f: '#C98D5E', c: C.ink, w: 4, dx: 2, dy: 2 }) + line('M200 -140V140M240 -140V-40M200 -40H240', 1, { c: C.line, w: 8 }), at(380, 560, k1));
    s += g(`<ellipse cx="-50" cy="0" rx="34" ry="34" fill="${C.paper}"/><ellipse cx="50" cy="0" rx="34" ry="34" fill="${C.paper}"/><circle cx="-50" cy="0" r="14" fill="${C.ink}"/><circle cx="50" cy="0" r="14" fill="${C.ink}"/>` + tx('Z', 120, -40, { f: 'U', s: 50, w: 800, c: C.grey, op: .3 }) + line('M100 -80L160 0', 1, { c: C.a1, w: 6 }), at(760, 820, k2));
    s += g(ink('M-160 -40L-110 -210H110L160 -40Z', { f: '#4A4466', c: C.line, w: 8 }) + ink('M-60 -210C-60 -290 60 -290 60 -210', { f: 'none', c: C.line, w: 22, dx: 0, dy: 0 }) + tx(L('heavy', 'тяжело'), 0, -100, { f: 'O', s: 50, w: 700, c: C.paper }), at(540, 1250, k3));
    s += cap(L('no appetite', 'нет аппетита'), 380, 790, { c: C.grey, op: k1 });
    return g(s, cam(t, T, .04));
  };

  D.mon = (t, S, T) => {
    let s = bg('#3A3A44');
    for (let i = 0; i < 40; i++) { const x = (rnd(i) * 1100 + t * 40) % 1100, y = (rnd(i + 9) * 2000 + t * 900 * (.7 + rnd(i + 3) * .5)) % 2000; s += line(`M${R(x)} ${R(y)}L${R(x - 10)} ${R(y + 46)}`, 1, { c: '#9A9AAA', w: 4, op: .5 }) }
    const it = [[L('anxiety', 'тревога'), 240, L('anxiety', 'тревога')], [L('paranoia', 'паранойя'), 540, L('paranoia', 'паранойя')], [L('more', 'ещё'), 840, L('more', 'ещё')]];
    it.forEach(([lab, x, cue], i) => { const k = E(t, T.c(cue, 0, 2 + i), .45, 'back'); if (k <= 0) return; s += g(bust(0, 0, { s: .42, f: ['#6F6F86', '#5E5E74', C.a1][i], skin: '#BFB4AA', mood: i === 2 ? 'o' : 'sad', c: C.line, hairC: '#2C2C36' }), at(x, 1000, k)) + tx(lab, x, 1080, { f: 'O', s: 52, w: 500, c: i === 2 ? C.a1 : C.paper, op: k }) });
    return g(s, cam(t, T, .04));
  };

  D.tue = (t, S, T) => {
    let s = bg(C.bg2);
    const k = E(t, T.a + .1, .5, 'back'), tw3 = T.c(L('never', 'никогда'), 0, 1.5);
    s += g(ink(D_.rr(-330, -230, 660, 460, 14), { f: '#FFF7D6', c: C.line, w: 7 }) + rise(L('NEVER', 'БОЛЬШЕ'), 0, -40, t, tw3 - .1, { f: 'U', s: 96, w: 800, c: C.ink }) + rise(L('AGAIN.', 'НИКОГДА.'), 0, 90, t, tw3 + .15, { f: 'U', s: L(96, 80), w: 800, c: C.a1 }) + line('M-250 140C-100 170 100 120 250 150', E(t, tw3 + .6, .4), { c: C.a1, w: 9 }), at(540, 800, k, -3));
    return g(s, cam(t, T, .04));
  };

  D.study = (t, S, T) => {
    let s = bg(C.bg);
    const k = E(t, T.a, .5, 'back'), lev = 1 - E(t, T.c(L('cocaine', 'кокаину'), 0, 2.5) - .2, .8, 'back'), ang = lev * 12 + wob(t, .5, 1), cx = 540, top = 700;
    s += g(ink('M-170 0L170 0L60 -80L-60 -80Z', { f: C.bg2, c: C.line, w: 8 }) + line('M0 -80V-460', 1, { c: C.line, w: 16 }), at(cx, 1160, k));
    const a = ang * Math.PI / 180, ex = Math.cos(a) * 360, ey = Math.sin(a) * 360;
    s += line(`M${R(cx - ex)} ${R(top - ey)}L${R(cx + ex)} ${R(top + ey)}`, k, { c: C.line, w: 14 });
    const pan = (x, y, lab, col) => line(`M${x} ${y}L${x - 120} ${y + 220}M${x} ${y}L${x + 120} ${y + 220}`, 1, { c: C.line, w: 5 }) + ink(`M${x - 160} ${y + 220}H${x + 160}C${x + 140} ${y + 290} ${x - 140} ${y + 290} ${x - 160} ${y + 220}Z`, { f: col, c: C.line, w: 7 }) + tx(lab, x, y + 200, { f: 'O', s: 52, w: 700, c: C.paper });
    if (k > .5) s += pan(cx - ex, top - ey, L('MEPH', 'МЕФ'), C.a1) + pan(cx + ex, top + ey, L('COCAINE', 'КОКАИН'), '#6B6480');
    if (S.sents.length > 1) { const kr = E(t, T.s(1), .5); s += tx(L('', 'Россия: один из самых распространённых'), 540, 1300, { f: 'O', s: 44, w: 500, c: C.a3, op: kr }) }
    s += cap(L('UK survey', 'британский опрос'), 540, 420, { c: C.a2, op: E(t, T.a, .4) });
    return g(s, cam(t, T, .04));
  };

  D.next = (t, S, T) => {
    let s = bg(C.bg);
    s += g(brain(0, 0, { s: 1.6, f: '#5B4C99', c: C.line }), at(540, 820), .55);
    const k = E(t, T.c(L('remember', 'вспомнит'), 0, 1.6) - .2, .6, 'back');
    s += g(ink(D_.rr(-170, -200, 340, 400, 12), { f: '#FFFFFF', c: C.line, w: 7 }) + fill(D_.rr(-140, -170, 280, 270, 6), C.a1) + beams(t, .0) + fill(D_.star(0, -40, 70, 30), C.a3) + tx('23:15', 0, 160, { f: 'O', s: 64, w: 700, c: C.ink }), at(560, 800, k, -6));
    s += burst(560, 800, t, T.c(L('fifteen', 'пятнадцать'), 0, 3), { c: C.a3, r0: 230, r1: 340, n: 14 });
    return g(s, cam(t, T, .05));
  };

  D.help = (t, S, T) => {
    let s = bg('#16303A');
    const k = E(t, T.a + .1, .6, 'back');
    let buoy = ''; for (let i = 0; i < 4; i++) buoy += `<path d="${D_.arc(0, 0, 160, i * 90 + 10, i * 90 + 80)}" fill="none" stroke="${i % 2 ? '#FFFFFF' : C.a1}" stroke-width="70"/>`;
    s += g(line(D_.circ(0, 0, 200), 1, { c: C.line, w: 7 }) + line(D_.circ(0, 0, 120), 1, { c: C.line, w: 7 }) + buoy, at(540, 760, k, wob(t, .4, 6)));
    s += tx(L('FREE · ANONYMOUS', 'БЕСПЛАТНО · АНОНИМНО'), 540, 1120, { f: 'O', s: 60, w: 700, c: C.a2, op: E(t, T.c(L('free', 'бесплатная'), 0, 2), .4), ls: 3 });
    s += tx(L('↓ link in description', '↓ ссылка в описании'), 540, 1230, { f: 'M', s: 44, w: 800, c: C.paper, op: E(t, T.c(L('link', 'ссылка'), 0, 3.5), .4) });
    return g(s, cam(t, T, .04));
  };

  // часы сверху
  function over(t) {
    const marks = [['hook', L('SAT 23:00', 'СБ 23:00')], ['t1115', '23:15'], ['t0000', '00:00'], ['t0040', '00:40'], ['t0300', '03:00'], ['t0500', '05:00'], ['t0700', '07:00'], ['t0900', '09:00'], ['sun', L('SUNDAY', 'ВОСКРЕСЕНЬЕ')], ['mon', L('MONDAY', 'ПОНЕДЕЛЬНИК')], ['tue', L('TUESDAY', 'ВТОРНИК')], ['next', L('NEXT SAT', 'СНОВА СБ')]];
    const v = marks.filter(m => K[m[0]]).map(m => [K[m[0]].v - .15, m[1]]); if (!v.length) return '';
    if (K.study && t >= K.study.a && t < (K.next ? K.next.a : 1e9)) return '';
    if (K.help && t >= K.help.a) return '';
    let i = 0; while (i < v.length - 1 && t >= v[i + 1][0]) i++;
    const kk = i ? E(t, v[i][0], .3, 'io') : E(t, 0, .4, 'o5'), id = uid();
    let s = fill(D_.rr(-260, -70, 520, 140, 30), C.ink, .82) + line(D_.rr(-260, -70, 520, 140, 30), 1, { c: C.a1, w: 4, op: .7 }) + `<clipPath id="${id}"><rect x="-250" y="-66" width="500" height="132"/></clipPath><g clip-path="url(#${id})">`;
    const fs = v[i][1].length > 8 ? 60 : 84;
    if (i && kk < 1) s += tx(v[i - 1][1], 0, 30 - kk * 140, { f: 'O', s: v[i - 1][1].length > 8 ? 60 : 84, w: 700, c: C.a1 });
    s += tx(v[i][1], 0, 30 + (1 - kk) * 140, { f: 'O', s: fs, w: 700, c: C.a1 }) + '</g>';
    return g(s, at(540, 300))
  }

  window.EP = {
    P: C, D, over,
    init(TL, SC) { K = {}; SC.forEach(S => { if (!K[S.key]) K[S.key] = S }) },
    tr: { hook: 'zoom', t1115: 'push', t0000: 'push', t0040: 'push', t0300: 'wipe', t0500: 'push', t0700: 'push', t0900: 'up', sun: 'push', mon: 'fade', tue: 'push', study: 'push', next: 'fade' },
    trAt: { hook: [820, 1000] }, trCol: { t0300: C.a1 },
    cap: { hi: C.a1, st: '#07050F' },
  };
})();
