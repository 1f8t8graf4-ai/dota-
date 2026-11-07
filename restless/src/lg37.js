// ===================== lg37 (07.11) — сайт во встроенном окне игры (мод, Ctrl+Alt+H): легче и с копированием =====================
// Андрей: «менюшка открывается, но лагает — 0 FPS; нельзя писать, копировать билды».
// Во встроенном браузере игры (?embed=1): без анимаций, переходов и живых видео — браузер игры перерисовывал страницу
// каждый кадр. Копирование: navigator.clipboard там часто запрещён — запасной путь через выделение текста и execCommand.
(() => {
  // копирование — везде, не только во встроенном окне
  const fallback = t => new Promise((res, rej) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = String(t); ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand('copy'); ta.remove();
      ok ? res() : rej(new Error('copy'));
    } catch (e) { rej(e); }
  });
  try {
    const cb = navigator.clipboard, orig = cb && cb.writeText ? cb.writeText.bind(cb) : null;
    const wt = t => (orig ? orig(t) : Promise.reject(new Error('no clipboard'))).catch(() => fallback(t));
    if (cb) { try { cb.writeText = wt; } catch (e) { Object.defineProperty(navigator, 'clipboard', {value: {writeText: wt}, configurable: true}); } }
    else Object.defineProperty(navigator, 'clipboard', {value: {writeText: wt}, configurable: true});
  } catch (e) {}

  if (typeof RL_EMBED === 'undefined' || !RL_EMBED) return;
  document.documentElement.classList.add('rl-lite');
  // живые видео (петли героев, фоны) — стоп на первом кадре
  const still = v => { try { v.autoplay = false; v.removeAttribute('autoplay'); v.loop = false; v.preload = 'metadata'; v.pause(); } catch (e) {} };
  const scan = root => { if (!root || root.nodeType !== 1) return; if (root.tagName === 'VIDEO') still(root); else root.querySelectorAll && root.querySelectorAll('video').forEach(still); };
  scan(document.body);
  new MutationObserver(ms => { for (const m of ms) m.addedNodes.forEach(scan); }).observe(document.body, {childList: true, subtree: true});
  document.addEventListener('play', e => { if (e.target && e.target.tagName === 'VIDEO') still(e.target); }, true);
})();
