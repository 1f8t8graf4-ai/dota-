# Иллюстрации нейросетью (Gemini image, «Nano Banana») → img/<ep>/<id>.png
#   python3 img.py mrbeast            — все кадры из shots/mrbeast.json (уже готовые пропускает)
#   python3 img.py mrbeast title,legend --force
#   python3 img.py --test             — проверка ключа одной маленькой картинкой
# Модель по умолчанию — Cloudflare Workers AI, FLUX.2 [klein] 9B (бесплатно ≈ 10 000 «нейронов» в сутки, вертикаль 768×1344,
#   2–3 с на картинку). Токен — Network secret на api.cloudflare.com (Bearer, прокси подставляет сам). Можно дать
#   картинки-образцы (refs) — модель держит того же героя и стиль. IMG_BACKEND=gemini — Gemini (только с оплатой).
# Кадр = STYLE (общий стиль студии) + палитра ролика + описание сцены. Без текста и логотипов —
#   надписи и цифры рисуются поверх кодом (lib.js), чтобы не было кривых букв.
import base64, json, os, sys, time
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
API = 'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent'
MODELS = [os.environ.get('IMG_MODEL') or 'gemini-nano-banana-2.1', 'gemini-2.5-flash-image', 'gemini-3.1-flash-image-preview', 'gemini-3-pro-image-preview']
CA = '/root/.ccr/ca-bundle.crt'

STYLE = ("Flat 2D vector illustration in the style of a premium 2016 explainer motion-design studio "
         "(like the Russian 'What do you know about…' series): muted desaturated palette, soft vertical gradients on every surface, "
         "subtle long soft shadows, fine paper grain texture, clean geometric shapes with slightly rounded corners, very thin or no outlines, "
         "objects drawn with realistic proportions and many small believable details, characters with simple round heads, dot eyes and small mouths, "
         "cinematic composition with clear depth (foreground, midground, background), gentle volumetric light. "
         "Vertical 9:16 frame, important subject in the middle third, calm empty area in the lower quarter for subtitles. "
         "Absolutely no text, no letters, no numbers, no logos, no watermarks, no brand names; any posters, screens, labels, packaging and signs "
         "are blank or show only simple abstract shapes.")
CF_ACC = os.environ.get('CF_ACCOUNT', '30e726a49a27820ac532f8ab97954d0c')
CF_MODEL = os.environ.get('CF_MODEL', '@cf/black-forest-labs/flux-2-klein-9b')
SIZE = {'9:16': (768, 1344), '1:1': (1024, 1024), '16:9': (1344, 768), '4:5': (896, 1120)}


def call_cf(prompt, aspect='9:16', refs=()):
    w, h = SIZE.get(aspect, (768, 1344))
    files = {'prompt': (None, prompt[:2000]), 'width': (None, str(w)), 'height': (None, str(h))}
    for i, r in enumerate(refs[:4]):
        files[f'input_image_{i}'] = (os.path.basename(r), open(r, 'rb'), 'image/png' if r.endswith('.png') else 'image/jpeg')
    last = None
    for attempt in range(4):
        try:
            r = requests.post(f'https://api.cloudflare.com/client/v4/accounts/{CF_ACC}/ai/run/{CF_MODEL}', files=files,
                              headers={'Authorization': 'Bearer proxy-injected'}, timeout=240, verify=CA if os.path.exists(CA) else True)
        except requests.RequestException as e:
            last = str(e); time.sleep(3 + attempt * 5); continue
        if r.ok:
            return base64.b64decode(r.json()['result']['image']), CF_MODEL
        last = f'{r.status_code} {r.text[:300]}'
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(5 + attempt * 10); continue
        break
    raise RuntimeError(last)


def call(prompt, aspect='9:16', refs=()):
    if os.environ.get('IMG_BACKEND', 'cf') == 'cf':
        return call_cf(prompt, aspect, refs)
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
        f = os.path.join(out, s['id'] + '.jpg')
        if os.path.exists(f) and not force:
            continue
        refs = [os.path.join(out, r + '.jpg') for r in s.get('refs', []) if os.path.exists(os.path.join(out, r + '.jpg'))]
        prompt = STYLE + ' Palette: ' + pal + ' Scene: ' + s['prompt'] + (' Keep exactly the same character design, palette and drawing style as the reference image.' if refs else '')
        t = time.time()
        png, m = call(prompt, s.get('aspect', '9:16'), refs)
        open(f, 'wb').write(png)
        print(f'{ep}/{s["id"]}: {len(png) // 1024} КБ, {m}, {time.time() - t:.0f} с', flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--test':
        png, m = call('A small flat vector illustration of a red apple on a table. ' + STYLE, '1:1')
        os.makedirs(os.path.join(HERE, 'img'), exist_ok=True); open(os.path.join(HERE, 'img', '_test.jpg'), 'wb').write(png)
        print('ключ работает:', m, len(png) // 1024, 'КБ')
    else:
        force = '--force' in a
        a = [x for x in a if x != '--force']
        main(a[0], set(a[1].split(',')) if len(a) > 1 else None, force)
