// v16.6 (13.11): 3D на three.js — ядро. Сцены — в соседних файлах (archive.js, school.js, marlboro.js, desk.js), каждая кладёт сборщик в V6.build.
// Кадр: three.js рисует сцену в HDR → размытие по глубине (как у объектива, не гаусс) → свечение ярких мест → тонировка, виньетка, зерно.
// Поверх — 2D-холст с субтитрами (как в v16.5). Время слов — из таймлайна голоса v165a (тот же голос).
(() => {
  const V6 = window.V6 = { build: [], shots: [] };
  const WW = 1080, HH = 1920; V6.WW = WW; V6.HH = HH;

  // ---------- утилиты ----------
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k, at = (u, k0, k1) => cl((u - k0) / (k1 - k0));
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3), eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.5 * k) * Math.cos(11 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const H2 = (i, j) => H1(i * 57.31 + j * 131.71);
  function vn(x, y) { const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v); return lp(lp(H2(xi, yi), H2(xi + 1, yi), su), lp(H2(xi, yi + 1), H2(xi + 1, yi + 1), su), sv) }
  function fbm(x, y, o = 4) { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += a * vn(x * f, y * f); a *= .5; f *= 2.03 } return s }
  Object.assign(V6, { cl, lp, at, ss, eo, ei, eio, spr, H1, H2, vn, fbm });

  // ---------- текстуры из 2D-холста ----------
  V6.cnv = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c };
  V6.tex = (c, o = {}) => {
    const t = new THREE.CanvasTexture(c); t.encoding = o.lin ? THREE.LinearEncoding : THREE.sRGBEncoding; t.anisotropy = 8;
    if (o.rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(o.rep[0], o.rep[1]) }
    return t;
  };
  // поле шума: fn(v, x, y) → [r, g, b] (0–255)
  V6.field = (w, h, fn) => V6.cnv(w, h, (x) => {
    const im = x.createImageData(w, h), d = im.data;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const p = (j * w + i) * 4, c = fn(i, j); d[p] = c[0]; d[p + 1] = c[1]; d[p + 2] = c[2]; d[p + 3] = 255 }
    x.putImageData(im, 0, 0);
  });
  // карта нормалей из карты высот (серый холст)
  V6.normalFrom = (hc, k = 2) => {
    const w = hc.width, h = hc.height, s = hc.getContext('2d').getImageData(0, 0, w, h).data, hv = (i, j) => s[(((j + h) % h) * w + ((i + w) % w)) * 4] / 255;
    return V6.field(w, h, (i, j) => { const dx = (hv(i + 1, j) - hv(i - 1, j)) * k, dy = (hv(i, j + 1) - hv(i, j - 1)) * k, n = Math.hypot(dx, dy, 1); return [(-dx / n * .5 + .5) * 255, (dy / n * .5 + .5) * 255, (1 / n * .5 + .5) * 255] });
  };
  // мягкое пятно (пар, дым, свечение): радиальный спад + шум
  V6.puffTex = (seed = 1) => V6.tex(V6.field(128, 128, (i, j) => {
    const dx = (i - 64) / 64, dy = (j - 64) / 64, r = Math.hypot(dx, dy), m = Math.max(0, 1 - r), n = fbm(i / 22 + seed * 7.1, j / 22 + seed * 3.3, 4);
    const a = cl(Math.pow(m, 1.6) * (n * 1.9 - .35)) * 255; return [a, a, a];
  }), { lin: true });

  // ---------- материалы ----------
  V6.std = (o) => new THREE.MeshStandardMaterial(o);
  V6.phy = (o) => new THREE.MeshPhysicalMaterial(o);

  // ---------- объёмный текст ----------
  let FONT = null;
  V6.text3d = (s, o = {}) => {
    if (!FONT) FONT = new THREE.FontLoader().parse(window.FONT3D.inter);
    const g = new THREE.TextGeometry(s, { font: FONT, size: o.size || 1, height: o.depth ?? .25, curveSegments: o.seg || 6, bevelEnabled: o.bevel !== false,
      bevelThickness: o.bt ?? .03, bevelSize: o.bs ?? .02, bevelSegments: 3 });
    g.computeBoundingBox(); const b = g.boundingBox, ax = o.align ?? .5;
    g.translate(-lp(b.min.x, b.max.x, ax), -(b.min.y + b.max.y) / 2 * (o.vc === false ? 0 : 1), -(o.depth ?? .25) / 2);
    return g;
  };

  // ---------- рендер ----------
  const GRADE = {
    uniforms: { tDiffuse: { value: null }, exposure: { value: 1 }, vig: { value: .55 }, grain: { value: .035 }, time: { value: 0 }, sat: { value: 1.05 },
      lift: { value: new THREE.Vector3(.012, .010, .016) }, gain: { value: new THREE.Vector3(1.0, .98, .95) }, flash: { value: 0 }, fade: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform float exposure, vig, grain, time, sat, flash, fade; uniform vec3 lift, gain; varying vec2 vUv;
      vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14), 0., 1.); }
      float hsh(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec3 c = texture2D(tDiffuse, vUv).rgb * exposure; c = aces(c);
        float l = dot(c, vec3(.2126, .7152, .0722)); c = mix(vec3(l), c, sat); c = c * gain + lift * (1. - c);
        vec2 q = vUv - .5; q.x *= ${(WW / HH).toFixed(4)}; c *= mix(1., smoothstep(.9, .22, length(q) * 1.2), vig);
        c = pow(max(c, 0.), vec3(1. / 2.2));
        c += (hsh(vUv * vec2(${WW}., ${HH}.) + fract(time * 7.13)) - .5) * grain;
        c = mix(c, vec3(1.), flash) * fade;
        gl_FragColor = vec4(c, 1.);
      }`,
  };
  let R, C, RP, BK, BL, FN, OV, OX;
  V6.setup = () => {
    R = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    R.setPixelRatio(1); R.setSize(WW, HH); R.outputEncoding = THREE.LinearEncoding; R.toneMapping = THREE.NoToneMapping; R.physicallyCorrectLights = true;
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
    R.domElement.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`;
    document.body.insertBefore(R.domElement, document.getElementById('grain'));
    const rt = new THREE.WebGLRenderTarget(WW, HH, { type: THREE.HalfFloatType, samples: 4 });
    C = new THREE.EffectComposer(R, rt);
    RP = new THREE.RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
    BK = new THREE.BokehPass(RP.scene, RP.camera, { focus: 5, aperture: .002, maxblur: .008, width: WW, height: HH });
    // пар и дым не пишут глубину: на время замера глубины прячем всё с userData.noDepth
    const bkr = BK.render.bind(BK);
    BK.render = function (r, w, rd, dt, m) { const hid = []; this.scene.traverse(o => { if (o.userData.noDepth && o.visible) { o.visible = false; hid.push(o) } }); bkr(r, w, rd, dt, m); hid.forEach(o => o.visible = true) };
    BL = new THREE.UnrealBloomPass(new THREE.Vector2(WW / 2, HH / 2), .5, .45, .92);
    FN = new THREE.ShaderPass(GRADE);
    C.addPass(RP); C.addPass(BK); C.addPass(BL); C.addPass(FN);
    // окружение для отражений: тёмная студия с тремя софтбоксами
    const env = new THREE.Scene(), pm = new THREE.PMREMGenerator(R);
    const box = (w, h, x, y, z, ry, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.y = ry; env.add(m) };
    env.background = new THREE.Color(0x020203);
    box(6, 2, 0, 6, 0, 0, 0xffffff); env.children[0].rotation.x = Math.PI / 2;
    box(3, 5, -6, 2, 0, Math.PI / 2, 0x9fb6ff); box(3, 5, 6, 2, 1, -Math.PI / 2, 0xffc89a); box(8, 1, 0, 1, -7, 0, 0x404040);
    V6.ENV = pm.fromScene(env, .02).texture;
    // поверх — субтитры
    OV = document.createElement('canvas'); OV.width = WW; OV.height = HH; OV.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px;pointer-events:none`;
    document.body.insertBefore(OV, document.getElementById('grain')); OX = OV.getContext('2d');
    V6.R = R;
  };

  // ---------- время слов ----------
  let TLW = [], CHUNKS = [];
  const nw = s => String(s).toLowerCase().replace(/[^a-zа-яё0-9%$×+'-]/g, '');
  V6.w = (q, n = 0) => { let k = 0; for (const x of TLW) if (nw(x.d) === q) { if (k++ === n) return x.a } throw new Error('v166: нет слова «' + q + '» #' + n) };
  V6.wb = (q, n = 0) => { let k = 0; for (const x of TLW) if (nw(x.d) === q) { if (k++ === n) return x.b } throw new Error('v166: нет слова «' + q + '» #' + n) };
  function buildChunks() {
    const out = []; let cur = [];
    const FW = new Set(['с', 'со', 'в', 'во', 'и', 'а', 'на', 'по', 'за', 'но', 'к', 'ко', 'о', 'об', 'от', 'до', 'из', 'у', 'для', 'при', 'без', 'под', 'над', 'что', 'как', 'чем', 'не', 'ни', 'где']);
    const bare = w => w.d.toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
    const flush = () => { if (cur.length) { out.push({ a: cur[0].a, b: cur[cur.length - 1].b, s: cur.map(w => w.d).join(' ') }); cur = [] } };
    TLW.forEach((w, i) => {
      const nx = TLW[i + 1];
      if (cur.length && ((FW.has(bare(w)) && cur.length >= 2) || cur.length >= 4 || (cur.map(x => x.d).join(' ') + ' ' + w.d).length > 20)) flush();
      cur.push(w);
      if (/[.,!?…:;—]$/.test(w.d) || !nx || nx.a - w.b > .35) flush();
    });
    out.forEach((ch, i) => { const nx = out[i + 1]; ch.e = nx ? Math.min(nx.a - .02, ch.b + .6) : ch.b + .8; ch.s = ch.s.replace(/\.\.\./g, '…').replace(/[.,;:—]+$/, '').replace(/^—\s*/, '') });
    return out.filter(ch => ch.s);
  }
  function subs(t) {
    OX.clearRect(0, 0, WW, HH);
    const ch = CHUNKS.find(x => t >= x.a - .05 && t < x.e); if (!ch) return;
    const k = eo(at(t, ch.a - .05, ch.a + .1)); OX.save(); OX.globalAlpha = k; OX.translate(0, (1 - k) * 10);
    OX.font = '800 54px M'; const w = OX.measureText(ch.s).width + 56, h = 84, y = 1404;
    OX.beginPath(); OX.roundRect(WW / 2 - w / 2, y - h / 2, w, h, 20); OX.fillStyle = 'rgba(8,10,16,.78)'; OX.fill();
    OX.fillStyle = '#fff'; OX.textAlign = 'center'; OX.textBaseline = 'middle'; OX.fillText(ch.s, WW / 2, y + 3);
    OX.restore();
  }

  // ---------- кадр ----------
  // план: { a, scene, cam, upd(t), fx(t) → {exp, bloom, br, focus, ap, blur, vig, flash, fade} }
  V6.frame = (t) => {
    let sh = null; for (const s of V6.shots) if (t >= s.a) sh = s;
    if (!sh) { R.setClearColor(0, 1); R.clear(); OX.clearRect(0, 0, WW, HH); return }
    sh.upd(t);
    const f = Object.assign({ exp: 1, bloom: .5, br: .45, th: .92, focus: 5, ap: .0015, blur: .006, vig: .55, flash: 0, fade: 1, grain: .035 }, sh.fx ? sh.fx(t) : {});
    RP.scene = sh.scene; RP.camera = sh.cam; BK.scene = sh.scene; BK.camera = sh.cam;
    const u = BK.uniforms; u.focus.value = f.focus; u.aperture.value = f.ap; u.maxblur.value = f.blur; u.nearClip.value = sh.cam.near; u.farClip.value = sh.cam.far; u.aspect.value = WW / HH;
    BK.enabled = f.blur > 0;
    BL.strength = f.bloom; BL.radius = f.br; BL.threshold = f.th;
    const g = FN.uniforms; g.exposure.value = f.exp; g.vig.value = f.vig; g.flash.value = f.flash; g.fade.value = f.fade; g.time.value = t; g.grain.value = f.grain;
    C.render();
    subs(t);
  };

  // ---------- точка входа для stage.html ----------
  const D = {};
  window.EP = {
    P: { bg: '#000', paper: '#fff', ink: '#000', line: '#fff', a1: '#ffb54a', a2: '#ff3d3d' }, D, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      TLW = tl.sent.flatMap(s => s.words); V6.TL = tl; CHUNKS = buildChunks();
      SC.forEach(S => { D[S.key] = t => { V6.frame(t); return '' } });
      for (const id of ['grain', 'vig']) { const el = document.getElementById(id); if (el) el.style.display = 'none' }
      return document.fonts.load('800 54px M', 'АЯaz').then(() => {
        V6.setup(); V6.shots = [];
        for (const b of V6.build) V6.shots.push(...b(V6));
        V6.shots.sort((a, b) => a.a - b.a);
        window.__V6 = V6; return 0;
      });
    },
  };
})();
