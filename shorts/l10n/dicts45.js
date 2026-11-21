// 22.11 — надписи глав 4–5 (TEXT_L, OBJ_L) в JSON для файла с текстами: node l10n/dicts45.js → печатает {ch4:{ru,en,de}, ch5:{…}}
// Функции чисел (fPrice и т. п.) показаны на значениях из ролика.
const fs = require('fs'), path = require('path');
const SAMPLE = { fPrice: 16, fCans: 581, fPct: 1.7, fPrem: 300, fUsers: 32, fCigs: 617, fPctN: '+0,6' };
function grab(file) {
  const s = fs.readFileSync(path.join(__dirname, '..', 'ep', file), 'utf8');
  const i = s.indexOf('const TEXT_L = {'), j = s.indexOf('const TEXT = {}', i), code = s.slice(i, j);
  return new Function(code + '\nreturn { TEXT_L, OBJ_NAMES, OBJ_L: typeof OBJ_L === "undefined" ? null : OBJ_L }')();
}
const flat = v => typeof v === 'function' ? null : Array.isArray(v) ? v.map(x => Array.isArray(x) ? x.join(' ') : x).join(' / ') : String(v);
const out = {};
for (const [ch, file] of [['ch4', 'v210/10-text.js'], ['ch5', 'v220/10-text.js']]) {
  const D = grab(file), rows = [];
  for (const k of Object.keys(D.TEXT_L.ru)) {
    const r = ['ru', 'en', 'de'].map(l => { const v = D.TEXT_L[l][k]; return typeof v === 'function' ? v(SAMPLE[k] ?? 1) : flat(v) });
    rows.push({ k, src: 'TEXT', ru: r[0], en: r[1], de: r[2] });
  }
  if (D.OBJ_L) for (const k of Object.keys(D.OBJ_L.ru)) {
    const r = ['ru', 'en', 'de'].map(l => flat(D.OBJ_L[l][k])); rows.push({ k, src: 'OBJ', ru: r[0], en: r[1], de: r[2] });
  }
  const names = [...new Set(Object.values(D.OBJ_NAMES).flat())];
  out[ch] = { rows, names };
}
process.stdout.write(JSON.stringify(out, null, 1));
