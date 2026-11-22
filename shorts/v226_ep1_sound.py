#!/usr/bin/env python3
"""v22.6 (22.11): звук главы 1 в фильме (v170e-ru) на груве Кашалота (Андрей: «в первом видео про одноразки — музыку Кашалота»).
Было: свой трек v9 (112,5 BPM, music18.wav, v192_ep1_sound.py → mix192.wav). Стало — как в главах 2–5: подложка «Льда»
(тот же грув Кашалота, out/v191y-ru/snd/bed.wav; трек в контейнере не нужен) по тактам (v210_sound.bed_from), дыры в конце такта
залиты звуком самого трека (bedfill.py), в паузах музыка на 3,5 дБ тише голоса, под голосом проседает на 5,5 дБ,
после последней строки поднимается на 4 дБ, хвост 1,4 с уходит. Звуки по событиям — те же, что были (v18_mix.sfx_track).
   python3 v226_ep1_sound.py   → out/v170e-ru/mix226.wav, final.mp4 (прежний — final.v225.mp4)"""
import json, os, shutil, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import mix193 as M, v165_sound as VS, tt_audio, bedfill, v210_sound as V2, v18_mix as M18
O = os.path.join(HERE, 'out', 'v170e-ru'); SR = M.SR

if __name__ == '__main__':
    T = json.load(open(os.path.join(O, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30; n = int(round(dur * SR)); voice = os.path.join(O, 'voice.wav')
    sw = os.path.join(O, 'sfx226.wav'); VS.wav(M18.sfx_track(json.load(open(os.path.join(O, 'cues.json'))), dur), sw)
    seq = list(range(40))
    while len(seq) < int(np.ceil(dur / M.BAR)) + 1: seq += list(range(20, 40))   # такты фраз 33 и 37 по кругу
    b = bedfill.fill(V2.bed_from(V2.old_bed(), dur, 1.4, seq), SR)
    tmp = os.path.join(O, 'bed_raw.wav'); VS.wav(b, tmp); Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(tmp); os.remove(tmp)
    env, sp, last = M.duck(voice, n, db=-5.5); b = b * 10 ** ((Lv - 3.5 - Lm) / 20) * env
    b *= 10 ** (4 * np.clip((np.arange(n) / SR - last) / .5, 0, 1) / 20)[:, None]
    bw = os.path.join(O, 'bed226.wav'); VS.wav(b, bw); print(f'v170e-ru: речь {sp * 100:.0f} % времени, подложка — грув Кашалота')
    mw = os.path.join(O, 'mix226.wav'); M.final(voice, sw, bw, mw, dur)
    fin = os.path.join(O, 'final.mp4'); old = os.path.join(O, 'final.v225.mp4')
    if os.path.exists(fin) and not os.path.exists(old): shutil.copy(fin, old)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(O, 'video.mp4'), '-i', mw, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                    '-t', f'{dur:.4f}', '-movflags', '+faststart', fin], check=True)
    print('готово:', fin)
