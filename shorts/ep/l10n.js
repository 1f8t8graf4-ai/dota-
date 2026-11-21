// 21.11 — локализация глав 1–3 (v170, v191 с мостиком, v200) без правки рисовки и без новой записи голоса.
// Всё, что глава рисует в кадре (fillText / strokeText / measureText), подменяется по словарю RU → EN / DE из ep/l10n-dict.js:
//   точное совпадение строки → по словарю;
//   строка — начало известной (печатается по буквам) → такая же доля перевода;
//   правила (числа с единицами: «12,8 МЛРД» → «12.8B») → по регулярным выражениям словаря.
// Ширина плашек считается по переводу (measureText тоже подменён) — плашки сами растут под текст.
// Субтитры перевода — tl.subs в таймлайне ролика (tools/l10n_subs.py), глава берёт их вместо русских слов (buildChunks).
// Ставится в stage.html → init(), если язык ролика не ru. Чего нет в словаре — остаётся как есть и попадает в window.L10N_MISS.
(function () {
  const CYR = /[А-Яа-яЁё]/;
  const norm = s => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  window.L10N = {
    lang: 'ru', off: 0,   // off — на время замера русской строки (плашка держится у края кадра так же, как русская)
    tr: s => s,
    install(lang) {
      const D = (window.L10N_DICT || {})[lang]; if (!D || this.lang === lang) return !!D;
      const exact = new Map(); for (const [k, v] of Object.entries(D.strings || {})) exact.set(norm(k), v);
      const keys = [...exact.keys()].sort((a, b) => b.length - a.length);
      const rules = (D.rules || []).map(([re, to]) => [new RegExp(re, 'u'), to]);
      const cache = new Map(), miss = window.L10N_MISS = {};
      // числа без букв: EN — десятичная точка, «8.9%», тысячи через запятую («14,000,000»); DE — тысячи через точку («14.000.000»)
      const NUMF = { en: x => x.replace(/(\d),(\d)/g, '$1.$2').replace(/(\d) %/g, '$1%').replace(/(\d) (?=\d{3}(?!\d))/g, '$1,'),
        de: x => x.replace(/(\d) (?=\d{3}(?!\d))/g, '$1.') }[lang] || (x => x);
      const tr = s => {
        if (typeof s !== 'string' || this.off) return s;
        if (!CYR.test(s)) { const n0 = norm(s); if (exact.has(n0)) return s.match(/^\s*/)[0] + exact.get(n0) + s.match(/\s*$/)[0]; return /\d/.test(s) ? NUMF(s) : s }   // 22.11: латинские штампы тоже по словарю (SECRET → GEHEIM)
        const hit = cache.get(s); if (hit !== undefined) return hit;
        const n = norm(s), lead = s.match(/^\s*/)[0], tail = s.match(/\s*$/)[0];
        let out = exact.has(n) ? exact.get(n) : null;
        if (out === null) for (const [re, to] of rules) if (re.test(n)) { out = n.replace(re, to); if (CYR.test(out)) out = tr(out); break }
        if (out === null && n.length >= 2) for (const k of keys) if (k.length > n.length && k.startsWith(n)) { const v = exact.get(k); out = v.slice(0, Math.max(1, Math.round(v.length * n.length / k.length))).trimEnd(); break }
        if (out === null) { miss[s] = (miss[s] || 0) + 1; out = n }
        out = lead + out + tail; cache.set(s, out); return out;
      };
      for (const P of [window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype, window.OffscreenCanvasRenderingContext2D && OffscreenCanvasRenderingContext2D.prototype].filter(Boolean)) {
        if (P.__l10n) continue; P.__l10n = 1;
        const f = P.fillText, g = P.strokeText, m = P.measureText;
        P.fillText = function (s, ...a) { return f.call(this, window.L10N.tr(s), ...a) };
        P.strokeText = function (s, ...a) { return g.call(this, window.L10N.tr(s), ...a) };
        P.measureText = function (s) { return m.call(this, window.L10N.tr(s)) };
      }
      this.tr = tr; this.lang = lang; return true;
    },
  };
})();
