// 23.11: фильм для YouTube в 16:9 (Андрей: «должен открываться как видос на ютубе, а не шортс»).
// Включается в capture.mjs переменной WIDE=1 (window.wideInit() до загрузки главы). Кадр — 1920×1080 (24.11; было 2560×1440).
// Рисовка глав — как была, в единицах вертикального кадра 1080×1920: он стоит по центру во всю высоту (масштаб 0,75),
// а камера и фоны видят мир шире — x от WIDE.X0 до WIDE.X1 (≈ −1167 … 2247).
// wideCtx(c): у контекста кадра setTransform/resetTransform/getTransform — в единицах рисовки (базовый сдвиг и масштаб спрятаны),
// заливка всего вертикального кадра (fillRect/clearRect от (0,0) на 1080×1920 при единичной матрице) — на всю ширину.
// Без WIDE ничего не меняется: вертикальные ролики рисуются как раньше.
(function () {
  'use strict';
  const P = CanvasRenderingContext2D.prototype;
  window.WIDE = window.WIDE || null;
  // 24.11 (ТЗ Андрея): кадр рисуется в 1920×1080 (в 2560×1440 — апскейлом при сборке), камера ближе в z раз (1,25–1,35):
  // по высоте видно 1920/z единиц рисовки вокруг cy, по ширине — сколько влезет
  window.wideInit = function (w = 1920, h = 1080, z = 1.3, cy = 900) {
    const s = z * h / 1920, ox = (w / s - 1080) / 2, vh = h / s, oy = cy - vh / 2;
    window.WIDE = { W: w, H: h, s, z, ox, oy, X0: -ox, X1: 1080 + ox, Y0: oy, Y1: oy + vh, hw: 540 + ox };
  };
  // плашка года в 16:9 — в левом верхнем углу кадра и в 1,5 раза крупнее; (70, 80) — её угол в вертикальном кадре
  window.widePill = function (c) { const w = window.WIDE; c.translate(w.X0 + 40, w.Y0 + 34); c.scale(1.5, 1.5); c.translate(-70, -80) };
  window.wideCtx = function (c) {
    const w = window.WIDE; if (!w || !c || c.__wide) return c;
    const B = new DOMMatrix([w.s, 0, 0, w.s, w.s * w.ox, -w.s * w.oy]), Bi = B.inverse();
    c.__wide = 1;
    c.setTransform = function (a, b, cc, d, e, f) {
      const m = typeof a === 'object' ? DOMMatrix.fromMatrix(a) : new DOMMatrix([a, b, cc, d, e, f]);
      return P.setTransform.call(this, B.multiply(m));
    };
    c.resetTransform = function () { return P.setTransform.call(this, B) };
    c.getTransform = function () { return Bi.multiply(P.getTransform.call(this)) };
    // заливка, которая закрывает весь вертикальный кадр, — на всю ширину; весь холст в пикселях (clearRect(0,0,w,h) у запасного холста) — весь холст
    const widen = (ctx, x, y, ww, hh, f) => {
      if (x === 0 && y === 0 && ww >= ctx.canvas.width && hh >= ctx.canvas.height && ww !== 1080 && isId(ctx.getTransform())) {
        ctx.save(); P.setTransform.call(ctx, 1, 0, 0, 1, 0, 0); f.call(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore(); return true;
      }
      // прямоугольник (в своих координатах) закрывает весь вертикальный кадр — при любой матрице, и с поворотом «живой камеры»:
      // расширяем его так, чтобы он закрыл и широкий кадр
      const m = ctx.getTransform(); let inv; try { inv = m.inverse() } catch (e) { return false }
      if (!isFinite(inv.a)) return false;
      const L = (X, Y) => { const p = inv.transformPoint(new DOMPoint(X, Y)); return [p.x, p.y] };
      const rx0 = Math.min(x, x + ww), rx1 = Math.max(x, x + ww), ry0 = Math.min(y, y + hh), ry1 = Math.max(y, y + hh);
      const inR = p => p[0] >= rx0 - .5 && p[0] <= rx1 + .5 && p[1] >= ry0 - .5 && p[1] <= ry1 + .5;
      if (![[0, 0], [1080, 0], [0, 1920], [1080, 1920]].every(q => inR(L(q[0], q[1])))) return false;
      // 24.11: глава может потребовать запас (WIDE.wm): предмет, который при наезде случайно закрыл вертикальный кадр (полка, лист),
      // — не фон; фоновая заливка шире кадра с запасом или нарисована без камеры
      if (w.wm && !(Math.abs(m.a - 1) < .02 && Math.abs(m.b) < .02 && Math.abs(m.d - 1) < .02) && ![[-w.wm, -w.wm], [1080 + w.wm, -w.wm], [-w.wm, 1920 + w.wm], [1080 + w.wm, 1920 + w.wm]].every(q => inR(L(q[0], q[1])))) return false;
      const wc = [[w.X0 - 4, Math.min(-4, w.Y0 - 4)], [w.X1 + 4, Math.min(-4, w.Y0 - 4)], [w.X0 - 4, Math.max(1924, w.Y1 + 4)], [w.X1 + 4, Math.max(1924, w.Y1 + 4)]].map(q => L(q[0], q[1]));
      const xs = [rx0, rx1, ...wc.map(p => p[0])], ys = [ry0, ry1, ...wc.map(p => p[1])], nx = Math.min(...xs), ny = Math.min(...ys);
      f.call(ctx, nx, ny, Math.max(...xs) - nx, Math.max(...ys) - ny); return true;
    };
    const isId = m => Math.abs(m.a - 1) < 1e-6 && Math.abs(m.b) < 1e-6 && Math.abs(m.c) < 1e-6 && Math.abs(m.d - 1) < 1e-6 && Math.abs(m.e) < 1e-3 && Math.abs(m.f) < 1e-3;
    // 24.11 (ТЗ Андрея: «никаких столбиков по центру»): горизонтальная полоса (пол, дорога, столешница, стена), которая на экране
    // закрывает всю ширину вертикального кадра, — до краёв широкого кадра. Только у глав, где включено WIDE.band, и без заметного поворота.
    const band = (ctx, x, y, ww, hh, f) => {
      if (!w.band || ctx.__noband) return false;
      const m = ctx.getTransform(); if (Math.abs(m.a) < 1e-6 || Math.abs(m.b) > .06 * Math.abs(m.a)) return false;
      const rx0 = Math.min(x, x + ww), rx1 = Math.max(x, x + ww), ys = [Math.min(y, y + hh), Math.max(y, y + hh)];
      const sx = (lx, ly) => m.a * lx + m.c * ly + m.e;
      const L = ys.map(ly => sx(m.a > 0 ? rx0 : rx1, ly)), R = ys.map(ly => sx(m.a > 0 ? rx1 : rx0, ly));
      if (Math.max(...L) > 1.5 || Math.min(...R) < 1078.5) return false;
      const lx = (X, ly) => (X - m.c * ly - m.e) / m.a, ex = ys.flatMap(ly => [lx(w.X0 - 8, ly), lx(w.X1 + 8, ly)]);
      const nx0 = Math.min(rx0, ...ex), nx1 = Math.max(rx1, ...ex); if (nx0 >= rx0 - .5 && nx1 <= rx1 + .5) return false;
      f.call(ctx, nx0, ys[0], nx1 - nx0, ys[1] - ys[0]); return true;
    };
    c.fillRect = function (x, y, ww, hh) { if (!widen(this, x, y, ww, hh, P.fillRect) && !band(this, x, y, ww, hh, P.fillRect)) P.fillRect.call(this, x, y, ww, hh) };
    c.clearRect = function (x, y, ww, hh) { if (!widen(this, x, y, ww, hh, P.clearRect)) P.clearRect.call(this, x, y, ww, hh) };
    // готовый кадр того же размера, что холст, в (0, 0) при единичной матрице — накладывается пиксель в пиксель
    c.drawImage = function (img, ...a) {
      if (a.length === 2 && a[0] === 0 && a[1] === 0 && img && img.width === this.canvas.width && img.height === this.canvas.height && isId(this.getTransform())) {
        this.save(); P.setTransform.call(this, 1, 0, 0, 1, 0, 0); P.drawImage.call(this, img, 0, 0); this.restore(); return;
      }
      return P.drawImage.call(this, img, ...a);
    };
    P.setTransform.call(c, B);
    return c;
  };
  // запасные холсты размером с кадр (тени, растворения, обработка кадра) — с тем же подменённым контекстом
  const GC = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...a) {
    const ctx = GC.call(this, type, ...a); const w = window.WIDE;
    if (w && type === '2d' && ctx && !ctx.__wide && this.width === w.W && this.height === w.H) window.wideCtx(ctx);
    return ctx;
  };
  // 23.11: стык глав в 16:9. Центр кадра у глав совпадает, а бока — из разных миров: за последние 0,5 с главы
  // поверх всего проявляется готовый широкий кадр следующей главы (за 1/30 с до её начала) — последний кадр = он.
  const SEAM = {};
  window.wideSeamLoad = src => new Promise(r => {
    if (!window.WIDE) return r(); const im = SEAM[src] || (SEAM[src] = new Image());
    if (im.complete && im.naturalWidth) return r(); im.onload = im.onerror = () => r(); if (!im.src) im.src = src;
  });
  window.wideSeam = function (c, t, t1, src, dur = .5) {
    const w = window.WIDE, im = SEAM[src]; if (!w || !im || !im.naturalWidth || t < t1 - dur) return;
    const k = Math.min(1, Math.max(0, (t - (t1 - dur)) / dur)), a = k * k * (3 - 2 * k);
    c.save(); P.setTransform.call(c, 1, 0, 0, 1, 0, 0); c.globalAlpha = a; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
    P.drawImage.call(c, im, 0, 0, c.canvas.width, c.canvas.height); c.restore();
  };
  window.wideRaw = c => P.setTransform.call(c, 1, 0, 0, 1, 0, 0);   // настоящая единичная матрица — наложить готовый кадр на кадр
  // холст кадра: в WIDE — 2560×1440 с подменённым контекстом, иначе как было
  window.wideCanvas = function (mk, WW, HH) {
    const w = window.WIDE; if (!w) return mk(WW, HH);
    const cv = mk(w.W, w.H); wideCtx(cv.getContext('2d')); return cv;
  };
})();
