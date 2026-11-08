# Звук роликов v2: своя музыка (синтез — чужих прав нет) + эффекты по таймлайну → tt_audio.master → out/<ep>/mix.wav
#   python3 audio.py mrbeast-en nicotine-ru …
# Музыка «загадка»: минор, щипковое арпеджио; до «But did you know» — тихо (пэд + арпеджио), после — бас и бит.
import json, os, subprocess, sys
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import tt_audio

SND = os.path.join(HERE, '..', 'snd', 'kino')
EPB = ''
SR = 48000
KEYS = {'mrbeast': 57, 'nicotine': 52, 'aids': 50, 'meph': 54, 'nicstory': 55, 'aidsmyth': 53, 'mephnight': 49, 'energy': 56}  # тоника
BPM = {'mephnight': 116, 'energy': 104, 'aidsmyth': 100}
# когда входит бит (сцена-поворот) и когда уходит; удары — на каких сценах
TURN = {'nicstory': 'd1', 'aidsmyth': 'm1f', 'mephnight': 't1115'}
STOP = {'mephnight': 'sun', 'nicstory': 'quit'}
BOOM = {'aidsmyth': ['m1f', 'm2f', 'm3f', 'm4f', 'true'], 'nicstory': ['flip'], 'mephnight': ['sun']}


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def fm(f, dur, idx=1.4, dec=3.0, att=400):
    t = np.arange(int(dur * SR)) / SR
    env = np.exp(-t * dec) * (1 - np.exp(-t * att))
    return np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * f * t) * idx * np.exp(-t * 4)) * env


def lp(x, hi=None, lo=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); g = np.ones_like(f)
    if hi: g *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo: g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X * g, len(x))


def put(buf, x, t, g=1.0, pan=0.0):
    s = int(t * SR)
    if s >= len(buf) or s + len(x) <= 0 or s < 0:
        return
    x = x[: len(buf) - s]
    buf[s:s + len(x), 0] += x * g * np.sqrt(1 - pan)
    buf[s:s + len(x), 1] += x * g * np.sqrt(1 + pan)


def load(name):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(SND, name + '.mp3'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                       capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).astype(np.float64)


def scenes(T):
    SC = []
    for s in T['sent']:
        if SC and SC[-1]['key'] == s['scene']:
            SC[-1]['sents'].append(s); SC[-1]['words'] += s['words']
        else:
            SC.append({'key': s['scene'], 'sents': [s], 'words': list(s['words'])})
    for i, s in enumerate(SC):
        s['a'] = s['sents'][0]['a'] - .22 if i else 0
    return SC


def music(ep, DUR, t_claim, rng, t_stop=1e9):
    N = int((DUR + 1) * SR)
    m = np.zeros((N, 2))
    root = KEYS.get(ep, 57)
    bpm = BPM.get(ep, 96); beat = 60 / bpm; bar = beat * 4
    # i – VI – iv – V (гармонический минор: тревожно, «тайна»)
    CH = [[0, 3, 7, 12], [-4, 0, 3, 8], [-7, -4, 0, 5], [-5, -1, 2, 7]]
    nb = int(DUR / bar) + 2
    tb = np.arange(int(bar * SR)) / SR
    for b in range(nb):
        t0 = b * bar; ch = CH[b % 4]; full = t_claim - .05 <= t0 < t_stop - .05
        env = np.minimum(1, tb / .6) * np.minimum(1, (bar - tb) / .5)
        pad = np.zeros_like(tb)
        for n in ch[:3]:
            f = midi(root + n)
            for d in (-.003, .003):
                pad += np.sin(2 * np.pi * f * (1 + d) * tb + rng.random() * 6.28)
        put(m, lp(pad * env * .02, hi=2200), t0, 1, -.2); put(m, lp(pad * env * .02, hi=2200), t0 + .015, 1, .2)
        # арпеджио шестнадцатыми — щипок
        for e in range(16):
            n = ch[[0, 1, 2, 3, 2, 1, 2, 3][e % 8]] + 12 + (12 if e % 8 == 3 else 0)
            v = (.045 if full else .035) * (1.0 if e % 4 == 0 else .7)
            put(m, fm(midi(root + n), .5, idx=1.1, dec=7) * v, t0 + e * beat / 4, 1, (.35 if e % 2 else -.35))
        if full:
            for k in range(4):
                bt = t0 + k * beat
                # бас
                if k in (0, 2):
                    put(m, lp(fm(midi(root - 12 + ch[0]), beat * 1.8, idx=.5, dec=1.6), hi=900) * .2, bt)
                # бочка
                if k in (0, 2):
                    tt = np.arange(int(.32 * SR)) / SR
                    f = 48 + 90 * np.exp(-tt * 30)
                    put(m, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 10) * .3, bt)
                # хлопок
                if k in (1, 3):
                    tt = np.arange(int(.2 * SR)) / SR
                    put(m, lp(rng.standard_normal(len(tt)), hi=4500, lo=900) * np.exp(-tt * 26) * .06, bt, 1, .1)
                # хэты
                for h in (0, .5):
                    tt = np.arange(int(.05 * SR)) / SR
                    put(m, lp(rng.standard_normal(len(tt)), lo=7000) * np.exp(-tt * 80) * .025, bt + h * beat, 1, .3)
    fi = np.minimum(1, np.arange(N) / (SR * .2))
    fo = np.clip((DUR + .4 - np.arange(N) / SR) / 1.2, 0, 1)
    m *= (fi * fo)[:, None]
    m /= np.max(np.abs(m)) / .7
    return m


def sfx(T, SC, DUR, rng):
    N = int((DUR + 1) * SR)
    x = np.zeros((N, 2))
    W, SEL, REW, TICK = load('whoosh'), load('sel'), load('reward'), load('tick')
    for s in SC[1:]:
        put(x, W, s['a'] - .05, .22)
    # «удар» на «But did you know» — главный поворот
    for cl in [s for s in SC if s['key'] in BOOM.get(EPB, ['claim'])]:
        tt = np.arange(int(1.6 * SR)) / SR
        boom = np.sin(2 * np.pi * np.cumsum(38 + 50 * np.exp(-tt * 5)) / SR) * np.exp(-tt * 2.2) * .5
        put(x, boom, cl['a'] + .15)
        put(x, lp(rng.standard_normal(len(tt)), hi=1800) * np.exp(-tt * 3) * .05, cl['a'] + .15)
    # щелчок на каждом выделенном слове
    last = -1
    for s in T['sent']:
        for w in s['words']:
            if w['c'] and w['a'] - last > .25:
                put(x, SEL, w['a'], .2 if w['c'] == 'y' else .26, (rng.random() - .5) * .4)
                last = w['a']
    put(x, REW, SC[-1]['a'] + .6, .2)
    return x * .9


def main(ep):
    global EPB
    EPB = ep.rsplit('-', 1)[0]
    out = os.path.join(HERE, 'out', ep)
    T = json.load(open(os.path.join(out, 'timeline.json')))
    DUR = T['dur']; SC = scenes(T); rng = np.random.default_rng(11)
    t_claim = next((s['a'] for s in SC if s['key'] == TURN.get(EPB, 'claim')), 0)
    t_stop = next((s['a'] for s in SC if s['key'] == STOP.get(EPB)), 1e9)
    sf.write(os.path.join(out, 'music.wav'), music(EPB, DUR, t_claim, rng, t_stop).astype(np.float32), SR)
    sf.write(os.path.join(out, 'sfx.wav'), sfx(T, SC, DUR, rng).astype(np.float32), SR)
    tt_audio.BED_DB = -16
    tt_audio.master(os.path.join(out, 'voice.wav'), os.path.join(out, 'mix.wav'), DUR,
                    bed=os.path.join(out, 'music.wav'), extra=os.path.join(out, 'sfx.wav'))
    print(ep, 'mix', tt_audio.report(os.path.join(out, 'mix.wav')))


if __name__ == '__main__':
    for ep in sys.argv[1:]:
        main(ep)
