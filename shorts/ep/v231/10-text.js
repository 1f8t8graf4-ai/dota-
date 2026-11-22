  // ================= тексты и привязка событий к словам (по номерам слов; голоса пока нет — черновой таймлайн) =================
  const TITLE_L = {   // титул — слово в слово как в финале фильма (ep/v220/10-text.js, titleL)
    ru: [['ЧТО', 'ВЫ', 'ЗНАЕТЕ'], ['О', 'НИКОТИНЕ?']],
    en: [['WHAT', 'DO', 'YOU', 'KNOW'], ['ABOUT', 'NICOTINE?']],
    de: [['WAS', 'WISST', 'IHR'], ['ÜBER', 'NIKOTIN?']],
  };
  const LAB_L = { ru: ['УПАКОВКА', 'ВКУС', 'ОБЕЩАНИЯ'], en: ['PACKAGING', 'FLAVORS', 'PROMISES'], de: ['VERPACKUNG', 'GESCHMACK', 'VERSPRECHEN'] };
  const STAMP_L = { ru: 'СПОСОБ БРОСИТЬ', en: 'A WAY TO QUIT', de: 'ZUM AUFHÖREN' };
  let VAR = 'A', FILM = false;   // v23.4: FILM — пролог для фильма на YouTube (v231f): без корпуса одноразки и без кадра главы 1 в конце
  const TTL_L = { ru: ['01', 'ОДНОРАЗКИ'], en: ['01', 'DISPOSABLES'], de: ['01', 'EINWEG-VAPES'] };
  const ORDA = ['cig', 'pod', 'heat', 'ice', 'tin'];   // v23.2: A — сигареты · «Джул» · айкос · одноразки · снюс (как карточки доски: 1924 · 1979 · 2014 · 2020 · 2022)
  // [фраза, № слова] — A: см. ниже;
  //                     B: «Сигареты. «Джул». Одноразки. Айкос. Снюс.» / «И каждый раз — «способ бросить».» / «Угадаете, кто стоит за всеми пятью?»
  const ANCH = {
    // v23.2: A — «Что вы знаете о никотине? / За сто лет он менял форму пять раз: / Сигареты. «Джул». Айкос. Одноразки. Снюс. / Менялись упаковка, вкус и обещания — но не суть. / Начнём…»
    A: { ru: { form: [['s3', 0], ['s3', 1], ['s3', 2], ['s3', 3], ['s3', 4]], five: ['s2', 6], mac: [['s4', 0], ['s4', 2], ['s4', 4]], dark: ['s4', 5], flare: ['s4', 7], grow: ['s5', 0], zip: ['s5', 2] } },
    B: { ru: { form: [['s1', 0], ['s1', 1], ['s1', 2], ['s1', 3], ['s1', 4]], stamp: ['s2', 1], quote: ['s2', 3], back: ['s3', 0], who: ['s3', 1], stand: ['s3', 2], pull: ['s3', 4], flare: ['s3', 5], grow: ['s4', 0], zip: ['s4', 2] } },
  };
  const WA = ([sc, i]) => { const s = TLS.find(x => x.scene === sc); if (!s) throw new Error('v231: нет фразы ' + sc); const w = s.words[Math.min(i, s.words.length - 1)]; return w.a };
  function keys() {
    const A = ANCH[VAR][LANG] || ANCH[VAR].ru, TE = TLX.endT, s1 = TLS.find(x => x.scene === 's1');
    const k = { TE, TE1: TE - 1 / 30, s1a: s1.a, s1b: s1.b, s2: SA('s2'), s2b: SB('s2'), s3: SA('s3'), s3b: SB('s3'), s4: SA('s4'), form: A.form.map(WA), flare: WA(A.flare), grow: WA(A.grow), zip: WA(A.zip) };
    if (VAR === 'A') {
      k.tw = s1.words.map(w => w.a); k.five = WA(A.five); k.mac = A.mac.map(WA); k.dark = WA(A.dark);
      k.row = Math.min(k.form[4] + .45, k.mac[0] - .55);   // v23.3: «Снюс» крупно ≈ 0,45 с → весь ряд; врезка «упаковка» — ровно на «Менялись» (mac[0])
      k.beat0 = k.tw[k.tw.length - 1]; k.noSub = ch => ch.a < s1.b + .05;   // первая фраза — это титул, субтитром её не дублируем
    } else {
      k.stamp = WA(A.stamp); k.quote = WA(A.quote); k.back = WA(A.back); k.who = WA(A.who); k.stand = WA(A.stand); k.pull = WA(A.pull);
      k.dark = k.flare - .02; k.beat0 = k.flare + .25; k.noSub = () => false;
    }
    k.dive0 = Math.max(k.zip + .95, TE - 1.05); k.dive1 = k.TE1;     // нырок кончается ровно на последнем кадре
    k.suck0 = k.grow + .35; k.suck1 = Math.max(k.suck0 + .4, Math.min(k.zip + .3, k.dive0 - .3));   // v23.3: капля поднимается к щели окна и втягивается (окно не открываем)
    if (FILM) {   // v23.4: капля → золотая точка → титр «01 · ОДНОРАЗКИ», бит гаснет на низком ударе, темнота, дальше — ночной город главы 1 (наплывом при склейке)
      const s5 = TLS.find(x => x.scene === 's5'), wl = s5.words[s5.words.length - 1];
      k.dive0 = 1e9; k.TE1 = TE + 1; k.suck0 = k.grow + .9; k.suck1 = k.grow + 1.3;
      k.ttl = WA(['s5', 3]) - .15; k.hit = wl.b + .07; k.tOut = TE - .95; k.blk = [TE - .8, TE - .4];
    }
    return k;
  }
