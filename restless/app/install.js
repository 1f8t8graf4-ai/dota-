// Restless — ставит мод в Deadlock сам: находит игру, включает папку модов в gameinfo.gi, убирает старые паки Restless
// (пробник 27.10 с плашкой Венатора и таймером, 0.10–0.12) и кладёт свежий pak. Чужие моды не трогает.
// Игра держит паки открытыми — пока она запущена, менять файлы нельзя: тогда статус 'busy', программа повторит после выхода из игры.
const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');

const GI = ['game', 'citadel', 'gameinfo.gi'];

// Строки в SearchPaths, без которых игра не читает citadel/addons (как в гайде deadlockmodding и как пишет DMM).
// Без «Mod citadel» игра не стартует: главной становится первая Game — citadel/addons (у Андрея 27.10, FATAL ERROR user_keys_default).
function fixGameinfo(text) {
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const L = text.split(/\r?\n/);
  const s = L.findIndex(l => /^\s*SearchPaths\s*$/i.test(l));
  if (s < 0) return {text, changed: false, err: 'нет SearchPaths'};
  let e = s + 1, depth = 0;
  for (; e < L.length; e++) { if (/\{/.test(L[e])) depth++; if (/\}/.test(L[e])) { depth--; if (depth <= 0) break; } }
  const has = rx => L.slice(s, e).some(l => rx.test(l));
  const gc = L.findIndex((l, i) => i > s && i < e && /^\s*Game\s+citadel\s*$/i.test(l));
  if (gc < 0) return {text, changed: false, err: 'нет строки Game citadel'};
  const ind = (L[gc].match(/^\s*/) || [''])[0], add = [], addCore = [];
  const line = (k, v) => ind + k + '\t\t\t\t' + v;
  if (!has(/^\s*Mod\s+citadel\s*$/i)) add.push(line('Mod', 'citadel'));
  if (!has(/^\s*Write\s+citadel\s*$/i)) add.push(line('Write', 'citadel'));
  if (!has(/^\s*Game\s+citadel\/addons\s*$/i)) add.push(line('Game', 'citadel/addons'));
  const gk = L.findIndex((l, i) => i > s && i < e && /^\s*Game\s+core\s*$/i.test(l));
  if (gk >= 0) {
    if (!has(/^\s*Mod\s+core\s*$/i)) addCore.push(line('Mod', 'core'));
    if (!has(/^\s*Write\s+core\s*$/i)) addCore.push(line('Write', 'core'));
  }
  if (!add.length && !addCore.length) return {text, changed: false};
  if (gk >= 0 && addCore.length) L.splice(gk, 0, ...addCore);
  L.splice(gc, 0, ...add);
  return {text: L.join(nl), changed: true, added: add.concat(addCore).map(x => x.trim().replace(/\s+/g, ' '))};
}

// Дерево VPK (v1/v2) — только имена файлов: по ним видно, наш ли это пак.
function vpkTree(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const h = Buffer.alloc(28); fs.readSync(fd, h, 0, 28, 0);
    if (h.readUInt32LE(0) !== 0x55AA1234) return null;
    const ver = h.readUInt32LE(4), tree = h.readUInt32LE(8), off = ver === 2 ? 28 : 12;
    if (tree <= 0 || tree > 64 * 1024 * 1024) return null;
    const b = Buffer.alloc(tree); fs.readSync(fd, b, 0, tree, off);
    return b.toString('latin1');
  } catch (e) { return null; } finally { if (fd !== undefined) try { fs.closeSync(fd); } catch (e) {} }
}
// наш пак: скрипт restless (0.4+) или restless_probe (пробник 27.10)
const isRestless = tree => !!tree && /\0restless(_probe)?\0/.test(tree);

function steamRoots() {
  const out = [];
  if (process.platform === 'win32') {
    for (const [k, v] of [['HKCU\\Software\\Valve\\Steam', 'SteamPath'], ['HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam', 'InstallPath'], ['HKLM\\SOFTWARE\\Valve\\Steam', 'InstallPath']]) {
      try { const r = execFileSync('reg', ['query', k, '/v', v], {encoding: 'utf8', windowsHide: true}); const m = r.match(/REG_SZ\s+(.+)/); if (m) out.push(m[1].trim().replace(/\//g, '\\')); } catch (e) {}
    }
    for (const d of 'CDEFGHIJ') out.push(d + ':\\Program Files (x86)\\Steam', d + ':\\Program Files\\Steam', d + ':\\Steam', d + ':\\SteamLibrary', d + ':\\Games\\Steam', d + ':\\Games\\SteamLibrary');
  }
  return out;
}
// библиотеки Steam: steamapps/libraryfolders.vdf → "path" …
function libraries(roots) {
  const libs = new Set();
  for (const r of roots) {
    libs.add(r);
    try { const v = fs.readFileSync(path.join(r, 'steamapps', 'libraryfolders.vdf'), 'utf8'); for (const m of v.matchAll(/"path"\s+"([^"]+)"/g)) libs.add(m[1].replace(/\\\\/g, '\\')); } catch (e) {}
  }
  return [...libs];
}
function findDeadlock(roots) {
  for (const lib of libraries(roots || steamRoots())) {
    const d = path.join(lib, 'steamapps', 'common', 'Deadlock');
    if (fs.existsSync(path.join(d, ...GI))) return d;
  }
  return null;
}

// Поставить мод: dir — папка Deadlock, buf — наш pakXX_dir.vpk.
function install(dir, buf, opt) {
  opt = opt || {};
  const r = {dir, moved: [], gameinfo: '', file: '', status: ''};
  if (!dir) { r.status = 'nogame'; return r; }
  const gi = path.join(dir, ...GI), addons = path.join(dir, 'game', 'citadel', 'addons');
  try {
    const t = fs.readFileSync(gi, 'utf8'), f = fixGameinfo(t);
    if (f.err) r.gameinfo = 'не понял gameinfo.gi: ' + f.err;
    else if (f.changed) {
      const bak = gi + '.restless.bak';
      if (!fs.existsSync(bak)) fs.writeFileSync(bak, t);
      fs.writeFileSync(gi, f.text); r.gameinfo = 'добавил: ' + f.added.join(', ');
    } else r.gameinfo = 'ok';
  } catch (e) { r.status = e.code === 'EBUSY' || e.code === 'EPERM' ? 'busy' : 'error'; r.err = 'gameinfo.gi: ' + e.message; return r; }
  try {
    fs.mkdirSync(addons, {recursive: true});
    const paks = fs.readdirSync(addons).filter(n => /^pak\d\d_dir\.vpk$/i.test(n)).sort();
    let same = '', mine = [];
    for (const n of paks) {
      const p = path.join(addons, n), tr = vpkTree(p);
      if (!isRestless(tr)) continue;
      if (!same && fs.statSync(p).size === buf.length && fs.readFileSync(p).equals(buf)) { same = n; continue; }
      mine.push(n);
    }
    // старые паки Restless — в game/citadel/restless_old (игра их оттуда не грузит), не удаляем
    if (mine.length) {
      const old = path.join(dir, 'game', 'citadel', 'restless_old'); fs.mkdirSync(old, {recursive: true});
      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      for (const n of mine) { fs.renameSync(path.join(addons, n), path.join(old, ts + '_' + n)); r.moved.push(n); }
    }
    if (same) { r.file = same; r.status = r.moved.length ? 'cleaned' : 'ok'; return r; }
    // номер: 42, если свободен; иначе первый свободный 43…99
    const used = new Set(fs.readdirSync(addons).map(n => n.toLowerCase()));
    let num = 42; while (num <= 99 && used.has(`pak${num}_dir.vpk`)) num++;
    if (num > 99) { r.status = 'error'; r.err = 'нет свободного номера pak42–pak99'; return r; }
    r.file = `pak${num}_dir.vpk`;
    fs.writeFileSync(path.join(addons, r.file), buf);
    r.status = 'installed';
  } catch (e) { r.status = e.code === 'EBUSY' || e.code === 'EPERM' ? 'busy' : 'error'; r.err = e.message; }
  return r;
}

module.exports = {fixGameinfo, vpkTree, isRestless, findDeadlock, libraries, install};
