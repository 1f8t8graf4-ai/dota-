# Озвучка → out/<ep>-<lang>/voice.wav + timeline.json (время каждого слова).
#   python3 voice.py mrbeast-en nicotine-ru …        (без аргументов — все)
#   EN: Kokoro af_heart (Apache 2.0), время слов — Vosk (../tools/wt_vosk.py).
#   RU: Piper ru_RU-dmitri-medium (MIT, датасет CC0), время слов — по слогам внутри фразы.
#   Свой голос (ElevenLabs): python3 voice.py nicotine-ru --audio eleven.mp3 — режет запись по паузам на фразы,
#   число фраз должно совпасть со scripts.py (иначе подскажет, где расходится).
import json, os, re, sys
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from scripts import EPISODES, parse

M = '/home/user/wdyk/models' if os.path.isdir('/home/user/wdyk/models') else os.path.join(HERE, 'models')
VOICE = os.environ.get('SV_VOICE', 'af_heart')
SPEED = float(os.environ.get('SV_SPEED', '0.95'))
GAP_IN, GAP_SCENE = 0.16, 0.30
SR = 24000


def trim(x, sr, thr=0.012, pad=0.03):
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    return x[max(0, idx[0] - int(pad * sr)):min(len(x), idx[-1] + int(pad * sr * 2))]


def resample(x, sr):
    if sr == SR:
        return x
    n = int(len(x) * SR / sr)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)


VOW = re.compile(r'[aeiouyаеёиоуыэюя]', re.I)


def by_syllables(toks, dur, t0):
    """Время слов внутри фразы — пропорционально слогам (+ паузы на знаках)."""
    w = []
    for tk in toks:
        sp = ' '.join(tk['sp'])
        v = max(1, len(VOW.findall(sp))) + 0.3
        p = 1.2 if re.search(r'[.!?…]$', sp) else 0.7 if re.search(r'[,:;—]$', sp) else 0
        w.append((v, p))
    tot = sum(a + b for a, b in w) or 1
    k = (dur - 0.05) / tot
    out, t = [], t0 + 0.03
    for tk, (v, p) in zip(toks, w):
        out.append({'d': tk['d'], 'c': tk['c'], 'a': round(t, 3), 'b': round(t + v * k, 3)})
        t += (v + p) * k
    return out


class Synth:
    def __init__(self, lang):
        self.lang = lang
        if lang == 'en':
            from kokoro_onnx import Kokoro
            self.k = Kokoro(os.path.join(M, 'kokoro-v1.0.onnx'), os.path.join(M, 'voices-v1.0.bin'))
        else:
            from piper import PiperVoice, SynthesisConfig
            d = os.path.join(M, 'piper', 'vits-piper-ru_RU-dmitri-medium')
            self.p = PiperVoice.load(os.path.join(d, 'ru_RU-dmitri-medium.onnx'),
                                     config_path=os.path.join(d, 'ru_RU-dmitri-medium.onnx.json'))
            self.cfg = SynthesisConfig(length_scale=float(os.environ.get('SV_LEN', '1.06')), noise_scale=0.6, noise_w_scale=0.7)

    def __call__(self, text):
        if self.lang == 'en':
            x, sr = self.k.create(text, voice=VOICE, speed=SPEED, lang='en-us')
            return resample(np.asarray(x, dtype=np.float32), sr)
        ch = list(self.p.synthesize(text, syn_config=self.cfg))
        x = np.concatenate([c.audio_float_array for c in ch]).astype(np.float32)
        return resample(x, ch[0].sample_rate)


def split_audio(path, n):
    """Своя запись → n фраз по самым длинным паузам."""
    import subprocess
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    y = np.frombuffer(raw, dtype=np.float32)
    hop = SR // 100
    e = np.array([np.sqrt(np.mean(y[i:i + hop] ** 2)) for i in range(0, len(y) - hop, hop)])
    on = e > max(0.006, np.percentile(e, 60) * 0.18)
    gaps, i = [], 0
    while i < len(on):
        if not on[i]:
            j = i
            while j < len(on) and not on[j]:
                j += 1
            if i > 0 and j < len(on):
                gaps.append((j - i, i, j))
            i = j
        else:
            i += 1
    cut = sorted(sorted(gaps, reverse=True)[:n - 1], key=lambda g: g[1])
    if len(cut) < n - 1:
        sys.exit(f'в записи нашлось {len(cut) + 1} фраз, а в тексте {n}')
    pts = [0] + [((a + b) // 2) * hop for _, a, b in cut] + [len(y)]
    return [trim(y[pts[i]:pts[i + 1]], SR) for i in range(n)]


def main(ep, audio=None):
    lang = ep.rsplit('-', 1)[1]
    L = EPISODES[ep]
    out = os.path.join(HERE, 'out', ep)
    os.makedirs(out, exist_ok=True)
    clips = split_audio(audio, len(L)) if audio else None
    syn = None if clips else Synth(lang)
    if lang == 'en':
        from wt_vosk import align
    parts, T, t, prev = [], [], 0.15, None
    for i, (scene, s) in enumerate(L):
        text, toks = parse(s)
        say = text.lstrip('.… ')
        x = clips[i] if clips else trim(syn(say), SR)
        if prev is not None:
            t += GAP_SCENE if scene != prev else GAP_IN
        dur = len(x) / SR
        q = 1.0
        if lang == 'en':
            wav = os.path.join(out, f's{i:02d}.wav')
            sf.write(wav, x, SR)
            W, q = align(os.path.join(M, 'vosk-en'), wav, say)
            j, words = 0, []
            for tk in toks:
                seg = W[j:j + len(tk['sp'])] or [W[-1]]
                j += len(tk['sp'])
                words.append({'d': tk['d'], 'c': tk['c'], 'a': round(t + seg[0][0], 3), 'b': round(t + seg[-1][1], 3)})
        else:
            words = by_syllables(toks, dur, t)
        T.append({'i': i, 'scene': scene, 'a': round(t, 3), 'b': round(t + dur, 3), 'q': round(q, 2), 'text': text, 'words': words})
        parts.append((t, x))
        print(f'{i:02d} {scene:8s} {t:6.2f}–{t + dur:6.2f} {q:4.0%} {text}')
        t += dur
        prev = scene
    total = t + 1.2
    y = np.zeros(int(total * SR), dtype=np.float32)
    for a, x in parts:
        s0 = int(a * SR)
        y[s0:s0 + len(x)] += x
    pk = np.max(np.abs(y)) or 1
    y = y / pk * 0.9
    sf.write(os.path.join(out, 'voice.wav'), y, SR)
    hop = SR // 30
    env = [float(np.sqrt(np.mean(y[i:i + hop] ** 2))) for i in range(0, len(y), hop)]
    mx = max(env) or 1
    json.dump({'ep': ep, 'lang': lang, 'dur': round(total, 3), 'fps': 30, 'voice': 'own' if audio else (VOICE if lang == 'en' else 'piper-dmitri'),
               'sent': T, 'env': [round(min(1, e / mx * 1.8), 3) for e in env]},
              open(os.path.join(out, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(ep, 'итого', round(total, 2), 'с')


if __name__ == '__main__':
    a = sys.argv[1:]
    audio = None
    if '--audio' in a:
        k = a.index('--audio')
        audio = a[k + 1]
        a = a[:k] + a[k + 2:]
    for ep in a or EPISODES:
        main(ep, audio)
