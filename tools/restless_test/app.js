// Программа Restless (restless/app): установщик мода (gameinfo.gi, старые паки, pak42) и приём данных от мода на 127.0.0.1. Без Electron: node tools/restless_test/app.js
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
const A = require('path').join(__dirname, '..', '..', 'restless', 'app') + '/';
const inst = require(A + 'install.js'), br = require(A + 'bridge.js');
let fail = 0; const ok = (c, t) => { console.log((c ? 'PASS ' : 'FAIL ') + t); if (!c) fail++; };
const W = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'rl-'));
// --- gameinfo
const GI0 = 'GameInfo\r\n{\r\n\tFileSystem\r\n\t{\r\n\t\tSearchPaths\r\n\t\t{\r\n\t\t\tGame_Language\t\tcitadel_*LANGUAGE*\r\n\t\t\tGame\t\t\t\tcitadel\r\n\t\t\tWrite\t\t\t\tcitadel\r\n\t\t\tGame\t\t\t\tcore\r\n\t\t}\r\n\t}\r\n}\r\n';
let f = inst.fixGameinfo(GI0);
const lines = f.text.split('\r\n').map(l => l.trim().replace(/\s+/g, ' '));
ok(f.changed && f.text.includes('\r\n'), 'gameinfo: дописал, переводы строк Windows сохранены');
const at = k => lines.indexOf(k);
ok(at('Mod citadel') < at('Game citadel/addons') && at('Game citadel/addons') < at('Game citadel') && at('Mod citadel') > at('Game_Language citadel_*LANGUAGE*'), 'Mod citadel и Game citadel/addons — над Game citadel: ' + f.added.join(', '));
ok(lines.filter(l => l === 'Write citadel').length === 1, 'Write citadel не задвоился (уже был)');
ok(at('Mod core') < at('Game core') && at('Write core') < at('Game core'), 'Mod core, Write core — перед Game core');
ok(!inst.fixGameinfo(f.text).changed, 'второй раз ничего не меняет');
ok(inst.fixGameinfo('x').err, 'нет SearchPaths — не трогаем');
// --- фейковая игра
const lib = path.join(W, 'SteamLibrary'), dd = path.join(lib, 'steamapps', 'common', 'Deadlock'), ad = path.join(dd, 'game', 'citadel', 'addons');
fs.mkdirSync(ad, {recursive: true}); fs.writeFileSync(path.join(dd, 'game', 'citadel', 'gameinfo.gi'), GI0);
const root = path.join(W, 'Steam'); fs.mkdirSync(path.join(root, 'steamapps'), {recursive: true});
fs.writeFileSync(path.join(root, 'steamapps', 'libraryfolders.vdf'), `"libraryfolders"\n{\n\t"0"\n\t{\n\t\t"path"\t\t"${root.replace(/\\/g, '\\\\')}"\n\t}\n\t"1"\n\t{\n\t\t"path"\t\t"${lib}"\n\t}\n}\n`);
ok(inst.findDeadlock([root]) === dd, 'нашёл Deadlock во второй библиотеке Steam по libraryfolders.vdf');
// паки: пробник 27.10 (restless_probe + dashboard) как pak01, чужой мод pak02, старый Restless 0.10 как pak42
const vpk = names => { const tree = Buffer.concat(names.map(([e, p, n]) => Buffer.from(e + '\0' + p + '\0' + n + '\0' + '\0'.repeat(18) + '\0\0'))); const h = Buffer.alloc(28); h.writeUInt32LE(0x55AA1234, 0); h.writeUInt32LE(2, 4); h.writeUInt32LE(tree.length, 8); return Buffer.concat([h, tree, Buffer.alloc(64)]); };
fs.writeFileSync(path.join(ad, 'pak01_dir.vpk'), vpk([['vjs_c', 'panorama/scripts', 'restless_probe'], ['vxml_c', 'panorama/layout', 'dashboard']]));
fs.writeFileSync(path.join(ad, 'pak02_dir.vpk'), vpk([['vjs_c', 'panorama/scripts', 'ql_app'], ['vxml_c', 'panorama/layout', 'hud_escape_menu']]));
fs.writeFileSync(path.join(ad, 'pak42_dir.vpk'), vpk([['vjs_c', 'panorama/scripts', 'restless'], ['vxml_c', 'panorama/layout', 'hud_escape_menu']]));
const buf = fs.readFileSync(A + 'pak42_dir.vpk');
ok(inst.isRestless(inst.vpkTree(A + 'pak42_dir.vpk')) && !inst.isRestless(inst.vpkTree(path.join(ad, 'pak02_dir.vpk'))), 'свой пак узнаёт по дереву, чужой (QoL) — нет');
let r = inst.install(dd, buf);
ok(r.status === 'installed' && r.file === 'pak42_dir.vpk', 'поставил: ' + r.status + ' ' + r.file);
ok(r.moved.sort().join() === 'pak01_dir.vpk,pak42_dir.vpk', 'старые Restless убраны: ' + r.moved.join(', '));
ok(fs.existsSync(path.join(ad, 'pak02_dir.vpk')), 'чужой мод (pak02) не тронут');
ok(fs.readdirSync(path.join(dd, 'game', 'citadel', 'restless_old')).length === 2, 'старые — не удалены, а лежат в game/citadel/restless_old');
ok(fs.readFileSync(path.join(ad, 'pak42_dir.vpk')).equals(buf), 'pak42 — свежий');
ok(/addons/.test(fs.readFileSync(path.join(dd, 'game', 'citadel', 'gameinfo.gi'), 'utf8')) && fs.existsSync(path.join(dd, 'game', 'citadel', 'gameinfo.gi.restless.bak')), 'gameinfo.gi поправлен, копия .restless.bak есть');
r = inst.install(dd, buf); ok(r.status === 'ok' && !r.moved.length, 'второй запуск: всё на месте, ничего не трогает');
// pak42 занят чужим — берём 43
fs.unlinkSync(path.join(ad, 'pak42_dir.vpk')); fs.writeFileSync(path.join(ad, 'pak42_dir.vpk'), vpk([['vjs_c', 'panorama/scripts', 'other_mod']]));
r = inst.install(dd, buf); ok(r.status === 'installed' && r.file === 'pak43_dir.vpk', 'pak42 занят чужим модом — свой в pak43');
ok(inst.install(null, buf).status === 'nogame', 'игры нет — nogame');
// --- мост
const g = br.parse('/rl.png?v=0.13&s=m&p=f~%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B9~%D0%92%D0%B5%D0%BD%D0%B0%D1%82%D0%BE%D1%80~65~930626915|e~Rat~~84~|e~x~y~9999~12&gt=12%3A34&n=3');
ok(g.s === 'm' && g.players.length === 3 && g.players[0].n === 'Андрей' && g.players[0].h === 'Венатор' && g.players[0].hid === 65 && g.players[0].a === 930626915, 'разбор адреса: ник, герой, hero_id, ID');
ok(g.players[1].t === 'e' && g.players[1].a === 0 && g.players[2].hid === 0 && g.players[2].a === 0 && g.gt === '12:34', 'кривые hero_id/ID отброшены, время матча');
const got = [];
const srv = br.start(x => got.push(x), e => { ok(false, 'сервер: ' + e.message); });
srv.on('listening', () => {
  http.get('http://127.0.0.1:' + br.PORT + '/rl.png?v=0.13&s=h&p=&n=1', res => {
    const b = []; res.on('data', c => b.push(c)); res.on('end', () => {
      const png = Buffer.concat(b);
      ok(res.statusCode === 200 && res.headers['content-type'] === 'image/png' && png.slice(1, 4).toString() === 'PNG', 'отвечает картинкой PNG');
      ok(got.length === 1 && got[0].s === 'h' && !got[0].players.length, 'укрытие дошло до программы');
      ok(srv.address().address === '127.0.0.1', 'слушает только 127.0.0.1');
      srv.close(); fs.rmSync(W, {recursive: true, force: true});
      console.log(fail ? '\nКРАСНЫХ: ' + fail : '\nвсё PASS'); process.exit(fail ? 1 : 0);
    });
  });
});
