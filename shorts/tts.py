# Голос ролика нейросетью — Gemini TTS (09.11). Бесплатно: 10 запросов в сутки на каждую модель, ролик = 1 запрос.
#   python3 tts.py nicw2-ru                       → out/nicw2-ru/tts.wav (голос Iapetus)
#   python3 tts.py nicw2-ru --voice Charon --model gemini-3.8-flash-tts
#   python3 tts.py --samples                      → пробы голосов на одной фразе (out/_voices/*.mp3 + все подряд)
# Дальше как с записью ElevenLabs: python3 voice.py nicw2-ru --audio out/nicw2-ru/tts.wav && VOICE=1 ./make6.sh nicw2-ru
#
# ElevenLabs (09.11, решение Андрея): python3 tts.py nicb-ru --el [--voice <id>] [--model eleven_v4]
#   Ключ — Network secret xi-api-key на api.elevenlabs.io (прокси подставляет сам). Голос по умолчанию — Max (EL_VOICE).
#   Голоса из общей библиотеки сначала добавить к себе: POST /v1/voices/add/<public_owner_id>/<voice_id>.
#
# Ключ — Network secret x-goog-api-key на generativelanguage.googleapis.com (прокси подставляет сам).
# Как задавать манеру: текст «Прочитай спокойно: …» модель читает вслух, systemInstruction у TTS выключен —
# работает только разметка «# AUDIO PROFILE … ### DIRECTOR'S NOTES … #### TRANSCRIPT» (читается только TRANSCRIPT).
# Каждая фраза ролика — отдельной строкой: на переносах голос делает паузу, по ним voice.py режет запись на фразы.
import base64, json, os, subprocess, sys, time
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from scripts import EPISODES, parse

API = 'https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent'
# лучшая первая; у каждой модели свой суточный лимит, кончился — следующая
MODELS = ['gemini-3.8-flash-tts', 'gemini-2.5-flash-preview-tts', 'gemini-3.1-flash-tts-preview', 'gemini-3.8-flash-lite-tts']
VOICE = 'Iapetus'  # «ясный» мужской; по высоте и ровности ближе всех к диктору «Что вы знаете о…»
MALE = ['Iapetus', 'Charon', 'Schedar', 'Algieba', 'Sadaltager', 'Algenib', 'Orus', 'Rasalgethi', 'Alnilam', 'Umbriel']

# Манера — как у диктора оригиналов: ровно, без эмоций, почти без пауз, ~2,4 слова в секунду (замер по 13 роликам)
BASE = ('Style: спокойный, ровный, уверенный мужской голос за кадром, чуть ироничный, без эмоций — шутка в серьёзной подаче, '
        'как у диктора ролика «Что вы знаете о Кока-Коле».\n'
        'Pace: размеренно, без спешки, но и без долгих пауз — около двух с половиной слов в секунду. '
        'Каждая строка — отдельная фраза, между строками короткая пауза.')
STYLE = {
    'nicw1': BASE + '\nТон: серьёзный документальный, будто раскрывает страшную тайну. «Совпадение?» — пауза — «Не думаю.» '
                    '«Тля не курит.» — сухо.',
    'nicw2': BASE + '\n«Тля выдохнула.» — с лёгкой улыбкой в голосе.',
    'nicw3': BASE + '\nНа «…и в баклажане?» — удивление. «Десять килограммов.» — после паузы, как шутка. '
                    'Последнюю строку не заканчивать: голос не опускать, она продолжается в начало ролика.',
}


def prompt(text, style):
    return ('# AUDIO PROFILE: Рассказчик\n## Голос за кадром короткого документального ролика\n'
            f"### DIRECTOR'S NOTES\n{style}\n#### TRANSCRIPT\n{text}")


def say(text, voice=VOICE, models=None, style=BASE):
    """→ (pcm int16 24 кГц, модель). Пробует модели по очереди: 429 (лимит) — сразу следующая, 5xx — ещё раз."""
    body = {'contents': [{'parts': [{'text': prompt(text, style)}]}],
            'generationConfig': {'responseModalities': ['AUDIO'],
                                 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}
    last = ''
    for m in models or MODELS:
        for a in range(4):
            try:
                r = requests.post(API.format(m), headers={'x-goog-api-key': 'proxy-injected'}, json=body, timeout=600)
            except requests.RequestException as e:
                last = str(e); time.sleep(5 + 5 * a); continue
            if r.status_code == 429:
                last = f'{m}: суточный лимит'; break
            if r.status_code != 200:
                last = f'{m}: {r.status_code} {r.text[:160]}'; time.sleep(5 + 5 * a); continue
            try:
                d = base64.b64decode(r.json()['candidates'][0]['content']['parts'][0]['inlineData']['data'])
            except (KeyError, IndexError, ValueError):
                last = f'{m}: пустой ответ'; time.sleep(3); continue
            return (d[44:] if d[:4] == b'RIFF' else d), m
        print('  ', last, file=sys.stderr)
    sys.exit('не озвучилось: ' + last)


EL_VOICE = {'ru': '2OdNfs9Z4GCMvoFiCavC',  # Max — Clear, Engaging and Professional (выбрал Андрей; цена ×2 за символ)
            'de': 'xQSqobBprMpWWqHzx3I4',  # Christian — лучший немецкий на пробе 09.11 (Gemini: 9.5/10)
            'en': 'WTUK291rZZ9CLPCiFTfh'}  # Mark
EL_SET = {'stability': .55, 'similarity_boost': .75}


def el_text(ep, L, tags=True):
    """Текст для синтеза: режиссёрские пометки по фразам (scripts.DIRECT) и ударения (scripts.SAY). На экран это не попадает.
    tags=False — без пометок (модели multilingual/turbo/flash читают их вслух; у v4 без пометок голос ровнее и «живее»)."""
    import re
    import scripts
    d, rep = (getattr(scripts, 'DIRECT', {}).get(ep, {}) if tags else {}), getattr(scripts, 'SAY', {}).get(ep, {})
    out = []
    for i, t in enumerate(L):
        for x, y in rep.items():
            t = re.sub(rf'(?<!\w){re.escape(x)}(?!\w)', y, t)
        out.append((d[i] + ' ' if i in d else '') + t)
    return '\n'.join(out)


def el_say(text, voice, lang, model='eleven_v4', stab=None, seed=None, extra=None):
    """→ mp3 (байты) ElevenLabs. Повтор при 5xx/сети. extra — ещё настройки голоса (style, speed — только у multilingual/turbo)."""
    body = {'text': text, 'model_id': model, 'language_code': lang, 'voice_settings': dict(EL_SET, **({'stability': stab} if stab is not None else {}), **(extra or {}))}
    if seed is not None:
        body['seed'] = seed
    last = ''
    for a in range(4):
        try:
            r = requests.post(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_192',
                              headers={'xi-api-key': 'proxy-injected'}, json=body, timeout=600)
        except requests.RequestException as e:
            last = str(e); time.sleep(5 + 5 * a); continue
        if r.status_code == 200:
            return r.content
        last = f'{r.status_code} {r.text[:200]}'
        if r.status_code < 500:
            break
        time.sleep(5 + 5 * a)
    sys.exit('ElevenLabs: ' + last)


TEMPO = float(os.environ.get('TEMPO', '1.06'))  # Gemini говорит на ~6 % медленнее диктора оригиналов — ускоряем без смены высоты


def save(pcm, dst, tempo=1.0):
    raw = dst + '.raw'
    open(raw, 'wb').write(pcm)
    af = ['-af', f'rubberband=tempo={tempo}'] if abs(tempo - 1) > 1e-3 else []
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', raw] + af + [dst], check=True)
    os.remove(raw)


def lines(ep):
    """Текст ролика так, как говорить: фраза на строку, числа словами (из разметки {1690|тысяча шестьсот …})."""
    return [parse(s)[0].lstrip('.… ') for _, s in EPISODES[ep]]


def main():
    a = sys.argv[1:]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    voice, model = opt('--voice', VOICE), opt('--model')
    models = [model] if model else None
    if '--samples' in a:
        out = os.path.join(HERE, 'out', '_voices'); os.makedirs(out, exist_ok=True)
        text = '\n'.join(lines('nicw2-ru')[:4])
        files = []
        for v in (opt('--voices', '') or ','.join(MALE[:6])).split(','):
            pcm, m = say(text, v, models)
            f = os.path.join(out, f'{v}.mp3'); save(pcm, f); files.append(f)
            print(v, m, f)
        return
    vals = {a[i + 1] for i, x in enumerate(a[:-1]) if x in ('--voice', '--model', '--stab', '--seed', '--voices', '--tempo', '--style', '--speed')}
    for ep in [x for x in a if not x.startswith('--') and x not in vals]:
        out = os.path.join(HERE, 'out', ep); os.makedirs(out, exist_ok=True)
        L = lines(ep)
        if '--el' in a:
            lang = ep.rsplit('-', 1)[1]; v = opt('--voice', EL_VOICE[lang]); m = model or 'eleven_v4'
            stab, seed = opt('--stab'), opt('--seed')
            tags = '--notags' not in a and m in ('eleven_v3', 'eleven_v4')
            extra = {k: float(opt('--' + k)) for k in ('style', 'speed') if opt('--' + k)}
            mp3 = os.path.join(out, 'tts.mp3'); open(mp3, 'wb').write(el_say(el_text(ep, L, tags), v, lang, m, float(stab) if stab else None, int(seed) if seed else None, extra))
            dst = os.path.join(out, 'tts.wav')
            tempo = float(opt('--tempo', '1'))  # чуть быстрее без смены высоты (у оригиналов 2,0–2,6 слова в секунду)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3] + (['-af', f'rubberband=tempo={tempo}'] if abs(tempo - 1) > 1e-3 else []) + ['-ac', '1', '-ar', '24000', dst], check=True)
            json.dump({'engine': 'elevenlabs', 'voice': v, 'model': m, 'settings': EL_SET, 'lines': L}, open(os.path.join(out, 'tts.json'), 'w'), ensure_ascii=False, indent=1)
            print(ep, 'ElevenLabs', v, m, '→', dst)
            continue
        pcm, m = say('\n'.join(L), voice, models, STYLE.get(ep.rsplit('-', 1)[0], BASE))
        open(os.path.join(out, 'tts.raw.pcm'), 'wb').write(pcm)  # как пришло — пересобрать с другим темпом без запроса
        dst = os.path.join(out, 'tts.wav'); save(pcm, dst, TEMPO)
        json.dump({'voice': voice, 'model': m, 'lines': L}, open(os.path.join(out, 'tts.json'), 'w'), ensure_ascii=False, indent=1)
        print(ep, voice, m, f'{len(pcm) / 48000 / TEMPO:.1f} с →', dst)


if __name__ == '__main__':
    main()
