  // ================= мир 4: звонок хозяев «Мальборо» → касса 12,8 млрд → табло 38 млрд → трещина =================
  let W4K = null, T4 = {}, TC1 = 0;
  const REG = { x: 1560, y: 1180 }, PIE = { x: 1560, y: 1640, r: 190 }, BIG = { x: 1560, y: -600, w: 900 };
  function w4Init() {
    const p = PH; T4 = { dek: Wd('декабрь'), zv: Wd('звонят'), mal: Wd('мальборо'), d12: Wd('двенадцать'), mlrd: Wd('миллиарда'), tret: Wd('треть'), stoit: Wd('стоит'), mlrds: Wd('миллиардов'), vl: Wd('власти'), epi: Wd('эпидемией') };
    TC1 = p[16].b + .12;
    W4K = [KY(TH, 620, 1210, 3.6), KY(TH + .6, 540, 985, 1.15), KY(p[13].b, 560, 960, 1.04), KY(p[14].a + .25, 1200, 1250, .85), KY(p[14].a + .7, 1560, 1330, .84), KY(p[14].b, 1560, 1370, .8),
      KY(p[15].a + .25, 1560, -200, .95), KY(p[15].a + .9, 1560, -575, 1.05), KY(p[15].b, 1560, -590, 1.1), KY(p[16].b - .3, 1560, -590, 1.2), KY(TC1, 1560, -590, 1.24)];
  }
  function phoneW4(c, t) {
    const lit = at(t, TH + .15, TH + .45), ring = t > TH + .3 && t < PH[14].a + .2, sh = ring ? Math.sin(t * 110) * 5 * (Math.sin(t * 7) > 0 ? 1 : .2) : 0;
    c.save(); c.translate(540 + sh, 960);
    if (ring) for (let i = 0; i < 3; i++) { const u = ((t * .9 + i / 3) % 1); rr(c, -190 - u * 150, -390 - u * 150, 380 + u * 300, 780 + u * 300, 60 + u * 60); lnW(c, 8, rgba('#eef2f7', .35 * (1 - u))) }
    rr(c, -190 + 18, -390 + 24, 380, 780, 56); fill(c, 'rgba(5,8,20,.4)');
    rr(c, -190, -390, 380, 780, 56); fill(c, '#0d0f19'); rr(c, -190, -390, 380, 780, 56); lnW(c, 6, PJ.ln);
    c.save(); rr(c, -170, -360, 340, 720, 40); c.clip(); c.fillStyle = PJ.hole; c.fillRect(-170, -360, 340, 720);
    circ(c, 80, 250, 44, '#22c55e'); circ(c, -80, 250, 44, '#ef4444');   // v3: кнопки видны с первого кадра — в них сжалось кольцо 75 %
    if (lit > 0) { c.globalAlpha = lit; const g = c.createLinearGradient(0, -360, 0, 360); g.addColorStop(0, '#2b0f17'); g.addColorStop(1, '#5c1220'); c.fillStyle = g; c.fillRect(-170, -360, 340, 720);
      tx(c, 'ВХОДЯЩИЙ ВЫЗОВ', 0, -300, { f: 'M', w: 800, s: 22, c: 'rgba(255,255,255,.75)', ls: 3 });
      const kl = bo(at(t, TH + .3, TH + .7)); c.save(); c.translate(0, -140); c.scale(kl, kl); rr(c, -95, -95, 190, 190, 30); fill(c, '#fff');
      c.save(); rr(c, -95, -95, 190, 190, 30); c.clip(); poly(c, [-95, -95, 95, -95, 95, 10, 0, -50, -95, 10]); fill(c, '#d61f3c'); c.restore(); rr(c, -95, -95, 190, 190, 30); lnW(c, 5, PJ.ink); c.restore();
      tx(c, '«МАЛЬБОРО»', 0, 40, { f: 'U', w: 800, s: 44, c: '#fff', mw: 310 }); tx(c, 'ALTRIA · США', 0, 92, { f: 'M', w: 800, s: 24, c: 'rgba(255,255,255,.7)', ls: 2 });
      const pu = 1 + .08 * Math.sin(t * 9); circ(c, -80, 250, 44, '#ef4444'); circ(c, 80, 250, 44 * (ring ? pu : 1), '#22c55e');
      c.save(); c.translate(80, 250); c.rotate(-.5); rr(c, -22, -8, 44, 16, 8); fill(c, '#fff'); c.restore(); c.save(); c.translate(-80, 250); c.rotate(.6); rr(c, -22, -8, 44, 16, 8); fill(c, '#fff'); c.restore();
      c.globalAlpha = 1 }
    c.restore(); c.restore();
    const kc = bo(at(t, T4.dek - .2, T4.dek + .2)); if (kc > 0) { c.save(); c.translate(225, 520); c.rotate(-.08); c.scale(kc, kc); rr(c, -120, -140, 240, 280, 14); fill(c, '#f4f1ea'); c.fillStyle = '#d61f3c'; c.fillRect(-120, -140, 240, 70);
      rr(c, -120, -140, 240, 280, 14); lnW(c, 5, PJ.ink); tx(c, 'ДЕКАБРЬ', 0, -104, { f: 'U', w: 800, s: 30, c: '#fff' }); tx(c, '2018', 0, 30, { f: 'U', w: 800, s: 78, c: PJ.ink }); c.restore() }
  }
  function registerW4(c, t) {
    c.save(); c.translate(REG.x, REG.y);
    rr(c, -330 + 22, -170 + 28, 660, 380, 40); fill(c, 'rgba(5,8,20,.4)');
    poly(c, [-330, 210, 330, 210, 290, -170, -290, -170]); fill(c, '#5b4b9a'); poly(c, [-330, 210, 330, 210, 290, -170, -290, -170]); lnW(c, 8, PJ.ln);
    for (let r = 0; r < 3; r++) for (let q = 0; q < 5; q++) { rr(c, -230 + q * 94, -120 + r * 92, 70, 60, 12); fill(c, '#e9e3ff'); lnW(c, 5, PJ.ink) }
    c.beginPath(); c.moveTo(-40, -170); c.lineTo(-40, -280); c.moveTo(40, -170); c.lineTo(40, -280); lnW(c, 18, '#3b3166');
    rr(c, -340, -480, 680, 210, 30); fill(c, '#0b1020'); rr(c, -340, -480, 680, 210, 30); lnW(c, 8, PJ.ln);
    const v = 12.8e9 * eo(at(t, T4.d12 - .1, T4.mlrd + .1)); num(c, '$' + fmt(Math.round(v / 1e8) * 1e8), 0, -375, { f: 'J', w: 700, s: 62, c: '#7ee787' });
    // чек: выезжает сверху слева
    const kc = eo(at(t, T4.d12, T4.tret)); if (kc > 0) { c.save(); c.beginPath(); c.rect(-700, -1200, 440, 1030); c.clip(); c.translate(-480, -190 - 560 * kc);
      c.beginPath(); c.moveTo(-110, 0); for (let i = 0; i <= 11; i++) c.lineTo(-110 + i * 20, i % 2 ? -14 : 0); c.lineTo(110, 600); c.lineTo(-110, 600); c.closePath(); fill(c, '#f8f6f0'); lnW(c, 4, PJ.ink);
      ['СДЕЛКА', '$12 800 000 000', 'ЗА 35 % «ДЖУЛА»', 'ДЕКАБРЬ 2018'].forEach((s, i) => tx(c, s, 0, 60 + i * 56, { f: i === 1 ? 'J' : 'M', w: 800, s: i === 1 ? 26 : 22, c: i === 1 ? PJ.ink : '#4b5563', mw: 196 }));
      c.restore() }
    c.restore();
  }
  function pieW4(c, t) {
    const k = bo(at(t, PH[14].a, PH[14].a + .4)); if (k <= 0) return; const kt = eio(at(t, T4.tret - .15, T4.tret + .35)), a0 = Math.PI * .55, a1 = a0 + TAU * .35, mid = (a0 + a1) / 2;
    c.save(); c.translate(PIE.x, PIE.y); c.scale(k, k);
    c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, PIE.r, a1, a0 + TAU); c.closePath(); fill(c, PJ.orange); lnW(c, 7, PJ.ink);
    tx(c, '«ДЖУЛ»', 40, -30, { f: 'U', w: 800, s: 40, c: '#fff' });
    const ox = Math.cos(mid) * 90 * kt - 60 * kt, oy = Math.sin(mid) * 90 * kt;
    c.beginPath(); c.moveTo(ox, oy); c.arc(ox, oy, PIE.r, a0, a1); c.closePath(); fill(c, mixc(PJ.orange, '#d61f3c', kt)); lnW(c, 7, PJ.ink);
    A(c, kt, () => tx(c, '35 %', ox + Math.cos(mid) * 110, oy + Math.sin(mid) * 110, { f: 'U', w: 800, s: 46, c: '#fff' }));
    c.restore();
  }
  function towersW4(c, t) {   // v2: за табло растут золотые башни Уолл-стрит, сверху — дождь монет
    const k0 = PH[15].a - .1; [[-560, 900, 200], [-330, 1250, 240], [330, 1150, 230], [580, 950, 210], [0, 1450, 260]].forEach(([dx, h, w], i) => { const k = spr(at(t, k0 + i * .12, k0 + .7 + i * .12)); if (k <= 0) return;
      const x = BIG.x + dx - w / 2, g = BIG.y + 700, top = g - h * k; rr(c, x, top, w, g - top, 4); cel(c, x, top, w, g - top, i % 2 ? '#c99a2e' : '#d9ab3c', { hw: .06, sw: .3 }); rr(c, x, top, w, g - top, 4); lnW(c, 3, '#5b4210');
      for (let r = 0; r < Math.floor(h * k / 70); r++) for (let q = 0; q < Math.floor((w - 30) / 44); q++) { c.fillStyle = 'rgba(255,240,200,.45)'; c.fillRect(x + 20 + q * 44, top + 40 + r * 70, 22, 30) } });
    const kc = at(t, PH[15].a + .2, PH[16].a + .4); if (kc > 0 && kc < 1) for (let i = 0; i < 26; i++) { const u = (t * .9 + H1(i * 3.1)) % 1, x = BIG.x - 600 + H1(i * 7.7) * 1200, y = BIG.y - 1100 + u * 2000; c.save(); c.translate(x, y); c.scale(Math.cos(t * 6 + i), 1); circ(c, 0, 0, 22, '#f2c14e'); ring(c, 0, 0, 16, '#b8862b', 3); c.restore() }
  }
  function sirenW4(c, t) {   // v2: красная сирена ЭПИДЕМИЯ · FDA, штамп раскалывает табло
    const ks = at(t, T4.epi - .15, T4.epi); if (ks <= 0) return; const s = lp(2.4, 1, eo(ks)), fl = .5 + .5 * Math.sin(t * 16);
    glow(c, BIG.x, BIG.y - 330, 380, '#ef4444', .4 * fl); c.save(); c.translate(BIG.x, BIG.y - 330); c.scale(1, 1); c.beginPath(); c.arc(0, 0, 56, Math.PI, 0); c.closePath(); fill(c, '#ef4444'); c.fillStyle = '#2c3048'; c.fillRect(-70, 0, 140, 22); c.restore();
    c.save(); c.translate(BIG.x - 40, BIG.y + 6); c.rotate(-.1); c.scale(s, s); c.globalAlpha *= cl(ks * 3); rr(c, -300, -70, 600, 140, 14); lnW(c, 12, '#ef4444'); tx(c, 'ЭПИДЕМИЯ · FDA', 0, 4, { f: 'U', w: 800, s: 64, c: '#ef4444' }); c.restore();
  }
  function bigW4(c, t, o = {}) {
    const k = bo(at(t, PH[15].a - .2, PH[15].a + .25)); if (k <= 0) return; towersW4(c, t);
    const v = 38e9 * eo(at(t, T4.stoit - .05, T4.mlrds + .2)), red = at(t, T4.epi - .05, T4.epi + .15);
    c.save(); c.translate(BIG.x, BIG.y); c.scale(k, k); moneyPanel(c, 0, 0, BIG.w, Math.round(v / 1e8) * 1e8, { lab: 'ОЦЕНКА «ДЖУЛА» · 2018', col: mixc('#7ee787', '#ef4444', red), bd: mixc(PJ.ln, '#ef4444', red) });
    if (red > 0) { const cr = [[60, -40], [0, 0]]; c.save(); c.translate(180, -40); for (let i = 0; i < 9; i++) { const a = i * TAU / 9 + .3, L = (120 + H1(i * 3) * 300) * eo(red); c.beginPath(); c.moveTo(0, 0);
      c.lineTo(Math.cos(a) * L * .45 + (H1(i) - .5) * 30, Math.sin(a) * L * .45 + (H1(i * 2) - .5) * 30); c.lineTo(Math.cos(a) * L, Math.sin(a) * L); lnW(c, 6, '#fff') } c.restore() }
    c.restore();
  }
  function drawW4(c, t, q) {
    c.fillStyle = PJ.bg; c.fillRect(0, 0, WW, HH); c.save(); applyCam(c, q);
    const v = viewRect(q); c.fillStyle = 'rgba(238,242,247,.05)'; for (let x = Math.floor(v.x0 / 60) * 60; x < v.x1; x += 60) for (let y = Math.floor(v.y0 / 60) * 60; y < v.y1; y += 60) if (((x + y) / 60) % 2 === 0) { c.beginPath(); c.arc(x, y, 3, 0, TAU); c.fill() }
    const al = at(t, T4.vl - .1, T4.vl + .2); if (al > 0) { glow(c, BIG.x - 700, BIG.y, 600, '#ef4444', .35 * al * (.6 + .4 * Math.sin(t * 12))); glow(c, BIG.x + 700, BIG.y, 600, '#3b82f6', .3 * al * (.6 + .4 * Math.sin(t * 12 + 3))) }
    phoneW4(c, t); registerW4(c, t); pieW4(c, t); bigW4(c, t); sirenW4(c, t);
    c.restore();
  }
  function shotW4(c, t) { if (!W4K) w4Init(); const q = camOf(W4K, t); drawW4(c, t, q) }
