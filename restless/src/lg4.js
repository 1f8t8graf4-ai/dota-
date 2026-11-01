// ==================== 01.11 · вид сайта: «Сейчас» · «Латунь» · «Сталь» (раскладка одна, меняется оформление) ====================
const SKINS = [['', 'Сейчас'], ['brass', 'Латунь'], ['steel', 'Сталь']];
const SKIN_FONT = {brass: 'family=Forum&family=Manrope:wght@400;500;600;700;800', steel: 'family=Exo+2:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Manrope:wght@400;500;600;700;800'};
function skinSet(k, keep) {
  const H = document.documentElement;
  if (k) H.dataset.skin = k; else delete H.dataset.skin;
  if (k && SKIN_FONT[k] && !document.getElementById('skf-' + k)) { const l = document.createElement('link'); l.id = 'skf-' + k; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?' + SKIN_FONT[k] + '&display=swap'; document.head.appendChild(l); }
  if (!keep) try { localStorage.setItem('rl-skin', k); } catch (e) {}
  const P = document.getElementById('qskin'); if (P) $$('button[data-sk]', P).forEach(b => b.classList.toggle('on', b.dataset.sk === k));
}
(function skinInit() {
  let k = ''; const q = new URLSearchParams(location.search).get('skin');
  try { k = localStorage.getItem('rl-skin') || ''; } catch (e) {}
  if (q != null && SKINS.some(s => s[0] === q)) k = q;
  const P = document.createElement('div'); P.className = 'q-skin'; P.id = 'qskin'; P.setAttribute('role', 'group'); P.setAttribute('aria-label', 'Вид сайта');
  P.innerHTML = `<span>Вид</span>${SKINS.map(([id, n]) => `<button type="button" data-sk="${id}">${n}</button>`).join('')}`;
  P.addEventListener('click', e => { const b = e.target.closest('button[data-sk]'); if (b) skinSet(b.dataset.sk); });
  document.body.appendChild(P);
  skinSet(k, true);
})();
