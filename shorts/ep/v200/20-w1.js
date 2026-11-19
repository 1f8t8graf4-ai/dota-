  // ================= мир 1: щит Marlboro Country у трассы на закате (кадр 0) → ветер рвёт плакат с угла → под ним дамская реклама, нырок в дыру (#088) =================
  let T1 = null, K1 = null, W1PRE = null, W1PEEL = null;   // v20.1: W1PRE / W1PEEL — только когда главу рисует мостик «Льда» (камера до кадра 0, порыв ветра)
  const W1V = .4;   // v20.1: фильм — в кадре 0 камера уже наезжает (лог. масштаба в секунду); мостик «Льда» приходит с той же скоростью
  function w1Init() {
    const hk = SA('hook') !== null, s1 = SA('s1');
    T1 = { hk, s1, marl: Ws('s1', 'мальборо'), do: Ws('s1', 'до'), zh: Ws('s1', 'жизнь'), end: SA('s2') - .02,
      ledi: hk ? Ws('hook', 'леди') : -9, brut: hk ? Ws('hook', 'брутальности') : -9 };
    const a = T1;   // камера: кадр 0 → пачка → угол → нырок в розовый слой под плакатом
    K1 = [KY(0, 540, 960, 1)];
    // v20.2: до «до» камера держит щит целиком (надпись и всадник в кадре), потом едет к отогнутому углу
    if (hk) K1.push(KY(a.brut, 545, 944, 1.05), KY(a.s1 - .2, 540, 912, 1.1));   // крючок: медленный наезд, камера не стоит
    else { K1[0].v = [0, 0, W1V, 0]; K1.push(KY(.62, 540, 905, 1.12)) }   // v20.1: фильм — кадр 0 на ходу (наезд продолжает нырок мостика «Льда») и сразу мягко тормозит
    K1.push(KY(a.do + .05, 548, 880, 1.16), KY(a.do + .6, 760, 860, 1.42), KY(a.zh - .5, 860, 860, 1.9), KY(a.zh + .05, 900, 870, 2.6), KY(a.end, 918, 872, 9.5));
  }
  function w1Peel(t) {
    const a = T1; let px = 210 + 14 * Math.sin(t * 3.1) + 8 * Math.sin(t * 7.3);   // ветер треплет угол
    if (a.hk) px += 40 * eo(at(t, a.ledi - .3, a.ledi + .6));
    return px + 1250 * eio(at(t, a.do - .1, a.zh + .2)) + (W1PEEL ? W1PEEL(t) : 0);
  }
  function tumbleweed(c, x, y, R, rot) {
    c.save(); c.translate(x, y); c.rotate(rot); c.strokeStyle = '#8A4A2A'; c.lineWidth = 4;
    for (let k = 0; k < 14; k++) { c.beginPath(); c.arc(((k * 13) % 21 - 10) * R / 40, ((k * 7) % 17 - 8) * R / 40, R * (.65 + ((k * 11) % 22) / 40), k * .9, k * .9 + 2.1); c.stroke() } c.restore();
  }
  function w1World(c, t, q) {
    layer(c, q, .3, cc => { P0(cc, .3); desertFar(cc) });   // дальний план почти стоит
    layer(c, q, 1, cc => { desertGround(cc, t); billboardFrame(cc); poster(cc, t, { peelPx: w1Peel(t), glow: eo(at(t, T1.marl - .05, T1.marl + .3)) * (1 - eio(at(t, T1.do + .4, T1.do + 1))) }) });   // v20.2: на «Мальборо» имя на пачке загорается
    layer(c, q, 1.35, cc => { P0(cc, 1.35);   // передний план: перекати-поле катится, песок по ветру
      const u = (t * .045 + .62) % 1, x = lp(-300, 1500, u); tumbleweed(cc, x, 1530 - Math.abs(Math.sin(t * 2.4)) * 26, 44, t * 2.2);
      cc.strokeStyle = 'rgba(242,180,90,.5)'; cc.lineWidth = 3;
      [[90, 1500], [270, 1560], [500, 1510], [690, 1590], [210, 1650], [620, 1680], [960, 1640], [-200, 1600], [1200, 1540]].forEach(([x0, y0], i) => { const dx = ((t * 160 + i * 90) % 400); cc.beginPath(); cc.moveTo(x0 + dx, y0); cc.lineTo(x0 + dx + 80, y0 - 16); cc.stroke() });
    });
  }
  function w1Shot(c, t) { const v = camAt(K1, t); if (W1PRE && t < 0) v[2] = W1PRE(t); w1World(c, t, camObj(v)) }
