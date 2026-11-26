// Контракт lemo-opuscar: window.DUR, window.render(t), window.EV, window.TEXTS, window.READY
import { paperFinish } from './paper9.js';
import { loadFonts } from './glyph9.js';
import { renderFilm, DUR, events, texts } from './film.js';
const Q = new URLSearchParams(location.search);
await Promise.all(['400 40px LGothic', '600 52px LSpartan', '600 44px LSpartan'].map(f => document.fonts.load(f)));
await loadFonts();
window.DUR = DUR; window.EV = events(); window.TEXTS = texts;
window.render = t => { renderFilm(t, { nosub: Q.has('nosub') }); paperFinish(); };
window.READY = true;
