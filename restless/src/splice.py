#!/usr/bin/env python3
"""Собирает новый restless/index.html: шапка, CSS-слой, новые вью вместо старых (31.10 вечер)."""
import re, sys
P = '/home/user/wtm/restless/index.html'
s = open(P, encoding='utf-8').read()
L = s.split('\n')

def starts(name):
    rx = re.compile(r'^(async )?function ' + re.escape(name) + r'\(')
    return [i for i, l in enumerate(L) if rx.match(l)]

def end_of(i):
    if L[i].count('{') and L[i].count('{') == L[i].count('}'):
        return i
    for j in range(i + 1, len(L)):
        if L[j] == '}':
            return j
        if re.match(r'^(async )?function \w+\(', L[j]) or re.match(r'^(const|let|var) ', L[j]):
            raise SystemExit(f'не нашёл конец функции со строки {i+1}: {L[i][:60]} (упёрся в {j+1}: {L[j][:60]})')
    raise SystemExit('конец файла')

drop = []  # (start, end) включительно
def drop_fn(name, which='all'):
    st = starts(name)
    if not st:
        raise SystemExit('нет функции ' + name)
    pick = st if which == 'all' else [st[which]]
    for i in pick:
        drop.append((i, end_of(i), name))

drop_fn('exampleTop', 0)
drop_fn('alertBox', 0)
drop_fn('viewHome')
drop_fn('viewLanding')
drop_fn('viewLive')
drop_fn('viewHero')
drop_fn('viewMatches')
drop_fn('heroFace')
drop_fn('mGrade')
drop_fn('viewPro')
drop_fn('route')
# однострочник ptabsHTML
pt = [i for i, l in enumerate(L) if l.startswith('const ptabsHTML = ')]
assert len(pt) == 1, pt
drop.append((pt[0], pt[0], 'ptabsHTML'))
# alertBox первая — однострочная функция? проверим, что конец не дальше 3 строк
for a, b, n in drop:
    print(f'убираю {n}: строки {a+1}–{b+1} ({b-a+1})')
drop.sort()
for (a1, b1, _), (a2, b2, _) in zip(drop, drop[1:]):
    assert b1 < a2, 'пересечение'
keep = []
cut = set()
for a, b, _ in drop:
    cut.update(range(a, b + 1))
L2 = [l for i, l in enumerate(L) if i not in cut]
s = '\n'.join(L2)

# однострочные alertBox/exampleTop: убедимся, что вторые экземпляры остались
assert s.count('function alertBox(') == 1 and s.count('async function exampleTop(') == 1

# шапка
h0 = s.index('<header class="nav">')
h1 = s.index('</header>', h0) + len('</header>')
old = s[h0:h1]
form = old[old.index('<form class="srch"'):old.index('</form>') + len('</form>')]
gear = old[old.index('<button id="stg"'):old.index('</button>', old.index('<button id="stg"')) + len('</button>')]
new_header = f'''<header class="q-nav"><div class="q-in">
 {form}
 <a class="q-logo" href="#home" aria-label="Restless — профиль"><span class="q-lw">RESTLESS</span></a>
 <div class="q-nr"><a class="me hide" id="me" href="#home"></a>
 {gear}</div>
</div>
<nav class="q-tabs" id="tabs" aria-label="Разделы"><a href="#home" data-t="home">Профиль</a><a href="#live" data-t="live">Лайв-матч</a><a href="#meta" data-t="meta">Мета</a><a href="#lb" data-t="lb">Лидеры</a><a href="#pro" data-t="pro">Про</a><a href="#upd" data-t="upd">Обновления</a></nav>
</header>'''
s = s[:h0] + new_header + s[h1:]

# CSS-слой в конец главного <style>
css = open('/home/user/work/lg/lg.css', encoding='utf-8').read() + '\n' + open('/home/user/work/lg/lg2.css', encoding='utf-8').read() + '\n' + open('/home/user/work/lg/lg3.css', encoding='utf-8').read() + '\n' + open('/home/user/work/lg/lg4.css', encoding='utf-8').read() + '\n' + open('/home/user/work/lg/lg5.css', encoding='utf-8').read()
st0 = s.index('<style>')
st1 = s.index('</style>', st0)
s = s[:st1] + css.rstrip() + '\n' + s[st1:]

# новые вью перед запуском
js = open('/home/user/work/lg/lg.js', encoding='utf-8').read() + '\n' + open('/home/user/work/lg/lg2.js', encoding='utf-8').read() + '\n' + open('/home/user/work/lg/lg3.js', encoding='utf-8').read() + '\n' + open('/home/user/work/lg/lg4.js', encoding='utf-8').read() + '\n' + open('/home/user/work/lg/lg5.js', encoding='utf-8').read()
anchor = "window.addEventListener('hashchange', route);"
assert s.count(anchor) == 1
s = s.replace(anchor, js.strip() + '\n' + anchor)

# мелкие правки старого кода
a = "$('#hctr').innerHTML ="
assert s.count(a) == 2, s.count(a)
s = s.replace(a, "($('#hctr') || {}).innerHTML =")
a = '<h1 class="h1">Официальный <em>топ</em></h1>'
assert a in s
s = s.replace(a, '<h1 class="h1">Лиде<em>ры</em></h1>')
a = 'Нажми на героя — его страница.</p>'
assert a in s
s = s.replace(a, 'Нажми на героя — его страница: портрет и настоящие сборки. <a class="lnk" href="#heroes">Все герои карточками ›</a></p>', 1)
s = s.replace('<meta name="description" content="Restless — профиль с васянами и оценками матчей S/A/B/C/D, мета тир-лист, официальный топ, сборки с винрейтом и разбор каждого матча в Deadlock">',
              '<meta name="description" content="Restless — статистика Deadlock как League of Graphs: профиль, матчи с предметами и всеми игроками, оценки S+…D−, лайв-матч как Porofessor, мета, лидеры, сборки с винрейтом, патчноуты">')

# метки матча — понятными словами, без сленга (Андрей: короткие — кринж)
for a, b in [("['Кормил', 'r'", "['Много смертей', 'r'"), ("['Нафармил', 'g'", "['Хороший фарм', 'g'"), ("['Мало душ', 'r'", "['Плохой фарм', 'r'"),
             ("['Чисто', 'g'", "['Высокий KDA', 'g'"), ("['Бессмертный', 'g'", "['Без смертей', 'g'"), ("['Первая на герое', 'b'", "['Первая игра на герое', 'b'")]:
    assert s.count(a) >= 1, a
    s = s.replace(a, b)

# лидеры: настоящий ранг пачкой (в лидерборде игры ранга нет — было «место» вместо ранга)
a = '<td><div class="rkc">${rankImg(e.rank)}<span>${esc(rankOf(e.rank).name)}</span></div></td>'
assert s.count(a) == 1, 'lb rank'
s = s.replace(a, '<td><div class="rkc" data-acc="${one || \'\'}"><span class="sub">${one ? \'…\' : \'—\'}</span></div></td>')
a = "      el.innerHTML = LBROW(LBQ);\n"
assert s.count(a) == 1, 'lb draw'
s = s.replace(a, "      el.innerHTML = LBROW(LBQ); lbRanks();\n")
a = "$('#lbf').oninput = e => { LBQ = e.target.value.trim().toLowerCase(); $('#lbt').innerHTML = LBROW(LBQ); };"
assert s.count(a) == 1, 'lb filter'
s = s.replace(a, "$('#lbf').oninput = e => { LBQ = e.target.value.trim().toLowerCase(); $('#lbt').innerHTML = LBROW(LBQ); lbRanks(); };")

# «Мои билды»: ган / спирит — как и на странице героя
a = "const CATN = {gun: 'Оружие', spirit: 'Дух', mix: 'Микс'};"
assert s.count(a) == 1, 'CATN'
s = s.replace(a, "const CATN = {gun: 'Ган', spirit: 'Спирит', mix: 'Микс'};")
# всплывающая карта героя срабатывала на каждом лице (их ~240 на странице) и тянула большие картинки с 3D-тенью — тормоза; теперь только по явной метке data-hc
a = "const t = e.target.closest('[data-h]');"
assert s.count(a) == 2, s.count(a)
s = s.replace(a, "const t = e.target.closest('[data-hc]');")
# «Статистика»: вкладки Обзор · Линия · Смерти · Экономика · Бой
a = "    V(`${ptabsHTML('form')}\n    <div class=\"row fm-top\">"
assert s.count(a) == 1, 'fm-top'
s = s.replace(a, "    V(`${ptabsHTML('form')}${stTabs('')}\n    <div class=\"row fm-top\">")
open(P, 'w', encoding='utf-8').write(s)
print('готово, строк', s.count('\n') + 1)
