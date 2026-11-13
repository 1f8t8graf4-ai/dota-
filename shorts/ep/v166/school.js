// v16.6, локация 6 (1:13–1:21): школьный коридор — шкафчики уходят вдаль, контровой дневной свет из окна в конце, без людей.
// «…школьники тянули его без остановки и подсаживались в разы быстрее. Уже через четыре года в США парил каждый четвёртый старшеклассник»
// На «каждый четвёртый» — каждый 4-й шкафчик загорается красным, дверца приоткрывается, из неё идёт пар; посреди коридора падает «27,5 %».
(() => {
  const V6 = window.V6, { lp, at, eo, ei, eio, spr, H1 } = V6;

  function lockerTex(n) {
    const W = 192, H = 768;
    const c = V6.cnv(W, H, (x) => {
      const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#4f6c8a'); g.addColorStop(.5, '#6585a6'); g.addColorStop(1, '#4a6684'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(255,255,255,${.02 + .03 * H1(i)})`; x.fillRect(H1(i * 3.1) * W, H1(i * 7.3) * H, 1 + 3 * H1(i * 1.1), 1) }   // царапины
      x.fillStyle = '#1b2632'; for (let k = 0; k < 6; k++) x.fillRect(36, 46 + k * 22, W - 72, 9);   // вентиляция сверху
      x.fillStyle = '#1b2632'; for (let k = 0; k < 4; k++) x.fillRect(36, H - 150 + k * 22, W - 72, 9);
      x.strokeStyle = 'rgba(0,0,0,.6)'; x.lineWidth = 6; x.strokeRect(3, 3, W - 6, H - 6);
      x.fillStyle = '#c9ccd2'; x.fillRect(W - 46, H / 2 - 40, 18, 80); x.fillStyle = '#7b8088'; x.fillRect(W - 44, H / 2 - 30, 6, 60);   // ручка
      x.fillStyle = '#e9e4d6'; x.fillRect(W / 2 - 34, 210, 68, 30); x.fillStyle = '#222'; x.font = '700 22px J'; x.textAlign = 'center'; x.fillText(String(n), W / 2, 233);
    });
    return V6.tex(c);
  }
  function ventGlowTex() {
    return V6.tex(V6.cnv(192, 768, (x) => { x.fillStyle = '#2a0402'; x.fillRect(0, 0, 192, 768); x.fillStyle = '#ff2a1a'; for (let k = 0; k < 6; k++) x.fillRect(36, 46 + k * 22, 120, 9); for (let k = 0; k < 4; k++) x.fillRect(36, 618 + k * 22, 120, 9) }));
  }

  function buildSchool() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x1a2028); S.fog = new THREE.Fog(0x4a5a6c, 7, 38); S.environment = V6.ENV;
    const L = 32, W = 1.9, LW = .4, LH = 1.9, N = Math.floor(L / LW);
    // пол: светлая плитка с бликами
    const tile = V6.tex(V6.cnv(256, 256, (x) => { for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { x.fillStyle = (i + j) % 2 ? '#c9c4b8' : '#e8e3d6'; x.fillRect(i * 64, j * 64, 64, 64) } x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 2; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, 256); x.stroke(); x.beginPath(); x.moveTo(0, i * 64); x.lineTo(256, i * 64); x.stroke() } }), { rep: [2, 16] });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * W, L + 6), V6.std({ map: tile, roughness: .22, metalness: 0, envMapIntensity: .8 })); floor.rotation.x = -Math.PI / 2; floor.position.z = -L / 2 + 2; floor.receiveShadow = true; S.add(floor);
    const wallM = V6.std({ color: 0x8c877c, roughness: .85 });
    for (const sd of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(L + 6, 3.4), wallM); w.rotation.y = -sd * Math.PI / 2; w.position.set(sd * (W + .46), 1.7, -L / 2 + 2); S.add(w) }
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(2 * W + 1, L + 6), V6.std({ color: 0xf1efe8, roughness: .9 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 3.3, -L / 2 + 2); S.add(ceil);
    for (let i = 0; i < 14; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(.5, 1.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.65, 1.7) })); p.rotation.x = Math.PI / 2; p.position.set(0, 3.28, 1 - i * 2.4); S.add(p) }
    // окно в конце коридора — яркое, контровой свет и лучи
    const win = new THREE.Mesh(new THREE.PlaneGeometry(2 * W + .9, 3.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 3.4, 3.6) })); win.position.set(0, 1.65, -L - 1); S.add(win);
    const sun = new THREE.SpotLight(0xf3f7ff, 55, 50, .45, .6, 1.2); sun.position.set(0, 2.8, -L - .5); sun.target.position.set(0, 0, 2); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); S.add(sun, sun.target);
    S.add(new THREE.HemisphereLight(0xb8c8dc, 0x3a342c, .16));
    for (const x of [-1.1, 0, 1.1]) { const b = V6.beam(26, .3, 1.6, 0xeaf3ff, .05); b.position.set(x, 3.0, -L - .6); b.rotation.x = Math.PI / 2 + .06; S.add(b) }
    const dust = V6.dust(300, [-1.6, .2, -16, 1.6, 3, 1], 0xffffff, 5, 4); S.add(dust);
    // шкафчики: корпус + дверца (инстансы), каждый 4-й — свой меш с красным свечением и открывающейся дверцей
    const body = new THREE.BoxGeometry(LW - .02, LH, .44), bodyM = V6.std({ color: 0x33475a, metalness: .7, roughness: .45, envMapIntensity: .5 });
    const doorG = new THREE.BoxGeometry(LW - .04, LH - .04, .02); doorG.translate((LW - .04) / 2, 0, 0);
    const texs = [0, 1, 2, 3, 4].map(k => lockerTex(201 + k)), glowT = ventGlowTex();
    const IB = new THREE.InstancedMesh(body, bodyM, 2 * N); let k = 0; const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1), Y = new THREE.Vector3(0, 1, 0);
    const reds = [], doors = [];
    for (const sd of [-1, 1]) for (let j = 0; j < N; j++) {
      const z = 1.2 - j * LW, x = sd * (W + .22); q.setFromAxisAngle(Y, sd > 0 ? -Math.PI / 2 : Math.PI / 2);
      m4.compose(new THREE.Vector3(x, LH / 2 + .1, z), q, sc); IB.setMatrixAt(k++, m4);
      const red = (j + (sd > 0 ? 2 : 0)) % 4 === 0;
      const dm = V6.std({ map: texs[j % 5], metalness: .65, roughness: .42, envMapIntensity: .55, emissive: 0xff2414, emissiveMap: glowT, emissiveIntensity: 0 });
      const hingeG = new THREE.Group(); hingeG.quaternion.copy(q); hingeG.position.set(x, LH / 2 + .1, z).add(new THREE.Vector3(-(LW - .04) / 2, 0, .231).applyQuaternion(q));   // петля — у края дверцы
      const dmesh = new THREE.Mesh(doorG, dm); hingeG.add(dmesh); S.add(hingeG);
      doors.push({ g: hingeG, m: dm, red, sd, j, z, x });
      if (red && j < 22) { const pl = new THREE.PointLight(0xff2a14, 0, 2.2, 2); pl.position.set(x - sd * .5, 1.3, z); S.add(pl); const vp = V6.vapor({ n: 10, life: 2.4, rise: 1.0, spread: .15, size: .9, size0: .2, op: .3, col: 0xffd9d0, seed: j, dir: [-sd * .7, .55, 0] }); vp.position.set(x - sd * .28, 1.55, z); S.add(vp); reds.push({ pl, vp, j, sd }) }
    }
    IB.castShadow = IB.receiveShadow = true; S.add(IB);
    // «27,5 %» — объёмная цифра падает посреди коридора
    const numM = V6.std({ color: 0xe8e8ea, metalness: .55, roughness: .3, envMapIntensity: 1 });
    const num = new THREE.Mesh(V6.text3d('27,5 %', { size: .34, depth: .14, bt: .02, bs: .012 }), numM); num.castShadow = true; S.add(num);
    const redM = V6.std({ color: 0xd8203a, metalness: .2, roughness: .4, emissive: 0x500008 });
    const sub = new THREE.Mesh(V6.text3d('СТАРШЕКЛАССНИКОВ США', { size: .062, depth: .02, bt: .004, bs: .003 }), redM); S.add(sub);
    const puff = V6.vapor({ n: 18, life: 1.6, rise: .5, spread: 1.2, size: 1.1, size0: .4, op: .25, col: 0xdcd6cc, seed: 30, dir: [0, .3, 0] }); S.add(puff);
    const cam = V6.persp(46);
    return { S, cam, doors, reds, num, sub, puff, dust };
  }

  V6.build.push((V) => {
    const w = V.w, K = { kids: w('школьники'), hooked: w('подсаживались'), y19: w('четыре'), usa: w('сша'), every4: w('четвёртый'), senior: w('старшеклассник'), third: w('треть') };
    const t0 = K.kids - .25, Sc = buildSchool();
    function upd(t) {
      // красные шкафчики загораются по очереди от камеры вглубь на «каждый четвёртый»
      Sc.doors.forEach(d => {
        if (!d.red) return; const kk = eo(at(t, K.every4 - .1 + d.j * .025, K.every4 + .35 + d.j * .025));
        d.m.emissiveIntensity = 7 * kk * (.85 + .15 * Math.sin(t * 7 + d.j)); if (!d.g.userData.q0) d.g.userData.q0 = d.g.quaternion.clone(); d.g.quaternion.copy(d.g.userData.q0); d.g.rotateY(-.38 * kk);
      });
      Sc.reds.forEach(r => { const kk = eo(at(t, K.every4 - .1 + r.j * .025, K.every4 + .35 + r.j * .025)); r.pl.intensity = 5 * kk; r.vp.userData.upd(t, kk) });
      // «27,5 %» падает на «старшеклассник» и встаёт
      const kf = at(t, K.senior - .45, K.senior), land = t > K.senior;
      const y = land ? .36 + .04 * Math.sin(Math.PI * Math.min(1, (t - K.senior) / .2)) * Math.exp(-(t - K.senior) * 6) : lp(4.2, .36, ei(kf));
      Sc.num.position.set(.05, y, -6.2); Sc.num.rotation.set(0, Math.sin(t * .4) * .04, land ? 0 : (1 - kf) * .3); Sc.num.visible = t > K.senior - .45;
      Sc.sub.position.set(.05, .1, -6.1); Sc.sub.visible = t > K.senior + .25; Sc.sub.scale.setScalar(spr(at(t, K.senior + .25, K.senior + .6)) || .001);
      Sc.puff.position.set(0, .05, -6.2); Sc.puff.userData.upd(t - K.senior, t > K.senior ? 1 - at(t, K.senior + .8, K.senior + 1.6) : 0);
      Sc.dust.userData.upd(t);
      V6.camPath(Sc.cam, [[t0, [-.95, 1.42, 1.4], [.7, 1.2, -7], 46], [K.every4 - .2, [-.8, 1.36, -.5], [.55, 1.15, -7.5], 46], [K.senior - .2, [-.45, 1.2, -1.6], [.1, .6, -6.4], 42], [K.third, [-.3, 1.05, -2.4], [.05, .45, -6.3], 40]], t);
    }
    const fx = t => ({ exp: .85, bloom: .75, br: .55, th: 1.0, focus: t > K.senior - .4 ? 4.2 : 4, ap: .0022, blur: .007, vig: .6, flash: Math.max(0, 1 - Math.abs(t - K.senior) / .05) * .12 });
    return [{ a: t0, scene: Sc.S, cam: Sc.cam, upd, fx }];
  });
})();
