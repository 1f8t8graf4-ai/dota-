#!/usr/bin/env python3
"""v21.0 (19.11): звук главы 4 «2014 · Нагреватели» (копия v200_sound.py). Было: звук главы 3 «1924 · Мальборо» — голос Макса + звуки по событиям + Кашалот (только грув, как в «Льде»).
Трек Кашалота у Андрея, в git не кладём. С путём к треку подложка режется из него (mix193.bed, те же фразы грува).
Без пути — из подложки «Льда» (out/v191y-ru/snd/bed.wav, тоже не в git): с неё снимается проседание под голос «Льда»
(огибающая заново по его голосу) и подъём после голоса; такт j там начинается ровно в j·BAR, его исходный такт — bars_of(ORDER[:11], END_Y)[j].
Дальше такты встают подряд, на стыках — наплыв равной мощности 40 мс, кончается за 5 мс до сильной доли.
Под голосом музыка проседает на 4 дБ, в паузах — на 5,5 дБ тише голоса; в фильме после голоса поднимается на 4 дБ и держит доску.
   python3 v210_sound.py v210y-ru|v210s-ru [трек.mp3]  → out/<ролик>/snd/mix.wav, out/<ролик>/final.mp4"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import mix193 as M
import v165_sound as VS
import tt_audio
from v180_sound import sfx_track
SR, BAR = M.SR, M.BAR
SEQ = {'y': list(range(40)) + list(range(20, 28)), 's': list(range(40)) + list(range(20, 28))}   # фильм главы 4 длиннее (1:44): ещё 4 такта фразы 37   # такты подложки «Льда»: 0–39 — фразы 9 13 17 21 33 37 13 17 21 33; 20–23 — фраза 37


def old_bed():
    o = os.path.join(HERE, 'out', 'v191y-ru'); T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30; n = int(round(dur * SR))
    b = M.dec(os.path.join(o, 'snd', 'bed.wav'))[:n]; env, _, last = M.duck(os.path.join(o, 'voice.wav'), n)
    rise = 10 ** (4 * np.clip((np.arange(n) / SR - last) / .5, 0, 1) / 20)
    return b / (env * rise[:, None])


def bed_from(src, dur, tail, seq):   # как mix193.bed, но источник — уже нарезанная подложка с сильной долей такта j в j·BAR
    n = int(round(dur * SR)); out = np.zeros((n + int(4 * BAR * SR), 2)); xf, gap = int(.04 * SR), int(.005 * SR); pre = xf + gap
    up = np.sin(np.linspace(0, np.pi / 2, xf))[:, None]; dn = np.cos(np.linspace(0, np.pi / 2, xf))[:, None]
    nb = min(len(seq), int(np.ceil(dur / BAR)) + 1); runs = []; j = 0
    while j < nb:
        k = j
        while k + 1 < nb and seq[k + 1] == seq[k] + 1: k += 1
        runs.append((j, k + 1, seq[j])); j = k + 1
    for r, (j0, j1, m) in enumerate(runs):
        d0, d1 = int(round(j0 * BAR * SR)), int(round(j1 * BAR * SR)); s0 = int(round(m * BAR * SR)); p0 = pre if r else 0; last = r == len(runs) - 1
        seg = src[s0 - p0:s0 + (d1 - d0) - (0 if last else gap)].copy()
        if r: seg[:xf] *= up
        else: f = int(.005 * SR); seg[:f] *= np.linspace(0, 1, f)[:, None]
        if not last: seg[-xf:] *= dn
        out[d0 - p0:d0 - p0 + len(seg)] += seg
    x = out[:n]; m = int(tail * SR); x[-m:] *= np.linspace(1, 0, m)[:, None]
    return x


if __name__ == '__main__':
    ep = sys.argv[1]; track = sys.argv[2] if len(sys.argv) > 2 else None; sh = ep.startswith('v210s')
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd'); os.makedirs(od, exist_ok=True)
    T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30; n = int(round(dur * SR)); voice = os.path.join(o, 'voice.wav')
    sw = os.path.join(od, 'sfx.wav'); VS.wav(sfx_track(json.load(open(os.path.join(o, 'cues.json'))), dur), sw)
    tail = .25 if sh else 1.4
    if track: b = M.bed(track, dur, tail, M.bars_of(M.ORDER))
    else: b = bed_from(old_bed(), dur, tail, SEQ['s' if sh else 'y'])
    tmp = os.path.join(od, 'bed_raw.wav'); VS.wav(b, tmp); Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(tmp); os.remove(tmp)
    env, sp, last = M.duck(voice, n); b = b * 10 ** ((Lv - 5.5 - Lm) / 20) * env
    if not sh: b *= 10 ** (4 * np.clip((np.arange(n) / SR - last) / .5, 0, 1) / 20)[:, None]
    bw = os.path.join(od, 'bed.wav'); VS.wav(b, bw); print(f'{ep}: речь {sp * 100:.0f} % времени, подложка {"из трека" if track else "из «Льда»"}')
    M.final(voice, sw, bw, os.path.join(od, 'mix.wav'), dur)
    fin = os.path.join(o, 'final.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'video.mp4'), '-i', os.path.join(od, 'mix.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                    '-t', f'{dur:.4f}', '-movflags', '+faststart', fin], check=True)
    print('готово:', fin)
