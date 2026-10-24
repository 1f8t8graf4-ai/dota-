# Собирает макеты 24.10 в отдельные html: картинки и видео вшиваются base64.
# Готовый файл открывается двойным кликом или публикуется артефактом (Artifact → publish).
#   python3 build.py   →   glavnaya-dd.html (главная и ДД, 5+5 вариантов), tri-dizajna.html (три дизайна)
# Правишь только *.tpl.html и assets/ — собранные html в .gitignore.
import base64, glob, json, os
D = os.path.dirname(os.path.abspath(__file__))
I = {os.path.basename(p)[:-5]: 'data:image/webp;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
     for p in sorted(glob.glob(D + '/assets/img/*.webp'))}
V = {os.path.basename(p)[:-4]: base64.b64encode(open(p, 'rb').read()).decode()
     for p in sorted(glob.glob(D + '/assets/vid/*.mp4'))}
t = open(D + '/glavnaya-dd.tpl.html', encoding='utf8').read()
open(D + '/glavnaya-dd.html', 'w', encoding='utf8').write(t.replace('__ASSETS__', json.dumps({'I': I, 'V': V})))
t = open(D + '/tri-dizajna.tpl.html', encoding='utf8').read()
open(D + '/tri-dizajna.html', 'w', encoding='utf8').write(t.replace('__IMG__', json.dumps(I)))
print('собрано: glavnaya-dd.html, tri-dizajna.html')
