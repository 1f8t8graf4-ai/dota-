// Вкладки пульта: прямо, в чужом iframe (скроллится сам / по высоте содержимого), с перехватом ссылок, как может делать просмотрщик.
const { chromium } = require('playwright');
const GUARD = `document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (a) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);`;
(async () => {
  const b = await chromium.launch(); const errs = []; let fails = 0;
  const ok = (c, m) => { if (!c) { fails++; console.log('  FAIL', m); } };
  // где заголовок раздела относительно видимой части окна (с учётом iframe)
  async function seen(page, frame, id) {
    const fr = await frame.evaluate(id => { const h = document.getElementById('h_' + id) || document.getElementById(id);
      const sc = document.getElementById(id); return { top: h.getBoundingClientRect().top, vis: !!(sc && sc.offsetParent !== null && !sc.hidden) }; }, id);
    let off = 0;
    if (frame !== page.mainFrame()) off = await page.evaluate(() => document.getElementById('f').getBoundingClientRect().top);
    const vh = await page.evaluate(() => innerHeight);
    const top = Math.round(fr.top + off);
    // нижняя панель с кнопками: в своём окне она прибита к низу экрана — заголовок должен быть выше неё
    const barTop = await frame.evaluate(() => { const b = document.querySelector('.bar'); return b ? b.getBoundingClientRect().top : 1e9; });
    const limit = Math.min(vh, (frame === page.mainFrame() || barTop + off < vh) ? barTop + off : vh) - 30;
    return { top, vis: fr.vis, inView: top >= -2 && top <= limit, limit: Math.round(limit) };
  }
  for (const page of ['T_old.html', 'T_new.html']) {
    const isNew = page === 'T_new.html';
    console.log('==', isNew ? 'НОВЫЙ (кнопки-вкладки)' : 'СТАРЫЙ v2 (ссылки)');
    for (const [mode, guard] of [['direct', false], ['fixed', false], ['fixed', true], ['tall', false], ['tall', true]]) {
      for (const [w, h, dev] of [[390, 844, 'ph'], [1440, 900, 'pc']]) {
        const ctx = await b.newContext({ viewport: { width: w, height: h } });
        if (guard) await ctx.addInitScript(GUARD);
        const p = await ctx.newPage(); p.on('pageerror', e => errs.push(`${page} ${mode} ${dev}: ${e.message}`));
        if (mode === 'direct') await p.goto('http://127.0.0.1:8090/' + page);
        else await p.goto(`http://127.0.0.1:8091/parent.html?mode=${mode}&page=${page}`);
        await p.waitForTimeout(700);
        const fr = mode === 'direct' ? p.mainFrame() : p.frames().find(f => f.url().includes(':8090/'));
        const res = [];
        for (const id of ['s8', 's3', 's10', 's1']) {
          const sel = isNew ? `.tab[data-s="${id}"]` : `.toc a[href="#${id}"]`;
          await fr.click(sel); await p.waitForTimeout(250);
          const r = await seen(p, fr, id); res.push(`${id}:${r.inView ? 'ok' : 'НЕТ'}(${r.top})`);
          if (isNew) ok(r.inView && r.vis, `${mode}${guard ? '+guard' : ''} ${dev} вкладка ${id} — ${JSON.stringify(r)}`);
        }
        let pg = '';
        if (isNew) {
          // «Дальше» внизу раздела: s1 → s2, потом «← Интро»
          await fr.click('.tab[data-s="s1"]'); await p.waitForTimeout(150);
          await fr.locator('#s1 .pg-next').scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
          await fr.click('#s1 .pg-next'); await p.waitForTimeout(300);
          const r2 = await seen(p, fr, 's2');
          const one = await fr.evaluate(() => [...document.querySelectorAll('section.scene')].filter(s => !s.hidden).map(s => s.id).join(','));
          ok(r2.inView && one === 's2', `${mode}${guard ? '+guard' : ''} ${dev} «Дальше» → s2: ${JSON.stringify(r2)} видно: ${one}`);
          await fr.locator('#s2 .pg-prev').scrollIntoViewIfNeeded(); await fr.click('#s2 .pg-prev'); await p.waitForTimeout(300);
          const r3 = await seen(p, fr, 's1');
          ok(r3.inView, `${mode}${guard ? '+guard' : ''} ${dev} «← Интро»: ${JSON.stringify(r3)}`);
          pg = ` дальше→s2:${r2.inView ? 'ok' : 'НЕТ'} назад→s1:${r3.inView ? 'ok' : 'НЕТ'}`;
          const over = await fr.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          ok(over <= 0, `${mode} ${dev} вылезает вбок на ${over}`);
        }
        console.log(`  ${mode}${guard ? '+перехват' : ''} ${dev}: ${res.join(' ')}${pg}`);
        await ctx.close();
      }
    }
  }
  console.log('ошибки страницы:', errs.length ? errs : 'нет'); console.log(fails ? `ПРОВАЛОВ: ${fails}` : 'новый — всё ок');
  await b.close(); process.exit(fails ? 1 : 0);
})();
