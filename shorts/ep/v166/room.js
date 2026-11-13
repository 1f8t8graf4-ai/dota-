// v16.6, локация 8 (1:29–1:46): спальня ночью → доска расследования на кирпичной стене той же комнаты → в окно (петля в 0:00).
// «Признайтесь… вам ведь и сейчас захотелось… затянуться?» — на тумбочке у окна вейп, красный огонёк пульсирует, облако пара в камеру.
// «Захотите бросить — вам и это продадут. Причём одни и те же люди… А вот кто именно — смотрите на YouTube» — доска: «1979 · СОЛЬ» открыта,
// 4 карточки закрыты чёрными полосами с первой секунды, подписи читаются; штамп «ТОЛЬКО НА YOUTUBE». «Так… о чём это я? А, точно!» — в окно.
(() => {
  const V6 = window.V6, { lp, at, eo, ei, eio, spr, H1, cl } = V6;
  const CARDS = [['1979', 'СОЛЬ', false], ['2020', 'ЛАЗЕЙКА ОДНОРАЗОК', true], ['1924', '«МАЛЬБОРО»', true], ['2014', 'НАГРЕВАТЕЛИ', true], ['2022', 'ШАЙБЫ', true]];

  function brickTex() {
    const c = V6.cnv(512, 512, (x) => {
      x.fillStyle = '#3a2a24'; x.fillRect(0, 0, 512, 512);
      for (let r = 0; r < 16; r++) for (let k = -1; k < 5; k++) { const bx = k * 128 + (r % 2) * 64, by = r * 32; const v = 70 + 50 * H1(r * 17 + k * 3); x.fillStyle = `rgb(${v + 40},${v * .55},${v * .42})`; x.fillRect(bx + 3, by + 3, 122, 26); x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(bx + 3, by + 22, 122, 7) }
    });
    const h = V6.cnv(512, 512, (x) => { x.fillStyle = '#202020'; x.fillRect(0, 0, 512, 512); for (let r = 0; r < 16; r++) for (let k = -1; k < 5; k++) { const bx = k * 128 + (r % 2) * 64, by = r * 32; x.fillStyle = '#b0b0b0'; x.fillRect(bx + 4, by + 4, 120, 24) } });
    return { map: V6.tex(c, { rep: [3, 2] }), normal: V6.tex(V6.normalFrom(h, 3), { lin: true, rep: [3, 2] }) };
  }
  function cardTex(yr, cap, censored) {
    return V6.tex(V6.cnv(400, 480, (x) => {
      x.fillStyle = '#f2ece0'; x.fillRect(0, 0, 400, 480);
      x.fillStyle = '#2a3446'; x.fillRect(24, 24, 352, 300);
      if (!censored) { x.fillStyle = '#cfe6ff'; x.beginPath(); x.moveTo(120, 90); x.lineTo(200, 60); x.lineTo(280, 90); x.lineTo(300, 200); x.lineTo(200, 280); x.lineTo(100, 200); x.closePath(); x.fill(); x.fillStyle = '#9fc4ef'; x.beginPath(); x.moveTo(200, 60); x.lineTo(300, 200); x.lineTo(200, 280); x.closePath(); x.fill() }
      else { x.fillStyle = '#0d0c10'; for (let k = 0; k < 3; k++) { x.beginPath(); x.roundRect(14, 30 + k * 98, 372, 92, 40); x.fill() } }
      x.fillStyle = '#16161a'; x.font = '800 64px J'; x.textAlign = 'center'; x.fillText(yr, 200, 392); x.font = `700 ${cap.length > 12 ? 26 : 32}px M`; x.fillText(cap, 200, 440);
    }));
  }

  function buildRoom() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x030308); S.environment = V6.ENV; S.fog = new THREE.FogExp2(0x05050c, .06);
    const br = brickTex();
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.6), V6.std({ map: br.map, normalMap: br.normal, roughness: .85, color: 0x9a8a84 })); wall.position.set(0, 1.8, -1.2); wall.receiveShadow = true; S.add(wall);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), V6.std({ map: V6.wood([60, 40, 26]).map, roughness: .4 })); floor.rotation.x = -Math.PI / 2; floor.position.z = .6; floor.receiveShadow = true; S.add(floor);
    // окно справа: ночной город в размытии (огни-боке)
    const city = V6.tex(V6.cnv(512, 768, (x) => { x.fillStyle = '#0a0e22'; x.fillRect(0, 0, 512, 768); for (let i = 0; i < 90; i++) { const r = 4 + 18 * H1(i * 2.3); x.fillStyle = `rgba(${200 + 55 * H1(i)},${150 + 80 * H1(i * 3)},${110 + 120 * H1(i * 5)},${.25 + .5 * H1(i * 7)})`; x.beginPath(); x.arc(H1(i * 9.1) * 512, 300 + H1(i * 4.3) * 468, r, 0, 7); x.fill() } }));
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 2.0), new THREE.MeshBasicMaterial({ map: city, color: new THREE.Color(1.3, 1.3, 1.4) })); win.position.set(2.0, 1.7, -1.18); S.add(win);
    const frameM = V6.std({ color: 0x15141a, roughness: .5 });
    for (const [w, h, x, y] of [[1.42, .06, 2.0, 2.72], [1.42, .06, 2.0, .68], [.06, 2.1, 1.32, 1.7], [.06, 2.1, 2.68, 1.7], [.04, 2.0, 2.0, 1.7]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, .08), frameM); p.position.set(x, y, -1.14); S.add(p) }
    // тумбочка и вейп у окна
    const nsM = V6.std({ map: V6.wood([50, 32, 22]).map, roughness: .5 });
    const ns = new THREE.Mesh(new THREE.BoxGeometry(.5, .55, .4), nsM); ns.position.set(1.45, .275, -.8); ns.castShadow = ns.receiveShadow = true; S.add(ns);
    const vape = new THREE.Group(); vape.position.set(1.45, .56, -.78); vape.rotation.y = -.4; S.add(vape);
    const body = new THREE.Mesh(new THREE.BoxGeometry(.05, .13, .025), V6.std({ color: 0xe8432e, metalness: .5, roughness: .25, envMapIntensity: 1.3 })); body.position.y = .065; vape.add(body);
    const mp = new THREE.Mesh(new THREE.BoxGeometry(.04, .03, .018), V6.std({ color: 0xf2efe8, roughness: .4 })); mp.position.y = .145; vape.add(mp);
    const led = new THREE.Mesh(new THREE.CircleGeometry(.006, 16), new THREE.MeshStandardMaterial({ color: 0x200000, emissive: 0xff1a10, emissiveIntensity: 0 })); led.position.set(0, .03, .0131); vape.add(led);
    const ledL = new THREE.PointLight(0xff2010, 0, 1.2, 2); ledL.position.set(1.45, .6, -.7); S.add(ledL);
    const cloud = V6.vapor({ n: 40, life: 2.2, rise: 1.4, spread: .25, size: 1.6, size0: .1, op: .35, col: 0xf0ecf4, seed: 81, dir: [-.35, .25, 1] }); cloud.position.set(1.45, .72, -.75); S.add(cloud);
    // доска: пробка, карточки, нити, штамп
    const cork = V6.tex(V6.field(256, 256, (i, j) => { const v = 120 + 70 * V6.fbm(i / 3, j / 3, 3); return [v * 1.05, v * .8, v * .52] }), { rep: [3, 2] });
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.2, .04), [frameM, frameM, frameM, frameM, V6.std({ map: cork, roughness: .9 }), frameM]); board.position.set(-.35, 1.75, -1.16); board.castShadow = true; S.add(board);
    const cards = CARDS.map(([y, c, cen], i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.3, .36), V6.std({ map: cardTex(y, c, cen), roughness: .8 })); const P = [[-.95, 2.08], [.25, 2.1], [-.35, 1.72], [-.92, 1.38], [.22, 1.36]][i]; m.position.set(P[0], P[1], -1.13); m.rotation.z = (H1(i * 3) - .5) * .12; m.castShadow = true; S.add(m); const pin = new THREE.Mesh(new THREE.SphereGeometry(.014, 12, 8), V6.std({ color: 0xd0141e, roughness: .3 })); pin.position.set(P[0], P[1] + .15, -1.115); S.add(pin); return { m, P } });
    const threadM = new THREE.MeshStandardMaterial({ color: 0xb5121f, roughness: .6 });
    for (const [a, b] of [[0, 2], [2, 1], [2, 3], [2, 4], [0, 3]]) { const A = cards[a].P, B = cards[b].P, cv = new THREE.QuadraticBezierCurve3(new THREE.Vector3(A[0], A[1] + .15, -1.11), new THREE.Vector3((A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + .03, -1.1), new THREE.Vector3(B[0], B[1] + .15, -1.11)); S.add(new THREE.Mesh(new THREE.TubeGeometry(cv, 24, .004, 6), threadM)) }
    const stampT = V6.tex(V6.labelCanvas(700, 170, [['ТОЛЬКО НА YOUTUBE', 78, '#d0141e']], { bg: 'rgba(0,0,0,0)', border: '#d0141e', bw: 10 }));
    const stamp = new THREE.Mesh(new THREE.PlaneGeometry(.9, .22), new THREE.MeshStandardMaterial({ map: stampT, transparent: true, roughness: .8 })); stamp.position.set(-.35, 1.72, -1.1); stamp.rotation.z = .08; S.add(stamp);
    // свет: холодная луна из окна, тёплый прожектор на доску (включается на доске), красный огонёк вейпа
    const moon = new THREE.SpotLight(0x8fa8ff, 5, 8, .6, .8, 1.5); moon.position.set(2.4, 2.4, -1.0); moon.target.position.set(.4, .5, 0); moon.castShadow = true; S.add(moon, moon.target);
    const spot = new THREE.SpotLight(0xffd8a8, 0, 6, .45, .55, 1.4); spot.position.set(-.3, 3.2, .6); spot.target.position.set(-.35, 1.75, -1.15); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); S.add(spot, spot.target);
    const sb = V6.beam(3.2, .05, .9, 0xffe0b0, .06); sb.position.set(-.3, 3.2, .6); sb.lookAt(-.35, 1.75, -1.15); sb.rotateX(-Math.PI / 2); S.add(sb);
    S.add(new THREE.AmbientLight(0x101428, .35));
    const dust = V6.dust(160, [-1.4, .4, -1.1, 2.4, 2.8, .8]); S.add(dust);
    const cam = V6.persp(40);
    return { S, cam, led, ledL, cloud, spot, sb, stamp, dust };
  }

  V6.build.push((V) => {
    const w = V.w, K = { adm: w('признайтесь'), want: w('захотелось'), drag: w('затянуться'), l1: w('захотите'), l3: w('кто'), yt: w('youtube'), tak: w('так'), tochno: w('точно') };
    const t0 = K.adm - .3, R = buildRoom();
    function upd(t) {
      const pulse = .5 + .5 * Math.sin(t * 3.2), puff = at(t, K.drag - .2, K.drag + .4) * (1 - at(t, K.drag + 1.2, K.drag + 1.6));
      R.led.material.emissiveIntensity = (t < K.l1 ? 3 + 5 * pulse : 2) + 8 * puff; R.ledL.intensity = (t < K.l1 ? .6 + .8 * pulse : .3) + 2 * puff;
      R.cloud.userData.upd(t - K.drag, at(t, K.drag - .1, K.drag + .3) * (1 - at(t, K.l1 + .6, K.l1 + 1.4)));
      const kb = eo(at(t, K.l1 - .4, K.l1 + .4)); R.spot.intensity = 22 * kb; R.sb.material.uniforms.a.value = .06 * kb;
      const ks = at(t, K.yt + .02, K.yt + .25); R.stamp.visible = ks > 0; R.stamp.scale.setScalar(lp(1.8, 1, ei(ks))); R.stamp.material.opacity = Math.min(1, ks * 3);
      R.dust.userData.upd(t);
      V6.camPath(R.cam, [
        [t0, [1.0, .82, .45], [1.45, .62, -.78], 36],
        [K.drag, [1.22, .74, .02], [1.45, .64, -.78], 32],
        [K.l1 - .2, [1.0, 1.1, .4], [.6, 1.3, -1.0], 40],
        [K.l1 + 1.6, [-.3, 1.75, 1.15], [-.35, 1.72, -1.15], 42],
        [K.tak, [-.32, 1.74, .95], [-.35, 1.72, -1.15], 40],
        [K.tochno, [1.2, 1.7, .4], [2.0, 1.7, -1.2], 44],
        [K.tochno + .9, [2.0, 1.7, -.9], [2.0, 1.7, -3], 50]], t);
    }
    const fx = t => ({ exp: .82, bloom: .6, br: .55, th: 1.2, focus: t < K.l1 ? .9 : 2.2, ap: .003, blur: .009, vig: .7, flash: Math.max(0, 1 - Math.abs(t - (K.yt + .25)) / .05) * .1,
      fade: 1 - at(t, K.tochno + .6, K.tochno + 1.0) });
    return [{ a: t0, scene: R.S, cam: R.cam, upd, fx }];
  });
})();
