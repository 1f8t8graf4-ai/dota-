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
                           c=im.get('icon_hero_card_webp') or im.get('icon_hero_card'), m=im.get('minimap_image_webp') or im.get('minimap_image'),
                           v=im.get('top_bar_vertical_image_webp') or im.get('top_bar_vertical_image'),
                           bg=im.get('background_image_webp') or im.get('background_image'),
                           col=(h.get('colors') or {}).get('style_hex') or '', ty=h.get('hero_type') or '', cx=h.get('complexity') or 0,
                           sig=[(h.get('items') or {}).get('signature%d' % k) for k in (1, 2, 3, 4)])
I = get('items')
# способности героев: по class_name из signature1..4 (порядок кнопок 1–4, 4 — ульта)
AB = {i['class_name']: i for i in I if i.get('type') == 'ability'}
for hid, h in heroes.items():
    L = []
    for k, cn in enumerate(h.pop('sig'), 1):
        a = AB.get(cn)
        if a: L.append(dict(id=a['id'], n=a['name'], k=k, i=a.get('image_webp') or a.get('image')))
    h['ab'] = L
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
