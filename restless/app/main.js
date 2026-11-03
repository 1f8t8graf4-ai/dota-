// Restless Overlay 0.2 — программа поверх Deadlock (как Porofessor).
// Кто в матче, говорит сама игра: мод Restless 0.13 шлёт игроков на 127.0.0.1:27515 (bridge.js) — открытый API знает
// только ~150 топ-матчей, обычного матча там нет. Мод программа ставит сама (install.js) и убирает старые паки Restless.
// Ctrl+Alt+H — показать / скрыть (Alt+R занят оверлеем NVIDIA). Ctrl+Alt+T — клики сквозь окно. Значок в трее — меню.
// Игра должна быть в режиме «Оконный без рамки»: поверх полноэкранного режима Windows ничего не рисует.
const {app, BrowserWindow, Tray, Menu, globalShortcut, screen, nativeImage, shell} = require('electron');
const {exec} = require('child_process');
const path = require('path'), fs = require('fs');
const bridge = require('./bridge'), inst = require('./install');
const SITE = 'https://1f8t8graf4-ai.github.io/dota-/restless/';
const URL0 = SITE + '?ov=1&app=1&dev=vasyan2026#ov';
const KEYS = [['Control+Alt+H', 'Control+Shift+F10'], ['Control+Alt+T', 'Control+Shift+F11']];
const CFG = path.join(app.getPath('userData'), 'restless.json');
let cfg = {x: null, y: null, w: 460, h: 900, auto: true, through: false, seen: false};
try { Object.assign(cfg, JSON.parse(fs.readFileSync(CFG, 'utf8'))); } catch (e) {}
const save = () => { try { fs.writeFileSync(CFG, JSON.stringify(cfg)); } catch (e) {} };
let win = null, tray = null, proc = false, userHidden = false, G = null, MOD = {status: 'wait'}, keyNames = ['', ''], bridgeErr = '';

function create() {
  const wa = screen.getPrimaryDisplay().workArea;
  win = new BrowserWindow({
    width: cfg.w, height: Math.min(cfg.h, wa.height - 40), x: cfg.x ?? wa.x + wa.width - cfg.w - 16, y: cfg.y ?? wa.y + 20,
    frame: false, alwaysOnTop: true, skipTaskbar: true, resizable: true, show: false, backgroundColor: '#0b0c10',
    title: 'Restless Overlay', icon: path.join(__dirname, 'icon.png'), webPreferences: {contextIsolation: true}
  });
  win.setAlwaysOnTop(true, 'screen-saver'); win.setVisibleOnAllWorkspaces(true);
  win.loadURL(URL0);
  win.webContents.setWindowOpenHandler(({url}) => { shell.openExternal(url); return {action: 'deny'}; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(SITE)) { e.preventDefault(); shell.openExternal(url); } });
  win.webContents.on('did-finish-load', push);
  const keep = () => { const b = win.getBounds(); cfg.x = b.x; cfg.y = b.y; cfg.w = b.width; cfg.h = b.height; save(); };
  win.on('moved', keep); win.on('resized', keep);
  win.on('close', e => { if (!app.quitting) { e.preventDefault(); win.hide(); userHidden = true; menu(); } });
  setThrough(cfg.through);
  // первый запуск — окно сразу, чтобы было видно, что программа работает; дальше — само, когда начнётся матч
  win.once('ready-to-show', () => { if (!cfg.seen || !cfg.auto) { win.show(); cfg.seen = true; save(); } });
}
// данные игры и состояние мода — в страницу (сайт ?ov=1&app=1 рисует 12 игроков)
function push() {
  if (!win) return;
  const js = `window.rlApp&&window.rlApp(${JSON.stringify({mod: MOD, keys: keyNames, bridge: bridgeErr, proc})});` + (G ? `window.rlGame&&window.rlGame(${JSON.stringify(G)});` : '');
  win.webContents.executeJavaScript(js).catch(() => {});
}
function setThrough(on) { cfg.through = on; save(); if (win) win.setIgnoreMouseEvents(on, {forward: true}); menu(); }
function show() { if (!win) return; win.showInactive(); win.setAlwaysOnTop(true, 'screen-saver'); userHidden = false; menu(); }
function toggle() { if (!win) return; if (win.isVisible()) { win.hide(); userHidden = true; } else show(); menu(); }
const MODTXT = {wait: 'Мод: проверяю…', nogame: 'Мод: не нашёл Deadlock', busy: 'Мод: поставлю, когда закроешь игру', error: 'Мод: ошибка — ', installed: 'Мод: поставлен ✓', cleaned: 'Мод: на месте ✓, старые убраны', ok: 'Мод: на месте ✓'};
function menu() {
  if (!tray) return;
  const live = G && Date.now() - G.at < 45000;
  const k0 = keyNames[0] || 'не назначилась', k1 = keyNames[1] || 'не назначилась';
  tray.setToolTip('Restless Overlay · ' + (live ? (G.s === 'm' ? 'матч: игроков ' + G.players.length : 'игра на связи') : 'жду игру'));
  tray.setContextMenu(Menu.buildFromTemplate([
    {label: win && win.isVisible() ? `Скрыть панель (${k0})` : `Показать панель (${k0})`, click: toggle},
    {label: `Клики сквозь окно (${k1})`, type: 'checkbox', checked: cfg.through, click: i => setThrough(i.checked)},
    {label: 'Показывать само, когда начался матч', type: 'checkbox', checked: cfg.auto, click: i => { cfg.auto = i.checked; save(); }},
    {type: 'separator'},
    {label: (MODTXT[MOD.status] || MOD.status) + (MOD.status === 'error' ? (MOD.err || '') : MOD.file ? ' · ' + MOD.file : ''), enabled: false},
    {label: live ? (G.s === 'm' ? `Игра на связи: матч, игроков ${G.players.length}` : 'Игра на связи: укрытие') : bridgeErr ? 'Связь с игрой: ' + bridgeErr : 'Связь с игрой: жду (нужен мод 0.13)', enabled: false},
    {label: 'Поставить мод заново', click: () => setupMod(true)},
    {label: 'Открыть папку модов', enabled: !!MOD.dir, click: () => MOD.dir && shell.openPath(path.join(MOD.dir, 'game', 'citadel', 'addons'))},
    {type: 'separator'},
    {label: 'Открыть сайт Restless', click: () => shell.openExternal(SITE)},
    {label: 'Обновить панель', click: () => win && win.reload()},
    {type: 'separator'},
    {label: 'Выйти', click: () => { app.quitting = true; app.quit(); }}
  ]));
}
// мод: найти игру, включить папку модов, убрать старые паки Restless, положить свежий
function setupMod(force) {
  if (proc && !force) { MOD = Object.assign({}, MOD, {status: 'busy'}); menu(); push(); return; }
  let buf = null;
  try { buf = fs.readFileSync(path.join(__dirname, 'pak42_dir.vpk')); } catch (e) { MOD = {status: 'error', err: 'нет pak в программе'}; menu(); return; }
  MOD = inst.install(inst.findDeadlock(), buf);
  if (MOD.status === 'installed' || MOD.status === 'cleaned') tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless', content: MOD.status === 'installed' ? `Мод Restless поставлен (${MOD.file}). Запусти игру.` : `Старые файлы Restless убраны: ${MOD.moved.join(', ')}`});
  if (MOD.status === 'nogame') tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless', content: 'Не нашёл Deadlock. Положи pak42_dir.vpk в game/citadel/addons вручную.'});
  menu(); push();
}
// Deadlock запущен? Процесс игры — project8.exe (у некоторых сборок deadlock.exe), раз в 5 секунд
function watchGame() {
  if (process.platform !== 'win32') return;
  setInterval(() => exec('tasklist /FO CSV /NH', {windowsHide: true, maxBuffer: 4 * 1024 * 1024}, (err, out) => {
    const on = !err && /"(project8|deadlock)\.exe"/i.test(out || '');
    if (on === proc) return; proc = on;
    if (!on) { if (MOD.status === 'busy') setupMod(); if (cfg.auto && win) { win.hide(); userHidden = false; } }
    menu(); push();
  }), 5000);
  // окно поверх игры: Windows иногда кладёт игру выше — поднимаем раз в 3 с
  setInterval(() => { if (win && win.isVisible()) { win.setAlwaysOnTop(true, 'screen-saver'); win.moveTop(); } }, 3000);
}
function onGame(g) {
  const was = G;
  G = g;
  // начался матч — показать само (если не прятали руками)
  if (g.s === 'm' && (!was || was.s !== 'm' || Date.now() - was.at > 45000) && cfg.auto && !userHidden) show();
  push(); menu();
}
if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => show());
app.whenReady().then(() => {
  create();
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'icon.png')).resize({width: 16, height: 16}));
  tray.on('click', toggle);
  // горячие клавиши: первая, что получилось занять (Alt+R не берём — его держит оверлей NVIDIA)
  KEYS.forEach((alts, i) => { for (const k of alts) { try { if (globalShortcut.register(k, i ? () => setThrough(!cfg.through) : toggle)) { keyNames[i] = k.replace('Control', 'Ctrl'); break; } } catch (e) {} } });
  bridge.start(onGame, e => { bridgeErr = e.code === 'EADDRINUSE' ? 'порт 27515 занят (второй экземпляр?)' : e.message; menu(); push(); });
  menu();
  setTimeout(() => setupMod(), 1500);
  watchGame();
});
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', e => e.preventDefault());
