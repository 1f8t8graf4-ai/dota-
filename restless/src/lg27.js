// ===================== lg27 — 04.11 (ночь 6): без пояснений на сайте =====================
// Андрей: «убери в срочном порядке все эти надписи как в League of Graphs и т. д.» (правило: на сайте — без пояснений).
// Прячем подписи-пояснения под заголовками, «как считаем», сноски; из подсказок при наведении убираем ссылки на чужие сайты.
const U27RX = /(League of Graphs|LoG\b|Porofessor|Deadlock Labs|ResoAI|нажми|Нажми|наведи|Наведи|как считаем|Как считаем|столбик —|▲ —|— из файлов игры|открытые данные|данные игры через)/;
const U27T = /,?\s*(как|Как) (в )?(League of Graphs|Porofessor|Deadlock Labs|LoG)[^.;)]*[.;)]?/g;
function u27Sweep(root) {
  (root || document).querySelectorAll('small, p.note, p.sub, .note, .q-pop p, details.l16-how').forEach(el => {
    if (el.dataset.u27) return; el.dataset.u27 = 1;
    if (el.matches('details.l16-how') || U27RX.test(el.textContent || '')) el.style.display = 'none';
  });
  (root || document).querySelectorAll('[title]').forEach(el => { const t = el.getAttribute('title'); if (t && U27T.test(t)) el.setAttribute('title', t.replace(U27T, '').replace(/\s{2,}/g, ' ').trim()); U27T.lastIndex = 0; });
}
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => u27Sweep(), 60); }).observe(document.body, {childList: true, subtree: true}); u27Sweep(); }
