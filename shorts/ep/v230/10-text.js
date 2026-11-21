  // ================= тексты и привязка событий к словам (по номерам слов — у EN/DE свои номера, голоса пока нет) =================
  const TITLE_L = {   // титул — слово в слово как в финале фильма (ep/v220/10-text.js, titleL): кольцо — фильм начинается и кончается этим вопросом
    ru: [['ЧТО', 'ВЫ', 'ЗНАЕТЕ'], ['О', 'НИКОТИНЕ?']],
    en: [['WHAT', 'DO', 'YOU', 'KNOW'], ['ABOUT', 'NICOTINE?']],
    de: [['WAS', 'WISST', 'IHR'], ['ÜBER', 'NIKOTIN?']],
  };
  // [фраза, № слова]: форма 1–5 (сигарета, нагреватель, под, одноразка, банка); три «лица» оболочки; трещина; вспышка ядра; рост корпуса; молния
  const ANCH = {
    ru: { form: [['s2', 0], ['s2', 4], ['s2', 6], ['s2', 9], ['s2', 12]], face: [['s3', 1], ['s3', 2], ['s3', 4]], crack: ['s3', 5], flare: ['s3', 7], grow: ['s4', 0], zip: ['s4', 2] },
    en: { form: [['s2', 0], ['s2', 4], ['s2', 6], ['s2', 9], ['s2', 12]], face: [['s3', 1], ['s3', 3], ['s3', 6]], crack: ['s3', 8], flare: ['s3', 9], grow: ['s4', 0], zip: ['s4', 4] },
    de: { form: [['s2', 0], ['s2', 5], ['s2', 8], ['s2', 10], ['s2', 14]], face: [['s3', 0], ['s3', 1], ['s3', 3]], crack: ['s3', 6], flare: ['s3', 7], grow: ['s4', 0], zip: ['s4', 5] },
  };
  const WA = ([sc, i]) => { const s = TLS.find(x => x.scene === sc); if (!s) throw new Error('v230: нет фразы ' + sc); const w = s.words[Math.min(i, s.words.length - 1)]; return w.a };
  const WB = ([sc, i]) => { const s = TLS.find(x => x.scene === sc); const w = s.words[Math.min(i, s.words.length - 1)]; return w.b };
  function keys() {
    const A = ANCH[LANG] || ANCH.ru, s1 = TLS.find(x => x.scene === 's1'), TE = TLX.endT;
    const k = {
      TE, TE1: TE - 1 / 30,                                         // кадр 0 главы 1 и последний кадр пролога (= глава 1 за 1/30 с до кадра 0)
      tw: s1.words.map(w => w.a), s1b: s1.b, s2: SA('s2'),
      form: A.form.map(WA), face: A.face.map(WA), crack: WA(A.crack), flare: WA(A.flare), grow: WA(A.grow), zip: WA(A.zip),
    };
    k.beat0 = k.tw[k.tw.length - 1];                                  // ядро «бьётся» с последнего слова титула
    k.dive0 = Math.max(k.zip + .95, TE - 1.05); k.dive1 = k.TE1;     // нырок кончается ровно на последнем кадре
    k.pour = [k.grow + .3, k.grow + .7];                              // ядро стекает в капсулу
    k.zipE = Math.min(k.zip + .62, k.dive0 - .2);                     // кольцо дошло до верха капсулы — это кадр 0 главы 1
    k.noSub = ch => ch.a < s1.b + .05;
    return k;
  }
