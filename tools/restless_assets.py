#!/usr/bin/env python3
# Справочник для Restless (restless/data.js): герои, предметы магазина, ранги, карта — с api.deadlock-api.com.
# Полные ответы большие (предметы — 6 МБ), в страницу кладём только нужные поля. Запуск после патча: python3 tools/restless_assets.py
import json, urllib.request, os
A = 'https://api.deadlock-api.com/v1/assets/'
def get(p):
    with urllib.request.urlopen(urllib.request.Request(A + p, headers={'User-Agent': 'restless'}), timeout=60) as r:
        return json.load(r)
H = get('heroes')
heroes = {}
for h in H:
    if not h.get('player_selectable') or h.get('disabled'): continue
    im = h.get('images') or {}
    heroes[h['id']] = dict(n=h['name'], i=im.get('icon_image_small_webp') or im.get('icon_image_small'),
                           c=im.get('icon_hero_card_webp') or im.get('icon_hero_card'), m=im.get('minimap_image_webp') or im.get('minimap_image'))
I = get('items')
items = {}
for i in I:
    if i.get('type') != 'upgrade' or not i.get('shopable'): continue
    items[i['id']] = dict(n=i['name'], s=i.get('item_slot_type'), t=i.get('item_tier'), p=i.get('cost'),
                          i=i.get('shop_image_webp') or i.get('image_webp') or i.get('image'))
R = get('ranks')
ranks = [dict(t=r['tier'], n=r['name'], c=r.get('color'), i={k: v for k, v in (r.get('images') or {}).items() if k.endswith('webp')}) for r in R]
M = get('map')
out = dict(v=1, heroes=heroes, items=items, ranks=ranks,
           map=dict(r=M['radius'], img=M['images'].get('minimap'), frame=M['images'].get('frame'), obj=M.get('objective_positions')))
p = os.path.join(os.path.dirname(__file__), '..', 'restless', 'data.js')
s = 'window.RL_DATA=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
open(p, 'w', encoding='utf-8').write(s)
print('героев', len(heroes), 'предметов', len(items), 'рангов', len(ranks), '→', p, len(s), 'байт')
