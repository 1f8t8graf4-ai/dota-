// Restless Overlay — маленькая программа поверх Deadlock (как Porofessor).
// Окно с нашей панелью матча (сайт ?ov=1#ov) всегда поверх игры. Игра запустилась — окно показывается само, закрылась — прячется.
// Alt+R — показать / скрыть. Ctrl+Alt+R — «сквозь окно» (клики проходят в игру). Значок в трее — меню.
// Игра должна быть в режиме «Оконный без рамки»: поверх полноэкранного режима Windows ничего не рисует.
const {app, BrowserWindow, Tray, Menu, globalShortcut, screen, nativeImage, shell} = require('electron');
const {exec} = require('child_process');
const path = require('path'), fs = require('fs');
const SITE = 'https://1f8t8graf4-ai.github.io/dota-/restless/';
const CFG = path.join(app.getPath('userData'), 'restless.json');
let cfg = {x: null, y: null, w: 460, h: 900, auto: true, through: false};
try { Object.assign(cfg, JSON.parse(fs.readFileSync(CFG, 'utf8'))); } catch (e) {}
const save = () => { try { fs.writeFileSync(CFG, JSON.stringify(cfg)); } catch (e) {} };
let win = null, tray = null, game = false, userHidden = false;

function create() {
  const wa = screen.getPrimaryDisplay().workArea;
  win = new BrowserWindow({
    width: cfg.w, height: Math.min(cfg.h, wa.height - 40), x: cfg.x ?? wa.x + wa.width - cfg.w - 16, y: cfg.y ?? wa.y + 20,
    frame: false, alwaysOnTop: true, skipTaskbar: true, resizable: true, show: false, backgroundColor: '#0b0c10',
    title: 'Restless Overlay', icon: path.join(__dirname, 'icon.png'), webPreferences: {contextIsolation: true}
  });
  win.setAlwaysOnTop(true, 'screen-saver'); win.setVisibleOnAllWorkspaces(true);
  win.loadURL(SITE + '?ov=1&app=1#ov');
  win.webContents.setWindowOpenHandler(({url}) => { shell.openExternal(url); return {action: 'deny'}; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(SITE)) { e.preventDefault(); shell.openExternal(url); } });
  const keep = () => { const b = win.getBounds(); cfg.x = b.x; cfg.y = b.y; cfg.w = b.width; cfg.h = b.height; save(); };
  win.on('moved', keep); win.on('resized', keep);
  win.on('close', e => { if (!app.quitting) { e.preventDefault(); win.hide(); userHidden = true; } });
  setThrough(cfg.through);
  win.once('ready-to-show', () => { if (!cfg.auto) win.show(); });
}
function setThrough(on) { cfg.through = on; save(); if (win) win.setIgnoreMouseEvents(on, {forward: true}); menu(); }
function toggle() { if (!win) return; if (win.isVisible()) { win.hide(); userHidden = true; } else { win.show(); userHidden = false; } menu(); }
function menu() {
  if (!tray) return;
  tray.setContextMenu(Menu.buildFromTemplate([
    {label: win && win.isVisible() ? 'Скрыть панель (Alt+R)' : 'Показать панель (Alt+R)', click: toggle},
    {label: 'Клики сквозь окно (Ctrl+Alt+R)', type: 'checkbox', checked: cfg.through, click: i => setThrough(i.checked)},
    {label: 'Показывать само, когда запущен Deadlock', type: 'checkbox', checked: cfg.auto, click: i => { cfg.auto = i.checked; save(); }},
    {type: 'separator'},
    {label: 'Открыть сайт Restless', click: () => shell.openExternal(SITE)},
    {label: 'Обновить панель', click: () => win && win.reload()},
    {type: 'separator'},
    {label: 'Выйти', click: () => { app.quitting = true; app.quit(); }}
  ]));
}
// Deadlock запущен? Процесс deadlock.exe — раз в 5 секунд
function watchGame() {
  if (process.platform !== 'win32') return;
  setInterval(() => exec('tasklist /FI "IMAGENAME eq deadlock.exe" /NH', {windowsHide: true}, (err, out) => {
    const on = !err && /deadlock\.exe/i.test(out || '');
    if (on === game) return; game = on;
    if (!cfg.auto || !win) return;
    if (on && !userHidden) { win.showInactive(); win.webContents.executeJavaScript("location.hash='#ov'").catch(() => {}); }
    if (!on) { win.hide(); userHidden = false; }
    menu();
  }), 5000);
}
if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => { if (win) { win.show(); userHidden = false; } });
app.whenReady().then(() => {
  create();
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'icon.png')).resize({width: 16, height: 16}));
  tray.setToolTip('Restless Overlay'); tray.on('click', toggle); menu();
  globalShortcut.register('Alt+R', toggle);
  globalShortcut.register('Control+Alt+R', () => setThrough(!cfg.through));
  watchGame();
});
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', e => e.preventDefault());
