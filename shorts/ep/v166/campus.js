// v16.6, локация 5 (0:55–1:13): большой деревянный стол в кампусе. Рельефная карта залива (мост «Золотые Ворота» над проливом,
// красная нить от архива UCSF к Стэнфорду, бирка «20–30 МИН НА МАШИНЕ» — натяжка по решению Андрея), открытый ноутбук: поиск
// «nicotine salt 1979» → «НАЙДЕНО»; на зелёном коврике электронная сигарета разбирается на части (картридж с солью «1979»),
// рядом высыпаются 20 сигарет; мягкий пар.
(() => {
  const V6 = window.V6, { lp, at, eo, ei, eio, spr, H1, cl } = V6;

  // высота суши: полуостров снизу, Марин сверху, пролив между ними, залив справа
  const landH = (u, v) => {   // u, v ∈ [0, 1] (v = 0 — север)
    const pen = (u > .08 && u < .42 + .25 * v && v > .32) ? 1 : 0, marin = (v < .26 && u < .5) ? 1 : 0, east = (u > .7) ? 1 : 0;
    const base = Math.max(pen, marin, east), hills = V6.fbm(u * 9, v * 9, 4);
    return base ? .25 + .75 * hills : 0;
  };
  function mapCanvas() {
    const c = V6.field(1024, 1536, (i, j) => { const h = landH(i / 1024, j / 1536); if (h <= 0) { const d = 14 * V6.fbm(i / 60, j / 60, 3); return [22 + d, 62 + d, 104 + d] } const g = .55 + .45 * h; return [128 * g, 136 * g, 98 * g] });
    const x = c.getContext('2d');
    x.fillStyle = 'rgba(205,200,186,.55)'; for (let k = 0; k < 900; k++) { const u = .1 + .3 * V6.H1(k * 1.3), v = .33 + .6 * V6.H1(k * 2.9); if (landH(u, v) > 0 && (v < .5 || v > .8)) x.fillRect(u * 1024, v * 1536, 7, 7) }   // города
    x.strokeStyle = 'rgba(240,230,200,.55)'; x.lineWidth = 3; x.beginPath(); x.moveTo(.2 * 1024, .34 * 1536); x.bezierCurveTo(.22 * 1024, .55 * 1536, .3 * 1024, .7 * 1536, .36 * 1024, .9 * 1536); x.stroke();   // шоссе
    x.fillStyle = 'rgba(230,240,255,.75)'; x.font = '700 40px M'; x.textAlign = 'center'; x.fillText('ТИХИЙ ОКЕАН', 150, 1200); x.fillText('ЗАЛИВ', 620, 820); x.font = '700 30px M'; x.fillStyle = 'rgba(250,245,230,.85)'; x.fillText('САН-ФРАНЦИСКО', 270, 560);
    return c;
  }
  function screenCanvas() { return V6.cnv(800, 500, () => {}) }
  function drawScreen(c, t, K) {
    const x = c.getContext('2d'); x.fillStyle = '#f4f6fa'; x.fillRect(0, 0, 800, 500);
    x.fillStyle = '#20324d'; x.fillRect(0, 0, 800, 70); x.fillStyle = '#fff'; x.font = '700 24px M'; x.fillText('АРХИВ ДОКУМЕНТОВ ТАБАЧНЫХ КОМПАНИЙ', 30, 44);
    x.strokeStyle = '#9aa6b8'; x.lineWidth = 3; x.strokeRect(30, 100, 560, 56); x.fillStyle = '#c0121e'; x.fillRect(605, 100, 160, 56); x.fillStyle = '#fff'; x.font = '800 26px M'; x.fillText('НАЙТИ', 640, 138);
    const q = 'nicotine salt 1979', n = Math.round(q.length * cl((t - K.papers) / 1.0)); x.fillStyle = '#111'; x.font = '600 28px J'; x.fillText(q.slice(0, n) + (Math.floor(t * 3) % 2 ? '|' : ''), 46, 138);
    if (t > K.find) { const k = Math.min(1, (t - K.find) / .3); x.globalAlpha = k; x.fillStyle = '#fff4c8'; x.fillRect(30, 190, 735, 90); x.fillStyle = '#111'; x.font = '700 24px J'; x.fillText('R.J. REYNOLDS · 1979 · NICOTINE SALT', 50, 230); x.fillStyle = '#13865f'; x.font = '800 24px M'; x.fillText('НАЙДЕНО', 50, 264); x.globalAlpha = 1 }
    x.fillStyle = '#c9d0dc'; for (let r = 0; r < 4; r++) x.fillRect(30, 310 + r * 44, 500 - r * 60, 14);
  }

  function buildCampus() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x0c0a08); S.environment = V6.ENV; S.fog = new THREE.FogExp2(0x0e0b08, .04);
    const wd = V6.wood([150, 104, 62]);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4, .08, 2.2), V6.std({ map: wd.map, roughnessMap: wd.rough, roughness: .35, metalness: 0, envMapIntensity: .6 })); desk.position.y = -.04; desk.receiveShadow = true; S.add(desk);
    // рельефная карта
    const geo = new THREE.PlaneGeometry(.8, 1.2, 160, 240), pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) { const u = pos.getX(i) / .8 + .5, v = 1 - (pos.getY(i) / 1.2 + .5); pos.setZ(i, landH(u, v) * .035) }
    geo.computeVertexNormals();
    const map = new THREE.Mesh(geo, V6.std({ map: V6.tex(mapCanvas()), roughness: .7 })); map.rotation.x = -Math.PI / 2; map.position.set(-.6, .002, .1); map.receiveShadow = map.castShadow = true; S.add(map);
    const toW = (u, v, h = .04) => new THREE.Vector3(-.6 + (u - .5) * .8, h, .1 + (v - .5) * 1.2);
    // мост над проливом (v ≈ .26–.32 при u ≈ .18)
    const red = V6.std({ color: 0xd2462a, metalness: .3, roughness: .4 });
    const br = new THREE.Group(); const a = toW(.18, .245, .0), b = toW(.18, .335, .0); br.position.copy(a.clone().add(b).multiplyScalar(.5)); S.add(br);
    const span = a.distanceTo(b); const deck = new THREE.Mesh(new THREE.BoxGeometry(.012, .003, span), red); deck.position.y = .02; br.add(deck);
    for (const z of [-span * .28, span * .28]) { const tw = new THREE.Mesh(new THREE.BoxGeometry(.008, .05, .006), red); tw.position.set(0, .03, z); br.add(tw) }
    const cab = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .022, -span / 2), new THREE.Vector3(0, .055, -span * .28), new THREE.Vector3(0, .03, 0), new THREE.Vector3(0, .055, span * .28), new THREE.Vector3(0, .022, span / 2)]);
    br.add(new THREE.Mesh(new THREE.TubeGeometry(cab, 40, .0012, 4), red)); br.traverse(o => o.castShadow = true);
    // пины и нить
    const pinM = V6.std({ color: 0xd0141e, roughness: .3 });
    const UC = toW(.25, .42, .045), ST = toW(.36, .85, .045);
    for (const p of [UC, ST]) { const pin = new THREE.Mesh(new THREE.SphereGeometry(.012, 16, 12), pinM); pin.position.copy(p); pin.position.y += .03; S.add(pin); const needle = new THREE.Mesh(new THREE.CylinderGeometry(.0015, .0015, .04, 8), V6.std({ color: 0xcccccc, metalness: 1 })); needle.position.copy(p); needle.position.y += .01; S.add(needle) }
    const thread = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(UC.clone().setY(.075), UC.clone().lerp(ST, .5).setY(.11), ST.clone().setY(.075)), 40, .0016, 6), V6.std({ color: 0xc0101c, roughness: .5 }));
    S.add(thread);
    const tagT = V6.tex(V6.labelCanvas(400, 110, [['20–30 МИН', 44, '#111'], ['НА МАШИНЕ', 36, '#b3121d']], { bg: '#f4ecd8', border: '#3a2a12', bw: 4 }));
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(.16, .044), V6.std({ map: tagT, roughness: .8, side: THREE.DoubleSide })); const mid = UC.clone().lerp(ST, .5); tag.position.set(mid.x + .09, .13, mid.z); tag.rotation.set(-.6, -.3, .1); S.add(tag);
    const labsT = (s) => V6.tex(V6.labelCanvas(320, 80, [[s, 34, '#fff']], { bg: '#16161a' }));
    for (const [p, s] of [[UC, 'АРХИВ UCSF'], [ST, 'СТЭНФОРД']]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(.12, .03), new THREE.MeshBasicMaterial({ map: labsT(s) })); l.position.set(p.x + .08, .02, p.z + .03); l.rotation.x = -Math.PI / 2; S.add(l) }
    // ноутбук
    const alu = V6.std({ color: 0xb8bcc4, metalness: 1, roughness: .3, envMapIntensity: 1 });
    const lap = new THREE.Group(); lap.position.set(.35, 0, -.35); lap.rotation.y = -.25; S.add(lap);
    const base = new THREE.Mesh(new THREE.BoxGeometry(.62, .02, .42), alu); base.position.y = .01; lap.add(base);
    const keys = new THREE.Mesh(new THREE.PlaneGeometry(.52, .2), V6.std({ color: 0x1a1a1e, roughness: .6 })); keys.rotation.x = -Math.PI / 2; keys.position.set(0, .021, -.03); lap.add(keys);
    const scr = new THREE.Group(); scr.position.set(0, .02, -.21); scr.rotation.x = -.22; lap.add(scr);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(.62, .4, .012), alu); lid.position.y = .2; scr.add(lid);
    const sc = screenCanvas(), scT = V6.tex(sc); const disp = new THREE.Mesh(new THREE.PlaneGeometry(.58, .36), new THREE.MeshBasicMaterial({ map: scT, color: new THREE.Color(.85, .85, .88) })); disp.position.set(0, .2, .0065); scr.add(disp);
    const glow = new THREE.PointLight(0xcfe0ff, 2.2, 1.2, 2); glow.position.set(.35, .25, -.1); S.add(glow);
    // коврик и устройство
    const mat = new THREE.Mesh(new THREE.PlaneGeometry(.7, .5), V6.std({ map: V6.tex(V6.cnv(512, 360, (x) => { x.fillStyle = '#1f5a3e'; x.fillRect(0, 0, 512, 360); x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 1; for (let i = 0; i < 512; i += 20) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 360); x.stroke() } for (let j = 0; j < 360; j += 20) { x.beginPath(); x.moveTo(0, j); x.lineTo(512, j); x.stroke() } })), roughness: .7 })); mat.rotation.x = -Math.PI / 2; mat.position.set(.55, .002, .35); mat.receiveShadow = true; S.add(mat);
    const dev = new THREE.Group(); dev.position.set(.45, .02, .35); dev.rotation.y = .5; S.add(dev);
    const shell = new THREE.Mesh(new THREE.RoundedBoxGeometry(.03, .016, .2, 3, .006), V6.std({ color: 0x6e737c, metalness: .9, roughness: .3, envMapIntensity: 1.2 })); dev.add(shell);
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(.022, .004, .08), V6.std({ color: 0x1e6b3a, roughness: .5 })); dev.add(pcb);
    const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 40 }, (_, i) => new THREE.Vector3(Math.cos(i * .9) * .005, Math.sin(i * .9) * .005, -.015 + i * .00075))), 120, .0012, 6), V6.std({ color: 0xc87a3a, metalness: 1, roughness: .3 })); dev.add(coil);
    const pod = new THREE.Mesh(new THREE.RoundedBoxGeometry(.028, .014, .05, 2, .004), V6.phy({ color: 0xe8f2ff, roughness: .05, transparent: true, opacity: .45, clearcoat: 1 })); dev.add(pod);
    const salt = new THREE.Mesh(new THREE.BoxGeometry(.02, .008, .036), V6.std({ color: 0xffb43a, emissive: 0x6a3800, emissiveIntensity: 1, roughness: .2 })); pod.add(salt);
    const podTag = new THREE.Mesh(new THREE.PlaneGeometry(.05, .016), new THREE.MeshBasicMaterial({ map: V6.tex(V6.labelCanvas(300, 96, [['СОЛЬ · 1979', 44, '#ffb43a']], { bg: '#16161a' })) })); podTag.rotation.x = -Math.PI / 2; podTag.visible = false; S.add(podTag);
    // 20 сигарет
    const cigs = []; const cg = new THREE.CylinderGeometry(.0042, .0042, .085, 12), cm = V6.std({ color: 0xf2f0ea, roughness: .6 }), fm = V6.std({ color: 0xc8843c, roughness: .6 });
    for (let i = 0; i < 20; i++) { const g = new THREE.Group(); const p = new THREE.Mesh(cg, cm); p.rotation.z = Math.PI / 2; g.add(p); const f = new THREE.Mesh(new THREE.CylinderGeometry(.0043, .0043, .024, 12), fm); f.rotation.z = Math.PI / 2; f.position.x = -.03; g.add(f); g.traverse(o => o.castShadow = true); S.add(g); cigs.push(g) }
    const cardT = V6.tex(V6.labelCanvas(512, 120, [['1 КАРТРИДЖ = 20 СИГАРЕТ', 46, '#111']], { bg: '#f4ecd8', border: '#3a2a12', bw: 4 }));
    const card = new THREE.Mesh(new THREE.PlaneGeometry(.26, .06), V6.std({ map: cardT, roughness: .8 })); card.rotation.x = -Math.PI / 2; card.position.set(.6, .004, .58); card.rotation.z = -.05; S.add(card);
    const soft = V6.vapor({ n: 20, life: 3.2, rise: .45, spread: .05, size: .32, size0: .03, op: .2, col: 0xf4f0ff, seed: 71, dir: [0, 1, 0] }); S.add(soft);
    // свет: тёплая настольная лампа слева, холодный свет экрана
    const key = new THREE.SpotLight(0xffe0b0, 12, 5, .7, .7, 1.4); key.position.set(-1.5, .8, .5); key.target.position.set(0, 0, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); S.add(key, key.target);
    S.add(new THREE.AmbientLight(0x2a2018, .35));
    const dust = V6.dust(160, [-1, .05, -.8, 1, 1.2, .9]); S.add(dust);
    const cam = V6.persp(40);
    return { S, cam, sc, scT, dev, shell, pcb, coil, pod, podTag, cigs, card, soft, dust, thread, tag };
  }

  V6.build.push((V) => {
    const w = V.w, K = { odd: w('стечению'), near: w('прямо', 1), stan: w('стэнфордским'), papers: w('бумаги'), find: w('находят'), two: w('два'), create: w('создают'), flash: w('флешку'), inside: w('внутри', 1), salt: w('соль', 1), pod1: w('картридж'), pack: w('пачку'), soft: w('мягкий'), throat: w('горло', 1), kids: w('школьники') };
    const t0 = w('по') - .15, C = buildCampus(); let lastQ = -1;
    function upd(t) {
      const q = Math.round(t * 30); if (q !== lastQ) { drawScreen(C.sc, t, K); C.scT.needsUpdate = true; lastQ = q }
      // нить и бирка появляются на «по соседству»
      const kt = eo(at(t, K.near, K.near + .6)); C.thread.scale.setScalar(kt || .001); C.tag.visible = t > K.near + .4;
      // устройство разбирается на «внутри которой … соль»
      const ex = eio(at(t, K.inside - .1, K.salt + .2)), back = eio(at(t, K.pod1 - .3, K.pod1 + .3));
      C.shell.position.set(0, .03 * ex, -.06 * ex); C.pcb.position.set(0, .012 + .02 * ex, .02 * ex); C.coil.position.set(0, .016 + .035 * ex, .07 * ex); C.pod.position.set(0, .02 + .06 * ex, .12 * ex + .07);
      C.pod.scale.setScalar(1 + .25 * ex); C.podTag.visible = ex > .8 && t < K.pod1; if (C.podTag.visible) { const p = new THREE.Vector3(); C.pod.getWorldPosition(p); C.podTag.position.set(p.x, p.y + .025, p.z + .05) }
      // 20 сигарет высыпаются на «пачку»
      C.cigs.forEach((g, i) => { const k = at(t, K.pack - .25 + i * .02, K.pack + .25 + i * .02); g.visible = k > 0; const e = ei(Math.min(1, k)); g.position.set(.72 + (H1(i * 3.3) - .5) * .16, lp(.4, .005 + (i % 3) * .008, e), .3 + (H1(i * 5.1) - .5) * .2); g.rotation.set(0, H1(i * 7) * 3 + (1 - e) * 3, 0) });
      C.card.visible = t > K.pack + .3;
      const sp = new THREE.Vector3(); C.pod.getWorldPosition(sp); C.soft.position.copy(sp); C.soft.userData.upd(t, at(t, K.soft - .1, K.soft + .3) * (1 - at(t, K.kids - .2, K.kids)));
      C.dust.userData.upd(t);
      V6.camPath(C.cam, [
        [t0, [-.74, 1.35, 1.25], [-.77, 0, .2], 40],
        [K.near + .6, [-.72, 1.05, 1.05], [-.75, 0, .28], 38],
        [K.papers - .3, [.15, .55, .55], [.3, .2, -.4], 40],
        [K.find + .6, [.25, .42, .2], [.33, .2, -.42], 36],
        [K.create, [.45, .45, .75], [.45, .02, .35], 40],
        [K.salt + .3, [.5, .3, .65], [.5, .05, .4], 32],
        [K.pack, [.6, .4, .78], [.62, .02, .42], 38],
        [K.kids - .2, [.55, .36, .72], [.55, .05, .38], 36]], t);
    }
    const fx = t => ({ exp: .95, bloom: .55, br: .5, th: 1.1, focus: t < K.papers - .3 ? .95 : t < K.create ? .7 : .45, ap: .003, blur: .009, vig: .6 });
    return [{ a: t0, scene: C.S, cam: C.cam, upd, fx }];
  });
})();
