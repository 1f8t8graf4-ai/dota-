#!/usr/bin/env python3
"""v19.0 (17.11): звук выпуска 2 — голос (старая запись, ElevenLabs не трогаем) + звуки по событиям (cues.json), без музыки, как v18.5.
  python3 mix190.py v190s-ru|v190y-ru"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v165_sound as VS  # noqa: E402
from v180_sound import sfx_track  # noqa: E402
ep = sys.argv[1]; o = os.path.join(HERE, 'out', ep); T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30
sw = os.path.join(o, 'sfx.wav'); VS.wav(sfx_track(json.load(open(os.path.join(o, 'cues.json'))), dur), sw)
import tt_audio  # noqa: E402
mix = os.path.join(o, 'mix.wav'); raw = mix + '.raw.wav'
f = ['[0:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000[voc]',
     '[1:a]aresample=48000,aformat=channel_layouts=stereo,lowpass=f=7500,highpass=f=40[sx]', f'[voc][sx]amix=inputs=2:normalize=0,apad,atrim=0:{dur:.3f}[m]']
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'voice.wav'), '-i', sw, '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', raw], check=True)
L, _ = tt_audio._lufs(raw)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', f'volume={-13 - L:.2f}dB,alimiter=limit=0.89:level=disabled', '-c:a', 'pcm_s16le', mix], check=True)
os.remove(raw); print('mix.wav', tt_audio.report(mix))
