// v16.6, локация 1 (0:00–0:09): ночная улица после дождя → витрина вейп-шопа «VAPE SHOP 24/7». На подсвеченном подиуме — вейп «МАНГО»
// (без настоящих марок). «…замена сигаретам» — в уличную урну падают смятые пачки; «…манго и мяты» — камера проходит сквозь стекло к прилавку:
// «МЯТА», «КОЛА», дольки манго, мята, лёд в холодном пару; «А знаете ли вы, что жидкость…» — наезд в окошко с жидкостью (переход в 1973).
(() => {
  const V6 = window.V6, { lp, at, eo, ei, eio, spr, H1, cl } = V6;

  function vapeMesh(o) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.RoundedBoxGeometry(.075, .2, .036, 4, .012), V6.std({ color: o.col, metalness: .45, roughness: .22, envMapIntensity: 1.4 })); body.position.y = .1; g.add(body);
    const mp = new THREE.Mesh(new THREE.RoundedBoxGeometry(.06, .05, .026, 4, .01), V6.std({ color: o.mp || 0xf2efe8, roughness: .35, envMapIntensity: 1 })); mp.position.y = .222; g.add(mp);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(.038, .07), new THREE.MeshStandardMaterial({ color: o.liq, emissive: o.liq, emissiveIntensity: .9, roughness: .1 })); win.position.set(0, .13, .0185); g.add(win);
    const lab = V6.tex(V6.labelCanvas(256, 64, [[o.name, 40, o.lc || '#ffffff']], { bg: 'rgba(0,0,0,0)' }));
    const lb = new THREE.Mesh(new THREE.PlaneGeometry(.06, .015), new THREE.MeshBasicMaterial({ map: lab, transparent: true })); lb.position.set(0, .07, .0186); g.add(lb);
    g.traverse(m => m.castShadow = true); g.userData.win = win; return g;
  }
  function packMesh(kind) {
    const t = V6.tex(V6.cnv(200, 320, (x) => {
      const P = { marl: ['#f2f0ea', '#d4142a', 'Marlboro'], camel: ['#e6c46a', '#7a4f1c', 'CAMEL'], win: ['#f2f0ea', '#c8102a', 'WINSTON'] }[kind];
      x.fillStyle = P[0]; x.fillRect(0, 0, 200, 320); x.fillStyle = P[1];
      if (kind === 'marl') { x.beginPath(); x.moveTo(0, 0); x.lineTo(200, 0); x.lineTo(200, 120); x.lineTo(100, 60); x.lineTo(0, 120); x.fill() } else x.fillRect(0, 120, 200, 70);
      x.fillStyle = kind === 'win' ? '#fff' : '#111'; x.font = '800 34px O'; x.textAlign = 'center'; x.fillText(P[2], 100, 172);
    }));
    const side = V6.std({ color: 0xe8e2d4, roughness: .55 }), front = V6.std({ map: t, roughness: .5 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(.055, .088, .022, 3, 3, 1), [side, side, side, side, front, front]);
    const p = m.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (1 + (H1(i * 3.3) - .5) * .25), p.getY(i) * (1 + (H1(i * 7.7) - .5) * .2), p.getZ(i) * (1 + (H1(i * 5.1) - .5) * .5));   // смято
    m.geometry.computeVertexNormals(); m.castShadow = true; return m;
  }

  function buildShop() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x02030a); S.environment = V6.ENV; S.fog = new THREE.FogExp2(0x060818, .06);
    // мокрый асфальт: тёмный, почти зеркальный, с лужами
    const as = V6.field(512, 512, (i, j) => { const v = 18 + 26 * V6.fbm(i / 40, j / 40, 4); return [v, v, v * 1.1] });
    const rough = V6.field(256, 256, (i, j) => { const v = V6.fbm(i / 30, j / 30, 3) > .52 ? 25 : 150; return [v, v, v] });
    const street = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), V6.std({ map: V6.tex(as, { rep: [4, 4] }), roughnessMap: V6.tex(rough, { lin: true, rep: [3, 3] }), roughness: 1, metalness: .2, envMapIntensity: .9 }));
    street.rotation.x = -Math.PI / 2; street.position.z = 2; street.receiveShadow = true; S.add(street);
    // фасад магазина, витрина, вывеска
    const fs = new THREE.Shape(); fs.moveTo(-2.5, 0); fs.lineTo(2.5, 0); fs.lineTo(2.5, 4); fs.lineTo(-2.5, 4); fs.lineTo(-2.5, 0);
    const wh = new THREE.Path(); wh.moveTo(-1.2, .3); wh.lineTo(1.2, .3); wh.lineTo(1.2, 2.1); wh.lineTo(-1.2, 2.1); wh.lineTo(-1.2, .3); fs.holes.push(wh);   // проём витрины
    const facade = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: .2, bevelEnabled: false }), V6.std({ color: 0x15151c, roughness: .6, metalness: .2 })); facade.position.set(0, 0, -.7); S.add(facade);
    const neonM = new THREE.MeshBasicMaterial({ color: new THREE.Color(.4, 2.2, 2.6) });   // неоновая рамка витрины
    for (const [w, h, x, y] of [[2.44, .025, 0, 2.12], [2.44, .025, 0, .28], [.025, 1.86, -1.22, 1.2], [.025, 1.86, 1.22, 1.2]]) { const n = new THREE.Mesh(new THREE.BoxGeometry(w, h, .02), neonM); n.position.set(x, y, -.48); S.add(n) }
    const interior = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.0, 1.8), V6.std({ color: 0x3a1c2c, roughness: .8, side: THREE.BackSide })); interior.position.set(0, 1.2, -1.55); S.add(interior);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.8), V6.phy({ color: 0x9fc0ff, metalness: 0, roughness: .03, transparent: true, opacity: .12, clearcoat: 1, envMapIntensity: 2.2 })); glass.position.set(0, 1.2, -.49); S.add(glass);
    const signT = V6.tex(V6.cnv(1024, 256, (x) => { x.fillStyle = '#000'; x.fillRect(0, 0, 1024, 256); x.font = '800 150px O'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = '#ff2fae'; x.shadowBlur = 30; x.fillStyle = '#ffb8ea'; x.fillText('VAPE SHOP 24/7', 512, 132) }));
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .55), new THREE.MeshBasicMaterial({ map: signT, color: new THREE.Color(2.6, 2.2, 2.6), blending: THREE.AdditiveBlending, transparent: true })); sign.position.set(0, 2.55, -.48); S.add(sign);
    const signL = new THREE.PointLight(0xff3ab0, 6, 7, 2); signL.position.set(0, 2.5, .2); S.add(signL);
    // подиум и вейпы внутри
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(.22, .24, .5, 48), V6.std({ color: 0x1a1a22, metalness: .6, roughness: .25 })); pod.position.set(0, .55, -1.0); pod.receiveShadow = true; S.add(pod);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.22, .006, 8, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.5, 1.4, .6) })); ring.rotation.x = Math.PI / 2; ring.position.set(0, .801, -1.0); S.add(ring);
    const hero = vapeMesh({ col: 0xe8432e, liq: 0xffb43a, name: 'МАНГО' }); hero.position.set(0, .8, -1.0); hero.scale.setScalar(1.6); S.add(hero);
    const mint = vapeMesh({ col: 0x2fcfae, liq: 0xffd36a, name: 'МЯТА' }); mint.position.set(-.18, .8, -.95); mint.rotation.y = .4; mint.scale.setScalar(1.25); S.add(mint);
    const cola = vapeMesh({ col: 0xf2efe8, liq: 0x6b2a12, name: 'КОЛА', lc: '#8a2a1a', mp: 0x2a2a30 }); cola.position.set(.19, .8, -.95); cola.rotation.y = -.4; cola.scale.setScalar(1.25); S.add(cola);
    const heroL = new THREE.SpotLight(0xfff0e0, 7, 3, .4, .6, 1.4); heroL.position.set(.2, 1.8, -.6); heroL.target.position.set(0, .9, -1.0); heroL.castShadow = true; heroL.shadow.mapSize.set(1024, 1024); S.add(heroL, heroL.target);
    // фрукты и лёд у вейпов
    const mango = []; for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(.035, 24, 16, 0, Math.PI), V6.std({ color: 0xffa82e, roughness: .35, emissive: 0x3a1800 })); m.scale.set(1, .6, 1.4); m.position.set(-.3 + i * .08, .815, -.75 - (i % 2) * .05); m.rotation.y = i; S.add(m); mango.push(m) }
    const leafG = new THREE.SphereGeometry(.03, 16, 8); leafG.scale(1.6, .08, .7); const leafM = V6.std({ color: 0x2f9a4a, roughness: .5 });
    for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(leafG, leafM); l.position.set(.28 + (i % 2) * .06, .806, -.78 - (i > 1) * .06); l.rotation.y = i * 1.3; S.add(l) }
    const iceM = V6.phy({ color: 0xdff2ff, roughness: .05, transparent: true, opacity: .55, clearcoat: 1, envMapIntensity: 2 });
    for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.RoundedBoxGeometry(.035, .035, .035, 2, .006), iceM); c.position.set(.05 + i * .05, .82, -.72); c.rotation.set(i, i * .7, 0); S.add(c) }
    const cold = V6.vapor({ n: 18, life: 3, rise: .25, spread: .25, size: .3, size0: .05, op: .18, col: 0xdcefff, seed: 61, dir: [0, .3, .2] }); cold.position.set(.1, .82, -.75); S.add(cold);
    // урна на тротуаре и пачки
    const binM = V6.std({ color: 0x3a3e46, metalness: .8, roughness: .4, envMapIntensity: .8 });
    const bin = new THREE.Mesh(new THREE.CylinderGeometry(.24, .2, .75, 40, 1, true), binM); bin.position.set(-1.4, .375, .5); bin.castShadow = true; S.add(bin);
    const binIn = new THREE.Mesh(new THREE.CircleGeometry(.235, 40), V6.std({ color: 0x050506 })); binIn.rotation.x = -Math.PI / 2; binIn.position.set(-1.4, .55, .5); S.add(binIn);
    const packs = ['marl', 'camel', 'win'].map(k => { const p = packMesh(k); p.scale.setScalar(2.2); S.add(p); return p });
    // фонарь и дождь
    const lampL = new THREE.SpotLight(0x9fb8ff, 16, 9, .5, .7, 1.5); lampL.position.set(-2.4, 4, 2); lampL.target.position.set(-1, 0, .2); lampL.castShadow = true; S.add(lampL, lampL.target);
    const rainG = new THREE.BufferGeometry(), RN = 900, rp = new Float32Array(RN * 6); rainG.setAttribute('position', new THREE.BufferAttribute(rp, 3));
    const rain = new THREE.LineSegments(rainG, new THREE.LineBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: .25 })); rain.userData.noDepth = true; S.add(rain);
    const cam = V6.persp(40);
    return { S, cam, hero, packs, cold, rainG, rp, RN };
  }

  V6.build.push((V) => {
    const w = V.w, K = { s: 0, cig: w('замена'), cross: w('сигаретам'), par: w('паром'), mango: w('манго'), mint: w('мяты'), push: w('знаете', 1), liq: w('жидкость'), inv: w('изобрели') };
    const Sh = buildShop();
    function upd(t) {
      // пачки летят по дуге и падают внутрь урны
      Sh.packs.forEach((p, i) => { const k = at(t, K.cross - .1 + i * .18, K.cross + .5 + i * .18); p.visible = k > 0 && k < 1; const e = eio(k); p.position.set(lp(-.6 + i * .2, -1.4 + (i - 1) * .05, e), lp(1.6, .45, ei(k)) + Math.sin(Math.PI * k) * .5, lp(1.6, .5, e)); p.rotation.set(t * 5 + i, t * 3 + i * 2, t * 4) });
      Sh.cold.userData.upd(t);
      const a = Sh.rp; for (let i = 0; i < Sh.RN; i++) { const x = (H1(i * 1.7) - .5) * 8, z = (H1(i * 3.1) - .5) * 6 + 1.5, y = ((H1(i * 5.3) * 5 - t * 6.5) % 5 + 5) % 5; a[i * 6] = x; a[i * 6 + 1] = y; a[i * 6 + 2] = z; a[i * 6 + 3] = x - .02; a[i * 6 + 4] = y + .14; a[i * 6 + 5] = z } Sh.rainG.attributes.position.needsUpdate = true;
      Sh.hero.rotation.y = Math.sin(t * .6) * .25;
      V6.camPath(Sh.cam, [
        [0, [.2, 1.25, 4.2], [0, 1.1, -.8], 40],
        [K.cig - .1, [-.4, 1.15, 3.2], [-.8, .7, .3], 40],
        [K.par, [-.1, 1.0, 2.0], [0, .95, -1.0], 38],
        [K.mango - .1, [.0, .96, .2], [0, .88, -1.0], 36],
        [K.push, [.05, .98, -.45], [0, .95, -1.0], 30],
        [K.inv - .25, [0, 1.0, -.82], [0, 1.0, -1.02], 22]], t);
    }
    const fx = t => ({ exp: .85, bloom: .7, br: .6, th: 1.15, focus: t < K.mango - .3 ? 3.2 : t < K.push ? 1.0 : .25, ap: .003, blur: .01, vig: .6, fade: Math.min(1, t / .25) });
    return [{ a: 0, scene: Sh.S, cam: Sh.cam, upd, fx }];
  });
})();
