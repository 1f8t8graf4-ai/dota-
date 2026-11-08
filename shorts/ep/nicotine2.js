// Никотин v3 — картинки нейросетью (img/nicotine), сцены и оверлеи — описанием (genEP в lib.js).
genEP({
  dir: 'nicotine',
  pal: { bg: '#13241F', ink: '#08130F', paper: '#F2ECDD', a1: '#E9A23B', a2: '#E2574C', a3: '#F2C14E' },
  scenes: {
    title: { cam: [1.1, 1.2, 540, 600], motes: '#D8F5C8', ov: [{ t: 'label', text: { en: 'What do you know about', ru: 'Что вы знаете о' }, y: 1120 }, { t: 'title', text: { en: 'NICOTINE?', ru: 'НИКОТИНЕ?' }, y: 1245, d: -.2 }] },
    vape: { cam: [1.0, 1.15, 540, 900, -30, 30] },
    claim: { cam: [1.0, 1.22, 540, 700], ov: [{ t: 'stamp', text: { en: 'WEAPON', ru: 'ОРУЖИЕ' }, cue: { en: 'weapon', ru: 'оружие' }, y: 1150, s: 96 }, { t: 'ring', cue: { en: 'weapon', ru: 'оружие' }, y: 650, c: 'a1' }] },
    bite: { cam: [1.05, 1.3, 400, 700], ov: [{ t: 'flash', cue: { en: 'freezes', ru: 'замирает' }, c: '#FFF3C4' }, { t: 'chip', text: { en: 'FROZEN', ru: 'ЗАМЕР' }, cue: { en: 'freezes', ru: 'замирает' }, y: 1150 }] },
    farm: { cam: [1.0, 1.14, 540, 800, 30, -30], ov: [{ t: 'big', text: '1690', cue: '1690', y: 340, s: 120, c: 'a3' }] },
    bottle: { cam: [1.0, 1.2, 540, 760], motes: '#FFE9B0', ov: [{ t: 'chip', text: { en: 'UNTIL 1992', ru: 'ДО 1992' }, cue: '1992', y: 1150, bgc: 'ink' }] },
    neo: { img: ['neo_a', 'neo_b'], sw: { en: 'eu', ru: 'евросоюз' }, cam: [1.0, 1.15, 540, 800], ov: [{ t: 'big', text: { en: 'neoNICOTINoids', ru: 'неоНИКОТИНоиды' }, cue: { en: 'neonicotinoids', ru: 'неоникотиноиды' }, y: 360, s: 92, c: 'a1', until: { en: 'eu', ru: 'евросоюз' } }, { t: 'chip', text: { en: 'EU · 2018', ru: 'ЕС · 2018' }, cue: { en: 'eu', ru: 'евросоюз' }, y: 340, bgc: 'ink', c: 'a3' }] },
    brain: { cam: [1.0, 1.25, 470, 600], ov: [{ t: 'chip', text: { en: '≈ 10 s', ru: '≈ 10 с' }, cue: { en: 'seconds', ru: 'секунды' }, y: 330, x: 800, bgc: 'a1', c: 'ink' }, { t: 'stamp', text: { en: 'MORE', ru: 'ЕЩЁ' }, cue: { en: 'more', ru: 'ещё' }, y: 1150, s: 100 }] },
    pod: { cam: [1.0, 1.18, 540, 800], ov: [{ t: 'chip', text: { en: '1 POD = 1 PACK', ru: '1 ПОД = 1 ПАЧКА' }, cue: { en: 'pack', ru: 'пачке' }, y: 1150 }] },
    toll: { cam: [1.0, 1.2, 540, 760], ov: [{ t: 'count', to: 7000000, post: '+', d: .1, dur: 1.8, y: 320, sub: { en: 'deaths a year', ru: 'смертей в год' } }, { t: 'chip', text: { en: '1 EVERY 5 s', ru: '1 КАЖДЫЕ 5 с' }, cue: { en: 'five', ru: 'пять' }, y: 1150 }] },
    end: { cam: [1.0, 1.12, 540, 800, 40, -40] },
    end2: { cam: [1.0, 1.2, 540, 600], motes: '#FFC27A' },
  },
  tr: { title: 'zoom', vape: 'push', claim: 'zoom', bite: 'push', farm: 'push', bottle: 'push', neo: 'zoom', brain: 'push', pod: 'fade', toll: 'push', end: 'zoom' },
  trAt: { title: [540, 600], claim: [540, 650], neo: [470, 600], end: [560, 700] },
});
