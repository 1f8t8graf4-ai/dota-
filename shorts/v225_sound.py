#!/usr/bin/env python3
"""v22.5 (22.11): звук после замены строк Макса (v225_voice.py).
  v170e — как раньше: python3 v192_ep1_sound.py (музыка своя, music18.wav) → out/v170e-ru/mix192.wav.
  v191s — подложка Кашалота (трека в контейнере нет) — из уже собранной out/v191s-ru/snd/bed.wav: снимаю прежнее проседание под голосом
          (огибающая считается из прежнего голоса voice.v224.wav — тем же mix193.duck), режу под новую длину, проседание — под новый голос,
          громкость — по новому голосу, хвост 0,25 с — как в mix193.py. Звуки по событиям — из нового cues.json. → snd/mix.wav
Прежние файлы — *.v224.wav рядом.  python3 v225_sound.py"""
import json, os, shutil, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import mix193 as M, v165_sound as VS, tt_audio
from v180_sound import sfx_track


def keep(p):   # прежний файл — рядом, один раз
    b = p[:-4] + '.v224.wav'
    if os.path.exists(p) and not os.path.exists(b): shutil.copy(p, b)
    return b


def v191s():
    o = os.path.join(HERE, 'out', 'v191s-ru'); od = os.path.join(o, 'snd')
    T = json.load(open(os.path.join(o, 'timeline.json'))); T0 = json.load(open(os.path.join(o, 'timeline.v224.json')))
    dur, dur0 = np.ceil(T['dur'] * 30) / 30, np.ceil(T0['dur'] * 30) / 30; n, n0 = int(round(dur * M.SR)), int(round(dur0 * M.SR))
    bed0 = keep(os.path.join(od, 'bed.wav')); keep(os.path.join(od, 'mix.wav')); keep(os.path.join(od, 'sfx.wav'))
    b, sr = sf.read(bed0, dtype='float64'); assert sr == M.SR and len(b) == n0, (sr, len(b), n0)
    v0, v1 = os.path.join(o, 'voice.v224.wav'), os.path.join(o, 'voice.wav')
    e0, _, _ = M.duck(v0, n0); e1, sp, _ = M.duck(v1, n)
    L0, _ = tt_audio._lufs(v0); L1, _ = tt_audio._lufs(v1)
    raw = (b / e0)[:n] * 10 ** ((L1 - L0) / 20)   # без прежнего проседания, громкость — под новый голос (в mix193: Lv − 5,5 − Lm)
    m = int(.25 * M.SR); raw[-m:] *= np.linspace(1, 0, m)[:, None]
    import loopfix; bw = os.path.join(od, 'bed.wav'); VS.wav(loopfix.fix_start(raw * e1, M.dec(v1), M.SR), bw)   # v23.6: без «удара» музыки в начале петли
    sw = os.path.join(od, 'sfx.wav'); VS.wav(sfx_track(json.load(open(os.path.join(o, 'cues.json'))), dur), sw)
    M.final(v1, sw, bw, os.path.join(od, 'mix.wav'), dur)
    print(f'v191s: подложка {dur0:.3f} → {dur:.3f} с, голос {L0:.1f} → {L1:.1f} LUFS, речь {sp * 100:.0f} % времени')


if __name__ == '__main__':
    keep(os.path.join(HERE, 'out', 'v170e-ru', 'mix192.wav'))
    subprocess.run([sys.executable, 'v192_ep1_sound.py'], cwd=HERE, check=True)
    v191s()
