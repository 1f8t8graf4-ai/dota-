#!/usr/bin/env python3
"""v23.4 (22.11): глава 1 в фильме на YouTube — свой, спокойный саундтрек (Андрей: «на ютубе свой саундтрек, как в прологе, спокойный;
в тиктоке и шортсах — сдвгшный»). Тот же грув Кашалота, что в шортсах и в конце пролога, но приглушённый, как в прологе:
из-под фильтра (слышны бочка, бас и аккорд, без верхов) и тише — в паузах на 6 дБ под голосом (в шортсах 3,5), под голосом ещё −5,5 дБ.
Глава в фильме начинается с ночного города: розовый кадр с «Что вы знаете об одноразках?» (первые CUT с) вырезан, подложка
вступает мягко за 1 с с этого места. Шортсы и v226 (mix226.wav, final.mp4) не трогаем.
   python3 v234_ep1_film.py   → out/v170e-ru/bed234f.wav, mix234f.wav (вся глава, время главы), film234.mp4 (глава с CUT, без розового кадра)"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import mix193 as M, v165_sound as VS, tt_audio, bedfill, v210_sound as V2
O = os.path.join(HERE, 'out', 'v170e-ru'); SR = M.SR
CUT = 0.0           # v23.6: глава в фильме снова с начала — с «Что вы знаете об одноразках?» (Андрей: «верни то начало»); было 2,20 — с ночного города
FADE = 1.0          # вступление подложки
LP = 'lowpass=f=620:p=2,lowpass=f=900:p=2,bass=g=2:f=90'   # «за стеной»: без тарелок и верхов грува
QUIET = 6.0         # в паузах подложка на столько дБ тише голоса


def calm(b):   # грув → спокойный, через ffmpeg (быстро и без scipy)
    a = os.path.join(O, 'bed234_raw.wav'); z = os.path.join(O, 'bed234_lp.wav'); VS.wav(b, a)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', a, '-af', LP, '-c:a', 'pcm_f32le', z], check=True)
    y, _ = sf.read(z, dtype='float64'); os.remove(a); os.remove(z); return y[:len(b)]


if __name__ == '__main__':
    T = json.load(open(os.path.join(O, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30; n = int(round(dur * SR)); voice = os.path.join(O, 'voice.wav')
    sw = os.path.join(O, 'sfx226.wav')   # звуки по событиям — те же, что в главе (v226_ep1_sound.py)
    seq = list(range(40))
    while len(seq) < int(np.ceil(dur / M.BAR)) + 1: seq += list(range(20, 40))
    b = calm(bedfill.fill(V2.bed_from(V2.old_bed(), dur, 1.4, seq), SR))
    tmp = os.path.join(O, 'bed_raw.wav'); VS.wav(b, tmp); Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(tmp); os.remove(tmp)
    env, sp, last = M.duck(voice, n, db=-5.5); b = b * 10 ** ((Lv - QUIET - Lm) / 20) * env
    t = np.arange(n) / SR
    b *= 10 ** (4 * np.clip((t - last) / .5, 0, 1) / 20)[:, None]          # после последней строки — поднимается, как в главе
    b *= (np.clip((t - CUT) / FADE, 0, 1) ** 1.5)[:, None]                 # вступает мягко уже в ночном городе
    bw = os.path.join(O, 'bed234f.wav'); VS.wav(b, bw)
    mw = os.path.join(O, 'mix234f.wav'); M.final(voice, sw, bw, mw, dur)
    out = os.path.join(O, 'film234.mp4')   # глава 1 для фильма: с CUT, ровно по кадрам
    f0 = int(round(CUT * 30))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(O, 'video.mp4'), '-ss', f'{CUT:.4f}', '-i', mw,
                    '-filter_complex', f'[0:v]trim=start_frame={f0},setpts=PTS-STARTPTS[v]', '-map', '[v]', '-map', '1:a',
                    '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
    print(f'v170e-ru, фильм: речь {sp * 100:.0f} % времени, подложка — грув из-под фильтра, тише на {QUIET} дБ;', out, tt_audio.report(mw))
