#!/usr/bin/env python3
"""Промо «Джул» (vj1, 16.11): звук без голоса — звуки по событиям (cues.json) + своя музыка из music/ (уже оплаченная, Eleven Music).
Когда будет голос: положить out/vj1s-ru/voice.wav и свести через v180_sound.py, как выпуск 2.
  python3 vj1_sound.py <трек.mp3> <папка> → <папка>/mix.wav"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v165_sound as VS  # noqa: E402
import tt_audio  # noqa: E402
from v180_sound import sfx_track, bed  # noqa: E402

if __name__ == '__main__':
    track, od = sys.argv[1:3]; os.makedirs(od, exist_ok=True)
    o = os.path.join(HERE, 'out', 'vj1s-ru'); T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30
    sw = os.path.join(od, 'sfx.wav'); VS.wav(sfx_track(json.load(open(os.path.join(o, 'cues.json'))), dur), sw)
    bw = os.path.join(od, 'bed.wav'); VS.wav(bed(track, dur, 0, 2.0), bw)
    raw = os.path.join(od, 'raw.wav'); mix = os.path.join(od, 'mix.wav')
    Lm, _ = tt_audio._lufs(bw); Ls, _ = tt_audio._lufs(sw)
    f = f'[0:a]volume={-17 - Lm:.2f}dB[m];[1:a]lowpass=f=7500,highpass=f=40,volume={-19 - Ls:.2f}dB[s];[m][s]amix=inputs=2:normalize=0,atrim=0:{dur:.3f}[x]'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', bw, '-i', sw, '-filter_complex', f, '-map', '[x]', '-ar', '48000', '-c:a', 'pcm_s16le', raw], check=True)
    L, _ = tt_audio._lufs(raw)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', f'volume={-14 - L:.2f}dB,alimiter=limit=0.89:level=disabled', '-c:a', 'pcm_s16le', mix], check=True)
    os.remove(raw); print('mix.wav', tt_audio.report(mix))
