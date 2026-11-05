// ===================== lg32 — 05.11: английская версия сайта =====================
// Андрей: «полную английскую версию сайта». Названия героев, предметов и умений в данных и так английские (data.js).
// Интерфейс переводим словарём restless/i18n/en.json, без правки сотен функций: проходим по тексту страницы
// (и по title / placeholder / aria-label), числа подставляем в шаблон «# побед из #» → «# wins of last #».
// Язык: ?lang=en|ru → localStorage rl-lang → язык браузера (не русский — английский). Кнопка RU / EN в шапке.
const L32 = (() => {
  const q = /[?&]lang=(en|ru)\b/.exec(location.search);
  if (q) { try { localStorage.setItem('rl-lang', q[1]); } catch (e) {} return q[1]; }
  let v = ''; try { v = localStorage.getItem('rl-lang') || ''; } catch (e) {}
  if (v === 'en' || v === 'ru') return v;
  return /^(ru|uk|be|kk)/i.test(navigator.language || 'ru') ? 'ru' : 'en';
})();
const I32 = {d: null, n: 0, on: L32 === 'en'};
const CYR32 = /[А-Яа-яЁё]/;
const NUM32 = /#?[+−-]?\d(?:[\d.,:]|[\s  ](?=\d))*/g; // «#2 в топе»: «#2» — одно число
function n32(m) { // число по-английски: 1 074 → 1,074; 64,7 → 64.7
  return m.replace(/(\d),(\d)/g, '$1.$2').replace(/(\d)[\s  ](?=\d{3}\b)/g, '$1,');
}
const C32 = new Map();
function t32(s) {
  if (!s || !CYR32.test(s)) return s;
  const c = C32.get(s); if (c !== undefined) return c;
  const r = t32x(s); if (C32.size < 20000) C32.set(s, r); return r;
}
function t32x(s) {
  const D = I32.d; if (!D) return s;
  const lead = /^\s*/.exec(s)[0], tail = /\s*$/.exec(s)[0], v = s.trim();
  if (Object.prototype.hasOwnProperty.call(D, v)) return lead + D[v] + tail;
  const nums = [], k = v.replace(NUM32, m => { nums.push(m); return '#'; });
  if (nums.length && Object.prototype.hasOwnProperty.call(D, k)) { let i = 0; return lead + D[k].replace(/#/g, () => n32(nums[i++] || '')) + tail; }
  if (!I32.wc) I32.wc = Object.keys(D).filter(x => x.includes('*')).map(x => [new RegExp('^' + x.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '([^А-Яа-яЁё]+?)') + '$'), D[x]]);
  for (const [rx, to] of I32.wc) { const m = rx.exec(k); if (m) { let i = 0, j = 1; return lead + to.replace(/\*/g, () => m[j++] || '').replace(/#/g, () => n32(nums[i++] || '')) + tail; } }
  const lo = v.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(D, lo)) { const r = D[lo]; return lead + r.charAt(0).toUpperCase() + r.slice(1) + tail; }
  const parts = v.split(/(\s·\s|\s—\s|\s\/\s|:\s|\s\|\s)/);
  if (parts.length > 1) {
    let ch = false; const out = parts.map((p, i) => { if (i % 2) return p; const r = t32(p); if (r !== p) ch = true; return r; });
    if (ch) return lead + out.join('') + tail;
  }
  const sp = v.split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z])/);
  if (sp.length > 1) { let ch = false; const out = sp.map(p => { const r = t32(p); if (r !== p) ch = true; return r; }); if (ch) return lead + out.join(' ') + tail; }
  const ed = /^([·—:\s]*)(.*?)([·—:\s]*)$/.exec(v);
  if (ed && (ed[1] || ed[3]) && ed[2] && ed[2] !== v) { const r = t32(ed[2]); if (r !== ed[2]) return lead + ed[1] + r + ed[3] + tail; }
  return s;
}
function w32(root) {
  if (!I32.on || !I32.d || !root) return;
  if (root.nodeType === 3) { const pe = root.parentNode; if (pe && pe.closest && pe.closest('[data-l32no],script,style,textarea')) return; const v = root.nodeValue, r = t32(v); if (r !== v) root.nodeValue = r; return; }
  if (root.nodeType !== 1 || root.closest && root.closest('[data-l32no],script,style,textarea')) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => CYR32.test(n.nodeValue) && !(n.parentNode && n.parentNode.closest && n.parentNode.closest('[data-l32no],script,style,textarea')) ? 1 : 3});
  const L = []; let n; while ((n = w.nextNode())) L.push(n);
  for (const x of L) { const r = t32(x.nodeValue); if (r !== x.nodeValue) x.nodeValue = r; }
  const at = el => { for (const a of ['title', 'placeholder', 'aria-label', 'data-tip']) { const v = el.getAttribute && el.getAttribute(a); if (v && CYR32.test(v)) { const r = t32(v); if (r !== v) el.setAttribute(a, r); } } };
  at(root); root.querySelectorAll('[title],[placeholder],[aria-label],[data-tip]').forEach(at);
}
function go32() {
  document.documentElement.lang = 'en';
  w32(document.body);
  if (CYR32.test(document.title)) document.title = t32(document.title);
  new MutationObserver(ms => {
    for (const m of ms) {
      if (m.type === 'characterData') w32(m.target);
      else if (m.type === 'attributes') { if (m.target.getAttribute) { const v = m.target.getAttribute(m.attributeName); if (v && CYR32.test(v)) { const r = t32(v); if (r !== v) m.target.setAttribute(m.attributeName, r); } } }
      else m.addedNodes.forEach(w32);
    }
  }).observe(document.body, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title', 'placeholder', 'aria-label', 'data-tip']});
  document.documentElement.classList.remove('l32w');
}
if (I32.on) {
  try { if (!localStorage.getItem('rl-plang')) localStorage.setItem('rl-plang', 'en'); } catch (e) {}
  document.documentElement.classList.add('l32w');
  const fin = () => { if (!I32.d) I32.d = {}; go32(); };
  const tm = setTimeout(fin, 2500);
  fetch('i18n/en.json?v=' + (window.RL_V || Date.now() >> 20)).then(r => r.ok ? r.json() : {}).then(d => { clearTimeout(tm); I32.d = d || {}; I32.n = Object.keys(I32.d).length; go32(); }).catch(() => { clearTimeout(tm); fin(); });
}
{ // кнопка RU / EN в шапке
  const nr = document.querySelector('.q-nr');
  if (nr && !document.getElementById('l32b')) {
    const b = document.createElement('button');
    b.id = 'l32b'; b.type = 'button'; b.className = 'l32b'; b.setAttribute('data-l32no', '');
    b.innerHTML = `<span class="${L32 === 'ru' ? 'on' : ''}">RU</span><span class="${L32 === 'en' ? 'on' : ''}">EN</span>`;
    b.title = L32 === 'en' ? 'Language' : 'Язык';
    b.onclick = () => { const nl = L32 === 'en' ? 'ru' : 'en'; try { localStorage.setItem('rl-lang', nl); localStorage.setItem('rl-plang', nl); } catch (e) {} const u = new URL(location.href); u.searchParams.delete('lang'); location.replace(u.toString()); };
    nr.insertBefore(b, document.getElementById('stg'));
  }
}
