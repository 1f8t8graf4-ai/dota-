  // ================= тексты и привязка событий к словам (по номерам слов; голоса пока нет — черновой таймлайн) =================
  const TITLE_L = {   // титул — слово в слово как в финале фильма (ep/v220/10-text.js, titleL)
    ru: [['ЧТО', 'ВЫ', 'ЗНАЕТЕ'], ['О', 'НИКОТИНЕ?']],
    en: [['WHAT', 'DO', 'YOU', 'KNOW'], ['ABOUT', 'NICOTINE?']],
    de: [['WAS', 'WISST', 'IHR'], ['ÜBER', 'NIKOTIN?']],
  };
  const LAB_L = { ru: ['УПАКОВКА', 'ВКУС', 'ОБЕЩАНИЯ'], en: ['PACKAGING', 'FLAVORS', 'PROMISES'], de: ['VERPACKUNG', 'GESCHMACK', 'VERSPRECHEN'] };
  const STAMP_L = { ru: 'СПОСОБ БРОСИТЬ', en: 'A WAY TO QUIT', de: 'ZUM AUFHÖREN' };
  let VAR = 'A';
  // [фраза, № слова] — A: «За сто лет он менял форму пять раз — от сигарет до белых пакетиков» / «Менялись упаковка, вкус и обещания — но не суть»;
  //                     B: «Сигареты. «Джул». Одноразки. Айкос. Снюс.» / «И каждый раз — «способ бросить».» / «Угадаете, кто стоит за всеми пятью?»
  const ANCH = {
    A: { ru: { form: [['s2', 0], ['s2', 3], ['s2', 5], ['s2', 7], ['s2', 11]], line: ['s2', 8], hi: [['s2', 9]], mac: [['s3', 1], ['s3', 2], ['s3', 4]], dark: ['s3', 5], flare: ['s3', 7], grow: ['s4', 0], zip: ['s4', 2] } },
    B: { ru: { form: [['s1', 0], ['s1', 1], ['s1', 2], ['s1', 3], ['s1', 4]], stamp: ['s2', 1], quote: ['s2', 3], back: ['s3', 0], who: ['s3', 1], stand: ['s3', 2], pull: ['s3', 4], flare: ['s3', 5], grow: ['s4', 0], zip: ['s4', 2] } },
  };
  const WA = ([sc, i]) => { const s = TLS.find(x => x.scene === sc); if (!s) throw new Error('v231: нет фразы ' + sc); const w = s.words[Math.min(i, s.words.length - 1)]; return w.a };
  function keys() {
    const A = ANCH[VAR][LANG] || ANCH[VAR].ru, TE = TLX.endT, s1 = TLS.find(x => x.scene === 's1');
    const k = { TE, TE1: TE - 1 / 30, s1a: s1.a, s1b: s1.b, s2: SA('s2'), s2b: SB('s2'), s3: SA('s3'), s3b: SB('s3'), s4: SA('s4'), form: A.form.map(WA), flare: WA(A.flare), grow: WA(A.grow), zip: WA(A.zip) };
    if (VAR === 'A') {
      k.tw = s1.words.map(w => w.a); k.line = WA(A.line); k.hi = A.hi.map(WA); k.mac = A.mac.map(WA); k.dark = WA(A.dark);
      k.beat0 = k.tw[k.tw.length - 1]; k.noSub = ch => ch.a < s1.b + .05;   // первая фраза — это титул, субтитром её не дублируем
    } else {
      k.stamp = WA(A.stamp); k.quote = WA(A.quote); k.back = WA(A.back); k.who = WA(A.who); k.stand = WA(A.stand); k.pull = WA(A.pull);
      k.dark = k.flare - .02; k.beat0 = k.flare + .25; k.noSub = () => false;
    }
    k.dive0 = Math.max(k.zip + .95, TE - 1.05); k.dive1 = k.TE1;     // нырок кончается ровно на последнем кадре
    k.pour = [k.grow + .3, k.grow + .7];                              // капля стекает в капсулу
    k.zipE = Math.min(k.zip + .62, k.dive0 - .2);                     // кольцо дошло до верха капсулы — это кадр 0 главы 1
    return k;
  }
