const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); let fails = 0; const errs = [];
  const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fails++; };
  for (const [w, h, dev] of [[390, 844, 'ph'], [1440, 900, 'pc']]) {
    console.log('==', dev);
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(dev + ': ' + e.message));
    await p.goto('http://127.0.0.1:8090/T_new.html'); await p.waitForTimeout(600);
    const vis = () => p.evaluate(() => [...document.querySelectorAll('section.scene')].filter(s => !s.hidden).map(s => s.id).join(','));
    ok(await vis() === 's1', 'при открытии виден только «Интро»');
    ok(await p.evaluate(() => document.querySelectorAll('a[href^="#"]').length) === 0, 'ссылок-якорей нет');
    // выбор в «Горле» → счётчик на вкладке
    await p.click('.tab[data-s="s3"]'); await p.waitForTimeout(150);
    await p.locator('#s3 .q').first().locator('label.opt').first().click(); await p.waitForTimeout(150);
    ok((await p.textContent('.tab[data-s="s3"] i')) === '1/6', 'счётчик вкладки «Горло» = 1/6');
    ok((await p.textContent('#prog')).includes('1 из 42'), 'внизу «Выбрано 1 из 42»');
    // запоминает вкладку после перезагрузки
    await p.click('.tab[data-s="s9"]'); await p.reload(); await p.waitForTimeout(600);
    ok(await vis() === 's9', 'после перезагрузки открыта та же вкладка (Деньги)');
    ok((await p.textContent('.tab[data-s="s3"] i')) === '1/6', 'выбор сохранился после перезагрузки (черновик)');
    // «Советы» → все вкладки с вопросами зелёные
    await p.click('#btnRec'); await p.waitForTimeout(200);
    const done = await p.evaluate(() => [...document.querySelectorAll('.tab[data-s]')].filter(t => t.querySelector('i')).every(t => t.classList.contains('done')));
    ok(done, '«Советы» заполнили все разделы — вкладки отмечены');
    ok((await p.textContent('#prog')).includes('42 из 42'), 'выбрано 42 из 42');
    // текст ответов собирается из всех разделов, хотя видна одна вкладка
    const txt = await p.inputValue('#output');
    ok(txt.includes('## Интро') && txt.includes('## Большой ролик') && txt.includes('## Текст голоса'), 'текст ответов — по всем разделам');
    // последняя вкладка: кнопка «Сохранить ответы» работает (тут сохранения нет — статус об этом)
    await p.click('.tab[data-s="s11"]'); await p.waitForTimeout(150);
    await p.locator('#s11 [data-act=save]').scrollIntoViewIfNeeded(); await p.click('#s11 [data-act=save]'); await p.waitForTimeout(200);
    ok((await p.textContent('#status')).includes('«Текстом»'), '«Сохранить ответы» на последней вкладке срабатывает');
    // стрелки на клавиатуре
    await p.focus('#tr_s11'); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(100);
    ok(await vis() === 's13', 'стрелка ← переключает на соседнюю вкладку «Шортсы»');
    // кадр крупно открывается и закрывается
    await p.click('.tab[data-s="s1"]'); await p.waitForTimeout(100);
    await p.locator('#s1 figure.shot').first().click(); await p.waitForTimeout(150);
    ok(await p.evaluate(() => document.getElementById('lb').open), 'кадр открывается крупно');
    await p.mouse.click(10, 10); await p.waitForTimeout(150);
    ok(!(await p.evaluate(() => document.getElementById('lb').open)), 'кадр закрывается тапом');
    // ничего не вылезает вбок ни на одной вкладке
    let maxOver = 0;
    for (const id of ['s1','s2','s3','s4','s5','s6','s7','s12','s8','s9','s10','s13','s11']) {
      await p.click(`.tab[data-s="${id}"]`); await p.waitForTimeout(60);
      maxOver = Math.max(maxOver, await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    }
    ok(maxOver <= 0, 'ничего не вылезает вбок на всех 13 вкладках');
    await ctx.close();
  }
  for (const [w, h, dev] of [[390, 844, 'ph'], [1440, 900, 'pc']]) {
    console.log('== без кода страницы,', dev);
    const ctx = await b.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: false }); const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:8090/T_new.html'); await p.waitForTimeout(300);
    const vis = () => p.evaluate(() => 0).catch(() => 0);
    const shown = async () => {
      const ids = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11'], on = [];
      for (const id of ids) if (await p.locator('#' + id).isVisible()) on.push(id);
      return on.join(',');
    };
    ok(await shown() === 's1', 'при открытии виден только «Интро»');
    for (const id of ['s8', 's3', 's11', 's1']) {
      await p.click(`.tab[data-s="${id}"]`); await p.waitForTimeout(80);
      ok(await shown() === id, `вкладка ${id} открывается без кода`);
    }
    await p.click('.tab[data-s="s3"]'); await p.waitForTimeout(400);
    const bg = await p.locator('.tab[data-s="s3"]').evaluate(el => getComputedStyle(el).backgroundColor);
    ok(bg !== 'rgb(255, 255, 255)' && bg !== 'rgba(0, 0, 0, 0)', 'нажатая вкладка подсвечена: ' + bg);
    await ctx.close();
  }
  console.log('ошибки страницы:', errs.length ? errs : 'нет'); console.log(fails ? 'ПРОВАЛОВ: ' + fails : 'всё ок');
  await b.close(); process.exit(fails ? 1 : 0);
})();
