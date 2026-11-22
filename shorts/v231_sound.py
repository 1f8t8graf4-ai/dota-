#!/usr/bin/env python3
"""v23.2 (22.11): хвост пролога — грув Кашалота (глава 1 теперь на нём, v226_ep1_sound.py): такты 18–19 подложки «Льда» из-под фильтра,
кончаются ровно на кадре 0 главы 1, громкость — как у её подложки на старте; склейка «styk» — со звуком mix226.wav.
v23.1 (22.11): звук двух прологов (v231y — A, v232y — B) без голоса — как v230_sound.py (гул сцены, «тук-тук» капли, удар баса,
молния кольца, в конце — такты 1–2 музыки главы 1 из-под фильтра), события — из cues.json ролика.
   python3 v231_sound.py v231y-ru [styk 8]   → out/<ролик>/snd/mix.wav, final.mp4 (и styk.mp4 — пролог + первые 8 с главы 1)"""
import json, os, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v230_sound as V, tt_audio, subprocess
from v180_sound import sfx_track
import mix193 as M, v210_sound as V2, bedfill
SR = V.SR
C1 = os.path.join(HERE, 'out', 'v170e-ru')


def ch1_gain():   # во сколько раз подложка главы 1 на старте громче нарезанного грува: её усиление × огибающая × громкость финала (mix193.final)
    T = json.load(open(os.path.join(C1, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30
    seq = list(range(40))
    while len(seq) < int(np.ceil(dur / M.BAR)) + 1: seq += list(range(20, 40))
    raw = bedfill.fill(V2.bed_from(V2.old_bed(), dur, 1.4, seq), SR)
    bed, _ = sf.read(os.path.join(C1, 'bed226.wav'), dtype='float64'); w = slice(int(.02 * SR), int(.2 * SR))
    k_bed = np.sqrt((bed[w] ** 2).mean() / (raw[w] ** 2).mean())
    tmp = os.path.join(C1, 'raw_probe.wav')
    f = ['[0:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000[voc]',
         '[1:a]aformat=channel_layouts=stereo,highpass=f=35[md]', '[2:a]lowpass=f=7500,highpass=f=40[sx]', f'[voc][md][sx]amix=inputs=3:normalize=0,apad,atrim=0:{dur:.3f}[m]']
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(C1, 'voice.wav'), '-i', os.path.join(C1, 'bed226.wav'), '-i', os.path.join(C1, 'sfx226.wav'),
                    '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', tmp], check=True)
    L, _ = tt_audio._lufs(tmp); os.remove(tmp)
    return k_bed * 10 ** ((-12.5 - L) / 20)


def preroll(n, K):   # такты 18–19 грува (конец фразы) → глава 1 продолжает с такта 0; фильтр и громкость раскрываются с «Начнём»
    g = ch1_gain(); src = V2.old_bed(); B = M.BAR
    seg = bedfill.fill(V2.bed_from(src, 2 * B + .01, .002, [18, 19]), SR)
    L = int(round(2 * B * SR)); seg = seg[:L] * g; i0 = n - L; t = (np.arange(L) + i0) / SR
    k = np.clip((t - (K['grow'] - .15)) / (K['TE'] - .02 - (K['grow'] - .15)), 0, 1)
    fc = 180 * (18000 / 180) ** (k ** 1.6); y = V.lowpass_tv(seg, fc) * (k ** 1.8)[:, None]
    out = np.zeros((n, 2)); out[max(0, i0):] = y[max(0, -i0):]; return out


def riser(n, dur=.55, db=-19.):   # v23.2: в конце такта у грува ~0,4 с почти тишины — перед стыком её закрывает нарастающий шум, на кадре 0 главы 1 вступает доля
    L = int(dur * SR); rng = np.random.default_rng(232); z = rng.standard_normal((L, 2)); k = np.linspace(0, 1, L)
    y = V.lowpass_tv(z, 300 * (9000 / 300) ** k) * (10 ** (db / 20) * k ** 2.2)[:, None]
    y /= np.sqrt((y[-int(.1 * SR):] ** 2).mean()) / 10 ** (db / 20)
    out = np.zeros((n, 2)); out[n - L:] = y; return out


def styk(o, TE, mw, sec):   # пролог + первые sec с главы 1 (картинка и звук встык; глава 1 — со звуком на груве Кашалота, mix226.wav)
    v1 = os.path.join(C1, f'first{sec}.mp4'); a, _ = sf.read(mw, dtype='float64'); b, _ = sf.read(os.path.join(C1, 'mix226.wav'), dtype='float64')
    ab = np.concatenate([a, b[:int(sec * SR)]]); aw = os.path.join(o, 'snd', 'styk.wav'); sf.write(aw, ab.astype(np.float32), SR, subtype='PCM_16')
    lst = os.path.join(o, 'snd', 'styk.txt'); open(lst, 'w').write(f"file '{os.path.join(o, 'video.mp4')}'\nfile '{v1}'\n")
    out = os.path.join(o, 'styk.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-i', aw, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
    print(out, tt_audio.report(aw))


def build(ep):
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd'); os.makedirs(od, exist_ok=True)
    T = json.load(open(os.path.join(o, 'timeline.json'))); TE = T['dur']; n = int(round(TE * SR))
    C = json.load(open(os.path.join(o, 'cues.json')))
    fl = next(c[0] for c in C if c[1] == 'drop') + .03
    K = {'TE': TE, 'crack': fl - .5, 'flare': fl, 'grow': [c[0] for c in C if c[1] == 'plop'][-1] + .04}
    buf = np.zeros((n + SR, 2))
    V.put(buf, V.drone(n, K), 0, .2)
    for t0, nm, g0, pan in C:
        if nm == 'hb': V.put(buf, V.thump(92, 46, .32, .11), t0, .5 * g0); V.put(buf, .55 * V.thump(80, 44, .3, .1), t0 + .19, .5 * g0); V.put(buf, V.click(.003), t0, .07 * g0)
        elif nm == 'drop': V.put(buf, V.thump(120, 31, 1.8, .75), t0, .75); V.put(buf, V.click(.02, .3), t0, .16)
        elif nm == 'zip':
            te = next(c[0] for c in C if c[1] == 'zipend'); z = V.zipper(te - t0); V.put(buf, z, t0, .3, -.1); V.put(buf, V.click(.006, .6), te, .45)
    sfx = sfx_track([c for c in C if c[1] not in ('hb', 'drop', 'zip', 'zipend')], TE + 1); buf[:len(sfx)] += 1.7 * sfx[:len(buf)]
    x = np.tanh(buf[:n] * 1.4) / 1.4
    x += preroll(n, K) + riser(n)
    f = int(.003 * SR); x[-f:] *= np.linspace(1, 0, f)[:, None]
    mw = os.path.join(od, 'mix.wav'); sf.write(mw, x.astype(np.float32), SR, subtype='PCM_16')
    print(os.path.basename(mw), tt_audio.report(mw), 'пик %.2f' % np.abs(x).max())
    fin = os.path.join(o, 'final.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'video.mp4'), '-i', mw, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', fin], check=True)
    return o, TE, mw


if __name__ == '__main__':
    ep = sys.argv[1]; o, TE, mw = build(ep)
    if len(sys.argv) > 2 and sys.argv[2] == 'styk': styk(o, TE, mw, int(sys.argv[3]) if len(sys.argv) > 3 else 8)
