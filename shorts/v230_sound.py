#!/usr/bin/env python3
"""v23.0 (21.11): звук пролога фильма — без голоса (Андрей: «на голос добро не даю»).
Гул сцены, «тук-тук» ядра (hb), удар баса на «суть» (drop), молния кольца (zip → zipend) — синтез здесь; остальное — файлы sfx* по cues.json.
Последние такты — музыка главы 1 (music18, 112,5 BPM): такты 1–2 трека встают так, что кончаются ровно на её кадре 0, проступают из-под фильтра
и на стыке подхватываются её же началом (в сведении главы 1 музыка стоит на 0 дБ — v18_mix.final, проверено по громкостям).
   python3 v230_sound.py v230y-ru            → out/v230y-ru/snd/mix.wav, out/v230y-ru/final.mp4
   python3 v230_sound.py v230y-ru styk [8]   → ещё стык «пролог + первые N с главы 1»: out/v230y-ru/styk.mp4
                                               (нужны out/v170e-ru/mix192.wav — python3 v192_ep1_sound.py — и out/v170e-ru/first<N>.mp4)"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import tt_audio
from v180_sound import sfx_track
SR = 48000; BAR1 = 4 * 60 / 112.5   # такт музыки главы 1
rng = np.random.default_rng(23)


def env_at(t, pts):   # кусочно-линейная огибающая по точкам (время, уровень)
    xs, ys = zip(*pts); return np.interp(t, xs, ys)


def drone(n, K):   # гул сцены: ля контроктавы и квинта, медленно дышит; на «суть» обрывается и уходит в темноту, под музыку — на нет
    t = np.arange(n) / SR; x = np.zeros(n)
    for f, a, lf in [(55, 1, .13), (82.41, .5, .17), (110, .32, .21), (164.8, .12, .29), (220, .06, .23)]:
        x += a * np.sin(2 * np.pi * f * t + 3 * np.sin(2 * np.pi * .05 * t)) * (.75 + .25 * np.sin(2 * np.pi * lf * t))
    nz = rng.standard_normal(n); F = np.fft.rfft(nz); fr = np.fft.rfftfreq(n, 1 / SR); F *= np.exp(-((np.log(fr + 1) - np.log(520)) ** 2) / .5); air = np.fft.irfft(F, n); air /= np.abs(air).max()
    x = x / np.abs(x).max() + .18 * air * (.6 + .4 * np.sin(2 * np.pi * .09 * t))
    e = env_at(t, [(0, .35), (1.2, .85), (K['crack'], 1.15), (K['flare'] - .02, 1.2), (K['flare'] + .06, .12), (K['flare'] + 1.2, .45), (K['grow'], .5), (K['TE'] - .8, .18), (K['TE'], 0)])
    return x * e


def thump(f0, f1, dur, tau):   # удар с падающей высотой (сердце, бас)
    t = np.arange(int(dur * SR)) / SR; f = f1 + (f0 - f1) * np.exp(-t / (dur * .25)); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / tau) * np.minimum(1, t / .004)


def click(dur=.004, hp=.85):
    x = rng.standard_normal(int(dur * SR)) * np.exp(-np.arange(int(dur * SR)) / (dur * SR / 4)); y = np.copy(x)
    for i in range(1, len(x)): y[i] = hp * (y[i - 1] + x[i] - x[i - 1])
    return y


def put(buf, x, t0, g=1., pan=0.):
    i = int(round(t0 * SR)); j = min(len(buf), i + len(x));
    if j <= i: return
    buf[i:j, 0] += x[:j - i] * g * np.sqrt(.5 * (1 - pan)); buf[i:j, 1] += x[:j - i] * g * np.sqrt(.5 * (1 + pan))


def zipper(dur):   # молния: щелчки зубцов всё чаще и выше, к концу — щелчок застёжки
    out = np.zeros(int((dur + .2) * SR)); t, k = 0., 0
    while t < dur:
        u = t / dur; rate = 38 + 90 * u ** 1.3; c = click(.0035, .8 + .15 * u) * (.35 + .65 * np.sin(np.pi * min(1, u * 1.15)) ** .6)
        i = int(t * SR); out[i:i + len(c)] += c[:len(out) - i]; t += 1 / rate * (1 + .18 * (rng.random() - .5)); k += 1
    return out / (np.abs(out).max() + 1e-9)


def lowpass_tv(x, fc):   # фильтр с меняющейся частотой среза (два однополюсных подряд), fc — по сэмплам
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s1 = np.zeros(x.shape[1]); s2 = np.zeros(x.shape[1])
    for i in range(len(x)):
        s1 += a[i] * (x[i] - s1); s2 += a[i] * (s1 - s2); y[i] = s2
    return y


def preroll(n, K):   # такты 1–2 музыки главы 1 кончаются ровно на её кадре 0; громкость и фильтр раскрываются с «Начнём»
    m, sr = sf.read(os.path.join(HERE, 'out', 'v170e-ru', 'music18.wav'), dtype='float64'); assert sr == SR
    L = int(round(2 * BAR1 * SR)); seg = m[:L].copy(); i0 = n - L; t = (np.arange(L) + i0) / SR
    k = np.clip((t - (K['grow'] - .15)) / (K['TE'] - .02 - (K['grow'] - .15)), 0, 1)
    fc = 180 * (18000 / 180) ** (k ** 1.6); g = k ** 1.8
    y = lowpass_tv(seg, fc) * g[:, None]
    out = np.zeros((n, 2)); out[i0:] = y; return out


def build(ep):
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd'); os.makedirs(od, exist_ok=True)
    T = json.load(open(os.path.join(o, 'timeline.json'))); TE = T['dur']; n = int(round(TE * SR))
    C = json.load(open(os.path.join(o, 'cues.json'))); first = lambda nm: next(c[0] for c in C if c[1] == nm)
    K = {'TE': TE, 'crack': first('icecrack') + .02, 'flare': first('drop') + .03, 'grow': [c[0] for c in C if c[1] == 'plop'][-1] + .04}
    buf = np.zeros((n + SR, 2))
    d = drone(n, K); put(buf, d, 0, .2)
    for t0, nm, g0, pan in C:
        if nm == 'hb': put(buf, thump(92, 46, .32, .11), t0, .5 * g0); put(buf, .55 * thump(80, 44, .3, .1), t0 + .19, .5 * g0); put(buf, click(.003), t0, .07 * g0)   # «тук-тук», как на картинке
        elif nm == 'drop': put(buf, thump(120, 31, 1.8, .75), t0, .75); put(buf, click(.02, .3), t0, .16)
        elif nm == 'zip':
            te = next(c[0] for c in C if c[1] == 'zipend'); z = zipper(te - t0); put(buf, z, t0, .3, -.1); put(buf, click(.006, .6), te, .45)
    sfx = sfx_track([c for c in C if c[1] not in ('hb', 'drop', 'zip', 'zipend')], TE + 1); buf[:len(sfx)] += 1.7 * sfx[:len(buf)]
    x = buf[:n]
    x = np.tanh(x * 1.4) / 1.4   # мягкий потолок (без щелчков ограничителя)
    x += preroll(n, K)
    f = int(.003 * SR); x[-f:] *= np.linspace(1, 0, f)[:, None]   # стык без щелчка: глава 1 начинается своим звуком
    mw = os.path.join(od, 'mix.wav'); sf.write(mw, x.astype(np.float32), SR, subtype='PCM_16')
    print(os.path.basename(mw), tt_audio.report(mw), 'пик %.2f' % np.abs(x).max())
    fin = os.path.join(o, 'final.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'video.mp4'), '-i', mw, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', fin], check=True)
    return o, TE, mw


def styk(o, TE, mw, sec):   # пролог + первые sec с главы 1 одним роликом (картинка и звук встык, без наплыва)
    c1 = os.path.join(HERE, 'out', 'v170e-ru'); v1 = os.path.join(c1, f'first{sec}.mp4'); a1 = os.path.join(c1, 'mix192.wav')
    a, _ = sf.read(mw, dtype='float64'); b, _ = sf.read(a1, dtype='float64'); ab = np.concatenate([a, b[:int(sec * SR)]])
    # первые ~35 мс трека главы 1 — тишина до первой доли; в фильме их закрывает хвост такта 2 из пролога (доля такта 3 совпала бы с её первой — гасим до неё)
    m, _ = sf.read(os.path.join(c1, 'music18.wav'), dtype='float64'); L = int(round(2 * BAR1 * SR)); q, e, fo = int(.003 * SR), int(.041 * SR), int(.007 * SR)
    tail = m[L - q:L + e].copy(); tail[:q] *= np.linspace(0, 1, q)[:, None]; tail[-fo:] *= np.linspace(1, 0, fo)[:, None]; ab[len(a) - q:len(a) + e] += tail
    aw = os.path.join(o, 'snd', 'styk.wav'); sf.write(aw, ab.astype(np.float32), SR, subtype='PCM_16')
    lst = os.path.join(o, 'snd', 'styk.txt'); open(lst, 'w').write(f"file '{os.path.join(o, 'video.mp4')}'\nfile '{v1}'\n")
    out = os.path.join(o, 'styk.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-i', aw, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
    print(out, tt_audio.report(aw))


if __name__ == '__main__':
    ep = sys.argv[1]; o, TE, mw = build(ep)
    if len(sys.argv) > 2 and sys.argv[2] == 'styk': styk(o, TE, mw, int(sys.argv[3]) if len(sys.argv) > 3 else 8)
