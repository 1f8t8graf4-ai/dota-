# Озвучка (Kokoro, офлайн, Apache 2.0) + время каждого слова (Vosk) → out/<ep>/voice.wav, timeline.json
#   python3 build_voice.py mrbeast
# Основа — nightfabel/build_voice.py (ветка claude/peaceful-archimedes-h3otfg).
import json, os, sys
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
from wt_vosk import align
from scripts import EPISODES, parse

M = os.path.join(HERE, 'models')
VOICE = os.environ.get('WD_VOICE', 'af_heart')
SPEED = float(os.environ.get('WD_SPEED', '0.95'))
GAP_IN, GAP_SCENE = 0.16, 0.30


def trim(x, sr, thr=0.012, pad=0.03):
    a = np.abs(x)
    idx = np.where(a > thr)[0]
    if not len(idx):
        return x
    s = max(0, idx[0] - int(pad * sr))
    e = min(len(x), idx[-1] + int(pad * sr * 2))
    return x[s:e]


def main(ep):
    from kokoro_onnx import Kokoro
    S = EPISODES[ep]
    out = os.path.join(HERE, 'out', ep)
    os.makedirs(out, exist_ok=True)
    k = Kokoro(os.path.join(M, 'kokoro-v1.0.onnx'), os.path.join(M, 'voices-v1.0.bin'))
    sr = None
    parts, T = [], []
    t = 0.15
    prev = None
    for i, (scene, s) in enumerate(S):
        text, toks = parse(s)
        # «...Yet.» — Kokoro не любит начало с многоточия
        say = text.lstrip('.… ')
        x, sr = k.create(say, voice=VOICE, speed=SPEED, lang='en-us')
        x = trim(np.asarray(x, dtype=np.float32), sr)
        if prev is not None:
            t += GAP_SCENE if scene != prev else GAP_IN
            if text.startswith('...'):
                t += 0.45
        wav = os.path.join(out, f's{i:02d}.wav')
        sf.write(wav, x, sr)
        W, q = align(os.path.join(M, 'vosk-en'), wav, say)
        j, words = 0, []
        for tk in toks:
            n = len(tk['sp'])
            seg = W[j:j + n]
            j += n
            if not seg:
                seg = [W[-1]]
            words.append({'d': tk['d'], 'c': tk['c'], 'a': round(t + seg[0][0], 3), 'b': round(t + seg[-1][1], 3)})
        T.append({'i': i, 'scene': scene, 'a': round(t, 3), 'b': round(t + len(x) / sr, 3), 'q': round(q, 2),
                  'text': text, 'words': words})
        parts.append((t, x))
        print(f'{i:02d} {scene:9s} {t:6.2f}–{t + len(x) / sr:6.2f}  совпало {q:.0%}  {text}')
        t += len(x) / sr
        prev = scene
    total = t + 1.0
    y = np.zeros(int(total * sr), dtype=np.float32)
    for a, x in parts:
        s = int(a * sr)
        y[s:s + len(x)] += x
    sf.write(os.path.join(out, 'voice.wav'), y, sr)
    hop = sr // 30
    env = [float(np.sqrt(np.mean(y[i:i + hop] ** 2))) for i in range(0, len(y), hop)]
    mx = max(env) or 1
    json.dump({'ep': ep, 'dur': round(total, 3), 'fps': 30, 'voice': VOICE, 'speed': SPEED, 'sent': T,
               'env': [round(min(1, e / mx * 1.8), 3) for e in env]},
              open(os.path.join(out, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(ep, 'итого', round(total, 2), 'с')


if __name__ == '__main__':
    for ep in sys.argv[1:] or EPISODES:
        main(ep)
