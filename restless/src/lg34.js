// ===================== lg34 — 05.11: сборки — сначала лучшие =====================
// Андрей (05.11): «показывались сборки в первую очередь лучшие, а не в зависимости от ранга:
// пикаю Оракла — сборки только эмиссара, на Этернусе — только этернуса».
// Было: блок сборок наследовал общий фильтр ранга (дефолт «Oracle+», выбор хранится в localStorage
// навсегда) и сортировался «Популярные» — список срезан по рангу и по числу матчей.
// Стало: в сборках по умолчанию «Все ранги» + сортировка «Винрейт» (нижняя граница Уилсона —
// маленькая выборка не вылезает наверх). Выбор человека внутри блока сборок живёт свою сессию
// (sessionStorage), фильтр ранга на остальных страницах не трогаем.
{
  const OB34 = heroBuilds2;
  heroBuilds2 = async function (n, hid, me) {
    const ss = k => { try { return sessionStorage.getItem(k); } catch (e) { return '?'; } };
    const own = ss('rl-bld-b') !== null, sb = F.b;
    if (ss('rl-bld-s') === null) HBS = 'wr';
    if (!own) F.b = 0; // «Все ранги» на время запросов и отрисовки (drawBuilds2 внутри читает F.b)
    try { return await OB34(n, hid, me); }
    finally { if (!own) F.b = sb; }
  };
  // выбор в блоке сборок запоминаем раньше родного обработчика (capture), тот зовёт heroBuilds2 заново
  document.addEventListener('click', e => {
    const t = e.target && e.target.closest ? e.target.closest('#hbr [data-b], #hbs [data-s]') : null;
    if (!t) return;
    try {
      if (t.dataset.b !== undefined) sessionStorage.setItem('rl-bld-b', t.dataset.b);
      if (t.dataset.s !== undefined) sessionStorage.setItem('rl-bld-s', t.dataset.s);
    } catch (er) {}
  }, true);
}
