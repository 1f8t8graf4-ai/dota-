#!/usr/bin/env python3
"""Промты «микродвижение» (07.11, Андрей: «минимальное движение — видно, что арт живой,
и чтобы получалось с 1 раза, максимум со 2»).

Почему так выходит с первого раза:
- двигается 2–3 крошечные вещи (дыхание, моргание, прядь / пламя / блик), остальное заморожено;
- питомцы, птицы, всадники, оружие — названы и заморожены (это они раньше «телепортировались»);
- никаких действий по секундам, кроме одного моргания;
- в Flow «Кадры в видео» первый и последний кадр — один и тот же арт: модели некуда уйти.

Запуск:  python3 tools/bg_min.py            → поля min_* в tools/bg-prompts.json + tools/bg-min.json
         python3 tools/bg_min.py page out.html  → страница с кнопками (картинки героев — из ветки claude/hero-16x9)
Запускать ПОСЛЕ tools/bg_prompts2.py (он пересобирает bg-prompts.json и сотрёт min_*).
"""
import base64, html, json, subprocess, sys, io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tools', 'bg-prompts.json')

# у этих уже стоит петля (R2 или restless/loops) — промт не нужен
DONE = {'venator', 'rat-king', 'victor', 'celeste', 'deadmandanny', 'drifter',
        'dynamo', 'graves', 'vyper', 'wraith'}

BREATH = 'slow, shallow breathing lifts {his} chest and shoulders very slightly'
BLINK = '{he} blinks once around second 4'

HERO_HEAD = ('Animate this exact painting of {name} from the game Deadlock for 8 seconds as a living portrait '
             'with only micro-motion: it should look almost like a still image that is quietly alive. '
             'Locked camera: no zoom, no pan, no tilt, no cuts. Keep the whole 16:9 frame exactly as painted: '
             'the same framing, character, pose, face, expression, colors and painted style; nothing is redrawn, '
             'cropped, extended or moved, and the soft blurred sides stay still. ')
HERO_MID = 'The only motion is tiny (a few pixels), slow and smooth: '
HERO_TAIL = (' Nothing else moves at all. No new objects, creatures, sparkles, particles or effects; '
             'the light and colors stay exactly the same; no talking, the mouth stays as drawn. '
             'In the last second everything settles back to exactly the first frame, so the clip loops seamlessly.')
HERO_NEG = ('camera movement, zoom, pan, tilt, crop, new pose, head turning, turning to the camera, talking, mouth moving, '
            'face change, expression change, smiling, morphing, warping, melting, extra limbs or fingers, '
            'new objects, new creatures, a creature moving or flying, sparkles, magic effects, glowing rings, '
            'light changes, color changes, style change, 3D render look, text, watermark, flicker, fast movement, '
            'weapons bending or moving')

# hero: (he/she/it, his/her/its, still, live[list], что двигается по-русски)
# live: 'B' = дыхание, 'K' = моргание, иначе — свой текст
H = {
 'rem': ('He', 'his',
   'He hangs below the big dark-blue pillow he holds above his head: the pillow, his raised arm and his whole body stay exactly in place. '
   'The little dark imp at his side stays perfectly still, like painted. The clouds, the moon and the city stay still.',
   ['the teal-green candle flame in his other hand flickers gently; it is already burning in the first frame', 'K',
    'the tip of his nightcap stirs slightly'],
   'пламя свечи, моргает, кончик колпака'),
 'grey-talon': ('He', 'his',
   'The long bow is rigid wood and stays perfectly still. The ghostly green owl at the top right stays perfectly still at its place and size, like painted.',
   ['B', 'K', 'his long white braid sways a few pixels'],
   'дышит, моргает, коса чуть качается; сова стоит'),
 'abrams': ('He', 'his',
   'The huge revolver is rigid metal and stays perfectly still. The orange shards stay exactly where they are painted.',
   ['B', 'K', 'the edge of his coat collar stirs slightly'],
   'дышит, моргает, воротник'),
 'apollo': ('He', 'his',
   'The thin rapier is rigid metal and stays perfectly still and straight. The red slashes are flat painted strokes and stay exactly as drawn.',
   ['B', 'K', 'a few strands of his hair stir slightly'],
   'дышит, моргает, пряди'),
 'baba': ('She', 'her',
   'She sits on the bench exactly as drawn and holds the teacup still. The dark bird on her shoulder and every pink pigeon stay perfectly still, like painted.',
   ['a thin wisp of steam rises slowly from the teacup', 'B', 'she blinks once behind her glasses around second 4'],
   'пар из чашки, дышит, моргает; птицы стоят'),
 'bebop': ('He', 'his',
   'The big robot stands like a statue: his armored body, arms, legs and the big cannon keep their exact shape and place.',
   ['the green eye lights and the lamp on his head glow with a soft, slow pulse and never switch off',
    'the rope and the cloth panel at his waist sway a few pixels'],
   'глаза-лампы мягко пульсируют, тряпка на поясе'),
 'billy': ('He', 'his',
   'The spiked bat on his shoulder is rigid and stays perfectly still. The graffiti behind him stays exactly as drawn.',
   ['B', 'he blinks his glowing yellow eyes once around second 4', 'his long ears twitch slightly once around second 6'],
   'дышит, моргает, уши дёрнулись'),
 'calico': ('She', 'her',
   'The pale cat on her shoulder stays perfectly still, like painted. Her round white goggles keep the same glow. The pink circle behind her stays as drawn.',
   ['B', 'the purple glow at her hand pulses softly and slowly', 'her round earring sways a few pixels'],
   'дышит, свечение у руки, серьга; кошка стоит'),
 'doorman': ('He', 'his',
   'He keeps his leaping pose: he does not land and does not turn. The key ring in his raised hand stays still with the same number of keys. '
   'His wine-red uniform keeps its shape and does not flutter. The yellow rays behind him stay as drawn.',
   ['K', 'a soft glint slides once over the brass buttons on his chest around second 6',
    'the fingers of his other raised hand flex very slightly once'],
   'моргает, блик на пуговицах, пальцы; ключи и кафтан стоят'),
 'haze': ('She', 'her',
   'She stands with her back half turned, exactly as drawn; her face and mask stay exactly as painted. '
   'The gun is rigid metal and stays perfectly still. The knives on her belt stay as drawn. The pale-yellow circle stays as drawn.',
   ['slow, shallow breathing lifts her shoulders very slightly', 'a few strands of her hair stir slightly'],
   'дышит, пряди; лицо и маска стоят, без бликов'),
 'holliday': ('She', 'her',
   'The revolver pointing up is rigid metal and stays perfectly still. Her wide hat keeps its shape.',
   ['B', 'K', 'the ends of her plaid scarf stir slightly'],
   'дышит, моргает, концы шарфа'),
 'infernus': ('He', 'his',
   'He keeps his crouching pose, his arm pointing to the left. His red hat keeps its shape. '
   'The orange flame shapes stay where they are painted: they never spread, never grow and never fill the picture.',
   ['the orange flame shapes flicker slightly in place', 'slow, shallow breathing lifts his shoulders very slightly'],
   'огонь дрожит на месте, дышит'),
 'ivy': ('She', 'her',
   'She keeps her crouching pose. The big gun in her hands is rigid metal and stays perfectly still. Her wings stay spread exactly as drawn.',
   ['B', 'K', 'the thin edges of her wings flex a few pixels'],
   'дышит, моргает, края крыльев'),
 'kelvin': ('He', 'his',
   'The ice gun is rigid metal and stays perfectly still; its blue glow keeps the same size and never becomes a beam.',
   ['B', 'K', 'the fur of his collar ripples slightly'],
   'дышит, моргает, мех воротника'),
 'lady-geist': ('She', 'her',
   'Her pale sculpted hair and the dark fur stole keep their shape. The green glow at her raised hand keeps the same size: it never grows and never shoots out.',
   ['thin green wisps curl slowly in place around her fingers', 'B', 'she blinks slowly once around second 4'],
   'зелёные струйки у пальцев, дышит, моргает'),
 'lash': ('He', 'his',
   'His body and fists stay exactly as drawn, the same size and outline.',
   ['B', 'K', 'the pendant on his chest sways a few pixels'],
   'дышит, моргает, кулон'),
 'mcginnis': ('She', 'her',
   'The machine-gun turret beside her is rigid metal: its barrels never spin. Her goggles stay on her head and her salute stays exactly as drawn.',
   ['B', 'K', 'the ends of her red headband stir slightly'],
   'дышит, моргает, концы повязки'),
 'mina': ('She', 'her',
   'The big red umbrella over her shoulder is stiff and stays exactly as drawn: it never closes and never flies. '
   'The small red bat shapes are flat painted shapes and never fly. The gun in her hand is rigid metal and stays perfectly still.',
   ['B', 'K', 'her short hair stirs slightly'],
   'дышит, моргает, волосы; зонт и мыши стоят'),
 'mirage': ('He', 'his',
   'The raised pistol is rigid metal and stays perfectly still. The ornate lamp at the right stays exactly as drawn. The purple light stays the same.',
   ['B', 'K', 'the tassel of his hat and his beard stir slightly'],
   'дышит, моргает, кисточка и борода'),
 'mo-krill': ('It', 'its',
   'The big armored figure keeps its leaping pose; its body and claws keep their exact shape and size. '
   'The small rider at the top left stays perfectly still, like painted. The heavy chain stays exactly as drawn.',
   ['the big figure breathes slowly, its back rising very slightly', 'the dust behind them drifts very slowly'],
   'большой дышит, пыль плывёт; наездник и цепь стоят'),
 'nurseharrow': ('She', 'her',
   'The long dart at the top right is rigid metal and stays perfectly still. The orange ribbon keeps its place and shape. The glowing bag keeps the same brightness.',
   ['the orange ribbon ripples gently along its length', 'she blinks once behind her glasses around second 4'],
   'лента колышется, моргает'),
 'paige': ('She', 'her',
   'The stack of books keeps its shape and number; the open book stays open; the green crystals keep their place and size.',
   ['the green crystals glow with a soft, slow pulse', 'she blinks once behind her round glasses around second 4',
    'the edges of the open pages flutter slightly'],
   'кристаллы пульсируют, моргает, края страниц'),
 'paradox': ('She', 'her',
   'The long rifle is rigid metal and stays perfectly still. Her black helmet keeps its shape and stays exactly as painted. '
   'The clock shapes behind her are flat painted shapes and never turn.',
   ['the pink slit on the helmet glows with a soft, slow pulse', 'slow, shallow breathing lifts her shoulders very slightly'],
   'щель шлема пульсирует, дышит; без бликов'),
 'pocket': ('He', 'his',
   'The case in his hand is stiff and stays perfectly still. The yellow-green glow at the right keeps its size.',
   ['his long scarf sways a few pixels', 'K'],
   'шарф качается, моргает'),
 'seven': ('It', 'its',
   'The big figure keeps its pose and size. The round metal ring on top is rigid and stays perfectly still. The yellow burst behind it stays as drawn.',
   ['the yellow glow on its chest pulses softly and slowly', 'the straps on its arms sway a few pixels'],
   'свечение на груди, ремни; без искр'),
 'shiv': ('He', 'his',
   'He keeps his lunging pose. The big cleaver blade is rigid metal and stays perfectly still.',
   ['B', 'K', 'his hair stirs slightly'],
   'дышит, моргает, волосы'),
 'silver': ('She', 'her',
   'The big wolf behind her stays perfectly still, like painted: it never moves and never opens its mouth. The red circle stays as drawn.',
   ['B', 'K', 'her long white hair sways a few pixels'],
   'дышит, моргает, волосы; волк стоит'),
 'sinclair': ('He', 'his',
   'The raised wand is a stiff stick and stays perfectly still. His top hat keeps its shape. The white circle behind him stays as drawn.',
   ['B', 'the tails of his coat stir slightly', 'his white gloved fingers flex very slightly once'],
   'дышит, фалды, пальцы'),
 'solomon': ('He', 'his',
   'The chess board and every chess piece stay exactly where they are; no piece moves. The ring of chess pieces behind his head stays as drawn.',
   ['B', 'K', 'the soft glow behind his head pulses slowly'],
   'дышит, моргает, свечение за головой'),
 'vindicta': ('She', 'her',
   'The long rifle is rigid metal and stays perfectly still.',
   ['her long pale-blue hair drifts slowly a few pixels', 'K'],
   'волосы плывут, моргает'),
 'violet': ('She', 'her',
   'The papers around her stay exactly where they are painted and never fly. The purple brush stroke stays as drawn.',
   ['B', 'K', 'the edges of the papers flutter slightly'],
   'дышит, моргает, края листов'),
 'viscous': ('He', 'his',
   'His green body and round helmet keep their exact shape and size: the body never melts, stretches or wobbles. '
   'The gun is rigid metal and stays perfectly still. The green dots stay exactly as drawn.',
   ['a few small bubbles drift slowly upward inside his green body', 'he blinks his two black eyes once around second 4'],
   'пузырьки внутри, моргает'),
 'warden': ('He', 'his',
   'He stands like a statue. The big metal case on his shoulder, the braided cord and his helmet with the badge keep their exact shape.',
   ['B', 'K', 'the tassels of the cord stir slightly'],
   'дышит, моргает, кисти шнура'),
 'yamato': ('She', 'her',
   'The long sword is rigid metal and stays perfectly still. Her golden armor keeps its shape. The red circle stays as drawn.',
   ['the blue glow along the blade pulses softly and slowly', 'K', 'the fabric of her tall hood stirs slightly'],
   'свечение клинка, моргает, капюшон'),
}

# фоны: одна вещь двигается — синемаграф
F = {
 'film:wolf': ('the goldfish swims slowly in its bowl', 'рыбка плавает'),
 'film:psycho': ('the vinyl record spins slowly on the turntable', 'пластинка крутится'),
 'film:taxi': ('steam rises slowly from the manhole', 'пар из люка'),
 'film:titanic': ('the sea moves gently: small waves and golden glints on the water; the ship stays exactly in place', 'море и блики'),
 'film:bunker': ('the fire glow flickers softly on the broken walls', 'отсвет огня на стенах'),
 'season:sopranos:S01': ('the water ripples gently with sun glints; the ducks float, rocking very slightly in place', 'рябь, утки покачиваются'),
 'season:sopranos:S04': ('fine hay dust drifts slowly in the beam of the bulb; the mare stands perfectly still', 'пыль в луче лампы'),
 'season:sopranos:S06': ('a thin wisp of steam rises slowly from the coffee cup', 'пар над кофе'),
 'season:bb:S01': ('the khaki trousers and the dry grass sway slightly in the hot wind', 'брюки и трава на ветру'),
 'season:bb:S02': ('light patterns move gently on the pool walls and the water ripples softly; the teddy bear floats, rocking very slightly in place', 'блики в бассейне'),
 'season:bb:S04': ('thin steam rises slowly from one valve on a tank', 'пар из клапана'),
 'season:bb:S05': ('the dry grass waves gently in the wind', 'трава на ветру'),
 'person:durov': ('the sheer curtain sways slowly in the breeze', 'занавеска'),
 'person:clavicular': ('the palm trees outside the small window sway slowly in the wind', 'пальмы за окном'),
 'moment:sopranos:ralph-kitchen': ('a thin wisp of steam rises slowly from the pot on the stove', 'пар из кастрюли'),
}
F_ANIM = ('Animate this exact image for 8 seconds as a cinemagraph: only one thing moves, everything else is frozen like a photograph. '
          'Locked camera: no zoom, no pan, no cuts. Only this moves, slowly and continuously: {one}. '
          'Everything else stays perfectly still. The light does not change. Nothing new appears and nothing disappears; no people. '
          'The last frame is identical to the first frame, so the video loops seamlessly. No smoke, fog or mist.')
F_VID_MID = ' This is a cinemagraph, like a photograph that is quietly alive: only one thing moves, slowly and continuously: {one}. '
F_NEG = ('people, hands, faces, camera movement, zoom, pan, cuts, objects moving, objects appearing or disappearing, '
         'light changes, flicker, smoke, fog, mist, rain on glass, text, logos, letters, CGI, 3D render, plastic look')


def hero_prompt(x):
    he, his, still, live, ru = H[x['hero']]
    parts = []
    for p in live:
        if p == 'B': parts.append(BREATH.format(his=his))
        elif p == 'K': parts.append(BLINK.format(he=he.lower()))
        else: parts.append(p)
    txt = HERO_HEAD.format(name=x.get('title') or x['hero']) + still + ' ' + HERO_MID + '; '.join(parts) + '.' + HERO_TAIL
    return txt.replace('  ', ' '), ru


def build():
    d = json.load(open(SRC))
    out = {'v': 1, 'updated': '2026-11-07', 'how': [
        'Герой: Flow → «Кадры в видео», ПЕРВЫЙ и ПОСЛЕДНИЙ кадр — один и тот же арт 16:9 (кнопка «Кадр»), 8 с, 16:9.',
        'Фон: сначала «Фото» (Gemini / Flow, 9:16, выбери лучший из 3–4), потом «Оживить» с этим фото первым и последним кадром.',
        'Негатив — в поле Negative prompt, если оно есть; нет — не страшно.',
        'Не вышло 2 раза — не дописывай: скинь кадр Claude.'], 'heroes': [], 'bgs': []}
    for x in d['items']:
        if x['kind'] == 'hero':
            k = x['hero']
            if k in DONE:
                out['heroes'].append({'hero': k, 'name': x.get('title') or k, 'done': True})
                x.pop('min_animate', None); x.pop('min_neg', None)
                continue
            if k not in H:
                print('нет микропромта:', k, file=sys.stderr); continue
            p, ru = hero_prompt(x)
            x['min_animate'] = p; x['min_neg'] = HERO_NEG
            out['heroes'].append({'hero': k, 'name': x.get('title') or k, 'moves': ru, 'prompt': p, 'neg': HERO_NEG})
        elif x['key'] in F:
            one, ru = F[x['key']]
            anim = F_ANIM.format(one=one)
            scene = x['photo'].split(' Vertical 9:16.')[0]
            vid = d['video_head'] + scene + F_VID_MID.format(one=one) + d['video_tail']
            x['min_animate'] = anim; x['min_video'] = vid; x['min_neg'] = F_NEG
            out['bgs'].append({'key': x['key'], 'title': x['title'], 'moves': ru, 'photo': x['photo'],
                               'animate': anim, 'video': vid, 'neg': F_NEG})
    open(SRC, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=1) + '\n')
    open(os.path.join(ROOT, 'tools', 'bg-min.json'), 'w', encoding='utf-8').write(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
    for h in out['heroes']:
        if 'prompt' in h: assert len(h['prompt']) < 1500, h['hero']
    print('героев:', sum(1 for h in out['heroes'] if 'prompt' in h), '· готово:', sum(1 for h in out['heroes'] if h.get('done')),
          '· фонов:', len(out['bgs']))
    return out


def thumb(hero):
    try:
        raw = subprocess.run(['git', 'show', f'origin/claude/hero-16x9:heroes-16x9/{hero}.jpg'], cwd=ROOT,
                             capture_output=True, check=True).stdout
        from PIL import Image
        im = Image.open(io.BytesIO(raw)).convert('RGB'); im.thumbnail((360, 203))
        b = io.BytesIO(); im.save(b, 'JPEG', quality=72)
        return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    except Exception as e:
        print('нет кадра', hero, e, file=sys.stderr); return ''


def page(out, path):
    e = lambda s: html.escape(s, quote=True)
    RAW = 'https://raw.githubusercontent.com/1f8t8graf4-ai/dota-/claude/hero-16x9/heroes-16x9/'
    cards = []
    for h in out['heroes']:
        img = thumb(h['hero'])
        if h.get('done'):
            cards.append(f'<article class="c done" data-g="done"><img src="{img}" alt=""><div class="b"><h3>{e(h["name"])}</h3>'
                         f'<p class="mv">Петля уже стоит</p></div></article>')
            continue
        cards.append(
            f'<article class="c" data-g="hero" data-id="h-{e(h["hero"])}"><img src="{img}" alt="">'
            f'<div class="b"><h3>{e(h["name"])}</h3><p class="mv">{e(h["moves"])}</p>'
            f'<div class="act"><button data-cp="p">Промт</button><button data-cp="n" class="sec">Негатив</button>'
            f'<a class="sec" href="{RAW}{e(h["hero"])}.jpg" target="_blank" rel="noopener">Кадр ↗</a>'
            f'<label class="ok"><input type="checkbox" id="ok-h-{e(h["hero"])}"> готово</label></div>'
            f'<details><summary>текст</summary><pre data-t="p">{e(h["prompt"])}</pre><pre data-t="n">{e(h["neg"])}</pre></details>'
            f'</div></article>')
    for f in out['bgs']:
        cards.append(
            f'<article class="c bg" data-g="bg" data-id="b-{e(f["key"])}"><div class="b"><h3>{e(f["title"])}</h3>'
            f'<p class="mv">двигается: {e(f["moves"])}</p>'
            f'<div class="act"><button data-cp="f">1 · Фото</button><button data-cp="a">2 · Оживить</button>'
            f'<button data-cp="v" class="sec">Сразу видео</button><button data-cp="n" class="sec">Негатив</button>'
            f'<label class="ok"><input type="checkbox" id="ok-b-{e(f["key"])}"> готово</label></div>'
            f'<details><summary>текст</summary><pre data-t="f">{e(f["photo"])}</pre><pre data-t="a">{e(f["animate"])}</pre>'
            f'<pre data-t="v">{e(f["video"])}</pre><pre data-t="n">{e(f["neg"])}</pre></details></div></article>')
    nh = sum(1 for h in out['heroes'] if 'prompt' in h); nd = sum(1 for h in out['heroes'] if h.get('done'))
    how = ''.join(f'<li>{e(s)}</li>' for s in out['how'])
    doc = TPL.replace('%HOW%', how).replace('%CARDS%', '\n'.join(cards)) \
             .replace('%NH%', str(nh)).replace('%ND%', str(nd)).replace('%NB%', str(len(out['bgs'])))
    open(path, 'w').write(doc)
    print('страница:', path, len(doc) // 1024, 'КБ')


TPL = r'''<title>Промты микродвижения</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* Пульт для Flow: карточки героев и фонов, одна кнопка — один промт в буфер */
:root{--bg:#f3f1ec;--card:#fffdf8;--ink:#1d1b18;--mute:#6d675d;--line:#e2ddd2;--acc:#b4462c;--accs:#f6e3dc;--ok:#2f7d4f;
 --f-d:"Unbounded",system-ui,sans-serif;--f-b:"Golos Text",system-ui,sans-serif;--f-m:ui-monospace,"SF Mono",Menlo,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#15130f;--card:#1e1b16;--ink:#f1ece2;--mute:#a39a8b;--line:#332e26;--acc:#ef7a55;--accs:#3a2219;--ok:#5fc489;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#15130f;--card:#1e1b16;--ink:#f1ece2;--mute:#a39a8b;--line:#332e26;--acc:#ef7a55;--accs:#3a2219;--ok:#5fc489;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:15px/1.45 var(--f-b);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:20px 60px}
.w{max-width:1180px;margin:0 auto;display:grid;gap:18px}
h1{font:600 clamp(22px,4vw,32px)/1.1 var(--f-d);margin:0;text-wrap:balance}
.how{margin:0;padding-left:18px;color:var(--mute);display:grid;gap:4px;max-width:70ch}
.tabs{display:flex;gap:6px;flex-wrap:wrap;position:sticky;top:env(safe-area-inset-top,0px);background:var(--bg);padding-block:8px;z-index:5}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--bg)}
.tabs button{font:500 14px var(--f-b);border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:7px 14px;cursor:pointer}
.tabs button[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.tabs .cnt{font-variant-numeric:tabular-nums;opacity:.6;margin-left:4px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
.c{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:grid;align-content:start;min-width:0}
.c img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:var(--line)}
.c .b{padding:12px 14px 14px;display:grid;gap:8px;min-width:0}
.c h3{margin:0;font:600 17px/1.2 var(--f-d)}
.mv{margin:0;color:var(--mute);font-size:13.5px}
.act{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.act button,.act a{font:600 13px var(--f-b);border:0;border-radius:8px;padding:8px 12px;background:var(--acc);color:#fff;cursor:pointer;text-decoration:none}
.act .sec{background:var(--accs);color:var(--acc)}
.act button.cp{background:var(--ok);color:#fff}
.ok{margin-left:auto;font-size:13px;color:var(--mute);display:flex;gap:5px;align-items:center;cursor:pointer}
.c.is-ok{border-color:var(--ok)}.c.is-ok h3::after{content:" ✓";color:var(--ok)}
details summary{cursor:pointer;color:var(--mute);font-size:12.5px}
pre{white-space:pre-wrap;word-break:break-word;font:12px/1.5 var(--f-m);background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px;margin:6px 0 0;max-height:220px;overflow:auto}
.done img{filter:grayscale(1);opacity:.55}
[hidden]{display:none!important}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
@media (prefers-reduced-motion:no-preference){.act button{transition:background .15s}}
</style>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Unbounded:wght@600&display=swap">
<div class="w">
<h1>Микродвижение: арт просто живой</h1>
<ul class="how">%HOW%</ul>
<div class="tabs" role="toolbar">
<button data-f="hero" aria-pressed="true">Герои<span class="cnt">%NH%</span></button>
<button data-f="bg" aria-pressed="false">Фоны<span class="cnt">%NB%</span></button>
<button data-f="done" aria-pressed="false">Уже стоят<span class="cnt">%ND%</span></button>
</div>
<div class="grid" id="g">%CARDS%</div>
</div>
<script>
(function(){
var g=document.getElementById('g');
function show(f){document.querySelectorAll('.tabs button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===f)});
 g.querySelectorAll('.c').forEach(function(c){c.hidden=c.dataset.g!==f});try{localStorage.setItem('bgmin-tab',f)}catch(e){}}
document.querySelector('.tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b)show(b.dataset.f)});
var t='hero';try{t=localStorage.getItem('bgmin-tab')||'hero'}catch(e){}show(t);
g.addEventListener('click',function(e){var b=e.target.closest('button[data-cp]');if(!b)return;
 var pre=b.closest('.c').querySelector('pre[data-t="'+b.dataset.cp+'"]');var txt=pre.textContent;
 function done(){var o=b.textContent;b.classList.add('cp');b.textContent='Скопировано';setTimeout(function(){b.classList.remove('cp');b.textContent=o},1300)}
 function sel(){var d=pre.closest('details');d.open=true;var r=document.createRange();r.selectNodeContents(pre);var s=getSelection();s.removeAllRanges();s.addRange(r)}
 try{navigator.clipboard.writeText(txt).then(done,sel)}catch(x){sel()}});
g.querySelectorAll('.ok input').forEach(function(i){var c=i.closest('.c');var k='bgmin-'+i.id;
 try{i.checked=localStorage.getItem(k)==='1'}catch(e){}c.classList.toggle('is-ok',i.checked);
 i.addEventListener('change',function(){c.classList.toggle('is-ok',i.checked);try{localStorage.setItem(k,i.checked?'1':'0')}catch(e){}})});
})();
</script>
'''

if __name__ == '__main__':
    o = build()
    if len(sys.argv) > 2 and sys.argv[1] == 'page':
        page(o, sys.argv[2])
