// Restless Overlay 0.3.1 — твой профиль Restless поверх Deadlock (как Porofessor).
// Одна клавиша — Ctrl+Alt+H (Андрей, 03.11: «зачем Ctrl+X, если всё на Ctrl+H»): открыть / закрыть окно, и в игре, и без неё.
// В окне сайт целиком — профиль, лайв-матч, герои, вкладка «Оверлей». Нашёлся матч — окно само на 12 игроках, значок в трее «оживает» (LIVE).
// Закрыть — та же клавиша, ✕ сверху или Esc.
// Кто в матче, говорит сама игра: мод Restless шлёт игроков на 127.0.0.1:27515 (bridge.js). Мод программа ставит сама (install.js).
// Игра должна быть в режиме «Оконный без рамки»: поверх полноэкранного режима Windows ничего не рисует.
const {app, BrowserWindow, Tray, Menu, globalShortcut, screen, nativeImage, shell, ipcMain} = require('electron');
const {exec} = require('child_process');
const path = require('path'), fs = require('fs');
const bridge = require('./bridge'), inst = require('./install');
const VER = '0.4.4';
const SITE = 'https://1f8t8graf4-ai.github.io/dota-/restless/';
const URL0 = SITE + '?app=1&dev=vasyan2026#home';   // сайт пока закрыт замком разработки — ключ открывает его в окне программы
// одна клавиша, всегда (Ctrl+X не берём: в других программах это «вырезать», в Deadlock — присесть + второй предмет)
const KEY_OPTS = ['Control+Alt+H', 'Control+Shift+H', 'Alt+H', 'Control+Shift+F10'];
const THRU_KEYS = ['Control+Alt+T', 'Control+Shift+F11'];   // клики сквозь окно
const CFG = path.join(app.getPath('userData'), 'restless.json');
let cfg = {v: 3, x: null, y: null, w: 1180, h: 820, auto: true, through: false, seen: false, key: 'Control+Alt+H', fps: 'off'};
try { const c = JSON.parse(fs.readFileSync(CFG, 'utf8')); if (!c.v || c.v < 3) { delete c.x; delete c.y; delete c.w; delete c.h; c.v = 3; } Object.assign(cfg, c); } catch (e) {}
if (!KEY_OPTS.includes(cfg.key)) cfg.key = 'Control+Alt+H';   // 0.3 ставила Ctrl+X — теперь одна клавиша
const save = () => { try { fs.writeFileSync(CFG, JSON.stringify(cfg)); } catch (e) {} };
const nice = k => String(k || '').replace(/Control/g, 'Ctrl');
const TEST_PROC = process.env.RL_TEST_PROC === '1';   // проверка без Windows: «игра запущена»
let win = null, tray = null, proc = TEST_PROC, userHidden = false, G = null, MOD = {status: 'wait'}, bridgeErr = '';
const K = {show: '', showAcc: '', thru: '', thruAcc: ''};

const isLive = () => !!(G && G.s === 'm' && Date.now() - G.at < 45000);
const IC = {};
function icons() {
  const im = f => nativeImage.createFromPath(path.join(__dirname, 'ic', f));
  IC.idle = im('idle.png'); IC.on = im('tray.png'); IC.live = [0, 1, 2, 3, 4, 5].map(i => im(`live${i}.png`));
}

function create() {
  const wa = screen.getPrimaryDisplay().workArea;
  const w = Math.min(cfg.w, wa.width - 40), h = Math.min(cfg.h, wa.height - 40);
  win = new BrowserWindow({
    width: w, height: h, x: cfg.x ?? Math.round(wa.x + (wa.width - w) / 2), y: cfg.y ?? Math.round(wa.y + (wa.height - h) / 2),
    minWidth: 420, minHeight: 360, frame: false, alwaysOnTop: true, skipTaskbar: true, resizable: true, show: false, backgroundColor: '#0b0c10',
    title: 'Restless', icon: path.join(__dirname, 'icon.png'),
    webPreferences: {contextIsolation: true, sandbox: true, preload: path.join(__dirname, 'preload.js')}
  });
  win.setAlwaysOnTop(true, 'screen-saver'); win.setVisibleOnAllWorkspaces(true);
  win.loadURL(URL0);
  // свой сайт — в этом окне; профиль другого игрока и всё чужое — в обычном браузере (иначе сайт запомнит его как «тебя»)
  win.webContents.setWindowOpenHandler(({url}) => { shell.openExternal(url); return {action: 'deny'}; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(SITE)) { e.preventDefault(); shell.openExternal(url); } });
  win.webContents.on('did-finish-load', push);
  const keep = () => { const b = win.getBounds(); cfg.x = b.x; cfg.y = b.y; cfg.w = b.width; cfg.h = b.height; save(); };
  win.on('moved', keep); win.on('resized', keep);
  win.on('show', menu); win.on('hide', menu);
  win.on('close', e => { if (!app.quitting) { e.preventDefault(); hide(true); } });
  setThrough(cfg.through);
  // первый запуск — окно сразу; дальше — по клавише и само, когда начнётся матч
  win.once('ready-to-show', () => { if (!cfg.seen) { open(true); cfg.seen = true; save(); } });
}
// состояние программы и данные игры — в страницу (сайт ?app=1: вкладка «Оверлей», LIVE, 12 игроков)
function state() {
  return {ver: VER, mod: MOD, keys: [K.show, K.thru], bridge: bridgeErr, proc, live: isLive(), auto: cfg.auto, through: cfg.through,
    hk: {show: K.show, cur: cfg.key, opts: KEY_OPTS.map(k => [k, nice(k)])}};
}
function push() {
  if (!win) return;
  const js = `window.rlApp&&window.rlApp(${JSON.stringify(state())});` + (G ? `window.rlGame&&window.rlGame(${JSON.stringify(G)});` : '');
  win.webContents.executeJavaScript(js).catch(() => {});
}
function setThrough(on) { cfg.through = on; save(); if (win) win.setIgnoreMouseEvents(on, {forward: true}); menu(); push(); }
// focus: по клавише — окно получает клавиатуру (можно листать, искать); само на матч — без фокуса, игра не теряет управление
function open(focus) {
  if (!win) return;
  if (focus) { win.show(); win.focus(); } else win.showInactive();
  win.setAlwaysOnTop(true, 'screen-saver'); userHidden = false; menu();
}
function hide(byUser) { if (!win) return; win.hide(); if (byUser) userHidden = true; menu(); }
function toggle() { if (!win) return; if (win.isVisible()) hide(true); else open(true); }
function goLive() { if (win) win.webContents.executeJavaScript(`if(!/^#ov(\\/|$)/.test(location.hash))location.hash='#ov'`).catch(() => {}); }

// ---------- клавиши: «открыть / скрыть» — одна, всегда; занята — берём следующую из списка ----------
function regKeys() {
  [K.showAcc, K.thruAcc].forEach(a => { if (a) try { globalShortcut.unregister(a); } catch (e) {} });
  K.show = K.showAcc = K.thru = K.thruAcc = '';
  const L = [cfg.key].concat(KEY_OPTS.filter(k => k !== cfg.key));
  for (const a of L) { try { if (globalShortcut.register(a, toggle)) { K.show = nice(a); K.showAcc = a; break; } } catch (e) {} }
  for (const a of THRU_KEYS) { try { if (globalShortcut.register(a, () => setThrough(!cfg.through))) { K.thru = nice(a); K.thruAcc = a; break; } } catch (e) {} }
}

// ---------- значок в трее: серый — игры нет, обычный — игра запущена, живой с красной точкой — LIVE (мод шлёт матч) ----------
let liveT = null, fr = 0, lastIc = '';
function iconTick() {
  if (!tray) return;
  if (isLive()) {
    if (!liveT) { liveT = setInterval(() => { tray.setImage(IC.live[fr++ % IC.live.length]); }, 170); lastIc = 'live'; menu(); push(); }
    return;
  }
  if (liveT) { clearInterval(liveT); liveT = null; menu(); push(); }
  const k = proc ? 'on' : 'idle';
  if (k !== lastIc) { tray.setImage(IC[k]); lastIc = k; }
}

const MODTXT = {wait: 'Мод: проверяю…', nogame: 'Мод: не нашёл Deadlock', busy: 'Мод: поставлю, когда закроешь игру', error: 'Мод: ошибка — ', installed: 'Мод: поставлен ✓', cleaned: 'Мод: на месте ✓, старые убраны', ok: 'Мод: на месте ✓'};
function menu() {
  if (!tray) return;
  const live = isLive(), recent = G && Date.now() - G.at < 45000;
  const kOpen = K.show || 'клавиша занята';
  tray.setToolTip('Restless' + (live ? ' · LIVE — матч, игроков ' + G.players.length : recent ? ' · игра на связи' : proc ? ' · игра запущена' : ' · жду игру'));
  tray.setContextMenu(Menu.buildFromTemplate([
    {label: win && win.isVisible() ? `Скрыть Restless (${kOpen})` : `Открыть профиль (${kOpen})`, click: toggle},
    {label: live ? '● LIVE — открыть матч' : 'Матча нет', enabled: live, click: () => { goLive(); open(true); }},
    {label: 'Открывать само, когда нашёлся матч', type: 'checkbox', checked: cfg.auto, click: i => { cfg.auto = i.checked; save(); push(); }},
    {label: `Клики сквозь окно (${K.thru || '—'})`, type: 'checkbox', checked: cfg.through, click: i => setThrough(i.checked)},
    {type: 'separator'},
    {label: 'Клавиша', submenu: KEY_OPTS.map(k => ({label: nice(k), type: 'radio', checked: cfg.key === k, click: () => { cfg.key = k; save(); regKeys(); menu(); push(); }}))},
    {label: (MODTXT[MOD.status] || MOD.status) + (MOD.status === 'error' ? (MOD.err || '') : MOD.file ? ' · ' + MOD.file : ''), enabled: false},
    {label: recent ? (G.s === 'm' ? `Игра на связи: матч, игроков ${G.players.length}` : G.s === 'b' ? 'Игра на связи: матч с ботами — не показываю' : 'Игра на связи: укрытие') : bridgeErr ? 'Связь с игрой: ' + bridgeErr : 'Связь с игрой: жду (нужен мод 0.13+)', enabled: false},
    {label: 'Поставить мод заново', click: () => setupMod(true)},
    {label: 'FPS в игре', submenu: [['off', 'Как в игре'], ['light', 'Лёгкий'], ['mid', 'Средний'], ['max', 'Максимум']].map(([k, nm]) => ({label: nm, type: 'radio', checked: cfg.fps === k, click: () => setFps(k)}))},
    {label: 'Открыть папку модов', enabled: !!MOD.dir, click: () => MOD.dir && shell.openPath(path.join(MOD.dir, 'game', 'citadel', 'addons'))},
    {type: 'separator'},
    {label: 'Настройки оверлея', click: () => { if (win) win.webContents.executeJavaScript(`location.hash='#ovs'`).catch(() => {}); open(true); }},
    {label: 'Открыть сайт в браузере', click: () => shell.openExternal(SITE)},
    {label: 'Обновить окно', click: () => win && win.reload()},
    {type: 'separator'},
    {label: `Выйти (версия ${VER})`, click: () => { app.quitting = true; app.quit(); }}
  ]));
}
// мод: найти игру, включить папку модов, убрать старые паки Restless, положить свежий
function setupMod(force) {
  if (proc && !force && !TEST_PROC) { MOD = Object.assign({}, MOD, {status: 'busy'}); menu(); push(); return; }
  let buf = null;
  try { buf = fs.readFileSync(path.join(__dirname, 'pak42_dir.vpk')); } catch (e) { MOD = {status: 'error', err: 'нет pak в программе'}; menu(); return; }
  MOD = inst.install(inst.findDeadlock(), buf, {fps: inst.FPS_LEVELS.includes(cfg.fps) ? cfg.fps : 'off'});
  if (MOD.status === 'installed' || MOD.status === 'cleaned') tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless', content: MOD.status === 'installed' ? `Мод Restless поставлен (${MOD.file}). Запусти игру.` : `Старые файлы Restless убраны: ${MOD.moved.join(', ')}`});
  if (MOD.status === 'nogame') tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless', content: 'Не нашёл Deadlock. Положи pak42_dir.vpk в game/citadel/addons вручную.'});
  menu(); push();
}
// Deadlock запущен? Процесс игры — project8.exe (у некоторых сборок deadlock.exe), раз в 5 секунд
function watchGame() {
  if (process.platform === 'win32') setInterval(() => exec('tasklist /FO CSV /NH', {windowsHide: true, maxBuffer: 4 * 1024 * 1024}, (err, out) => {
    const on = !err && /"(project8|deadlock)\.exe"/i.test(out || '');
    if (on === proc) return; proc = on;
    if (!on) { if (MOD.status === 'busy') setupMod(); userHidden = false; if (cfg.auto && win) win.hide(); }
    iconTick(); menu(); push();
  }), 5000);
  // окно поверх игры: Windows иногда кладёт игру выше — поднимаем раз в 3 с
  setInterval(() => { if (win && win.isVisible()) { win.setAlwaysOnTop(true, 'screen-saver'); win.moveTop(); } }, 3000);
}
function onGame(g) {
  const was = isLive();
  G = g;
  // нашёлся матч — окно открывается само на 12 игроках (даже если в прошлом матче его закрыли)
  if (g.s === 'm' && !was) {
    if (cfg.auto) { goLive(); open(false); }
    tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless · LIVE', content: `Матч найден — игроков ${g.players.length}. ${K.show} — открыть / скрыть.`});
  }
  iconTick(); push(); menu();
}
function setFps(k) { if (!inst.FPS_LEVELS.includes(k)) return; cfg.fps = k; save(); setupMod(true); }
// ---------- страница → программа (preload.js) ----------
ipcMain.on('rl', (e, cmd, val) => {
  const u = e.senderFrame && e.senderFrame.url || '';
  if (!String(u).startsWith(SITE)) return;
  if (cmd === 'hide') hide(true);
  else if (cmd === 'key' && KEY_OPTS.includes(val)) { cfg.key = val; save(); regKeys(); menu(); push(); }
  else if (cmd === 'auto') { cfg.auto = !!val; save(); menu(); push(); }
  else if (cmd === 'through') setThrough(!!val);
  else if (cmd === 'mod') setupMod(true);
  else if (cmd === 'fps') setFps(String(val || ''));
});

if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => open(true));
app.whenReady().then(() => {
  icons();
  create();
  tray = new Tray(IC.idle);
  tray.on('click', toggle);
  regKeys();
  bridge.start(onGame, e => { bridgeErr = e.code === 'EADDRINUSE' ? 'порт 27515 занят (второй экземпляр?)' : e.message; menu(); push(); });
  iconTick(); menu();
  setInterval(iconTick, 1000);
  setTimeout(() => setupMod(), 1500);
  watchGame();
});
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', e => e.preventDefault());
