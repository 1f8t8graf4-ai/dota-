// v16.6, локация 2 (0:09–0:27): кабинет 1973 года. Латунный перекидной календарь на подоконнике 2026 → 1973, за окном — заводы
// и башня в стиле ар-деко на закате; камера опускается с окна на дубовый стол: пачки CAMEL и WINSTON, записка под лампой,
// сигарета дымит в хрустальной пепельнице; цитата печатается на бумаге, маркер выделяет её, штамп «СЕКРЕТНО».
(() => {
  const V6 = window.V6, { lp, at, eo, ei, eio, spr, H1, cl } = V6;
  const QUOTE = ['МЫ ДОЛЖНЫ ПОЛУЧИТЬ', 'СВОЮ ДОЛЮ МОЛОДЁЖНОГО РЫНКА'];

  function skylineTex() {
    return V6.tex(V6.cnv(3072, 1536, (x) => { x.scale(2, 2);
      const g = x.createLinearGradient(0, 0, 0, 768); g.addColorStop(0, '#2a1838'); g.addColorStop(.45, '#a8484a'); g.addColorStop(.7, '#f0a060'); g.addColorStop(1, '#f6c27a'); x.fillStyle = g; x.fillRect(0, 0, 1536, 768);
      x.fillStyle = 'rgba(255,230,170,.9)'; x.beginPath(); x.arc(1120, 540, 70, 0, 7); x.fill();
      x.fillStyle = '#3a2430'; for (let i = 0; i < 34; i++) { const bx = i * 46, bh = 60 + 140 * H1(i * 3.3); x.fillRect(bx, 768 - bh, 40, bh) }
      x.fillStyle = '#2a1824';   // заводы и трубы
      for (const [cx, w, h] of [[160, 260, 170], [520, 300, 150], [1300, 240, 160]]) { x.fillRect(cx - w / 2, 768 - h, w, h); for (let k = 0; k < 3; k++) x.fillRect(cx - w / 2 + 30 + k * 80, 768 - h - 170 - 40 * H1(cx + k), 22, 170 + 40 * H1(cx + k)) }
      // башня ар-деко в центре: уступы, вертикальные рёбра, огни окон
      const tx = 768; x.fillStyle = '#1e1220'; [[150, 520], [110, 600], [76, 660], [40, 700], [8, 740]].forEach(([w, h]) => x.fillRect(tx - w, 768 - h, 2 * w, h));
      x.fillStyle = 'rgba(255,200,120,.85)'; for (let r = 0; r < 26; r++) for (let q = -5; q <= 5; q++) if (H1(r * 13 + q) > .55 && Math.abs(q) * 22 < (r < 6 ? 140 : r < 14 ? 100 : 66)) x.fillRect(tx + q * 22 - 5, 768 - 500 + r * 18, 9, 9);
      x.fillStyle = 'rgba(40,20,30,.9)'; x.font = '700 30px O'; x.textAlign = 'center'; x.fillText('R.J. REYNOLDS', tx, 768 - 470);
    }));
  }
  function cardTex(s) { return V6.tex(V6.labelCanvas(220, 300, [[s, 230, '#f4ead2', '800 230px O']], { bg: '#1a1714' })) }
  function packTex(kind) {
    return V6.tex(V6.cnv(400, 640, (x) => {
      if (kind === 'camel') { x.fillStyle = '#e6c46a'; x.fillRect(0, 0, 400, 640); x.fillStyle = '#7a4f1c'; x.font = '800 74px O'; x.textAlign = 'center'; x.fillText('CAMEL', 200, 150); x.fillStyle = '#9a6a2a'; x.beginPath(); x.ellipse(200, 360, 120, 70, 0, 0, 7); x.fill(); x.fillRect(110, 360, 18, 130); x.fillRect(270, 360, 18, 130); x.beginPath(); x.arc(150, 300, 40, 0, 7); x.arc(250, 300, 40, 0, 7); x.fill(); x.fillStyle = '#5a3a14'; x.font = '600 26px M'; x.fillText('TURKISH & DOMESTIC BLEND', 200, 580) }
      else { x.fillStyle = '#f2f0ea'; x.fillRect(0, 0, 400, 640); x.fillStyle = '#c8102a'; x.fillRect(0, 230, 400, 150); x.fillStyle = '#fff'; x.font = '800 70px O'; x.textAlign = 'center'; x.fillText('WINSTON', 200, 328); x.fillStyle = '#c8102a'; x.font = '600 28px M'; x.fillText('FILTER CIGARETTES', 200, 460) }
    }));
  }

  function buildOffice() {
    const S = new THREE.Scene(); S.background = new THREE.Color(0x0a0608); S.environment = V6.ENV; S.fog = new THREE.FogExp2(0x0c0708, .035);
    const wd = V6.wood([86, 48, 24]);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.4, .08, 1.8), V6.std({ map: wd.map, roughnessMap: wd.rough, roughness: .2, metalness: .05, envMapIntensity: .8 })); desk.position.set(0, .76, 0); desk.receiveShadow = true; S.add(desk);
    // стена с окном, за окном — небо и город 1973 года
    const wallM = V6.std({ color: 0x3b2a22, roughness: .8 });
    const wall = new THREE.Group(); wall.position.set(0, 0, -1.4); S.add(wall);
    for (const [w, h, x, y] of [[1.2, 3.4, -1.75, 1.7], [1.2, 3.4, 1.75, 1.7], [2.3, .95, 0, .47], [2.3, .7, 0, 3.05]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, .2), wallM); p.position.set(x, y, 0); wall.add(p) }
    const frameM = V6.std({ color: 0x2a1a12, roughness: .4 });
    for (const [w, h, x, y] of [[2.3, .06, 0, .97], [2.3, .06, 0, 2.7], [.06, 1.75, -1.12, 1.84], [.06, 1.75, 1.12, 1.84], [.04, 1.75, 0, 1.84], [2.3, .04, 0, 1.84]]) { const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, .1), frameM); p.position.set(x, y, .05); wall.add(p) }
    const sill = new THREE.Mesh(new THREE.BoxGeometry(2.5, .05, .32), V6.std({ map: wd.map, roughness: .3 })); sill.position.set(0, .97, .14); sill.receiveShadow = true; wall.add(sill);
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), new THREE.MeshBasicMaterial({ map: skylineTex(), color: new THREE.Color(1.25, 1.2, 1.15) })); sky.position.set(0, 2.2, -6); S.add(sky);
    const sunL = new THREE.SpotLight(0xffb070, 40, 12, .45, .7, 1.3); sunL.position.set(1.4, 2.6, -4); sunL.target.position.set(-.2, .7, .3); sunL.castShadow = true; sunL.shadow.mapSize.set(1024, 1024); S.add(sunL, sunL.target);
    const winBeam = V6.beam(5, .4, 1.6, 0xffb878, .06); winBeam.position.set(1.0, 2.6, -1.4); winBeam.rotation.x = -Math.PI / 2 + .55; winBeam.rotation.z = .3; S.add(winBeam);
    // перекидной календарь на подоконнике: латунный корпус, 4 карточки
    const cal = new THREE.Group(); cal.position.set(-.2, 1.0, -1.2); S.add(cal);
    const brass = V6.std({ color: 0xc89640, metalness: 1, roughness: .25, envMapIntensity: 1.3 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(.62, .3, .12), brass); body.position.y = .17; body.castShadow = true; cal.add(body);
    const digits = []; for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.13, .2), V6.std({ map: cardTex('2'), roughness: .5 })); m.position.set(-.21 + i * .14, .17, .061); cal.add(m); digits.push(m) }
    const TEX = {}; '0123456789'.split('').forEach(d => TEX[d] = cardTex(d));
    // стол: пачки, записка, пепельница с сигаретой, лампа
    const side = V6.std({ color: 0xe9e2cf, roughness: .4 });
    const camel = new THREE.Mesh(new THREE.BoxGeometry(.22, .036, .34), [side, side, V6.std({ map: packTex('camel'), roughness: .35 }), side, side, side]); camel.position.set(-.55, .818, .15); camel.rotation.y = .3; camel.castShadow = true; S.add(camel);
    const wins = new THREE.Mesh(new THREE.BoxGeometry(.22, .036, .34), [side, side, V6.std({ map: packTex('winston'), roughness: .35 }), side, side, side]); wins.position.set(-.25, .818, .32); wins.rotation.y = -.2; wins.castShadow = true; S.add(wins);
    const memoC = V6.cnv(600, 820, () => {}), memoT = V6.tex(memoC);
    const memo = new THREE.Mesh(new THREE.PlaneGeometry(.42, .574), V6.std({ map: memoT, color: 0xb9b2a4, roughness: .9 })); memo.rotation.x = -Math.PI / 2; memo.rotation.z = -.05; memo.position.set(.45, .802, .25); memo.receiveShadow = true; S.add(memo);
    const glass = V6.phy({ color: 0x9fb4c0, metalness: 0, roughness: .06, transparent: true, opacity: .5, clearcoat: 1, envMapIntensity: 1.6 });
    const tray = new THREE.Mesh(new THREE.CylinderGeometry(.11, .1, .045, 8), glass); tray.position.set(-.05, .825, -.25); S.add(tray);
    const cig = new THREE.Group(); cig.position.set(-.05, .855, -.25); cig.rotation.set(0, .5, .12); S.add(cig);
    const paper = new THREE.Mesh(new THREE.CylinderGeometry(.0045, .0045, .07, 16), V6.std({ color: 0xf2f0ea, roughness: .6 })); paper.rotation.z = Math.PI / 2; paper.position.x = .02; cig.add(paper);
    const filt = new THREE.Mesh(new THREE.CylinderGeometry(.0046, .0046, .022, 16), V6.std({ color: 0xc8843c, roughness: .6 })); filt.rotation.z = Math.PI / 2; filt.position.x = -.026; cig.add(filt);
    const ember = new THREE.Mesh(new THREE.SphereGeometry(.005, 12, 8), new THREE.MeshStandardMaterial({ color: 0x200000, emissive: 0xff5a1a, emissiveIntensity: 6 })); ember.position.x = .056; cig.add(ember);
    const smoke = V6.vapor({ n: 26, life: 4, rise: .9, spread: .03, size: .32, size0: .02, op: .22, col: 0xd8d4ce, seed: 21, dir: [.05, 1, 0] }); smoke.position.set(.0, .87, -.24); S.add(smoke);
    const lampM = V6.std({ color: 0x1f4a2e, metalness: .4, roughness: .3, envMapIntensity: 1 });
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(.08, .2, .14, 40, 1, true), lampM); shade.position.set(.95, 1.3, -.35); shade.rotation.z = .25; S.add(shade);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .5, 16), brass); stem.position.set(1.02, 1.03, -.38); S.add(stem);
    const lampL = new THREE.SpotLight(0xffd8a0, 6, 4, .7, .6, 1.5); lampL.position.set(.92, 1.25, -.33); lampL.target.position.set(.45, .8, .25); lampL.castShadow = true; lampL.shadow.mapSize.set(1024, 1024); S.add(lampL, lampL.target);
    S.add(new THREE.AmbientLight(0x2a1810, .3));
    const dust = V6.dust(220, [-1.2, .8, -1.3, 1.4, 2.6, .8]); S.add(dust);
    const cam = V6.persp(40);
    return { S, cam, digits, TEX, memoC, memoT, smoke, dust, ember };
  }

  function drawMemo(c, t, K) {
    const x = c.getContext('2d'), w = 600, h = 820;
    if (!drawMemo.base) drawMemo.base = V6.paperCanvas(w, h, { lines: false });   // бумага — один раз
    x.drawImage(drawMemo.base, 0, 0);
    x.fillStyle = '#222'; x.textAlign = 'left'; x.font = '700 22px J'; x.fillText('R.J. REYNOLDS TOBACCO COMPANY', 60, 80); x.fillRect(60, 92, 470, 3);
    x.font = '800 44px M'; x.fillText('МЕМОРАНДУМ', 60, 150); x.font = '500 20px J'; x.fillText('2 ФЕВРАЛЯ 1973', 60, 186);
    x.font = '500 19px J'; ['ТЕМА: НОВЫЕ МАРКИ СИГАРЕТ ДЛЯ', 'МОЛОДЁЖНОГО РЫНКА', 'Реалистично, если наша компания', 'хочет выжить и процветать', 'в долгосрочной перспективе,'].forEach((s, i) => x.fillText(s, 60, 240 + i * 30));
    // цитата печатается по словам голоса, маркер — после
    const full = QUOTE.join(' '), n = Math.round(full.length * cl((t - K.qt0) / (K.qt1 - K.qt0)));
    let left = n; x.font = '700 27px J';
    QUOTE.forEach((s, i) => { const k = Math.max(0, Math.min(s.length, left)); left -= s.length + 1; x.fillStyle = '#111'; x.fillText(s.slice(0, k), 60, 430 + i * 40) });
    const hk = eo(at(t, K.qt1 + .05, K.qt1 + .6)); if (hk > 0) { x.fillStyle = 'rgba(255,214,0,.5)'; x.fillRect(54, 406, 330 * hk, 34); x.fillRect(54, 446, 470 * hk, 34) }
    const sk = at(t, K.secret, K.secret + .15); if (sk > 0) { x.save(); x.translate(430, 720); x.rotate(-.12); x.globalAlpha = Math.min(1, sk * 2); x.strokeStyle = 'rgba(190,20,30,.88)'; x.lineWidth = 6; x.strokeRect(-120, -32, 240, 64); x.fillStyle = 'rgba(190,20,30,.88)'; x.font = '800 32px M'; x.textAlign = 'center'; x.fillText('СЕКРЕТНО', 0, 12); x.restore() }
  }

  V6.build.push((V) => {
    const w = V.w, K = { push: w('знаете', 1), fifty: w('пятьдесят'), y73: w('1973'), emp: w('табачная'), rey: w('рейнольдс'), camel: w('camel'), prep: w('готовит'), secret: w('секретный'), goal: w('главная'), qt0: w('мы'), qt1: V.wb('рынка'), prob: w('но') };
    const t0 = V.w('изобрели') - .2, O = buildOffice(); let lastQ = -1;   // до этого — витрина вейп-шопа (shop.js)
    function upd(t) {
      // календарь: 2026 → 1973, карточки перещёлкиваются, замедляясь
      const k = eio(at(t, K.fifty - .1, K.y73 + .1)), yr = Math.round(lp(2026, 1973, k)), s = String(yr);
      O.digits.forEach((m, i) => { const tx = O.TEX[s[i]]; if (m.material.map !== tx) { m.material.map = tx; m.material.needsUpdate = true } m.rotation.x = (k > 0 && k < 1) ? Math.sin(t * 40 + i) * .25 * (1 - k) : 0 });
      const q = Math.round(t * 30); if (q !== lastQ) { drawMemo(O.memoC, t, K); O.memoT.needsUpdate = true; lastQ = q }
      O.smoke.userData.upd(t); O.dust.userData.upd(t);
      V6.camPath(O.cam, [
        [t0, [-.15, 1.42, 1.25], [-.18, 1.35, -1.3], 40],
        [K.y73 + .3, [-.05, 1.55, .55], [-.02, 1.8, -4], 42],
        [K.camel + .3, [.05, 1.62, .25], [.05, 1.95, -5], 42],
        [K.prep + .2, [-.3, 1.5, 1.2], [-.35, .8, .2], 38],
        [K.goal, [.4, 1.42, 1.0], [.45, .8, .22], 34],
        [K.qt1 + .4, [.42, 1.3, .78], [.45, .8, .24], 30],
        [K.prob, [.42, 1.28, .74], [.45, .8, .24], 30]], t);
    }
    const fx = t => ({ exp: .82, bloom: .45, br: .5, th: 1.3, focus: t < K.y73 + .3 ? 1.3 : t < K.prep + .1 ? 4 : 1.0, ap: .003, blur: .009, vig: .65 });
    return [{ a: t0, scene: O.S, cam: O.cam, upd, fx }];
  });
})();
