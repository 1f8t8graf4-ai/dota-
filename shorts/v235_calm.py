#!/usr/bin/env python3
"""v23.5 (22.11): спокойная версия шортсов — для пробы (Андрей: «часть шортсов будет со спокойным, часть с изначальным»).
Подложка — та же, что в шортсе (out/<ролик>/snd/bed.wav: грув Кашалота, уже проседает под голос), но как в фильме на YouTube
(v234_ep1_film.py): из-под фильтра — слышны бочка, бас и аккорд, без верхов — и на CALM дБ тише (в шортсе в паузах музыка на 3,5 дБ
под голосом, в фильме — на 6). Голос и звуки по событиям — те же. Шортс с прежней музыкой (final.mp4) не трогаем.
   python3 v235_calm.py v191s-ru v200s-ru v210s-ru v220s-ru   → out/<ролик>/snd/bed_calm.wav, mix_calm.wav, final_calm.mp4"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import mix193 as M, v165_sound as VS, tt_audio
from v234_ep1_film import LP
CALM = 2.5


def calm(ep):
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd')
    T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T.get('vo_dur', T['dur']) * 30) / 30
    bw = os.path.join(od, 'bed_calm.wav')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(od, 'bed.wav'), '-af', f'{LP},volume=-{CALM}dB', '-c:a', 'pcm_f32le', bw], check=True)
    mw = os.path.join(od, 'mix_calm.wav'); M.final(os.path.join(o, 'voice.wav'), os.path.join(od, 'sfx.wav'), bw, mw, dur)
    out = os.path.join(o, 'final_calm.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'final.mp4'), '-i', mw, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac',
                    '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
    print(ep, out, tt_audio.report(mw))


if __name__ == '__main__':
    for ep in sys.argv[1:] or ['v191s-ru', 'v200s-ru', 'v210s-ru', 'v220s-ru']: calm(ep)
