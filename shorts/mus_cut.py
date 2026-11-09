# Музыка под тайминг ролика: куски одного трека переставляются по тактам и склеиваются коротким наплывом.
#   python3 mus_cut.py nics          → music/nics.mp3 из music/nics-raw.mp3 по плану CUTS['nics']
#   План: [начало в исходнике, конец в исходнике, куда ставим в ролике, громкость, наплыв в начале (с)]
import subprocess, sys, os, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
BAR = 4 * 60 / 112  # 112 BPM
D, HIT = 17.15, 68.57  # nics-raw: вход баса (сильная доля) и удар после провала
T_MEMO, T_HOME = 11.47, 65.70  # в ролике: «секретная записка» и «домой»
CUTS = {'nics': [
    (D - T_MEMO, D, 0.0, 1.55, .3),                                  # вступление → до записки (тише грува — подтянуть)
    (D, D + 12 * BAR, T_MEMO, 1.0, .04),                              # грув
    (D + 8 * BAR, D + 12 * BAR, T_MEMO + 12 * BAR, 1.0, .04),         # +4 такта (повтор), чтобы удар пришёлся на «домой»
    (D + 12 * BAR, D + 12 * BAR + (T_HOME - T_MEMO - 16 * BAR), T_MEMO + 16 * BAR, 1.0, .04),  # грув до самого «домой»
    (HIT - .02, HIT + 11.5, T_HOME - .02, 1.0, .03),                  # удар и хвост
    (.5, 13.0, T_HOME + 2.2, 1.5, 1.6),                               # финал: пульсация вступления (как в начале)
]}


def load(f):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, 2).astype(np.float64)


def main(ep, dur=None):
    x = load(os.path.join(HERE, 'music', ep + '-raw.mp3'))
    plan = CUTS[ep]
    end = max(c[2] + (c[1] - c[0]) for c in plan) + .5
    y = np.zeros((int(end * SR), 2))
    for a, b, at, g0, fd in plan:
        seg = x[int(a * SR):int(b * SR)].copy() * g0
        n = int(fd * SR)
        if n:
            seg[:n] *= np.sqrt(np.linspace(0, 1, n))[:, None]
        m = int(.03 * SR)
        seg[-m:] *= np.sqrt(np.linspace(1, 0, m))[:, None]
        i = int(at * SR)
        y[i:i + len(seg)] += seg[:len(y) - i]
    if dur:
        y = y[:int((dur + .5) * SR)]
        f = int(1.2 * SR); y[-f:] *= np.linspace(1, 0, f)[:, None]
    tmp = os.path.join(HERE, 'music', ep + '.wav')
    import soundfile as sf
    sf.write(tmp, (y / (np.max(np.abs(y)) or 1) * .9).astype(np.float32), SR)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-b:a', '192k', os.path.join(HERE, 'music', ep + '.mp3')], check=True)
    os.remove(tmp)
    print(ep, 'музыка', round(len(y) / SR, 2), 'с →', f'music/{ep}.mp3')


if __name__ == '__main__':
    main(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else None)
