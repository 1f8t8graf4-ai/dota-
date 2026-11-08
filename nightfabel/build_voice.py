# Озвучка (Kokoro, офлайн) + время каждого слова (Vosk) → voice.wav, timeline.json
import json, os, subprocess, sys
import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
from wt_vosk import align
from script import S, parse

HERE = os.path.dirname(os.path.abspath(__file__))
M = os.path.join(HERE, 'models')
VOICE = os.environ.get('NF_VOICE', 'af_heart')
SPEED = float(os.environ.get('NF_SPEED', '1.06'))
GAP_IN, GAP_SCENE = 0.12, 0.24
OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)


def trim(x, sr, thr=0.012, pad=0.03):
    a = np.abs(x)
    idx = np.where(a > thr)[0]
    if not len(idx):
        return x
    s = max(0, idx[0] - int(pad * sr))
    e = min(len(x), idx[-1] + int(pad * sr * 2))
    return x[s:e]


def main():
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(M, 'kokoro-v1.0.onnx'), os.path.join(M, 'voices-v1.0.bin'))
    sr = None
    parts, T = [], []
    t = 0.25                      # секунда-две тишины в начале ролика не нужны: 0,25 с на «вдох»
    prev = None
    for i, (scene, s) in enumerate(S):
        text, toks = parse(s)
        x, sr = k.create(text, voice=VOICE, speed=SPEED, lang='en-us')
        x = trim(np.asarray(x, dtype=np.float32), sr)
        if prev is not None:
            t += GAP_SCENE if scene != prev else GAP_IN
        wav = os.path.join(OUT, f's{i:02d}.wav')
        sf.write(wav, x, sr)
        W, q = align(os.path.join(M, 'vosk-en'), wav, text)
        # W — по словам озвучки (без «—»); раскладываем на слова показа
        j, words = 0, []
        for tk in toks:
            n = len(tk['sp'])
            seg = W[j:j + n]
            j += n
            words.append({'d': tk['d'], 'c': tk['c'], 'a': round(t + seg[0][0], 3), 'b': round(t + seg[-1][1], 3)})
        T.append({'i': i, 'scene': scene, 'a': round(t, 3), 'b': round(t + len(x) / sr, 3), 'q': round(q, 2),
                  'text': text, 'words': words})
        parts.append((t, x))
        print(f'{i:02d} {scene:8s} {t:6.2f}–{t + len(x) / sr:6.2f}  совпало {q:.0%}  {text}')
        t += len(x) / sr
        prev = scene
    total = t + 1.2
    y = np.zeros(int(total * sr), dtype=np.float32)
    for a, x in parts:
        s = int(a * sr)
        y[s:s + len(x)] += x
    sf.write(os.path.join(OUT, 'voice.wav'), y, sr)
    # огибающая голоса 30 к/с — клюв совы
    hop = sr // 30
    env = [float(np.sqrt(np.mean(y[i:i + hop] ** 2))) for i in range(0, len(y), hop)]
    mx = max(env) or 1
    json.dump({'dur': round(total, 3), 'fps': 30, 'voice': VOICE, 'sent': T,
               'env': [round(min(1, e / mx * 1.8), 3) for e in env]},
              open(os.path.join(OUT, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print('итого', round(total, 2), 'с')


if __name__ == '__main__':
    main()
