#!/usr/bin/env python3
"""v19.3 (17.11): звук «Льда» — голос + звуки + Кашалот (трек у Андрея, в git не кладём — путь аргументом).
Трек: 104,14 BPM, такт 2,3046 с, фраза — 4 такта (9,218 с). Грув — такты 9–24 (21,06–57,93 с) и 33–40 (76,37–94,81 с);
интро 0–21 с, брейки 57,9–67,2 и 74,1–76,4 с, хвост 94,8+ — тихие (на 10–12 дБ ниже), их не берём.
Подложка — фразы грува подряд, стык по сильной доле с наплывом 60 мс: ни одного провала в тишину.
Под голосом музыка мягко проседает на 4 дБ (атака 80 мс, отпуск 350 мс), в паузах — возвращается.
  python3 mix193.py v191y-ru|v191s-ru <трек.mp3>   → out/<ролик>/snd/mix.wav"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v165_sound as VS
import tt_audio
from v180_sound import sfx_track
SR, BEAT, PH = 48000, 0.57614, 0.3365   # атака баса на сильной доле такта m — PH + 4·m·BEAT (сверено по бочке в тактах 13, 14, 21, 33)
BAR = 4 * BEAT; PHR = 4 * BAR
ORDER = [9, 13, 17, 21, 33, 37, 13, 17, 21, 33, 37, 13]   # фразы грува (номер первого такта): 9…24 — первый грув, 33…40 — последний
END_Y = [11, 13, 14, 15]   # мостик, последние такты: сбивка 11 (без стопа) → 13 — иначе под «для леди.» и на финальном кадре стоп-доли дают ямки


def dec(path, ch=2):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, ch).astype(np.float64)


def bed(track, dur, tail, bars):   # подряд идущие такты источника — одним куском; на стыке кусков атака встаёт ровно в j·BAR,
    # наплыв равной мощности 40 мс кончается за 5 мс до атаки (в тихой последней доле прошлого такта)
    s = dec(track); n = int(round(dur * SR)); out = np.zeros((n + int(4 * BAR * SR), 2)); xf, gap = int(.04 * SR), int(.005 * SR); pre = xf + gap
    up = np.sin(np.linspace(0, np.pi / 2, xf))[:, None]; dn = np.cos(np.linspace(0, np.pi / 2, xf))[:, None]
    nb = int(np.ceil(dur / BAR)) + 1; runs = []; j = 0
    while j < nb:
        k = j
        while k + 1 < nb and bars[(k + 1) % len(bars)] == bars[k % len(bars)] + 1: k += 1
        runs.append((j, k + 1, bars[j % len(bars)])); j = k + 1
    for r, (j0, j1, m) in enumerate(runs):
        d0, d1 = int(round(j0 * BAR * SR)), int(round(j1 * BAR * SR)); src = int(round((PH + m * BAR) * SR))
        p0 = pre if r else 0; last = r == len(runs) - 1; seg = s[src - p0:src + (d1 - d0) - (0 if last else gap)].copy()
        if r: seg[:xf] *= up
        else: f = int(.005 * SR); seg[:f] *= np.linspace(0, 1, f)[:, None]
        if not last: seg[-xf:] *= dn
        out[d0 - p0:d0 - p0 + len(seg)] += seg
    x = out[:n]; m = int(tail * SR); x[-m:] *= np.linspace(1, 0, m)[:, None]
    return x


def bars_of(phr, tail=None):   # фразы (первый такт) → такты; tail — свои такты вместо последней фразы
    b = [m + k for m in phr for k in range(4)]
    return b[:-4] + tail if tail else b


def duck(voice, n, db=-4.0, att=.08, rel=.35):   # огибающая голоса → мягкое проседание музыки
    v = dec(voice, 1)[:, 0]; v = np.pad(v, (0, max(0, n - len(v))))[:n]; hop = int(.01 * SR)
    fr = np.sqrt(np.convolve(v ** 2, np.ones(hop) / hop, 'same')[::hop] + 1e-12); ref = np.percentile(fr[fr > 1e-4], 90)
    act = (fr > ref * 10 ** (-24 / 20)).astype(float); g = np.zeros_like(act); a, r = 1 - np.exp(-.01 / att), 1 - np.exp(-.01 / rel)
    for k in range(len(act)): g[k] = g[k - 1] + ((a if act[k] > g[k - 1] else r) * (act[k] - g[k - 1]) if k else 0)
    env = 10 ** (db * np.interp(np.arange(n) / hop, np.arange(len(g)), g) / 20)
    last = (np.nonzero(act)[0].max() + 1) * hop / SR if act.any() else 0
    return env[:, None], float(act.mean()), last


def final(voice, sfx, bedw, out, dur, lufs=-12.5):
    raw = out + '.raw.wav'
    f = ['[0:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000[voc]',
         '[1:a]aformat=channel_layouts=stereo,highpass=f=35[md]', '[2:a]lowpass=f=7500,highpass=f=40[sx]',
         f'[voc][md][sx]amix=inputs=3:normalize=0,apad,atrim=0:{dur:.3f}[m]']
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', voice, '-i', bedw, '-i', sfx, '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', raw], check=True)
    L, _ = tt_audio._lufs(raw)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', f'volume={lufs - L:.2f}dB,alimiter=limit=0.89:level=disabled', '-c:a', 'pcm_s16le', out], check=True)
    os.remove(raw); print(os.path.basename(out), tt_audio.report(out))


if __name__ == '__main__':
    ep, track = sys.argv[1:3]
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd'); os.makedirs(od, exist_ok=True)
    T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30; n = int(round(dur * SR))
    voice = os.path.join(o, 'voice.wav')
    sw = os.path.join(od, 'sfx.wav'); VS.wav(sfx_track(json.load(open(os.path.join(o, 'cues.json'))), dur), sw)
    sh = ep.startswith('v191s'); b = bed(track, dur, .25 if sh else 1.4, bars_of(ORDER) if sh else bars_of(ORDER[:11], END_Y))
    tmp = os.path.join(od, 'bed_raw.wav'); VS.wav(b, tmp); Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(tmp); os.remove(tmp)
    env, sp, last = duck(voice, n); b = b * 10 ** ((Lv - 5.5 - Lm) / 20) * env   # музыка на 5,5 дБ тише голоса в паузах, на 9,5 — под голосом
    if not sh:   # мостик: голос кончился — музыка поднимается на 4 дБ за 0,5 с и держит финальный кадр до затухания
        tt = np.arange(n) / SR; b *= 10 ** (4 * np.clip((tt - last) / .5, 0, 1) / 20)[:, None]
    bw = os.path.join(od, 'bed.wav'); VS.wav(b, bw); print(f'речь {sp * 100:.0f} % времени, фраз Кашалота: {int(np.ceil(dur / PHR))}')
    final(voice, sw, bw, os.path.join(od, 'mix.wav'), dur)
