// FPS-набор программы (restless/app/install.js → fpsGameinfo): уровни, повтор, «Как в игре» возвращает файл как был, CRLF.
// node tools/restless_test/fps.js <gameinfo.gi игры>   (оригинал: SteamDatabase/GameTracking-Deadlock → game/citadel/gameinfo.gi)
const fs = require('fs'), I = require('../../restless/app/install.js');
const o = fs.readFileSync(process.argv[2], 'utf8');
let ok = true; const chk = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); ok = ok && c; };
for (const lv of ['light', 'mid', 'max']) {
  const a = I.fpsGameinfo(o, lv); chk(!a.err && a.changed, lv + ': применено ' + a.n);
  chk(I.fpsGameinfo(a.text, lv).text === a.text, lv + ': второй раз то же самое');
  const vars = I.fpsVars(lv); chk(vars.every(([k, v]) => a.text.includes(`"${k}"\t\t"${v}"\t// restless-fps`)), lv + ': все строки на месте');
  const live = a.text.split(/\n/).filter(l => !/^\s*\/\//.test(l));
  chk(vars.every(([k]) => live.filter(l => new RegExp('^\\s*"?' + k + '"?\\s').test(l)).length === 1), lv + ': ключ живой один раз');
  chk(I.fpsGameinfo(a.text, 'off').text === o, lv + ' → «Как в игре»: файл как был');
  chk(I.fpsGameinfo(I.fpsGameinfo(o, 'max').text, lv).text === a.text, 'max → ' + lv + ': как сразу ' + lv);
}
const g = I.fpsGameinfo(I.fixGameinfo(o.replace(/\n/g, '\r\n')).text, 'mid'); chk(g.text.includes('\r\n') && !/[^\r]\n/.test(g.text), 'CRLF сохранён');
chk(I.fpsGameinfo('x', 'mid').err === 'нет блока ConVars', 'нет ConVars — не трогаем');
console.log(ok ? '\nвсё PASS' : '\nЕСТЬ FAIL'); process.exit(ok ? 0 : 1);
