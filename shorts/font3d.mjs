// Шрифт для объёмного текста three.js (TextGeometry): нужные буквы из OTF/TTF → vendor/font3d-<имя>.js (window.FONT3D[имя])
//   node font3d.mjs inter /usr/share/fonts/opentype/inter/InterDisplay-ExtraBold.otf
// Преобразование — как TTFLoader из three.js (команды пути: m l q b), только выбранные символы, чтобы файл был маленьким.
import fs from 'fs'; import path from 'path'; import url from 'url'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const here = path.dirname(url.fileURLToPath(import.meta.url));
const opentype = require(path.join(here, 'vendor/three147/opentype.min.js'));
const [name, file] = process.argv.slice(2);
const CH = '0123456789 $%,.·:-–—№«»"\'!?()/+×' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' +
  'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ' + 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
const font = opentype.parse(new Uint8Array(fs.readFileSync(file)).buffer);
const sc = 100000 / ((font.unitsPerEm || 2048) * 72), r = Math.round, glyphs = {};
for (const ch of CH) {
  const g = font.charToGlyph(ch); if (!g || (g.index === 0 && ch !== ' ')) continue;
  const tok = { ha: r(g.advanceWidth * sc), x_min: r((g.xMin || 0) * sc), x_max: r((g.xMax || 0) * sc), o: '' };
  for (const c of g.path.commands) {
    const t = c.type.toLowerCase() === 'c' ? 'b' : c.type.toLowerCase(); tok.o += t + ' ';
    if (c.x !== undefined && c.y !== undefined) tok.o += r(c.x * sc) + ' ' + r(c.y * sc) + ' ';
    if (c.x1 !== undefined && c.y1 !== undefined) tok.o += r(c.x1 * sc) + ' ' + r(c.y1 * sc) + ' ';
    if (c.x2 !== undefined && c.y2 !== undefined) tok.o += r(c.x2 * sc) + ' ' + r(c.y2 * sc) + ' ';
  }
  glyphs[ch] = tok;
}
const json = { glyphs, familyName: font.getEnglishName('fullName'), ascender: r(font.ascender * sc), descender: r(font.descender * sc),
  underlinePosition: font.tables.post.underlinePosition, underlineThickness: font.tables.post.underlineThickness,
  boundingBox: { xMin: font.tables.head.xMin, xMax: font.tables.head.xMax, yMin: font.tables.head.yMin, yMax: font.tables.head.yMax }, resolution: 1000 };
const out = path.join(here, 'vendor', `font3d-${name}.js`);
fs.writeFileSync(out, `// ${json.familyName} (SIL Open Font License) — подмножество для объёмного текста, собрано font3d.mjs\nwindow.FONT3D=window.FONT3D||{};window.FONT3D[${JSON.stringify(name)}]=${JSON.stringify(json)};\n`);
console.log(out, Object.keys(glyphs).length, 'символов', (fs.statSync(out).size / 1024).toFixed(0), 'КБ');
