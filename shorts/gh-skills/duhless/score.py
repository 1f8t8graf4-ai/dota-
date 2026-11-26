"""Музыка «Духless» в стиле lemo-opuscar «Spy Titles»: оригинальный спай-биг-бэнд (ми минор, 132 BPM, свинг).
Удары меди = склейки (события 'stab' из events.json), перед титром — настоящая тишина, на титре — длинный аккорд, в конце — «кнопка».
Инструменты — сэмплер lemo (core/audio/sampler.py), библиотека VSCO 2 CE (CC0): труба и тромбон стаккато, контрабас пиццикато,
малый и большой барабан, тарелка, литавры. Аккорды и приём «стаб чуть раньше доли» — из score.py демо spy-titles (MIT).
Запуск: LIB=~/lemo-opuscar $LIB/.venv/bin/python score.py   →  out/score.wav
"""
import sys, os, json
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
EV = ev['ev']; DUR = ev['dur'] + .4
N = int(DUR * SR)
S.seed(7)
bus = {k: np.zeros((N, 2), np.float32) for k in ['brass', 'bass', 'drums']}
def put(b, x, t, g=1.0, pan=0.0): add(bus[b], x, max(t, 0), g, pan)

T_STOP = next(e['t'] for e in EV if e['type'] == 'silence')
T_TITLE = next(e['t'] for e in EV if e['type'] == 'title')
BPM = 132; BEAT = 60 / BPM
T0 = next(e['t'] for e in EV if e['type'] == 'stab')   # первый удар меди = доля 1 первого такта

CH = {   # аккорды: тромбоны (низ) и трубы (верх) — из демо
    'Em7':   (['E2', 'E3', 'G3', 'B3', 'D4'], ['B4', 'D5', 'E5', 'G5']),
    'C7s11': (['C3', 'E3', 'A#3', 'F#3'], ['E4', 'A#4', 'C5', 'F#5']),
    'B7s9':  (['B2', 'D#3', 'A3', 'B3'], ['D#4', 'A4', 'D5', 'F#5']),
    'Fm6':   (['F2', 'F3', 'C4', 'D4'], ['G#4', 'C5', 'D5', 'F5']),
    'Em69':  (['E2', 'E3', 'B3', 'C#4', 'F#3'], ['G4', 'B4', 'C#5', 'F#5', 'E5']),
}
PRE = .008   # медь набирает пик ~8 мс — бьём чуть раньше, чтобы удар пришёлся ровно на кадр
def stab(t, ch, vel=.9, short=False):
    tb, tp = CH[ch]; d = .12 if short else .18
    for i, p in enumerate(tb): put('brass', S.note('trombone_stac', p, d, vel, release=.08), t - PRE, .55, -.35 + i * .08)
    for i, p in enumerate(tp): put('brass', S.note('trumpet_stac', p, d, vel, release=.08), t - PRE, .5, .1 + i * .1)
    put('drums', S.hit('crash', None, vel * (.6 if short else .85)), t, .45, .25)
    put('drums', S.hit('bass_drum', None, vel), t, .7, 0)
def long_chord(t, ch, dur, vel=.8):
    tb, tp = CH[ch]
    for i, p in enumerate(tb): put('brass', S.note('trombone', p, dur, vel, release=1.2), t - PRE, .42, -.35 + i * .08)
    for i, p in enumerate(tp): put('brass', S.note('trumpet', p, dur, vel, release=1.2), t - PRE, .36, .1 + i * .1)

# ── холодное начало: одинокий контрабас подводит к первому удару (4 ноты по хроматике вниз, как в демо-мотиве) ──
for k, p in enumerate(['B2', 'A#2', 'A2', 'G2']):
    put('bass', S.note('contrabass_pizz', p, .3, .85), T0 - (4 - k) * BEAT * .75 - .05, .95, -.1)
put('drums', S.hit('timpani', 0, .35), .05, .5, 0)

# ── грув от первого удара до стоп-кадра: шагающий бас, щётки на 2 и 4, лёгкая бочка ──
WALK = {'Em7': ['E2', 'G2', 'A2', 'A#2', 'B2', 'D3', 'C#3', 'B2'], 'C7s11': ['C2', 'E2', 'G2', 'A#2', 'C3', 'A#2', 'G2', 'E2'],
        'B7s9': ['B1', 'D#2', 'F#2', 'A2', 'B2', 'A2', 'F#2', 'D#2'], 'Fm6': ['F2', 'G#2', 'C3', 'D3', 'F3', 'D3', 'C3', 'G#2']}
stabs = [e for e in EV if e['type'] == 'stab']
def chord_at(t):
    c = 'Em7'
    for e in stabs:
        if e['t'] <= t: c = e['ch']
    return c
t = T0; i = 0
while t < T_STOP - .05:
    c = chord_at(t); w = WALK.get(c, WALK['Em7'])
    put('bass', S.note('contrabass_pizz', w[i % 8], BEAT * .9, .7 + .1 * (i % 2 == 0)), t, .9, -.1)
    if i % 2 == 1: put('drums', S.hit('snare', None, .28), t + .012, .38, .15)        # 2 и 4 — мягко
    if i % 4 == 0: put('drums', S.hit('bass_drum', None, .45), t, .45, 0)
    # свинговая «восьмая» перед следующей долей — призрак щётки
    put('drums', S.hit('snare', None, .1), t + BEAT * .62, .2, .2)
    t += BEAT; i += 1

for e in stabs: stab(e['t'], e['ch'], short=bool(e.get('short')))

# ── стоп-время: всё глушится в ноль (с хвостами) ──
cut0, cut1 = int(T_STOP * SR), int((T_TITLE - .06) * SR)
for b in bus.values():
    fade = np.linspace(1, 0, int(.03 * SR))[:, None]
    b[cut0:cut0 + len(fade)] *= fade; b[cut0 + len(fade):cut1] = 0

# ── титр: большой аккорд Em6/9 + тарелка + литавры, и «кнопка» в конце ──
long_chord(T_TITLE, 'Em69', 1.8, .85)
put('drums', S.hit('crash', None, .9), T_TITLE, .55, -.2)
put('drums', S.hit('timpani', 0, .8), T_TITLE, .7, 0)
for k, p in enumerate(['E2', 'E2']):
    put('bass', S.note('contrabass_pizz', p, .25, .9), T_TITLE + k * BEAT * 2, .9, 0)
button = ev['dur'] - .62
for p in ['E3', 'B3']: put('brass', S.note('trombone_stac', p, .12, .9, release=.1), button - PRE, .5, 0)
for p in ['E5', 'G5', 'B5']: put('brass', S.note('trumpet_stac', p, .12, .9, release=.1), button - PRE, .45, .1)
put('drums', S.hit('bass_drum', None, .9), button, .7, 0)

mix = bus['brass'] * .9 + bus['bass'] * 1.0 + bus['drums'] * .85
mix = np.stack([limit(mix[:, c], .9) for c in range(2)], 1)   # limit() в sfx.py одномерный
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'score.wav'), mix.astype(np.float32), SR)
with open(os.path.join(HERE, 'CREDITS_music.txt'), 'w') as f:
    f.write('\n'.join(S.credits(['trumpet_stac', 'trombone_stac', 'trumpet', 'trombone', 'contrabass_pizz', 'snare', 'bass_drum', 'crash', 'timpani'])) + '\n')
print('score.wav', round(len(mix) / SR, 2), 's, peak', round(float(np.abs(mix).max()), 3))
