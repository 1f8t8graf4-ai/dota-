// v16.6, локация 4 (0:44–0:55): архив-туннель из стальных ящиков под красными лампами, круглая дверь сейфа, суд 1998, вихрь документов.
// Слова: «И секретную формулу спрятали в архив. В 1998 году суд заставил табачников раскрыть свои тайны, и четырнадцать миллионов
// секретных документов опубликовали в Калифорнии».
(() => {
  const V6 = window.V6, { lp, at, eo, ei, eio, spr, H1, cl } = V6;

  function drawerTex() {
    const W = 256, H = 176, b = V6.brushed([140, 146, 156]);
    const c = V6.cnv(W, H, (x) => {
      const img = b.map.image; x.drawImage(img, 0, 0, W, H);
      x.strokeStyle = 'rgba(0,0,0,.55)'; x.lineWidth = 6; x.strokeRect(3, 3, W - 6, H - 6);
      x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 2; x.strokeRect(8, 8, W - 16, H - 16);
      x.fillStyle = '#e8e0cc'; x.fillRect(W / 2 - 50, 26, 100, 40); x.fillStyle = 'rgba(30,30,40,.7)'; for (let i = 0; i < 2; i++) x.fillRect(W / 2 - 40, 36 + i * 14, 60 + 20 * i, 5);
      x.strokeStyle = '#3a3e46'; x.lineWidth = 4; x.strokeRect(W / 2 - 54, 22, 108, 48);
      x.fillStyle = '#15171c'; x.beginPath(); x.roundRect(W / 2 - 46, 104, 92, 30, 12); x.fill();
      x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(W / 2 - 40, 106, 80, 3);
    });
    const h = V6.cnv(W, H, (x) => { x.fillStyle = '#808080'; x.fillRect(0, 0, W, H); x.fillStyle = '#404040'; x.fillRect(0, 0, W, 5); x.fillRect(0, H - 5, W, 5); x.fillRect(0, 0, 5, H); x.fillRect(W - 5, 0, 5, H); x.fillStyle = '#202020'; x.beginPath(); x.roundRect(W / 2 - 46, 104, 92, 30, 12); x.fill(); x.fillStyle = '#a0a0a0'; x.fillRect(W / 2 - 54, 22, 108, 48) });
    return { map: V6.tex(c), normal: V6.tex(V6.normalFrom(h, 4), { lin: true }) };
  }

  const brass0 = () => V6.std({ color: 0xb8893a, metalness: 1, roughness: .28, envMapIntensity: 1.1 });
  function buildArchive() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x030305); S.fog = new THREE.FogExp2(0x050307, .03);
    S.environment = V6.ENV;
    const L = 26, W = 1.65, ROWS = 9, COLS = 50, DZ = .52, DY = .36, Y0 = .22;
    // ящики: две стены
    const dt = drawerTex(), dg = new THREE.BoxGeometry(.5, .34, .5);
    const dm = V6.std({ map: dt.map, normalMap: dt.normal, metalness: .8, roughness: .45, envMapIntensity: .3 });
    const steel = V6.std({ color: 0x3a3f48, metalness: .9, roughness: .45, envMapIntensity: .5 });
    const mats = [steel, steel, steel, steel, dm, dm];   // лицевая сторона ящика — ±x (к проходу)
    const N = 2 * ROWS * COLS, IM = new THREE.InstancedMesh(dg, mats, N), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1);
    const cells = []; let k = 0;
    for (const side of [-1, 1]) for (let r = 0; r < ROWS; r++) for (let j = 0; j < COLS; j++) {
      const p = new THREE.Vector3(side * (W + .25), Y0 + r * DY, -1.2 - j * DZ); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), side > 0 ? -Math.PI / 2 : Math.PI / 2);
      m4.compose(p, q, sc); IM.setMatrixAt(k, m4); cells.push({ p: p.clone(), q: q.clone(), side, r, j, k }); k++;
    }
    IM.castShadow = IM.receiveShadow = true; S.add(IM);
    // пол, потолок, торцы
    const cc = V6.concrete();
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * W + 1, L + 4), V6.std({ map: cc.map, normalMap: cc.normal, normalScale: new THREE.Vector2(.25, .25), roughness: .55, metalness: .05, color: 0x6e6c72, envMapIntensity: .35 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -L / 2); floor.receiveShadow = true; S.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * W + 1, L + 4), V6.std({ color: 0x16151a, roughness: .9 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, ROWS * DY + .3, -L / 2); S.add(ceil);
    const endw = new THREE.Mesh(new THREE.PlaneGeometry(2 * W + 1, 4), V6.std({ map: cc.map, color: 0x2a2228, roughness: .8 })); endw.position.set(0, 2, -L - 1); S.add(endw);
    // красные лампы в решётках + свет
    const lamps = [];
    for (let i = 0; i < 7; i++) {
      const z = -2.2 - i * 3.6, g = new THREE.Group(); g.position.set(0, ROWS * DY + .05, z);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(.09, 20, 14), new THREE.MeshStandardMaterial({ color: 0x220000, emissive: 0xff2414, emissiveIntensity: 6 }));
      const cage = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 6, 0, Math.PI * 2, 0, Math.PI / 1.6), new THREE.MeshStandardMaterial({ color: 0x111111, wireframe: true, metalness: 1, roughness: .4 }));
      g.add(bulb, cage); S.add(g);
      const pl = new THREE.PointLight(0xff2a18, 3.2, 6.5, 2); pl.position.set(0, ROWS * DY - .2, z); S.add(pl); lamps.push({ bulb, pl });
    }
    // холодный ключ: прожектор из глубины, тени
    const key = new THREE.SpotLight(0xcfe3ff, 22, 30, .32, .8, 1.6); key.position.set(.6, 3.0, -L + 1); key.target.position.set(0, 0, -2); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0005; S.add(key, key.target);
    S.add(new THREE.AmbientLight(0x2a1a22, .25));
    const beam = V6.beam(9, .05, 1.6, 0x9fc4ff, .07); beam.position.set(.6, 3.0, -L + 1); beam.rotation.x = -Math.PI / 2 + .25; S.add(beam);
    const dust = V6.dust(320, [-1.4, .2, -22, 1.4, 3.2, -1]); S.add(dust);
    // дверь сейфа на входе (z = 0): проём в бетонной стене, дверь на петлях слева
    const wallSh = new THREE.Shape(); wallSh.moveTo(-6, -1); wallSh.lineTo(6, -1); wallSh.lineTo(6, 6); wallSh.lineTo(-6, 6); wallSh.lineTo(-6, -1);
    const hole = new THREE.Path(); hole.absarc(0, 1.65, 1.42, 0, Math.PI * 2, true); wallSh.holes.push(hole);
    const wall = new THREE.Mesh(new THREE.ExtrudeGeometry(wallSh, { depth: .5, bevelEnabled: false, curveSegments: 64 }), V6.std({ map: cc.map, normalMap: cc.normal, color: 0x5a5658, roughness: .7 }));
    wall.position.set(0, 0, -.5); wall.receiveShadow = true; S.add(wall);
    const ringM = V6.std({ color: 0x8d949e, metalness: 1, roughness: .26, envMapIntensity: 1.2 });
    const frame = new THREE.Mesh(new THREE.TorusGeometry(1.46, .12, 24, 96), ringM); frame.position.set(0, 1.65, 0); S.add(frame);
    // скользящий тёплый свет сверху-слева на дверь (рельеф колец и болтов) + холодный контровой справа
    const rake = new THREE.SpotLight(0xffd9a8, 30, 9, .5, .7, 1.4); rake.position.set(-2.4, 4.2, 2.6); rake.target.position.set(0, 1.6, 0); rake.castShadow = true; rake.shadow.mapSize.set(1024, 1024); S.add(rake, rake.target);
    const rimR = new THREE.PointLight(0x88aaff, 4, 6, 2); rimR.position.set(2.2, 2.6, 1.4); S.add(rimR);
    const hinge = new THREE.Group(); hinge.position.set(-1.5, 1.65, .32); S.add(hinge);
    const door = new THREE.Group(); door.position.set(1.5, 0, 0); hinge.add(door);
    const bm = V6.brushed([160, 166, 176]), dM = V6.std({ map: bm.map, roughnessMap: bm.rough, color: 0x8a9099, metalness: 1, roughness: .34, envMapIntensity: .9 });
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.36, .5, 96), dM); disc.rotation.x = Math.PI / 2; disc.castShadow = true; door.add(disc);
    for (const [r, tb] of [[1.15, .07], [.82, .055], [.55, .05]]) { const ri = new THREE.Mesh(new THREE.TorusGeometry(r, tb, 16, 96), ringM); ri.position.z = .26; ri.castShadow = true; door.add(ri) }
    const bolts = new THREE.InstancedMesh(new THREE.CylinderGeometry(.06, .06, .12, 20), brass0(), 20);
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; m4.compose(new THREE.Vector3(Math.cos(a) * 1.27, Math.sin(a) * 1.27, .27), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2), sc); bolts.setMatrixAt(i, m4) }
    door.add(bolts);
    const wheel = new THREE.Group(); wheel.position.z = .42; door.add(wheel);
    const brass = V6.std({ color: 0xc8963c, metalness: 1, roughness: .22, envMapIntensity: 1.4 });
    wheel.add(new THREE.Mesh(new THREE.TorusGeometry(.52, .065, 24, 96), ringM));
    for (let i = 0; i < 3; i++) { const sp = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 1.04, 16), ringM); sp.rotation.z = i * Math.PI / 3; wheel.add(sp) }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .14, 40), V6.std({ color: 0xd9a54a, metalness: 1, roughness: .18, envMapIntensity: 1.6, emissive: 0x2a1a04 })); hub.rotation.x = Math.PI / 2; wheel.add(hub);
    for (const y of [.75, -.75]) { const hg = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .34, 24), ringM); hg.position.set(-1.5, y, .1); door.add(hg) }
    // контейнер «ПРОЕКТ · 1979» и ящик, куда он задвигается: правая стена, ряд 3, ящик 9
    const target = cells.find(c => c.side > 0 && c.r === 3 && c.j === 9);
    const lab = V6.tex(V6.labelCanvas(512, 200, [['ПРОЕКТ · 1979', 64, '#141414'], ['СЕКРЕТНО', 44, '#b3121d']], { bg: '#efe6d2', border: '#2a2a2a', bw: 8 }));
    const caseM = V6.std({ map: bm.map, color: 0x9aa2ac, metalness: 1, roughness: .32, envMapIntensity: 1.1 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(.44, .24, .46), [caseM, caseM, caseM, caseM, caseM, caseM]); box.castShadow = true; S.add(box);
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(.3, .117), V6.std({ map: lab, roughness: .7 })); tag.position.set(0, 0, .231); box.add(tag);
    const tgtLight = new THREE.SpotLight(0xfff0d0, 25, 6, .35, .6, 1.5); S.add(tgtLight, tgtLight.target);
    // папка «НИКОТИНОВАЯ СОЛЬ · 1979» — в выдвинутом ящике на переднем плане
    const fl = V6.tex(V6.labelCanvas(512, 220, [['НИКОТИНОВАЯ СОЛЬ', 52, '#141414'], ['1979', 62, '#b3121d']], { bg: '#f4ecd8', border: '#3a2a12', bw: 6 }));
    const folder = new THREE.Group(); const fm = V6.std({ color: 0xd8b56e, roughness: .75 });
    const fb = new THREE.Mesh(new THREE.BoxGeometry(.4, .3, .02), fm); folder.add(fb); const flab = new THREE.Mesh(new THREE.PlaneGeometry(.3, .13), V6.std({ map: fl, roughness: .7 })); flab.position.set(0, .02, .0105); folder.add(flab);
    const tabG = new THREE.Mesh(new THREE.BoxGeometry(.14, .05, .02), fm); tabG.position.set(-.12, .17, 0); folder.add(tabG); S.add(folder);
    const folderLight = new THREE.SpotLight(0xfff2cc, 0, 5, .3, .5, 1.4); S.add(folderLight, folderLight.target);
    // документы: вихрь листов
    const pc = V6.paperCanvas(256, 362, { lines: true, top: 60, gap: 18, lh: 5, draw: (x, w) => { x.fillStyle = 'rgba(179,18,29,.75)'; x.fillRect(w * .1, 26, w * .35, 10) } });
    const pm = V6.std({ map: V6.tex(pc), color: 0x958f84, roughness: .95, side: THREE.DoubleSide });
    const NP = 420, papers = new THREE.InstancedMesh(new THREE.PlaneGeometry(.21, .297), pm, NP); papers.frustumCulled = false; S.add(papers);
    // счётчик
    const numM = V6.std({ color: 0xf2f2f2, metalness: .3, roughness: .35, emissive: 0x1a1a1a });
    const counter = new THREE.Group(); counter.position.set(0, 2.42, -1.8); S.add(counter); let numKey = '';
    const docsLab = new THREE.Mesh(new THREE.PlaneGeometry(1.5, .26), new THREE.MeshBasicMaterial({ map: V6.tex(V6.labelCanvas(768, 132, [['ДОКУМЕНТОВ', 88, '#c81d2a']], { bg: '#f4f1ea' })), transparent: true }));
    docsLab.position.set(0, -.5, 0); counter.add(docsLab);

    const cam = V6.persp(44);
    return { S, cam, lamps, door, hinge, wheel, box, target, cells, IM, tgtLight, folder, folderLight, papers, counter, numM, docsLab, dust, setNum(s) { if (s === numKey) return; numKey = s; while (counter.children.length > 1) counter.remove(counter.children[1]); const g = V6.text3d(s, { size: .42, depth: .1, bt: .015, bs: .01 }); counter.add(new THREE.Mesh(g, numM)) } };
  }

  function buildCourt() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x070504); S.environment = V6.ENV; S.fog = new THREE.FogExp2(0x0b0705, .06);
    const wd = V6.wood([88, 50, 26]);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4, .12, 2), V6.std({ map: wd.map, roughnessMap: wd.rough, roughness: .35, metalness: .05, envMapIntensity: .5 })); desk.position.y = -.06; desk.receiveShadow = true; S.add(desk);
    // стена: деревянные панели (размыта глубиной)
    const pan = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), V6.std({ map: V6.wood([60, 34, 18]).map, roughness: .5 })); pan.position.set(0, 1.4, -2.2); S.add(pan);
    for (let i = -3; i <= 3; i++) { const col = new THREE.Mesh(new THREE.BoxGeometry(.12, 5, .12), V6.std({ color: 0x2a160a, roughness: .5 })); col.position.set(i * 1.1, 1.4, -2.1); S.add(col) }
    // подставка и молоток
    const wood2 = V6.std({ map: V6.wood([70, 38, 20]).map, roughness: .32, metalness: .05, envMapIntensity: .6 });
    const block = new THREE.Mesh(new THREE.CylinderGeometry(.24, .26, .08, 64), wood2); block.position.set(.15, .04, .1); block.castShadow = block.receiveShadow = true; S.add(block);
    const pivot = new THREE.Group(); pivot.position.set(-.55, .32, .1); S.add(pivot);
    const gav = new THREE.Group(); pivot.add(gav);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(.025, .032, .62, 24), wood2); handle.rotation.z = Math.PI / 2; handle.position.x = .31; gav.add(handle);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, .26, 40), wood2); head.position.x = .7; gav.add(head);
    const bandM = V6.std({ color: 0xc89b45, metalness: 1, roughness: .25, envMapIntensity: 1.3 });
    for (const y of [-.1, .1]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(.078, .078, .02, 40), bandM); b.position.set(.7, y, 0); gav.add(b) }
    gav.traverse(o => o.castShadow = true);
    // папка «1998» на столе
    const fl = V6.tex(V6.labelCanvas(512, 220, [['ДЕЛО · МИННЕСОТА', 50, '#141414'], ['1998', 70, '#b3121d']], { bg: '#f4ecd8', border: '#3a2a12', bw: 6 }));
    const folder = new THREE.Group(); const fb = new THREE.Mesh(new THREE.BoxGeometry(.62, .02, .46), V6.std({ color: 0xc9a25a, roughness: .7 })); folder.add(fb);
    const flab = new THREE.Mesh(new THREE.PlaneGeometry(.42, .18), V6.std({ map: fl, roughness: .7 })); flab.rotation.x = -Math.PI / 2; flab.position.y = .011; folder.add(flab);
    folder.position.set(-.3, .01, .62); folder.rotation.y = .12; folder.traverse(o => o.receiveShadow = true); S.add(folder);
    // свет: тёплый контровой сзади-сверху + мягкий ключ спереди
    const rim = new THREE.SpotLight(0xffb36a, 70, 10, .5, .6, 1.4); rim.position.set(.6, 2.4, -1.6); rim.target.position.set(0, 0, .2); rim.castShadow = true; rim.shadow.mapSize.set(1024, 1024); S.add(rim, rim.target);
    const keyL = new THREE.SpotLight(0xdfe8ff, 18, 10, .7, .8, 1.5); keyL.position.set(-1.2, 1.6, 2.4); keyL.target.position.set(0, 0, 0); S.add(keyL, keyL.target);
    S.add(new THREE.AmbientLight(0x2a1a10, .3));
    const dust = V6.dust(160, [-1.2, .1, -1.4, 1.2, 2.2, 1]); S.add(dust);
    const cam = V6.persp(36);
    return { S, cam, pivot, dust };
  }

  V6.build.push((V) => {
    const w = V.w, A = buildArchive(), Ct = buildCourt();
    const K = { secr: w('секретную'), hid: w('спрятали'), arch: w('архив'), y98: w('1998'), court: w('суд'), raskr: w('раскрыть'), secrets: w('тайны'), n14: w('четырнадцать'), docs: w('документов'), pub: w('опубликовали'), cal: w('калифорнии') };
    const t0 = K.secr - .3, tCourt = K.y98 + .35, tBack = K.court + .75;
    const T = A.target, slot = T.p.clone(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1), zAx = new THREE.Vector3(0, 1, 0);
    // какой ящик выдвинут: базовая матрица + сдвиг к проходу
    const drawerOut = (c, d) => { const p = c.p.clone(); p.x -= c.side * d; m4.compose(p, c.q, sc); A.IM.setMatrixAt(c.k, m4) };
    const fCell = A.cells.find(c => c.side < 0 && c.r === 2 && c.j === 4);
    function updArchive(t) {
      // ящик для контейнера: выдвинут → контейнер въезжает → задвигается на «спрятали»
      const kin = eio(at(t, t0, K.hid - .1)), kshut = eio(at(t, K.hid - .05, K.hid + .2));
      drawerOut(T, .42 * (1 - kshut));
      A.box.position.set(slot.x - .42 * (1 - kshut) - .75 * (1 - kin), slot.y + .02 + .25 * (1 - kin), slot.z); A.box.rotation.set(0, 0, 0); A.box.visible = kshut < .98;
      A.tgtLight.position.set(slot.x - 1.6, slot.y + 1.4, slot.z + 1.2); A.tgtLight.target.position.copy(slot); A.tgtLight.intensity = 25 * (1 - at(t, K.hid + .2, K.hid + .6));
      // лампы: тревога на «архив», после «тайны» — ровно
      const alarm = at(t, K.hid - .2, K.hid + .1) * (1 - at(t, K.arch + .8, K.arch + 1.4));
      A.lamps.forEach((l, i) => { const f = 1 + alarm * (Math.sin(t * 9 + i) * .6); l.pl.intensity = 3.2 * f; l.bulb.material.emissiveIntensity = 6 * f });
      // дверь: открыта → захлопывается на «архив» → (суд) → распахивается на «раскрыть»
      const close = eio(at(t, K.arch - .05, K.arch + .45)), open2 = eio(at(t, K.raskr - .1, K.raskr + .7));
      const ang = t < tBack ? (1 - close) * 1.75 : open2 * 1.75; A.hinge.rotation.y = -ang;
      A.wheel.rotation.z = (t < tBack ? eio(at(t, K.arch + .4, K.arch + 1.0)) * 3.4 : 3.4 - eio(at(t, tBack, K.raskr)) * 3.4);
      // ящики выезжают волной после «тайны»
      const wv = t - K.secrets;
      if (wv > 0) for (const c of A.cells) { if (c === T) continue; const d = .35 * spr(at(wv, .05 + c.j * .018 + H1(c.k) * .2, .45 + c.j * .018 + H1(c.k) * .2)); if (d > 0 && c.j < 26) drawerOut(c, d) }
      // папка в выдвинутом ящике слева — подсвечена на «четырнадцать … документов»
      const kf = eio(at(t, K.n14 - .2, K.n14 + .5)); drawerOut(fCell, .45 * kf);
      A.folder.position.set(fCell.p.x + .45 * kf + .02, fCell.p.y + .2 * kf, fCell.p.z); A.folder.rotation.set(0, Math.PI / 2, -.35 * kf); A.folder.visible = kf > 0;
      A.folderLight.intensity = 30 * kf; A.folderLight.position.set(fCell.p.x + 1.4, fCell.p.y + 1.6, fCell.p.z + 1); A.folderLight.target.position.copy(A.folder.position);
      A.IM.instanceMatrix.needsUpdate = true;
      // листы: вылетают из глубины к камере после «четырнадцать»
      const pk = t - (K.n14 - .1);
      for (let i = 0; i < 420; i++) {
        const st = H1(i * 3.3) * 1.0, u = (pk - st) / 1.7;
        if (u <= 0 || pk < 0) { m4.makeScale(0, 0, 0); A.papers.setMatrixAt(i, m4); continue }
        const z = lp(-14 - 8 * H1(i * 1.1), 6, Math.min(1.4, u)), sw = Math.sin(u * 5 + i) * .6;
        const p = new THREE.Vector3((H1(i * 7.7) - .5) * 2.8 + sw * .4, .6 + H1(i * 5.1) * 2.6 + Math.cos(u * 4 + i) * .3, z);
        q.setFromEuler(new THREE.Euler(u * 6 * (H1(i) - .5) + i, u * 5 * (H1(i * 2) - .5), u * 4 * (H1(i * 3) - .5)));
        m4.compose(p, q, sc); A.papers.setMatrixAt(i, m4);
      }
      A.papers.instanceMatrix.needsUpdate = true;
      // счётчик и «ДОКУМЕНТОВ»
      const kn = at(t, K.n14 - .05, K.n14 + .2), kc = eo(at(t, K.n14, K.n14 + 1.0));
      A.counter.visible = kn > 0; if (kn > 0) { A.setNum(Math.round(14e6 * kc).toLocaleString('ru-RU').replace(/ /g, ' ')); A.counter.scale.setScalar(spr(kn)) }
      A.docsLab.visible = t > K.docs - .1; A.docsLab.scale.setScalar(spr(at(t, K.docs - .1, K.docs + .3)) || .001);
      A.dust.userData.upd(t);
      // камера: у ящика → отлёт назад сквозь проём → дверь захлопывается перед нами; потом — снова у двери → внутрь
      if (t < tBack) V6.camPath(A.cam, [
        [t0, [slot.x - 1.75, slot.y + .55, slot.z + 1.7], [slot.x - .35, slot.y, slot.z], 38],
        [K.hid + .05, [slot.x - 1.55, slot.y + .5, slot.z + 1.45], [slot.x - .2, slot.y, slot.z], 38],
        [K.hid + .25, [0, 1.75, -4.5], [0, 1.6, -12], 46],
        [K.arch + .1, [0, 1.7, 3.6], [0, 1.65, 0], 44],
        [tCourt, [0, 1.66, 1.4], [0, 1.65, 0], 30]], t);
      else V6.camPath(A.cam, [
        [tBack, [0, 1.66, 1.6], [0, 1.65, 0], 30],
        [K.raskr + .2, [0, 1.7, 3.4], [0, 1.65, -2], 44],
        [K.n14, [0, 1.75, 1.0], [0, 1.9, -8], 46],
        [K.docs + .2, [-.2, 1.6, -.6], [fCell.p.x + .4, fCell.p.y + .1, fCell.p.z], 42],
        [K.cal + .4, [0, 2.4, -2.0], [0, 3.2, -9], 48]], t);
    }
    function updCourt(t) {
      const kd = at(t, K.court - .35, K.court), up = at(t, K.court + .05, K.court + .5);
      Ct.pivot.rotation.z = lp(.55, 0, ei(kd)) + Math.sin(Math.PI * cl(up)) * .12 * (1 - up);
      Ct.dust.userData.upd(t);
      V6.camPath(Ct.cam, [[tCourt, [.9, .55, 1.6], [0, .12, .1], 34], [tBack, [.7, .4, 1.25], [0, .1, .1], 32]], t);
    }
    const fxA = t => {
      const flash = Math.max(0, 1 - Math.abs(t - (K.arch + .43)) / .06) * .25;
      return { exp: .95, bloom: .55, br: .45, th: 1.05, focus: t < K.hid + .1 ? 1.5 : t < tBack ? 3.6 : t > K.docs ? 1.3 : 4.5, ap: .0025, blur: .009, vig: .7, flash };
    };
    const fxC = t => ({ exp: 1.1, bloom: .5, br: .4, th: .9, focus: 1.7, ap: .004, blur: .012, vig: .75, flash: Math.max(0, 1 - Math.abs(t - K.court) / .05) * .18 });
    return [
      { a: t0, scene: A.S, cam: A.cam, upd: updArchive, fx: fxA },
      { a: tCourt, scene: Ct.S, cam: Ct.cam, upd: updCourt, fx: fxC },
      { a: tBack, scene: A.S, cam: A.cam, upd: updArchive, fx: fxA },
      { a: K.cal + .8, scene: A.S, cam: A.cam, upd: updArchive, fx: t => Object.assign(fxA(t), { fade: 1 - at(t, K.cal + .8, K.cal + 1.1) }) },
    ];
  });
})();
