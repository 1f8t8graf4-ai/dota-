// v16.6, локация 3 (0:27–0:45): лаборатория 1979. Негатоскоп со снимком трахеи «ПАЦИЕНТ · 16 ЛЕТ», в зажиме тлеет сигарета;
// на «дерёт горло» трахея на снимке наливается красным. Камера опускается на стальной стол: две колбы льют в коническую,
// внутри растёт кристалл никотиновой соли, стрелка «ДОЗА НИКОТИНА» уходит в красное, на чертёж падает штамп «ОТЛОЖЕНО · 1979».
(() => {
  const V6 = window.V6, { lp, at, eo, ei, eio, spr, H1, cl } = V6;

  function xrayCanvas(red) {
    return V6.cnv(512, 768, (x) => {
      x.fillStyle = '#05080e'; x.fillRect(0, 0, 512, 768);
      const lung = (cx, s) => { const g = x.createRadialGradient(cx, 470, 20, cx, 470, 200); g.addColorStop(0, 'rgba(150,180,220,.28)'); g.addColorStop(1, 'rgba(150,180,220,0)'); x.fillStyle = g; x.beginPath(); x.ellipse(cx, 470, 130, 220, s * .12, 0, 7); x.fill() };
      lung(150, -1); lung(362, 1);
      x.strokeStyle = 'rgba(200,220,255,.35)'; x.lineWidth = 6; for (let i = 0; i < 9; i++) { const y = 300 + i * 42; x.beginPath(); x.ellipse(256, y, 210 - i * 4, 40, 0, Math.PI * .05, Math.PI * .95); x.stroke() }   // рёбра
      const col = red ? 'rgba(255,60,40,.95)' : 'rgba(220,240,255,.92)';
      x.strokeStyle = col; x.lineCap = 'round'; x.lineWidth = 34; x.beginPath(); x.moveTo(256, 40); x.lineTo(256, 360); x.stroke();
      x.lineWidth = 22; x.beginPath(); x.moveTo(256, 350); x.quadraticCurveTo(220, 400, 170, 470); x.moveTo(256, 350); x.quadraticCurveTo(292, 400, 342, 470); x.stroke();
      x.lineWidth = 10; for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(256 + s * (60 + k * 30), 420 + k * 20); x.lineTo(256 + s * (110 + k * 40), 520 + k * 40); x.stroke() }
      x.strokeStyle = 'rgba(200,220,255,.5)'; x.lineWidth = 3; for (let k = 0; k < 12; k++) { x.beginPath(); x.moveTo(236, 60 + k * 25); x.lineTo(276, 60 + k * 25); x.stroke() }
      x.fillStyle = 'rgba(230,240,255,.9)'; x.font = '700 26px J'; x.fillText('ПАЦИЕНТ · 16 ЛЕТ', 24, 40); x.font = '500 18px J'; x.fillText('СНИМОК · ГОРЛО', 24, 740);
    });
  }
  function gaugeTex() {
    return V6.tex(V6.cnv(512, 512, (x) => {
      x.fillStyle = '#efe9da'; x.beginPath(); x.arc(256, 256, 250, 0, 7); x.fill();
      for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.25 - i * .15); x.strokeStyle = i > 7 ? '#c0121e' : '#222'; x.lineWidth = i % 5 ? 4 : 8; x.beginPath(); x.moveTo(256 + Math.cos(a) * 200, 256 - Math.sin(a) * 200); x.lineTo(256 + Math.cos(a) * 230, 256 - Math.sin(a) * 230); x.stroke() }
      x.strokeStyle = '#c0121e'; x.lineWidth = 16; x.beginPath(); x.arc(256, 256, 215, -Math.PI * .25, -Math.PI * .05 + .3, false); x.stroke();
      x.fillStyle = '#222'; x.font = '800 34px M'; x.textAlign = 'center'; x.fillText('ДОЗА НИКОТИНА', 256, 380);
    }));
  }

  function buildLab() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x05070b); S.environment = V6.ENV; S.fog = new THREE.FogExp2(0x070a10, .025);
    const bm = V6.brushed([150, 156, 166]);
    const table = new THREE.Mesh(new THREE.BoxGeometry(3, .06, 1.2), V6.std({ map: bm.map, roughnessMap: bm.rough, color: 0x9aa2ac, metalness: .95, roughness: .3, envMapIntensity: .9 })); table.position.y = .9; table.receiveShadow = true; S.add(table);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), V6.std({ color: 0x1c2228, roughness: .9 })); wall.position.set(0, 2, -.7); S.add(wall);
    // негатоскоп
    const xr0 = V6.tex(xrayCanvas(false)), xr1 = V6.tex(xrayCanvas(true));
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, .08), V6.std({ color: 0x2a2e34, metalness: .6, roughness: .4 })); box.position.set(0, 2.05, -.65); S.add(box);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(.86, 1.26), new THREE.MeshBasicMaterial({ map: xr0, color: new THREE.Color(1.05, 1.1, 1.2) })); screen.position.set(0, 2.05, -.605); S.add(screen);
    const screenRed = new THREE.Mesh(new THREE.PlaneGeometry(.86, 1.26), new THREE.MeshBasicMaterial({ map: xr1, color: new THREE.Color(1.2, 1.05, 1.05), transparent: true, opacity: 0 })); screenRed.position.set(0, 2.05, -.6); S.add(screenRed);
    const glowL = new THREE.PointLight(0xbcd4ff, 3, 3, 2); glowL.position.set(0, 2.05, -.3); S.add(glowL);
    // сигарета в зажиме штатива перед экраном
    const steel = V6.std({ color: 0x8a9099, metalness: 1, roughness: .3, envMapIntensity: 1.1 });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .9, 16), steel); rod.position.set(-.55, 1.38, -.35); S.add(rod);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(.01, .01, .32, 12), steel); arm.rotation.z = Math.PI / 2; arm.position.set(-.4, 1.7, -.35); S.add(arm);
    const cig = new THREE.Group(); cig.position.set(-.22, 1.7, -.35); S.add(cig);
    const paper = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .1, 16), V6.std({ color: 0xf2f0ea, roughness: .6 })); paper.rotation.z = Math.PI / 2; cig.add(paper);
    const filt = new THREE.Mesh(new THREE.CylinderGeometry(.0062, .0062, .03, 16), V6.std({ color: 0xc8843c, roughness: .6 })); filt.rotation.z = Math.PI / 2; filt.position.x = -.065; cig.add(filt);
    const ember = new THREE.Mesh(new THREE.SphereGeometry(.007, 12, 8), new THREE.MeshStandardMaterial({ color: 0x200000, emissive: 0xff5a1a, emissiveIntensity: 8 })); ember.position.x = .052; cig.add(ember);
    const smoke = V6.vapor({ n: 24, life: 3.2, rise: .7, spread: .03, size: .26, size0: .02, op: .22, col: 0xcfc8c0, seed: 31, dir: [.2, 1, 0] }); smoke.position.set(-.16, 1.71, -.35); S.add(smoke);
    // колбы: стекло — блики и прозрачность, жидкость — отдельная фигура внутри
    const glassM = V6.phy({ color: 0x8fb2c8, metalness: 0, roughness: .08, transparent: true, opacity: .14, clearcoat: 0, envMapIntensity: .45, side: THREE.DoubleSide, depthWrite: false });
    const erl = new THREE.LatheGeometry([[0, 0], [.16, 0], [.17, .01], [.06, .26], [.045, .3], [.045, .4], [.05, .41]].map(([a, b]) => new THREE.Vector2(a, b)), 64);
    const flask = new THREE.Mesh(erl, glassM); flask.position.set(.15, .93, .1); S.add(flask);
    const liqM = V6.std({ color: 0xd98a2a, roughness: .25, metalness: 0, emissive: 0x1a0a00, transparent: true, opacity: .85 });
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(.1, .155, .1, 48), liqM); liq.position.set(.15, .99, .1); liq.scale.y = .01; S.add(liq);
    const small = []; for (const sd of [-1, 1]) { const g = new THREE.Group(); g.position.set(.15 + sd * .42, 1.12, .1); const fm = new THREE.Mesh(new THREE.LatheGeometry([[0, -.12], [.08, -.12], [.09, -.02], [.03, .1], [.03, .16]].map(([a, b]) => new THREE.Vector2(a, b)), 48), glassM); g.add(fm); const lq = new THREE.Mesh(new THREE.SphereGeometry(.072, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), V6.std({ color: sd < 0 ? 0xd8c070 : 0x9fd8c8, roughness: .2, transparent: true, opacity: .85 })); lq.position.y = -.05; g.add(lq); S.add(g); small.push({ g, sd }) }
    const streamM = V6.std({ color: 0xffc860, roughness: .15, emissive: 0x2a1400, transparent: true, opacity: .9 });
    const streams = small.map(() => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, 1, 12), streamM); m.visible = false; S.add(m); return m });
    // кристалл соли: октаэдр с гранями, растёт в колбе
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(.06, 0), V6.phy({ color: 0xfff2d0, metalness: 0, roughness: .08, clearcoat: 1, transparent: true, opacity: .9, envMapIntensity: 2.2, emissive: 0x2a2010 })); crystal.position.set(.15, 1.05, .1); S.add(crystal);
    // прибор «ДОЗА НИКОТИНА»
    const gauge = new THREE.Group(); gauge.position.set(-.75, 1.12, .05); gauge.rotation.y = .35; S.add(gauge);
    const gb = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .06, 64), [steel, V6.std({ map: gaugeTex(), roughness: .5 }), steel]); gb.rotation.x = Math.PI / 2; gauge.add(gb);
    const needle = new THREE.Mesh(new THREE.BoxGeometry(.006, .13, .006), V6.std({ color: 0x111111 })); needle.geometry.translate(0, .06, 0); needle.position.z = .035; gauge.add(needle);
    const legG = new THREE.Mesh(new THREE.CylinderGeometry(.02, .03, .2, 16), steel); legG.position.set(-.75, 1.0, .05); S.add(legG);
    // чертёж и штамп «ОТЛОЖЕНО · 1979»
    const bp = V6.cnv(600, 420, (x) => { x.fillStyle = '#1d4f86'; x.fillRect(0, 0, 600, 420); x.strokeStyle = 'rgba(220,235,255,.8)'; x.lineWidth = 3; x.strokeRect(20, 20, 560, 380); x.strokeRect(220, 60, 90, 300); x.strokeRect(240, 80, 50, 70); x.beginPath(); x.moveTo(260, 160); x.lineTo(280, 170); x.lineTo(260, 180); x.lineTo(280, 190); x.stroke(); x.fillStyle = 'rgba(220,235,255,.9)'; x.font = '600 18px J'; x.fillText('ИСПАРИТЕЛЬ', 340, 140); x.fillText('ЁМКОСТЬ · СОЛЬ', 340, 200); x.fillText('1979', 500, 380) });
    const bpT = V6.tex(bp), bpBase = V6.cnv(600, 420, x => x.drawImage(bp, 0, 0));
    const blue = new THREE.Mesh(new THREE.PlaneGeometry(.6, .42), V6.std({ map: bpT, roughness: .8 })); blue.rotation.x = -Math.PI / 2; blue.rotation.z = .08; blue.position.set(.75, .934, .25); S.add(blue);
    // свет
    const key = new THREE.SpotLight(0xe8f0ff, 9, 6, .55, .75, 1.4); key.position.set(.8, 2.6, 1.2); key.target.position.set(0, .9, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); S.add(key, key.target);
    const warm = new THREE.PointLight(0xffb060, 1.5, 2.5, 2); warm.position.set(.2, 1.3, .4); S.add(warm);
    S.add(new THREE.AmbientLight(0x1a2230, .3));
    const dust = V6.dust(200, [-1, .9, -.6, 1.2, 2.6, .8]); S.add(dust);
    const cam = V6.persp(40);
    return { S, cam, screenRed, glowL, smoke, small, streams, liq, crystal, needle, bp, bpT, bpBase, dust, flask };
  }

  V6.build.push((V) => {
    const w = V.w, K = { prob: w('но'), smoke: w('дым'), acrid: w('едкий'), tear: w('дерёт'), throat: w('горло'), teens: w('подросткам'), chem: w('химики'), mix: w('смешали'), acid: w('кислотой'), salt: w('соль'), soft: w('мягко'), dose: w('убойной'), vop: w('электронных'), fail: w('что', 3) };
    const t0 = K.prob - .1, L = buildLab(); let stamped = -1;
    function upd(t) {
      const red = eo(at(t, K.acrid, K.tear + .2)) * (1 - at(t, K.chem - .2, K.chem + .4)); L.screenRed.material.opacity = red; L.glowL.color.setRGB(lp(.74, 1, red), lp(.83, .3, red), lp(1, .25, red));
      L.smoke.userData.upd(t);
      // колбы наклоняются и льют на «смешали … кислотой»
      L.small.forEach(({ g, sd }, i) => { const k = eio(at(t, K.mix - .2 + i * .25, K.mix + .3 + i * .25)) * (1 - eio(at(t, K.salt - .1, K.salt + .3))); g.rotation.z = -sd * 1.9 * k; const st = L.streams[i]; st.visible = k > .7; if (st.visible) { st.position.set(.15 + sd * .2, 1.12, .1); st.scale.y = .25; st.rotation.z = sd * .9 } });
      const lv = eio(at(t, K.mix, K.salt)); L.liq.scale.y = lp(.01, 1, lv); L.liq.position.y = .935 + .05 * lp(.01, 1, lv);
      const kc = eo(at(t, K.salt - .2, K.soft + .3)); L.crystal.scale.setScalar(lp(.05, 1, kc)); L.crystal.rotation.set(t * .3, t * .5, 0); L.crystal.visible = kc > 0;
      L.needle.rotation.z = lp(1.1, -.95, eo(at(t, K.dose - .2, K.dose + .5))) + Math.sin(t * 18) * .02 * at(t, K.dose, K.dose + .3);
      const sk = t > K.fail ? 1 : 0; if (sk !== stamped) { const x = L.bp.getContext('2d'); x.drawImage(L.bpBase, 0, 0); if (sk) { x.save(); x.translate(300, 230); x.rotate(-.14); x.strokeStyle = 'rgba(210,30,40,.92)'; x.lineWidth = 8; x.strokeRect(-200, -42, 400, 84); x.fillStyle = 'rgba(210,30,40,.92)'; x.font = '800 44px M'; x.textAlign = 'center'; x.fillText('ОТЛОЖЕНО · 1979', 0, 16); x.restore() } L.bpT.needsUpdate = true; stamped = sk }
      L.dust.userData.upd(t);
      V6.camPath(L.cam, [
        [t0, [.2, 1.95, 1.5], [0, 1.95, -.6], 40],
        [K.throat + .4, [.15, 1.95, 1.15], [0, 1.95, -.6], 38],
        [K.chem + .3, [.2, 1.55, 1.15], [.1, 1.05, .1], 40],
        [K.salt + .2, [.25, 1.3, 1.0], [.15, 1.05, .1], 36],
        [K.dose + .4, [-.35, 1.3, .9], [-.4, 1.1, .05], 36],
        [K.fail + .3, [.6, 1.55, .9], [.72, .93, .25], 38]], t);
    }
    const fx = t => ({ exp: .8, bloom: .5, br: .5, th: 1.25, focus: t < K.chem ? 1.5 : t < K.dose ? .7 : 1.0, ap: .003, blur: .009, vig: .65 });
    return [{ a: t0, scene: L.S, cam: L.cam, upd, fx }];
  });
})();
