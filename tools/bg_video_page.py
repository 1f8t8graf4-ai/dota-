# Страница «фоны без фото»: один промт сразу в видео на фон.  python3 tools/bg_video_page.py <выход.html> [ключ,ключ…]
import json, os, sys, html
D = json.load(open(os.path.join(os.path.dirname(__file__), 'bg-prompts.json'), encoding='utf-8'))
I = [x for x in D['items'] if x.get('video')]
if len(sys.argv) > 2: I = [x for x in I if x['key'] in sys.argv[2].split(',')]   # только эти ключи (то, чего ещё нет)
I.sort(key=lambda x: {'простой': 0, 'сложный': 1}.get(x.get('test'), 2))
KIND = {'film': 'Фильм', 'season': 'Сезон', 'person': 'Интервью', 'moment': 'Момент'}
def card(x):
    sub = KIND.get(x['kind'], '') + (' · ' + x['key'].split(':')[-1] if x['kind'] == 'season' else '')
    t = f'<span class="tst">тест · {x["test"]}</span>' if x.get('test') else ''
    return f'''<article class="c" data-k="{html.escape(x['key'])}"><header><div><small>{sub}</small><h2>{html.escape(x['title'])}</h2></div>{t}</header>
<p><b>Что в кадре:</b> {html.escape(x['what'])}</p><p><b>Что движется:</b> {html.escape(x['moves'])}</p>
<pre>{html.escape(x['video'])}</pre><div class="a"><button class="cp">Скопировать промт</button><label><input type="checkbox" class="dn"> Готово</label></div></article>'''
P = '''<title>Фоны без фото</title>
<style>
:root{--bg:#F3F1EC;--fg:#18171A;--mut:#6c6a66;--card:#fff;--line:rgba(0,0,0,.1);--acc:#E7B54A;--acct:#1a1300;--pre:#F7F5F0;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#111214;--fg:#ECEBE8;--mut:#9a9893;--card:#1A1B1F;--line:rgba(255,255,255,.1);--pre:#141518;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#111214;--fg:#ECEBE8;--mut:#9a9893;--card:#1A1B1F;--line:rgba(255,255,255,.1);--pre:#141518;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:15px/1.5 Inter,-apple-system,"Segoe UI",sans-serif;margin:0;padding-inline:16px;padding-block:20px 60px}
.w{max-width:760px;margin:0 auto;display:grid;gap:14px}
h1{font:700 26px/1.2 Inter,sans-serif;margin:0}
.lead{color:var(--mut);margin:0}.lead b{color:var(--fg)}
ol{margin:0;padding-left:20px;display:grid;gap:4px}
.c{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;display:grid;gap:8px;min-width:0}
.c.ok{opacity:.55}
.c header{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.c small{color:var(--mut);font-weight:700;font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.c h2{margin:2px 0 0;font:700 20px/1.2 Inter,sans-serif}
.tst{flex:none;font:700 12px/1 Inter,sans-serif;padding:6px 9px;border-radius:999px;background:var(--acc);color:var(--acct)}
.c p{margin:0}.c p b{font-weight:700}
pre{margin:0;white-space:pre-wrap;word-break:break-word;background:var(--pre);border:1px solid var(--line);border-radius:12px;padding:12px;font:13px/1.5 ui-monospace,Menlo,Consolas,monospace;max-height:9.5em;overflow:auto}
.a{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.cp{border:0;border-radius:14px;background:var(--acc);color:var(--acct);font:700 15px/1 Inter,sans-serif;padding:14px 18px;cursor:pointer}
.cp.y{background:#2BAE66;color:#fff}
label{display:flex;gap:8px;align-items:center;color:var(--mut);cursor:pointer}input{width:20px;height:20px}
</style>
<div class="w"><h1>Фоны без фото</h1>
<p class="lead"><b>Один промт — сразу видео.</b> Без шага с картинкой.</p>
<ol><li>Google Flow → «Текст в видео» (или Veo в Gemini). Формат 9:16, 8 секунд.</li><li>Вставь промт целиком, сделай 2–3 варианта, выбери лучший.</li><li>Начни с двух тестов (Психопат — простой, Волк — сложный). Нормально — делай остальные.</li><li>Готовый ролик — Z.ai или Claude: склеят петлю и зальют. Плохо вышло — кадр Claude, промт не дописывай.</li></ol>
<p class="lead">Героям Deadlock фото всё равно нужно — это арт с вики, его только оживляем.</p>
__C__
</div>
<script>
const K='bgvid-done-v1';let S={};try{S=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
document.querySelectorAll('.c').forEach(c=>{const k=c.dataset.k,cb=c.querySelector('.dn'),b=c.querySelector('.cp'),pre=c.querySelector('pre');
 cb.checked=!!S[k];c.classList.toggle('ok',cb.checked);
 cb.onchange=()=>{S[k]=cb.checked;c.classList.toggle('ok',cb.checked);try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
 b.onclick=()=>{const ok=()=>{b.textContent='Скопировано ✓';b.classList.add('y');setTimeout(()=>{b.textContent='Скопировать промт';b.classList.remove('y')},1600)};
  const sel=()=>{const r=document.createRange();r.selectNodeContents(pre);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Выделено — скопируй'};
  try{navigator.clipboard.writeText(pre.textContent).then(ok,sel)}catch(e){sel()}}});
</script>'''
open(sys.argv[1], 'w', encoding='utf-8').write(P.replace('__C__', '\n'.join(card(x) for x in I)))
print(sys.argv[1], len(I))
