// Программа Restless 0.3 (restless/app/main.js) без Electron: подменяем модуль electron и проверяем логику —
// клавиша только пока запущена игра, матч → окно само на #ov + LIVE в трее, страница → программа (preload), чужой сайт игнорируется.
// node tools/restless_test/appmain.js
const Module = require('module'), path = require('path'), fs = require('fs'), os = require('os'), http = require('http');
const A = path.join(__dirname, '..', '..', 'restless', 'app') + '/';
let fail = 0; const ok = (c, t) => { console.log((c ? 'PASS ' : 'FAIL ') + t); if (!c) fail++; };
const UD = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'rlm-'));
const L = {keys: {}, js: [], shown: 0, inactive: 0, focus: 0, hidden: 0, img: [], balloon: [], tip: '', menu: null, ipc: null, taken: new Set()};
let readyFn = null, winObj = null;
class BW {
  constructor(o) { this.o = o; this.vis = false; winObj = this; this.ev = {}; this.webContents = {executeJavaScript: js => { L.js.push(js); return Promise.resolve(); }, on: () => {}, setWindowOpenHandler: () => {}, reload: () => {}}; }
  setAlwaysOnTop() {} setVisibleOnAllWorkspaces() {} loadURL(u) { L.url = u; } on(e, f) { this.ev[e] = f; } once(e, f) { this.ev[e] = f; }
  getBounds() { return {x: 0, y: 0, width: 1, height: 1}; } setIgnoreMouseEvents(v) { L.through = v; }
  show() { this.vis = true; L.shown++; } showInactive() { this.vis = true; L.inactive++; } focus() { L.focus++; } hide() { this.vis = false; L.hidden++; }
  isVisible() { return this.vis; } moveTop() {}
}
class Tray { constructor(i) { L.img.push(i); } on() {} setImage(i) { L.img.push(i); } setToolTip(t) { L.tip = t; } setContextMenu(m) { L.menu = m; } displayBalloon(b) { L.balloon.push(b); } }
const fake = {
  app: {getPath: () => UD, whenReady: () => ({then: f => { readyFn = f; }}), requestSingleInstanceLock: () => true, on: () => {}, quit: () => {}},
  BrowserWindow: BW, Tray,
  Menu: {buildFromTemplate: t => t},
  globalShortcut: {register: (k, f) => { if (L.taken.has(k)) return false; L.keys[k] = f; return true; }, unregister: k => { delete L.keys[k]; }, unregisterAll: () => { L.keys = {}; }},
  screen: {getPrimaryDisplay: () => ({workArea: {x: 0, y: 0, width: 1920, height: 1040}})},
  nativeImage: {createFromPath: p => path.basename(p)},
  shell: {openExternal: () => {}, openPath: () => {}},
  ipcMain: {on: (ch, f) => { L.ipc = f; }}
};
const load0 = Module._load;
Module._load = function (req, ...a) { if (req === 'electron') return fake; return load0.call(this, req, ...a); };
const PROC = process.argv[2] === 'proc';
process.env.RL_TEST_PROC = PROC ? '1' : '';
if (PROC) L.taken.add('Control+Alt+X');
require(A + 'main.js');
readyFn();
const SITE = 'https://1f8t8graf4-ai.github.io/dota-/restless/';
const send = q => new Promise(r => http.get('http://127.0.0.1:27515/rl.png?' + q, res => { res.resume(); res.on('end', r); }).on('error', r));
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  await wait(200);
  if (PROC) return procTests();
  ok(L.url === SITE + '?app=1&dev=vasyan2026#home', 'окно открывает сайт целиком — профиль (?app=1#home, ключ замка): ' + L.url);
  ok(!!L.keys['Control+Alt+H'] && !!L.keys['Control+Alt+T'], 'Ctrl+Alt+H (всегда) и Ctrl+Alt+T заняты');
  ok(!L.keys['Control+X'], 'игры нет — Ctrl+X не занят (вырезать текст в других программах работает)');
  ok(L.img[L.img.length - 1] === 'idle.png', 'игры нет — серый значок в трее');
  // «игра запустилась»: без tasklist — через ipc нельзя, поэтому дёргаем то же, что watchGame: proc меняется только на Windows.
  // Для проверки клавиши — перезапуск с RL_TEST_PROC=1 ниже. Сначала — первый запуск: окно показано с фокусом
  winObj.ev['ready-to-show'] && winObj.ev['ready-to-show']();
  ok(L.shown === 1 && L.focus === 1, 'первый запуск — окно открыто сразу');
  L.keys['Control+Alt+H']();
  ok(!winObj.vis, 'Ctrl+Alt+H — скрыть');
  // матч из мода → LIVE, окно само на #ov без фокуса
  const ps = Array.from({length: 12}, (_, i) => `${i < 6 ? 'f' : 'e'}~P${i}~Hero~${i + 1}~${100000 + i}`).join('|');
  await send('v=0.14&s=m&gt=01:00&n=1&p=' + encodeURIComponent(ps).replace(/%7E/g, '~').replace(/%7C/g, '|'));
  await wait(450);
  ok(winObj.vis && L.inactive === 1, 'нашёлся матч — окно открылось само и без фокуса (игра не теряет управление), хотя его закрывали');
  ok(L.js.some(j => j.includes("location.hash='#ov'")), 'окно само перешло на 12 игроков (#ov)');
  ok(/^live\d\.png$/.test(L.img[L.img.length - 1]), 'значок в трее — живой LIVE: ' + L.img.slice(-3).join(' '));
  ok(/LIVE/.test(L.tip) && L.balloon.some(b => /LIVE/.test(b.title)), 'подсказка трея и всплывашка: LIVE');
  ok(L.js.some(j => j.includes('"live":true')), 'страница знает про LIVE (rlApp.live)');
  const n0 = L.inactive; await send('v=0.14&s=m&gt=01:05&n=2&p=' + encodeURIComponent(ps).replace(/%7E/g, '~').replace(/%7C/g, '|')); await wait(100);
  ok(L.inactive === n0, 'тот же матч — второй раз само не открывается');
  // страница → программа
  const ev = u => ({senderFrame: {url: u}});
  L.ipc(ev(SITE + '?app=1#ovs'), 'hide');
  ok(!winObj.vis, 'страница: ✕ / Esc → окно спрятано');
  L.ipc(ev('https://evil.example/'), 'auto', false);
  L.ipc(ev(SITE), 'key', 'Control+Shift+X');
  L.ipc(ev(SITE), 'key', 'Control+Delete');
  const cfg = JSON.parse(fs.readFileSync(path.join(UD, 'restless.json'), 'utf8'));
  ok(cfg.auto === true, 'чужой сайт не может ничего поменять');
  ok(cfg.key === 'Control+Shift+X', 'клавиша меняется со страницы, только из списка (Ctrl+Delete — нет)');
  L.ipc(ev(SITE), 'auto', false);
  ok(JSON.parse(fs.readFileSync(path.join(UD, 'restless.json'), 'utf8')).auto === false, '«открывать само» выключается со страницы');
  const r = require('child_process').spawnSync(process.execPath, [__filename, 'proc'], {encoding: 'utf8'});
  process.stdout.write(r.stdout); if (r.status) fail++;
  console.log(fail ? `\n${fail} FAIL` : '\nвсё PASS');
  process.exit(fail ? 1 : 0);
})();
function procTests() {
  const SITE = 'https://1f8t8graf4-ai.github.io/dota-/restless/', ev = {senderFrame: {url: SITE}};
  ok(!!L.keys['Control+X'], 'игра запущена — Ctrl+X занят (открыть профиль)');
  ok(L.img[L.img.length - 1] === 'tray.png', 'игра запущена — обычный значок');
  L.keys['Control+X']();
  ok(winObj.vis && L.focus >= 1, 'Ctrl+X — окно открыто с фокусом (можно листать профиль)');
  L.keys['Control+X']();
  ok(!winObj.vis, 'Ctrl+X ещё раз — спрятано');
  L.ipc(ev, 'key', 'Control+Shift+X');
  ok(!L.keys['Control+X'] && !!L.keys['Control+Shift+X'], 'сменил клавишу — старая отпущена, новая занята');
  L.ipc(ev, 'key', 'Control+Alt+X');
  ok(!L.keys['Control+Alt+X'] && L.js.some(j => j.includes('"gameErr":"занята другой программой"')), 'занятая клавиша — страница узнаёт «занята другой программой»');
  process.exit(fail ? 1 : 0);
}
