# Голос ролика нейросетью — Gemini TTS (09.11). Бесплатно: 10 запросов в сутки на каждую модель, ролик = 1 запрос.
#   python3 tts.py nicw2-ru                       → out/nicw2-ru/tts.wav (голос Iapetus)
#   python3 tts.py nicw2-ru --voice Charon --model gemini-3.8-flash-tts
#   python3 tts.py --samples                      → пробы голосов на одной фразе (out/_voices/*.mp3 + все подряд)
# Дальше как с записью ElevenLabs: python3 voice.py nicw2-ru --audio out/nicw2-ru/tts.wav && VOICE=1 ./make6.sh nicw2-ru
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
    for ep in [x for x in a if not x.startswith('--') and x not in (voice, model)]:
        out = os.path.join(HERE, 'out', ep); os.makedirs(out, exist_ok=True)
        L = lines(ep)
        pcm, m = say('\n'.join(L), voice, models, STYLE.get(ep.rsplit('-', 1)[0], BASE))
        open(os.path.join(out, 'tts.raw.pcm'), 'wb').write(pcm)  # как пришло — пересобрать с другим темпом без запроса
        dst = os.path.join(out, 'tts.wav'); save(pcm, dst, TEMPO)
        json.dump({'voice': voice, 'model': m, 'lines': L}, open(os.path.join(out, 'tts.json'), 'w'), ensure_ascii=False, indent=1)
        print(ep, voice, m, f'{len(pcm) / 48000 / TEMPO:.1f} с →', dst)


if __name__ == '__main__':
    main()
