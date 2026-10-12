# Фоны v4 «картинка → движение → склейка» (второй Claude, 12.10) — предложение, решает Андрей.
# Берёт тексты основного Claude (фоны-промты-СРАВНЕНИЕ.json: место, камера, предметы, свет, цвет, живое движение)
# и меняет только форму: ① картинка 9:16 (Nano Banana / Imagen), ② у главных — правка «после», ③ движение для Veo
# («кадр → видео», короткий промт), ④ склейка (tools/bg_fx.py, делает Claude). Слова основного Claude не переписываю.
#   python3 от-второго-клауда/фоны-v4.py  → от-второго-клауда/фоны-v4.txt + .json
import json,re,os
H=os.path.dirname(os.path.abspath(__file__));R=os.path.dirname(H)
D=json.load(open(os.path.join(R,'фоны-промты-СРАВНЕНИЕ.json')))

def part(p,k,nxt):
    m=re.search(k+r':\s*(.*?)\s*(?='+'|'.join(n+':' for n in nxt)+r'|Timeline|$)',p,re.S);return m.group(1).strip() if m else ''
def motion(p):
    m=re.search(r'\[00:00-00:0[48]\]\s*(?:Calm:\s*)?(.*?)(?=\s*\[00:0|\s*This motion|\s*Rules:)',p,re.S);return m.group(1).strip() if m else ''
def txt_rule(p):   # у экранов/котировок — «только мелкие размытые цифры», как у основного Claude
    m=re.search(r'no (?:words|text)[^.;]*?only ([^.;]+)',p);return m.group(1).strip() if m else None
HEAD='Vertical 9:16 photograph, a still frame from a feature film shot on 35mm, shallow depth of field, rich deep blacks. '
COMP=('Composition for a phone screen: the main objects sit just above the middle of the frame (about a third of the way down); '
      'the top of the frame is the light source, the wall, ceiling or sky; the bottom third is a calm dark surface (floor, desk, ground) with nothing important on it.')
def still(p):
    S,C,O,L,G=(part(p,k,n) for k,n in [('Setting',['Camera']),('Camera',['Objects']),('Objects',['Light']),('Light',['Grade']),('Grade',['Timeline'])])
    t=txt_rule(p)
    tail=('Real materials and real-world sizes; every object stands or lies naturally where it belongs, nothing else in the frame. '
          'No people, no faces, no hands. '+(f'No readable words, letters or logos — only {t}.' if t else 'No readable words, letters or logos anywhere.')+' Full-bleed image, no borders or black bars.')
    return HEAD+f'Setting: {S} Camera: {C} Objects: {O} Light: {L} Colors and mood: {G} '+COMP+' '+tail
def move(mot):
    mot=mot.strip().rstrip('.');mot=mot[:1].upper()+mot[1:]
    return ('Static locked-off camera, no camera movement, no zoom, no cuts. '+mot+'. '
            'This motion continues smoothly for all 8 seconds; everything else in the frame stays perfectly still, the light stays the same and nothing new appears. No people.')
KEEP='Keep this exact photo — same objects, same positions, same framing and the same camera. '
# главные фоны: событие (решение основного Claude) → как сделать надёжно. post — команда склейки; A/B — ролики из ① и ②
EV={
1:dict(how='Экраны и бегущая строка разом из зелёных в красные — переключение двух картинок (или перекраска одного ролика: демо «Волк — обвал» сделано на стоящем фоне без генерации).',
   edit=KEEP+'Change only the screens: every monitor and the long wall ticker now show small glowing red numbers with down arrows instead of green ones, and a soft red glow from the screens falls on the desk, the champagne glass and the white car. Nothing else changes.',
   moveB='the goldfish hovers in place waving its fins; bubbles rise in the glass of champagne; the red numbers on the screens flicker as the prices fall; the red numbers on the wall ticker scroll slowly',
   post='python3 tools/bg_fx.py switch film-bg.mp4 A.mp4 B.mp4 --how flicker --end dip   (один ролик: recolor B.mp4 A.mp4 --hue 100:200 --to 356 --tint ff2a1a:0.10, потом switch … --sync)'),
5:dict(how='Неон-свинья мигает и гаснет, потом резко чёрное (финал «Сопрано») — две картинки, мигание и чёрное делает склейка.',
   edit=KEEP+'Change only one thing: the pink neon pig in the shop window is switched off — its glass tubes are dark and unlit, and the pink glow on the window and on the sidewalk is gone. Nothing else changes.',
   moveB='a thin thread of smoke rises only from the tip of the cigar, steam rises from one espresso cup',
   post='python3 tools/bg_fx.py switch film-bg.mp4 A.mp4 B.mp4 --how flicker --b 2 --end black=1.2'),
13:dict(how='Музыка на полную: индикаторы стерео до красного — две картинки (индикаторы низко / в красной зоне), переключение. Событие мелкое (стерео с краю) — на телефоне почти не видно. Надёжнее и заметнее: свет гаснет, остаётся ночной город за окном (демо «Психопат — свет» сделано на стоящем фоне без генерации).',
   edit=KEEP+'Change only the stereo: its level meters are lit all the way up into the red zone, glowing bright red and amber. Nothing else changes.',
   moveB='the level meters on the stereo jump hard into the red to very loud music, the city lights twinkle',
   post='python3 tools/bg_fx.py switch film-bg.mp4 A.mp4 B.mp4 --how cut --end dip   (свет гаснет без генерации: dim B.mp4 A.mp4 --room 0.3 --keep <окно> --keep <стерео>; switch … --sync --how fade --dur 0.15)'),
16:dict(how='Настоящий ливень по стеклу — две картинки (редкие капли / потоки воды), ролики дождя Veo делает хорошо; переход наплывом 0.6 с.',
   edit=KEEP+'Change only the weather: heavy rain now streams down the window glass in thick running rivulets, and the neon and the taxi outside are blurred behind the water. Nothing else changes.',
   moveB='heavy rain streams down the window glass in running rivulets; the neon outside glows through the water',
   post='python3 tools/bg_fx.py switch film-bg.mp4 A.mp4 B.mp4 --how fade --dur 0.6 --end dip'),
19:dict(how='Взрыв вдали: оранжевая вспышка за горизонтом, гаснет за полсекунды — вспышку делает склейка, генерировать не надо (демо «Бункер — взрыв» на стоящем фоне). Волну пыли и приподнятую карту не делать (рой и «само двигается»).',
   edit=None,moveB=None,post='python3 tools/bg_fx.py flash film-bg.mp4 A.mp4 --preset blast --at 4'),
21:dict(how='Вдоль борта одна за другой зажигаются лампы — две картинки (лампы не горят / горят), «одна за другой» делает шторка вдоль борта.',
   edit=KEEP+'Change only the deck lamps: the row of lamps along the railing is now lit, each with a small warm glow, and warm light falls on the wooden deck under them. Nothing else changes.',
   moveB=None,
   post='python3 tools/bg_fx.py switch film-bg.mp4 A.mp4 B.mp4 --how wipe-lr --dur 1.2 --end dip   (направление — по тому, как идёт борт в кадре: wipe-lr / wipe-rl / wipe-tb)'),
25:dict(how='Из двери и люка фургона вырывается густое белое облако — это движение, его делает Veo («кадр → видео» с разметкой по секундам: дым у Veo выходит хорошо). Если не выйдет со 2-й попытки — проще: в фургоне загорается свет (две картинки, переключение).',
   edit=None,moveB=None,
   post='ролик из ① по промту ③в, петля: python3 tools/loop_bg.py film-bg.mp4 ролик.mp4 --event auto --calm auto --seam xfade'),
31:dict(how='Порыв ветра — улетает только белый самолётик (ветер виден по шторе). Рискованно: предмет летит. Надёжная замена — переключение: в окне вечереет, загораются фонари и окна площади (две картинки, шторка сверху вниз).',
   edit=KEEP+'Change only the time of evening: it is ten minutes later, the street lamps along the square and many windows across the city are now lit with warm light, the sky is a little deeper blue. Nothing else changes.',
   moveB=None,
   post='python3 tools/bg_fx.py switch film-bg.mp4 A.mp4 B.mp4 --how wipe-tb --dur 1.4 --end dip   (самолётик — только Veo с разметкой по секундам)'),
33:dict(how='Выход в эфир: лампы вокруг зеркала загораются по кругу — две картинки (лампы не горят / горят), «по кругу» делает склейка (демо «Клав — эфир» на стоящем фоне без генерации).',
   edit=KEEP+'Change only the mirror lamps: all the round bulbs around the mirror are now switched on and glowing bright white, lighting the room. Nothing else changes.',
   moveB=None,
   post='python3 tools/bg_fx.py switch film-bg.mp4 A.mp4 B.mp4 --how radial@<центр зеркала x,y>,<радиус> --dur 1.3 --end dip   (без генерации: dim A.mp4 стоящий.mp4 --lampbox <зеркало> --keep <окно> --keep <телефон>; switch … --sync)'),
}
OUT=[];T=[]
T.append('ФОНЫ v4 — «КАРТИНКА → ДВИЖЕНИЕ → СКЛЕЙКА» (второй Claude, 12.10). ПРЕДЛОЖЕНИЕ — решает Андрей.\n'
 'Тексты (место, предметы, свет, цвет, движение) — основного Claude, слово в слово; поменял только форму. Почему так — от-второго-клауда/ответы-фоны.md.\n\n'
 'КАК ДЕЛАТЬ\n'
 '① КАРТИНКА (Nano Banana / Imagen, 9:16) — дёшево и сразу видно: деньги, лишние предметы, «игрушечность», буквы. Не нравится — переделать картинку, не видео.\n'
 '② У ГЛАВНЫХ — КАРТИНКА «ПОСЛЕ»: загрузить ① и попросить правку (текст ниже). Только то, что меняет событие.\n'
 '③ ДВИЖЕНИЕ (Veo «кадр → видео», Fast или Lite): загрузить ① (у главных — ещё раз с ② для ролика Б), промт — только движение.\n'
 '④ СКЛЕЙКА — делает Claude (tools/bg_fx.py): событие ровно на нужной секунде, мигание, петля, превью.\n'
 'Имена файлов: <имя>-1.png (картинка), <имя>-2.png (после), <имя>-А.mp4, <имя>-Б.mp4 → в scenes/claude/фоны/.\n')
for x in D:
    n=x['n'];base=x['calm'];st=still(base);mv=move(motion(base));e=EV.get(n)
    it=dict(n=n,kind=x['kind'],grp=x['grp'],title=x['title'],file=x['file'],where=x['where'],still=st,motion=mv,live=x.get('live',''),event=x.get('ev','') if x['kind']=='main' else '')
    if e:
        it.update(how=e['how'],edit_after=e['edit'],motion_after=move(e['moveB']) if e['moveB'] else (mv if e['edit'] else None),post=e['post'])
    else:
        it.update(post='python3 tools/loop_bg.py bg.mp4 ролик.mp4   (живой фон: обычная петля; поехал предмет — bg_fx.py freeze --live <зоны, что должны жить>)')
    if n in (25,31):   # событие-движение: делает Veo из картинки ① — разметка по секундам основного Claude, слово в слово
        tl=re.search(r'8 seconds:\s*(.*?)\s*Rules:',x['prompt'],re.S).group(1).strip()
        it['motion_event']='Static locked-off camera, no camera movement, no zoom, no cuts. '+tl+' Apart from the event, the light stays the same and nothing else appears. No people.'
    OUT.append(it)
    T.append('\n'+'═'*70+f"\n{n}. {x['title']}   → {x['where']}\nфайлы: {x['file']}-1.png" + (f", {x['file']}-2.png" if e and e['edit'] else '')+f", {x['file']}-А.mp4"+(f", {x['file']}-Б.mp4" if e and e['edit'] else '')+'\n')
    if x['kind']=='main':T.append(f"Событие: {x.get('ev','')}\nКак: {e['how']}\n")
    else:T.append(f"Живое, без события. Что движется: {x.get('live','')}\n")
    T.append(f"\n① КАРТИНКА «ДО» (9:16):\n{st}\n")
    if e and e['edit']:T.append(f"\n② КАРТИНКА «ПОСЛЕ» (правка ①):\n{e['edit']}\n")
    T.append(f"\n③ ДВИЖЕНИЕ для ролика А (из ①):\n{mv}\n")
    if e and e['edit']:T.append(f"\n③б ДВИЖЕНИЕ для ролика Б (из ②):\n{it['motion_after']}\n")
    if it.get('motion_event'):T.append(f"\n③в ДВИЖЕНИЕ С СОБЫТИЕМ (Veo из ①, если событие делать генерацией):\n{it['motion_event']}\n")
    T.append(f"\n④ СКЛЕЙКА (Claude): {it['post']}\n")
json.dump(OUT,open(os.path.join(H,'фоны-v4.json'),'w'),ensure_ascii=False,indent=1)
open(os.path.join(H,'фоны-v4.txt'),'w').write(''.join(T))
L=[len(i['still']) for i in OUT];M=[len(i['motion']) for i in OUT]
bad=[i['n'] for i in OUT for k in ('still','motion','edit_after','motion_after') if i.get(k) and re.search(r'\b(toy|cartoon|miniature|figurine|someone)\b',i[k],re.I)]
print(f'{len(OUT)} фонов; картинка {min(L)}–{max(L)} знаков, движение {min(M)}–{max(M)}; слова toy/cartoon/miniature/someone: {bad or "нет"}')
print('пустые части:',[i['n'] for i in OUT if 'Setting:  ' in i['still'] or 'Objects:  ' in i['still'] or len(i['motion'])<200] or 'нет')
