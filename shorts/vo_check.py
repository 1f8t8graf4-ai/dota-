#!/usr/bin/env python3
"""23.11: проверка «субтитр есть — голоса нет» (Андрей: в EN-фильме пропали 3 фразы, а субтитры, музыка и звуки шли).
Для каждого куска субтитров / фразы считает громкость голоса в его время; тихо — печатает.
  python3 vo_check.py <ролик> […]        например: v170e-en-vo v191y-de-vo v200y-ru
  python3 vo_check.py --film <язык> …    то же по готовому фильму out/film-<язык>/voice.wav
Время: у глав 1–2 EN/DE картинка в русском времени (warp) — субтитры переводятся во время голоса по tmap.json."""
import json, os, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
THR = .006   # RMS голоса (пик ≈ .9): речь .03–.2, тишина между фразами — шум записи ≈ .001


def spans(o):
    T = json.load(open(os.path.join(o, 'timeline.json')))
    if T.get('subs'):
        S = [(c['a'], c['b'], c['s']) for c in T['subs']]
        if T.get('warp'):   # время субтитров — русское; голос — в своём времени
            tm = np.array(json.load(open(os.path.join(o, 'tmap.json')))); t = np.arange(len(tm)) / 30
            S = [(float(np.interp(a, tm, t)), float(np.interp(b, tm, t)), s) for a, b, s in S]
        return S
    out = []
    for s in T['sent']:   # русские ролики: по словам фразы
        for w in s['words']: out.append((w['a'], w['b'], w.get('w') or w.get('d') or ''))
    return out


def check(o, off=0.0, y=None, sr=None):
    if y is None:
        y, sr = sf.read(os.path.join(o, 'voice.wav'))
        if y.ndim > 1: y = y.mean(1)
    bad = []
    for a, b, s in spans(o):
        a += off; b += off; seg = y[int(a * sr):int(b * sr)]
        r = float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.
        if r < THR and b - a > .12: bad.append((a, b, r, s))
    return bad


def main(args):
    film = None
    if args and args[0] == '--film': film = args[1]; args = args[2:]
    if film:
        F = json.load(open(os.path.join(HERE, 'out', f'film-{film}', 'film.json')))
        y, sr = sf.read(os.path.join(HERE, 'out', f'film-{film}', 'voice.wav'))
        if y.ndim > 1: y = y.mean(1)
        c0 = F['off'][1] if F['seg'][0].startswith('v231') else 0.
        tot = 0
        for e, o0 in zip(F['seg'], F['off']):
            if e.startswith('v231'): continue
            bad = check(os.path.join(HERE, 'out', e), o0 - c0, y, sr); tot += len(bad)
            print(f'{e}: ' + ('голос везде ✓' if not bad else f'ТИХО {len(bad)}'))
            for a, b, r, s in bad: print(f'   фильм {a + c0:7.2f}–{b + c0:7.2f}  rms {r:.4f}  {s}')
        return tot
    tot = 0
    for e in args:
        bad = check(os.path.join(HERE, 'out', e)); tot += len(bad)
        print(f'{e}: ' + ('голос везде ✓' if not bad else f'ТИХО {len(bad)}'))
        for a, b, r, s in bad: print(f'   {a:7.2f}–{b:7.2f}  rms {r:.4f}  {s}')
    return tot


if __name__ == '__main__':
    sys.exit(1 if main(sys.argv[1:]) else 0)
