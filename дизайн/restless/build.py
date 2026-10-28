# Страница «Интерфейс Restless»: шаблон ui.tpl.html + картинки (base64) + места на карте → restless-ui.html (в git не кладём)
#   python3 build.py <папка с картинками *.webp> <map.json> [выход]
# Картинки: скрины программ из архива Андрея (sb-*, dl-*, dc-*, sl-*) и мини-иконки героев из макетов (mini_*.webp).
# map.json — сжатые места из https://api.deadlock-api.com/v1/assets/map (lanes, camps, crates, tough, buffs, urn, rifts, obj).
import base64, json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
img_dir, map_path = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(D, 'restless-ui.html')
imgs = {}
for f in sorted(os.listdir(img_dir)):
    if f.endswith('.webp'):
        imgs[f[:-5].replace('-', '-')] = 'data:image/webp;base64,' + base64.b64encode(open(os.path.join(img_dir, f), 'rb').read()).decode()
t = open(os.path.join(D, 'ui.tpl.html'), encoding='utf8').read()
t = t.replace('{{imgs}}', json.dumps(imgs)).replace('{{map}}', open(map_path, encoding='utf8').read().strip())
open(out, 'w', encoding='utf8').write(t)
print(out, len(t), 'картинок', len(imgs))
