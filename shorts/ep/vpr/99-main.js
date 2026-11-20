  // ================= сборка пробы: три части подряд, плашка части сверху =================
  const PARTS = [[0, 6.6, morphPart, '1 · ПРЕВРАЩЕНИЯ'], [6.6, 13.0, rigPart, '2 · СКЕЛЕТ'], [13.0, 18.6, tinPart, '3 · BLENDER']];
  const partAt = t => PARTS.find(p => t < p[1]) || PARTS[PARTS.length - 1];
  function scene(c, t) { const p = partAt(t); p[2](c, t - p[0]) }
  let MBC = null;
  function sceneMB(c, t) {   // затвор 180° — среднее 4 моментов за полкадра (у баночки кадры свои — без него)
    if (partAt(t)[2] === tinPart) return scene(c, t);
    const n = 4, sh = 1 / 60; if (!MBC) MBC = mk(WW, HH); const g = MBC.getContext('2d');
    for (let j = 0; j < n; j++) {
      const tj = t + (j / (n - 1) - .5) * sh;
      if (j === 0) { scene(c, tj); continue }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, WW, HH); scene(g, tj);
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1 / (j + 1); c.drawImage(MBC, 0, 0); c.globalAlpha = 1;
    }
  }
  function frameTo(c, t) {
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH); FT = t;
    if (window.NOMB) scene(c, t); else sceneMB(c, t);
    const p = partAt(t); c.setTransform(1, 0, 0, 1, 0, 0); partTag(c, p[3], eo(at(t - p[0], .05, .4)));
  }
  window.EP = {
    P: { bg: '#0f172a', paper: '#fff', ink: '#0f172a', line: '#fff', a1: '#f59e0b', a2: '#ef4444' }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      SC.forEach(S => { this.D[S.key] = t => { frameTo(X, t); return '' } }); window.CUES_READY = 1;
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d');
      return Promise.all([tinLoad(), ...['600 20px M', '800 20px M'].map(f => document.fonts.load(f, 'АЯaz09'))]).then(() => 0);
    },
  };
})();
