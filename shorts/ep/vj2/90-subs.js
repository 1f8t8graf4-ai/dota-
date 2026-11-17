  // ================= субтитры как у dynastixxx: крупно по центру, по 1–3 слова, звучащее слово — жёлтым =================
  let BIGS = null;
  function bigChunks() {
    const out = []; let cur = [];
    const flush = () => { if (cur.length) { out.push(cur); cur = [] } };
    TLW.forEach((w, i) => {
      const s = (cur.map(x => x.d).join(' ') + ' ' + w.d).trim();
      if (cur.length && (cur.length >= 3 || s.length > 19)) flush();
      cur.push(w);
      const nx = TLW[i + 1]; if (/[.,!?…:;»]$/.test(w.d) || !nx || nx.a - w.b > .3) flush();
    });
    return out.map((ws, i) => ({ ws, a: ws[0].a - .04, e: out[i + 1] ? out[i + 1][0].a - .04 : ws[ws.length - 1].b + .5 }));
  }
  const clean = s => s.replace(/[«»]/g, '').replace(/[.,;:]+$/, '');
  function subsBig(c, t) {
    if (!BIGS) BIGS = bigChunks(); if (t > T6.film - .1) return; const ch = BIGS.find(x => t >= x.a && t < x.e); if (!ch) return;
    const pop = bo(at(t, ch.a, ch.a + .12)), o = { f: 'M', w: 800, s: 84, ls: 0 };
    const words = ch.ws.map(w => clean(w.d)).filter(Boolean), sp = 36;
    let ws = words.map(s => tw(c, s, o)), W = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1), k = W > 960 ? 960 / W : 1;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(540, 1470); c.scale(k * lp(.82, 1, pop), k * lp(.82, 1, pop)); c.globalAlpha = cl(pop * 2);
    let x = -W / 2; ch.ws.forEach((w, i) => { const s = clean(w.d); if (!s) return; const ww = tw(c, s, o), on = t >= w.a - .03 && (i === ch.ws.length - 1 || t < ch.ws[i + 1].a - .03);
      const sc = on ? 1.06 : 1; c.save(); c.translate(x + ww / 2, 0); c.scale(sc, sc);
      tx(c, s, 0, 6, { ...o, c: 'rgba(0,0,0,.45)', sw: 22, sc: 'rgba(0,0,0,.45)' });
      tx(c, s, 0, 0, { ...o, c: on ? '#ffd23f' : '#fff', sw: 14, sc: '#0b0e1a' }); c.restore(); x += ww + sp });
    c.restore();
  }
