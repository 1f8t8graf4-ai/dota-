// v16.6, локация 7 (1:22–1:29): стол боссов. «…а треть новой компании за тринадцать миллиардов долларов выкупил производитель
// «Мальборо». Старый план сработал идеально». Диаграмма доли JUUL на столе, красная доля 35 % растёт, сверху падает пачка «Мальборо»,
// литая плашка MARLBORO ложится наискось поперёк доли; камера едет по столу к записке 1973 года — штамп «ПЛАН ВЫПОЛНЕН».
(() => {
  const V6 = window.V6, { lp, at, eo, ei, eio, spr, H1 } = V6;

  function packTex() {   // пачка: белый верх, красная «крыша», надпись — без мелкого текста марки
    return V6.tex(V6.cnv(512, 820, (x) => {
      x.fillStyle = '#f4f1ea'; x.fillRect(0, 0, 512, 820);
      x.fillStyle = '#d4142a'; x.beginPath(); x.moveTo(0, 0); x.lineTo(512, 0); x.lineTo(512, 300); x.lineTo(256, 160); x.lineTo(0, 300); x.closePath(); x.fill();
      x.fillStyle = '#111'; x.font = 'italic 700 92px "Liberation Serif"'; x.textAlign = 'center'; x.fillText('Marlboro', 256, 470);
      x.fillStyle = 'rgba(0,0,0,.5)'; x.font = '600 26px M'; x.fillText('FILTER CIGARETTES', 256, 520);
      x.fillStyle = '#eee'; x.fillRect(30, 660, 452, 120); x.strokeStyle = '#111'; x.lineWidth = 4; x.strokeRect(30, 660, 452, 120);
      x.fillStyle = '#111'; x.font = '800 30px M'; x.fillText('КУРЕНИЕ УБИВАЕТ', 256, 732);
    }));
  }
  function memoTex(done) {
    return V6.tex(V6.paperCanvas(600, 820, { lines: true, top: 230, gap: 26, lh: 7, draw: (x, w, h) => {
      x.fillStyle = '#222'; x.font = '700 22px J'; x.textAlign = 'left'; x.fillText('R.J. REYNOLDS TOBACCO COMPANY', 60, 80);
      x.font = '800 44px M'; x.fillText('МЕМОРАНДУМ', 60, 140); x.font = '500 20px J'; x.fillText('2 ФЕВРАЛЯ 1973', 60, 176);
      x.fillStyle = 'rgba(255,214,0,.55)'; x.fillRect(56, 470, 420, 34); x.fillRect(56, 504, 300, 34);
      x.fillStyle = '#111'; x.font = '700 26px J'; x.fillText('МЫ ДОЛЖНЫ ПОЛУЧИТЬ', 60, 496); x.fillText('СВОЮ ДОЛЮ МОЛОДЁЖНОГО РЫНКА', 60, 530);
      x.save(); x.translate(430, 720); x.rotate(-.12); x.strokeStyle = 'rgba(190,20,30,.85)'; x.lineWidth = 6; x.strokeRect(-120, -32, 240, 64); x.fillStyle = 'rgba(190,20,30,.85)'; x.font = '800 32px M'; x.textAlign = 'center'; x.fillText('СЕКРЕТНО', 0, 12); x.restore();
      if (done) { x.save(); x.translate(300, 380); x.rotate(-.1); x.globalAlpha = .9; x.strokeStyle = '#13865f'; x.lineWidth = 10; x.strokeRect(-250, -60, 500, 120); x.fillStyle = '#13865f'; x.font = '800 54px M'; x.textAlign = 'center'; x.fillText('ПЛАН ВЫПОЛНЕН', 0, 20); x.restore() }
    } }));
  }

  function buildBoss() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x050406); S.environment = V6.ENV; S.fog = new THREE.FogExp2(0x060407, .05);
    const wd = V6.wood([74, 40, 20]);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(5, .1, 3), V6.std({ map: wd.map, roughnessMap: wd.rough, roughness: .22, metalness: .05, envMapIntensity: .7 })); desk.position.y = -.05; desk.receiveShadow = true; S.add(desk);
    // окно с ночным городом за столом (далеко, в размытии)
    const city = V6.tex(V6.cnv(1024, 512, (x) => { x.fillStyle = '#0a0d1c'; x.fillRect(0, 0, 1024, 512); for (let i = 0; i < 60; i++) { const bx = H1(i * 3.1) * 1024, bw = 20 + 40 * H1(i * 1.7), bh = 120 + 300 * H1(i * 5.3); x.fillStyle = '#111733'; x.fillRect(bx, 512 - bh, bw, bh); x.fillStyle = 'rgba(255,200,120,.8)'; for (let k = 0; k < bh / 18; k++) for (let q = 0; q < bw / 10; q++) if (H1(i * 97 + k * 7 + q) > .72) x.fillRect(bx + 3 + q * 10, 512 - bh + 6 + k * 18, 4, 7) } }));
    const winM = new THREE.MeshBasicMaterial({ map: city, color: new THREE.Color(1.4, 1.4, 1.4) });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.5), winM); win.position.set(0, 1.6, -3.2); S.add(win);
    // диаграмма: белый диск + красная доля 35 %
    const pie = new THREE.Group(); pie.position.set(-.15, 0, -.1); S.add(pie);
    const discTex = V6.tex(V6.cnv(512, 512, (x) => { x.fillStyle = '#f2f0ea'; x.fillRect(0, 0, 512, 512); x.fillStyle = '#16161a'; x.font = '800 92px U'; x.textAlign = 'center'; x.fillText('JUUL', 210, 352) }));
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .06, 96), [V6.std({ color: 0xbdbab2, roughness: .45 }), V6.std({ map: discTex, color: 0xc9c6be, roughness: .45 }), V6.std({ color: 0xbdbab2 })]); disc.position.y = .03; disc.rotation.y = Math.PI / 2; disc.castShadow = disc.receiveShadow = true; pie.add(disc);
    const wedgeM = V6.std({ color: 0xa50d1e, roughness: .32, metalness: .1, emissive: 0x120002, envMapIntensity: .7 });
    const wedge = new THREE.Mesh(new THREE.CylinderGeometry(.64, .64, .16, 96, 1, false, 0, .35 * Math.PI * 2), wedgeM); wedge.castShadow = true; pie.add(wedge);
    const n35 = new THREE.Mesh(V6.text3d('35 %', { size: .12, depth: .03, bt: .006, bs: .004 }), V6.std({ color: 0xffffff, roughness: .3 })); n35.rotation.x = -Math.PI / 2; pie.add(n35);
    const bill = new THREE.Mesh(V6.text3d('$12,8 МЛРД', { size: .12, depth: .05, bt: .008, bs: .005 }), V6.std({ color: 0xf2e9d8, metalness: .6, roughness: .3, envMapIntensity: 1.2 })); bill.castShadow = true; S.add(bill);
    // пачка и плашка
    const pt = packTex(), side = V6.std({ color: 0xf2efe8, roughness: .35 });
    const pack = new THREE.Mesh(new THREE.BoxGeometry(.5, .8, .2), [side, side, V6.std({ color: 0xd4142a, roughness: .35 }), side, V6.std({ map: pt, roughness: .3, metalness: 0, envMapIntensity: .6 }), side]); pack.castShadow = true; S.add(pack);
    const plateT = V6.tex(V6.labelCanvas(700, 160, [['MARLBORO', 100, '#ffffff', '700 100px "Liberation Serif"']], { bg: '#c8102a', border: '#ffffff', bw: 6 }));
    const plate = new THREE.Mesh(new THREE.BoxGeometry(.66, .15, .03), [V6.std({ color: 0x9a0c20, metalness: .6, roughness: .3 }), V6.std({ color: 0x9a0c20 }), V6.std({ color: 0x9a0c20 }), V6.std({ color: 0x9a0c20 }), V6.std({ map: plateT, metalness: .5, roughness: .3, envMapIntensity: 1 }), V6.std({ color: 0x9a0c20 })]); plate.castShadow = true; S.add(plate);
    // записка 1973 года и штамп
    const memo = new THREE.Mesh(new THREE.PlaneGeometry(.6, .82), V6.std({ map: memoTex(false), roughness: .85 })); memo.rotation.x = -Math.PI / 2; memo.rotation.z = .06; memo.position.set(1.5, .003, .25); memo.receiveShadow = true; S.add(memo);
    const memoDone = memoTex(true);
    const stamp = new THREE.Group(); const hd = new THREE.Mesh(new THREE.CylinderGeometry(.05, .07, .22, 32), V6.std({ map: wd.map, roughness: .4 })); hd.position.y = .2; const knob = new THREE.Mesh(new THREE.SphereGeometry(.07, 24, 16), V6.std({ map: wd.map, roughness: .35 })); knob.position.y = .33; const base = new THREE.Mesh(new THREE.BoxGeometry(.3, .07, .14), V6.std({ color: 0x2a2a2e, metalness: .4, roughness: .5 })); base.position.y = .05;
    stamp.add(hd, knob, base); stamp.traverse(o => o.castShadow = true); S.add(stamp);
    // свет: тёплая лампа сверху-слева, красный контровой от окна, мягкая заливка
    const lamp = new THREE.SpotLight(0xffd29a, 16, 8, .55, .7, 1.4); lamp.position.set(-.8, 2.2, 1.2); lamp.target.position.set(.2, 0, 0); lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); S.add(lamp, lamp.target);
    const rim = new THREE.SpotLight(0xff5a4a, 25, 8, .6, .7, 1.4); rim.position.set(.6, 1.6, -2.6); rim.target.position.set(0, 0, 0); S.add(rim, rim.target);
    const lamp2 = new THREE.SpotLight(0xffe2b8, 0, 6, .45, .6, 1.4); lamp2.position.set(1.2, 1.8, 1.0); lamp2.target.position.set(1.5, 0, .25); lamp2.castShadow = true; S.add(lamp2, lamp2.target);
    S.add(new THREE.AmbientLight(0x2a1c18, .3));
    const dust = V6.dust(160, [-1.2, .1, -1, 2, 2, 1.2]); S.add(dust);
    const thud = V6.vapor({ n: 14, life: 1.2, rise: .25, spread: .7, size: .6, size0: .2, op: .25, col: 0xcfc4b4, seed: 51, dir: [0, .2, 0] }); S.add(thud);
    const cam = V6.persp(40);
    return { S, cam, pie, wedge, n35, bill, pack, plate, memo, memoDone, stamp, lamp2, dust, thud };
  }

  V6.build.push((V) => {
    const w = V.w, K = { third: w('треть'), company: w('компании'), b13: w('тринадцать'), dollars: w('долларов'), bought: w('выкупил'), marl: w('мальборо'), plan: w('старый'), worked: w('идеально'), adm: w('признайтесь') };
    const t0 = K.third - .1, B = buildBoss();
    function upd(t) {
      const kw = eio(at(t, K.third + .1, K.bought + .3));   // доля растёт от «треть» до «выкупил»
      B.wedge.scale.set(1, lp(.05, 1, kw), 1); B.wedge.position.y = .06 + .08 * lp(.05, 1, kw); B.wedge.visible = kw > 0;
      const am = .35 * Math.PI; B.n35.position.set(Math.sin(am) * .34, .38 + .2 * lp(.05, 1, kw), Math.cos(am) * .34); B.n35.visible = kw > .6; B.n35.rotation.set(0, -.15, 0);
      const kb = spr(at(t, K.b13 - .1, K.b13 + .4)); B.bill.position.set(-.05, .52, -1.0); B.bill.scale.setScalar(kb || .001); B.bill.rotation.y = .1;
      // пачка падает на «Мальборо» (за диаграмму), плашка ложится наискось поперёк доли
      const kp = at(t, K.marl - .5, K.marl - .12), landed = t > K.marl - .12;
      B.pack.position.set(.62, landed ? .4 : lp(3.2, .4, ei(kp)), -.55); B.pack.rotation.set(landed ? 0 : (1 - kp) * .5, -.35, landed ? 0 : (1 - kp) * .25);
      B.pack.visible = t > K.marl - .5;
      B.thud.position.set(.62, .02, -.45); B.thud.userData.upd(t - (K.marl - .12), landed ? 1 - at(t, K.marl + .4, K.marl + 1.2) : 0);
      const kpl = at(t, K.marl - .02, K.marl + .32);
      B.plate.position.set(lp(.9, .3, eo(kpl)), lp(1.2, .19, eo(kpl)), lp(.4, .02, eo(kpl))); B.plate.rotation.set(-Math.PI / 2 + lp(-.8, 0, spr(kpl)), 0, lp(1.2, .55, spr(kpl))); B.plate.visible = kpl > 0;
      // штамп на «идеально»
      const ks = at(t, K.worked - .35, K.worked), up = at(t, K.worked + .08, K.worked + .45);
      B.stamp.position.set(1.52, lp(.9, 0, ei(ks)) + .5 * eo(up), .28); B.stamp.rotation.y = -.1; B.stamp.visible = t > K.plan - .2;
      const want = t > K.worked ? B.memoDone : B.memo.userData.base; if (B.memo.material.map !== want) { B.memo.material.map = want; B.memo.material.needsUpdate = true }
      B.lamp2.intensity = 7 * eo(at(t, K.plan - .3, K.plan + .4));
      B.dust.userData.upd(t);
      V6.camPath(B.cam, [[t0, [-.35, 1.55, 2.7], [0, .2, -.35], 40], [K.marl - .6, [.05, 1.4, 2.55], [.15, .3, -.4], 40], [K.plan - .1, [.4, 1.35, 2.3], [.45, .25, -.3], 40], [K.plan + .7, [1.5, 1.3, 1.45], [1.5, 0, .2], 38], [K.adm, [1.5, 1.2, 1.3], [1.5, 0, .22], 36]], t);
    }
    B.memo.userData.base = B.memo.material.map;
    const fx = t => ({ exp: .8, bloom: .45, br: .45, th: 1.25, focus: t < K.plan + .3 ? 2.6 : 1.5, ap: .003, blur: .008, vig: .65,
      flash: Math.max(0, 1 - Math.abs(t - (K.marl - .12)) / .05) * .12 + Math.max(0, 1 - Math.abs(t - K.worked) / .05) * .1 });
    return [{ a: t0, scene: B.S, cam: B.cam, upd, fx }];
  });
})();
