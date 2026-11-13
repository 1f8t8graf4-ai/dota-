// v16.6: общие материалы и детали для 3D-сцен (процедурные текстуры на 2D-холсте → three.js)
(() => {
  const V6 = window.V6, { fbm, H1, lp, cl } = V6;
  const TX = {}, once = (k, fn) => TX[k] || (TX[k] = fn());

  // шлифованная сталь: продольные риски + пятна; roughness-карта из того же шума
  V6.brushed = (tint = [150, 156, 166]) => once('brushed' + tint, () => {
    const c = V6.field(256, 256, (i, j) => { const n = fbm(i / 2.2, j / 70, 3) * .55 + fbm(i / 40, j / 40, 3) * .45, v = 70 + 120 * n; return [v * tint[0] / 150, v * tint[1] / 150, v * tint[2] / 150] });
    const r = V6.field(256, 256, (i, j) => { const v = 70 + 110 * fbm(i / 3, j / 90, 3); return [v, v, v] });
    return { map: V6.tex(c, { rep: [2, 2] }), rough: V6.tex(r, { lin: true, rep: [2, 2] }) };
  });
  // бетон: крупные пятна и мелкие поры
  V6.concrete = () => once('concrete', () => {
    const c = V6.field(512, 512, (i, j) => { const v = 60 + 70 * fbm(i / 60, j / 60, 5) + 20 * (fbm(i / 3, j / 3, 2) - .5); return [v * .95, v * .96, v] });
    const h = V6.field(256, 256, (i, j) => { const v = 255 * fbm(i / 4, j / 4, 3); return [v, v, v] });
    return { map: V6.tex(c, { rep: [3, 3] }), normal: V6.tex(V6.normalFrom(h, 3), { lin: true, rep: [6, 6] }) };
  });
  // тёмное полированное дерево (дуб/орех): волокна вдоль x
  V6.wood = (base = [92, 52, 28]) => once('wood' + base, () => {
    const c = V6.field(512, 512, (i, j) => {
      const ring = Math.sin((j / 9 + fbm(i / 90, j / 30, 4) * 7) * 2) * .5 + .5, n = fbm(i / 160, j / 6, 3);
      const k = .62 + .25 * ring + .25 * n; return [base[0] * k, base[1] * k, base[2] * k];
    });
    const r = V6.field(256, 256, (i, j) => { const v = 60 + 80 * fbm(i / 50, j / 4, 3); return [v, v, v] });
    return { map: V6.tex(c, { rep: [1, 1] }), rough: V6.tex(r, { lin: true }) };
  });
  // бумага: тёплый тон, волокна; lines — машинопись строками (полоски-«слова»)
  V6.paperCanvas = (w, h, o = {}) => V6.cnv(w, h, (x) => {
    const im = x.createImageData(w, h), d = im.data, b = o.base || [238, 230, 210];
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const p = (j * w + i) * 4, n = fbm(i / 40, j / 40, 3) * .08 + (H1(i * 7.1 + j * 13.3) - .5) * .05; d[p] = b[0] * (1 + n); d[p + 1] = b[1] * (1 + n); d[p + 2] = b[2] * (1 + n); d[p + 3] = 255 }
    x.putImageData(im, 0, 0);
    if (o.lines) { x.fillStyle = 'rgba(30,30,40,.55)'; let y = o.top || h * .14; while (y < h * .88) { let xx = w * .1; while (xx < w * .86) { const lw = 10 + H1(xx * 3.1 + y) * 46; x.fillRect(xx, y, Math.min(lw, w * .9 - xx), o.lh || 6); xx += lw + 8 } y += o.gap || 22 } }
    if (o.draw) o.draw(x, w, h);
  });
  // надпись-плашка на холсте (для этикеток, ярлыков, экранов)
  V6.labelCanvas = (w, h, lines, o = {}) => V6.cnv(w, h, (x) => {
    x.fillStyle = o.bg || '#f2ece0'; x.fillRect(0, 0, w, h);
    if (o.border) { x.strokeStyle = o.border; x.lineWidth = o.bw || 6; x.strokeRect(o.bw || 6, o.bw || 6, w - 2 * (o.bw || 6), h - 2 * (o.bw || 6)) }
    x.textAlign = 'center'; x.textBaseline = 'middle';
    lines.forEach(([s, size, col, font], i) => { x.font = font || `800 ${size}px M`; x.fillStyle = col || '#111'; x.fillText(s, w / 2, h * (lines.length === 1 ? .5 : (i + .5) / lines.length)) });
  });

  // мягкий «объёмный» луч: конус с градиентом прозрачности, аддитивно; не пишет глубину
  V6.beam = (len, r0, r1, col, a = .18) => {
    const g = new THREE.CylinderGeometry(r0, r1, len, 48, 1, true); g.translate(0, -len / 2, 0);
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { col: { value: new THREE.Color(col) }, a: { value: a }, len: { value: len } },
      vertexShader: 'varying float vy; varying vec3 vn, vv; void main(){ vy = -position.y; vec4 mv = modelViewMatrix * vec4(position, 1.); vv = normalize(-mv.xyz); vn = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 col; uniform float a, len; varying float vy; varying vec3 vn, vv; void main(){ float f = pow(abs(dot(vn, vv)), 1.6); float k = (1. - smoothstep(0., len, vy)) * smoothstep(0., .08 * len, vy); gl_FragColor = vec4(col * a * f * k, 1.); }' });
    const b = new THREE.Mesh(g, m); b.userData.noDepth = true; b.renderOrder = 5; return b;
  };
  // пылинки в луче (точки), двигаются от времени
  V6.dust = (n, box, col = 0xfff1d6, size = 6, seed = 1) => {
    const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { p[i * 3] = lp(box[0], box[3], H1(seed + i * 1.7)); p[i * 3 + 1] = lp(box[1], box[4], H1(seed + i * 3.1)); p[i * 3 + 2] = lp(box[2], box[5], H1(seed + i * 5.3)) }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.userData.base = p.slice();
    const sp = V6.puffTex(seed + 9); const m = new THREE.PointsMaterial({ color: col, size, map: sp, transparent: true, depthWrite: false, opacity: .55, blending: THREE.AdditiveBlending, sizeAttenuation: false });
    const pts = new THREE.Points(g, m); pts.userData.noDepth = true;
    pts.userData.upd = t => { const a = g.attributes.position.array, b = g.userData.base; for (let i = 0; i < n; i++) { a[i * 3] = b[i * 3] + Math.sin(t * .3 + i) * .12; a[i * 3 + 1] = b[i * 3 + 1] + ((t * .05 + H1(i * 9.1)) % 1 - .5) * .4; a[i * 3 + 2] = b[i * 3 + 2] + Math.cos(t * .25 + i * 1.3) * .1 } g.attributes.position.needsUpdate = true };
    return pts;
  };
  // облако пара/дыма: спрайты с мягкой текстурой; o: n, from, life, rise, spread, size, col, op
  V6.vapor = (o = {}) => {
    const grp = new THREE.Group(), n = o.n || 24, tex = [1, 2, 3].map(s => V6.puffTex(s + (o.seed || 0)));
    for (let i = 0; i < n; i++) { const m = new THREE.SpriteMaterial({ map: tex[i % 3], color: o.col || 0xffffff, transparent: true, depthWrite: false, opacity: 0 }); const s = new THREE.Sprite(m); grp.add(s) }
    grp.userData.noDepth = true; grp.children.forEach(s => s.userData.noDepth = true);
    grp.userData.upd = (t, k = 1) => grp.children.forEach((s, i) => {
      const life = o.life || 3, age = (((t - (o.t0 || 0)) / life + H1(i * 1.37 + (o.seed || 0))) % 1 + 1) % 1, e = Math.pow(age, .8);
      const sp = o.spread || .3, dir = o.dir || [0, 1, 0];
      s.position.set((H1(i * 9.1) - .5) * sp * (1 + age * 2) + dir[0] * e * (o.rise || 1.2) + Math.sin(t * .7 + i) * .05 * age, dir[1] * e * (o.rise || 1.2), (H1(i * 4.7) - .5) * sp + dir[2] * e * (o.rise || 1.2));
      const sz = lp(o.size0 || .15, o.size || .9, e); s.scale.set(sz, sz, 1); s.material.rotation = H1(i) * 6.28 + t * .2 * (H1(i * 2) - .5);
      s.material.opacity = (o.op || .35) * k * Math.pow(Math.sin(Math.PI * Math.min(1, age * 1.1)), 1.3);
    });
    return grp;
  };
  // камера по ключевым точкам: [[t, [x,y,z], [tx,ty,tz], fov]] — плавно (eio) между соседними
  V6.camPath = (cam, keys, t) => {
    let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++;
    const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)], k = b === a ? 1 : V6.eio(V6.at(t, a[0], b[0]));
    cam.position.set(lp(a[1][0], b[1][0], k), lp(a[1][1], b[1][1], k), lp(a[1][2], b[1][2], k));
    cam.lookAt(lp(a[2][0], b[2][0], k), lp(a[2][1], b[2][1], k), lp(a[2][2], b[2][2], k));
    const f = lp(a[3] || 40, b[3] || 40, k); if (cam.fov !== f) { cam.fov = f; cam.updateProjectionMatrix() }
  };
  V6.persp = (fov = 38) => new THREE.PerspectiveCamera(fov, V6.WW / V6.HH, .05, 120);
})();
