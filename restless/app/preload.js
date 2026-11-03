// Restless Overlay — мост «страница → программа». Только для нашего сайта: спрятать окно, выбрать клавишу,
// «открывать само на матч», клики сквозь окно. Больше странице ничего не доступно.
const {contextBridge, ipcRenderer} = require('electron');
const SITE = 'https://1f8t8graf4-ai.github.io/dota-/restless/';
if (location.href.startsWith(SITE)) {
  contextBridge.exposeInMainWorld('rlHost', {
    hide: () => ipcRenderer.send('rl', 'hide'),
    setKey: k => ipcRenderer.send('rl', 'key', String(k || '')),
    setAuto: on => ipcRenderer.send('rl', 'auto', !!on),
    setThrough: on => ipcRenderer.send('rl', 'through', !!on),
    reinstall: () => ipcRenderer.send('rl', 'mod'),
    setFps: lv => ipcRenderer.send('rl', 'fps', String(lv || ''))
  });
}
