# Звук ролика: своя музыка (синтез, без чужих прав) + эффекты по таймлайну → master (tt_audio) → final.mp4
import json, os, re, subprocess, sys
import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tools'))
import tt_audio

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
SND = os.path.join(HERE, '..', 'snd', 'kino')
SR = 48000
T = json.load(open(os.path.join(OUT, 'timeline.json')))
DUR = T['dur']
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)


# ---------- сцены и подсказки — как в stage.html ----------
SC = []
for s in T['sent']:
    if SC and SC[-1]['key'] == s['scene']:
        SC[-1]['sents'].append(s); SC[-1]['words'] += s['words']
    else:
        SC.append({'key': s['scene'], 'sents': [s], 'words': list(s['words'])})
for i, s in enumerate(SC):
    s['a'] = s['sents'][0]['a'] - .2 if i else 0
    s['b'] = SC[i + 1]['sents'][0]['a'] - .2 if i < len(SC) - 1 else DUR
SCN = {s['key']: s for s in SC}


def cue(key, w, n=0):
    S, k, m = SCN[key], w.lower(), 0
    for x in S['words']:
        d = re.sub(r"[^a-z0-9%×+–'-]", '', x['d'].lower())
        if d.startswith(k):
            if m == n:
                return x['a']
            m += 1
    return S['a']


# ---------- помощники ----------
def tone_fm(f, dur, idx=1.6, dec=1.8):
    t = np.arange(int(dur * SR)) / SR
    env = np.exp(-t * dec) * (1 - np.exp(-t * 400))
    m = np.sin(2 * np.pi * f * t) * idx * np.exp(-t * 3.5)
    return np.sin(2 * np.pi * f * t + m) * env


def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        g *= 1 / np.sqrt(1 + (f / hi) ** 4)
    return np.fft.irfft(X * g, len(x))


def put(buf, x, t, g=1.0, pan=0.0):
    s = int(t * SR)
    if s >= len(buf) or s + len(x) <= 0:
        return
    x = x[: len(buf) - s]
    L, R = g * np.sqrt((1 - pan) / 2) * np.sqrt(2), g * np.sqrt((1 + pan) / 2) * np.sqrt(2)
    buf[s:s + len(x), 0] += x * L
    buf[s:s + len(x), 1] += x * R


def load(name):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(SND, name + '.mp3'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                       capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).astype(np.float64)


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


# ---------- музыка ----------
def music():
    bpm, sw = 88, .57
    beat = 60 / bpm
    bar = beat * 4
    CH = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [52, 55, 59, 62]]   # Am7 Fmaj7 C(add) Em7
    BASS = [45, 41, 36, 40]
    m = np.zeros((N, 2))
    # где барабаны молчат: тревога и психоз — только пэд и бас
    quiet = [(SCN['anx']['a'], SCN['anx']['b']), (SCN['psych']['a'], SCN['psych']['b'])]

    def dg(t):
        for a, b in quiet:
            if a - .25 <= t <= b + .1:
                return 0.0
        return 1.0
    nb = int(DUR / bar) + 2
    t_bar = np.arange(int(bar * SR)) / SR
    for b in range(nb):
        t0 = b * bar
        ch = CH[b % 4]
        # пэд: мягкие синусы с расстройкой, медленная атака
        env = np.minimum(1, t_bar / .45) * np.minimum(1, (bar - t_bar) / .35 + .0)
        pad = np.zeros_like(t_bar)
        for n in ch:
            f = midi(n)
            for d in (-.004, 0, .004):
                pad += np.sin(2 * np.pi * f * (1 + d) * t_bar + rng.random() * 6.28)
        pad *= env * .028 * (1 + .12 * np.sin(2 * np.pi * .5 * t_bar))
        put(m, pad, t0, 1, -.15); put(m, pad, t0 + .012, 1, .15)
        # бас
        for k in (0, 2):
            bt = t0 + k * beat
            x = tone_fm(midi(BASS[b % 4]), beat * 1.9, idx=.6, dec=1.4) * .22
            put(m, x, bt)
        # электропиано: восьмые с качем
        pat = [0, 2, 1, 3, 2, 1, 3, 2]
        for e in range(8):
            off = (e // 2) * beat + (e % 2) * beat * sw * 2 * .5 * 2 * .5 * 2
            off = (e // 2) * beat + (beat * sw if e % 2 else 0)
            if rng.random() < .18:
                continue
            n = ch[pat[e]] + 12
            v = .06 + .03 * rng.random()
            put(m, tone_fm(midi(n), .9, idx=1.3, dec=3.2) * v, t0 + off, 1, (rng.random() - .5) * .5)
        # барабаны
        for k in range(4):
            bt = t0 + k * beat
            g = dg(bt)
            if not g:
                continue
            if k in (0, 2) or (k == 1 and b % 2 == 1 and False):
                tt = np.arange(int(.35 * SR)) / SR
                f = 45 + 80 * np.exp(-tt * 28)
                kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * .34
                put(m, kick, bt)
            if k in (1, 3):
                tt = np.arange(int(.25 * SR)) / SR
                nz = rng.standard_normal(len(tt))
                sn = fft_filter(nz, lo=900, hi=5200) * np.exp(-tt * 22) * .07
                put(m, sn, bt, 1, .1)
            for h in (0, 1):
                ht = bt + (beat * sw if h else 0)
                tt = np.arange(int(.06 * SR)) / SR
                hh = fft_filter(rng.standard_normal(len(tt)), lo=7000) * np.exp(-tt * 70) * (.025 if h else .035)
                put(m, hh, ht, 1, .35)
    # винил: тихое шипение и редкие щелчки
    hiss = fft_filter(rng.standard_normal(N), lo=1500, hi=9000) * .004
    m[:, 0] += hiss; m[:, 1] += hiss
    for c in rng.uniform(0, DUR, int(DUR * 3)):
        put(m, np.array([.06, -.04, .02]) * rng.random(), c, 1, rng.uniform(-.6, .6))
    # мягкий вход и уход
    fi = np.minimum(1, np.arange(N) / (SR * .25))
    fo = np.clip((DUR + .3 - np.arange(N) / SR) / 1.2, 0, 1)
    m *= (fi * fo)[:, None]
    m = fft_filter(m[:, 0], hi=9500)[:, None] * [1, 0] + fft_filter(m[:, 1], hi=9500)[:, None] * [0, 1]
    m /= np.max(np.abs(m)) / .7
    return m


# ---------- эффекты ----------
def sfx():
    x = np.zeros((N, 2))
    W, SEL, TAP, TICK, GOOD, REW = load('whoosh'), load('sel'), load('tap'), load('tick'), load('good'), load('reward')
    for s in SC[1:]:
        put(x, W, s['a'] - .05, .24)
    pops = [('hook', 'weed'), ('brain', 'seconds'), ('brain', 'lungs'), ('brain', 'blood'), ('brain', 'brain'), ('bliss', 'pretends'),
            ('bliss', 'anandamide'), ('dopa', 'dopamine'), ('memory', 'hippocampus'), ('time', 'stretches'), ('time', 'forever'),
            ('eyes', 'widen'), ('eyes', 'red'), ('heart', '+20'), ('mouth', 'shuts'), ('munch', 'mice'), ('potency', '4%'),
            ('potency', '12%'), ('anx', 'anxiety'), ('anx', 'paranoia'), ('stay', 'hides'), ('stay', 'once'), ('stay', 'heavy'),
            ('outro', 'alcohol'), ('outro', 'energy')]
    for k, w in pops:
        put(x, SEL, cue(k, w), .26, (rng.random() - .5) * .4)
    for k, w in [('dopa', 'high'), ('potency', 'stronger'), ('teen', '4–7'), ('psych', '5×')]:
        put(x, GOOD, cue(k, w), .2)
    # хлопки ваты и еды
    for i in range(5):
        put(x, SEL, cue('mouth', 'cottonmouth') + i * .08, .18, (i - 2) * .2)
    for i in range(6):
        put(x, SEL, cue('munch', 'hunger') + .25 + i * .09, .2, (i - 2.5) * .15)
    # набор и стирание текста в пузыре
    a = SCN['forget']['a'] + .05
    for i in range(16):
        put(x, TAP, a + .7 * (i / 16), .14)
    a = cue('forget', 'saying') + .15
    for i in range(16):
        put(x, TAP, a + .45 * (i / 16), .1)
    # часы
    S = SCN['time']; st = cue('time', 'stretches'); t = S['a'] + .2
    while t < S['b'] - .1:
        put(x, TICK, t, .26)
        t += .5 if t < st else 1.1
    # сердце — в такт картинке: удар, когда floor(t*rate) растёт
    S = SCN['heart']; jump = cue('heart', 'jump')
    th = np.arange(int(.32 * SR)) / SR
    thump = fft_filter(np.sin(2 * np.pi * np.cumsum(60 + 110 * np.exp(-th * 30)) / SR) * np.exp(-th * 16), lo=85)
    prev = None
    for t in np.arange(S['a'], S['b'], 1 / 240):
        k = np.clip((t - jump) / 1.6, 0, 1); k = 4 * k ** 3 if k < .5 else 1 - (-2 * k + 2) ** 3 / 2
        rate = 1.25 + (2.1 - 1.25) * k
        f = int(np.floor(t * rate))
        if prev is not None and f != prev:
            put(x, thump, t, .09); put(x, thump, t + .2 / rate * 1.2, .06)
        prev = f
    # подписка
    put(x, REW, cue('outro', 'drinks') + .45, .22)
    return x * .85


def main():
    sf.write(os.path.join(OUT, 'music.wav'), music().astype(np.float32), SR)
    sf.write(os.path.join(OUT, 'sfx.wav'), sfx().astype(np.float32), SR)
    tt_audio.BED_DB = -17
    tt_audio.master(os.path.join(OUT, 'voice.wav'), os.path.join(OUT, 'mix.wav'), DUR,
                    bed=os.path.join(OUT, 'music.wav'), extra=os.path.join(OUT, 'sfx.wav'))
    print('mix', tt_audio.report(os.path.join(OUT, 'mix.wav')))


if __name__ == '__main__':
    main()
