# Иллюстрации нейросетью (Gemini image, «Nano Banana») → img/<ep>/<id>.png
#   python3 img.py mrbeast            — все кадры из shots/mrbeast.json (уже готовые пропускает)
#   python3 img.py mrbeast title,legend --force
#   python3 img.py --test             — проверка ключа одной маленькой картинкой
# Ключ: Network secret окружения (host generativelanguage.googleapis.com, header x-goog-api-key) —
#   прокси подставляет его сам, в коде ключа нет. Или переменная GEMINI_API_KEY.
# Кадр = STYLE (общий стиль студии) + палитра ролика + описание сцены. Без текста и логотипов —
#   надписи и цифры рисуются поверх кодом (lib.js), чтобы не было кривых букв.
import base64, json, os, sys, time
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
API = 'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent'
MODELS = [os.environ.get('IMG_MODEL') or 'gemini-2.5-flash-image', 'gemini-3.1-flash-image-preview', 'gemini-3-pro-image-preview']
CA = '/root/.ccr/ca-bundle.crt'

STYLE = ("Flat 2D vector illustration in the style of a premium 2016 explainer motion-design studio "
         "(like the Russian 'What do you know about…' series): muted desaturated palette, soft vertical gradients on every surface, "
         "subtle long soft shadows, fine paper grain texture, clean geometric shapes with slightly rounded corners, very thin or no outlines, "
         "objects drawn with realistic proportions and many small believable details, characters with simple round heads, dot eyes and small mouths, "
         "cinematic composition with clear depth (foreground, midground, background), gentle volumetric light. "
         "Vertical 9:16 frame, important subject in the middle third, calm empty area in the lower quarter for subtitles. "
         "Absolutely no text, no letters, no numbers, no logos, no watermarks, no brand names.")


def call(prompt, aspect='9:16', refs=()):
    parts = [{'text': prompt}]
    for r in refs:
        parts.append({'inline_data': {'mime_type': 'image/png', 'data': base64.b64encode(open(r, 'rb').read()).decode()}})
    body = {'contents': [{'parts': parts}], 'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': aspect}}}
    hdr = {'Content-Type': 'application/json'}
    if os.environ.get('GEMINI_API_KEY'):
        hdr['x-goog-api-key'] = os.environ['GEMINI_API_KEY']
    last = None
    for m in MODELS:
        for attempt in range(3):
            try:
                r = requests.post(API.format(m=m), json=body, headers=hdr, timeout=180, verify=CA if os.path.exists(CA) else True)
            except requests.RequestException as e:
                last = str(e); time.sleep(2 + attempt * 3); continue
            if r.status_code == 200:
                for c in r.json().get('candidates', []):
                    for p in c.get('content', {}).get('parts', []):
                        d = p.get('inline_data') or p.get('inlineData')
                        if d and d.get('data'):
                            return base64.b64decode(d['data']), m
                last = 'нет картинки в ответе: ' + r.text[:300]
                break
            last = f'{m}: {r.status_code} {r.text[:400]}'
            if r.status_code in (429, 500, 503):
                time.sleep(5 + attempt * 10); continue
            break
    raise RuntimeError(last)


def main(ep, only=None, force=False):
    spec = json.load(open(os.path.join(HERE, 'shots', ep + '.json')))
    out = os.path.join(HERE, 'img', ep)
    os.makedirs(out, exist_ok=True)
    pal = spec.get('palette', '')
    for s in spec['shots']:
        if only and s['id'] not in only:
            continue
        f = os.path.join(out, s['id'] + '.png')
        if os.path.exists(f) and not force:
            continue
        refs = [os.path.join(out, r + '.png') for r in s.get('refs', []) if os.path.exists(os.path.join(out, r + '.png'))]
        prompt = STYLE + ' Palette: ' + pal + ' Scene: ' + s['prompt'] + (' Keep the same character design and style as the reference image.' if refs else '')
        t = time.time()
        png, m = call(prompt, s.get('aspect', '9:16'), refs)
        open(f, 'wb').write(png)
        print(f'{ep}/{s["id"]}: {len(png) // 1024} КБ, {m}, {time.time() - t:.0f} с', flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--test':
        png, m = call('A small flat vector illustration of a red apple on a table. ' + STYLE, '1:1')
        os.makedirs(os.path.join(HERE, 'img'), exist_ok=True); open(os.path.join(HERE, 'img', '_test.png'), 'wb').write(png)
        print('ключ работает:', m, len(png) // 1024, 'КБ')
    else:
        force = '--force' in a
        a = [x for x in a if x != '--force']
        main(a[0], set(a[1].split(',')) if len(a) > 1 else None, force)
