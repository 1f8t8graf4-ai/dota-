#!/usr/bin/env python3
"""v18.0 (15.11): звук 2-го выпуска — голос (out/<ролик>/voice.wav) + звуки по событиям (cues.json; sfx18 → sfx17 → sfx16 → sfx13 → sfx8)
+ инструментал «Кашелота» (в git не кладём — путь аргументом). ТЗ: без ding / tick / pin / swish, звуки — с срезом верхов;
музыка плотнее (на 6–8 дБ громче прежней подложки «через стену»), мягкий сайдчейн — не пропадает под голосом.
  python3 v180_sound.py <ролик> <трек.mp3> <папка> [смещение трека, с]  → <папка>/mix.wav"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v165_sound as VS  # noqa: E402
import tt_audio  # noqa: E402
SR = 48000
DIRS = ('sfx18', 'sfx17', 'sfx16', 'sfx13', 'sfx8')
BAN = {'ding', 'tick', 'pin', 'swish', 'carriage', 'typing'}
GAIN = dict(VS.GAIN, icecrack=.42, snowroof=.4, neon=.22, truck=.5, blade=.55, splash=.42, chain=.3, scroll=.4, conveyor=.28, wave=.45, plop=.45,
            pageflip=.35, glassbulb=.32, leaves=.3, register=.5, counter=.32, receipt=.28, city=.2, cryptex=.45, lipstick=.45, train=.5, coins=.22, bubble=.3)


def sfx_track(cues, dur):
    buf = np.zeros((int((dur + 3) * SR), 2)); cache = {}; last = {}
    for t0, name, g0, pan in sorted(cues):
        if name in BAN: continue
        f = next((p for p in (os.path.join(HERE, d, name + '.mp3') for d in DIRS) if os.path.exists(p)), '')
        if not f or t0 - last.get(name, -9) < .25: continue
        last[name] = t0
        if name not in cache: cache[name] = VS.dec_mono(f)
        x = cache[name].copy(); a, b = min(len(x) // 4, int(.004 * SR)), min(len(x) // 4, int(.04 * SR)); x[:a] *= np.linspace(0, 1, a); x[-b:] *= np.linspace(1, 0, b)
        VS.put(buf, x, t0, GAIN.get(name, .3) * g0, pan * .4)
    return buf[:int(dur * SR)]


def bed(track, dur, off, tail):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{off:.3f}', '-i', track, '-t', f'{dur + .5:.3f}', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(b, np.float32).reshape(-1, 2).copy(); n = int(dur * SR)
    x = np.concatenate([x, np.zeros((max(0, n - len(x)), 2), np.float32)])[:n]
    a = int(.03 * SR); x[:a] *= np.linspace(0, 1, a)[:, None]
    m = int(tail * SR); x[-m:] *= np.linspace(1, 0, m)[:, None]
    return x


def final(voice, sfx, bedw, out, dur, lufs=-12.5, bed_db=-6.0):
    Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(bedw); g = Lv + bed_db - Lm
    f = ['[0:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000,asplit=3[voc][k1][k2]',
         f'[1:a]aformat=channel_layouts=stereo,volume={g:.2f}dB,acrossover=split=180[lo][hi]',
         '[lo][k1]sidechaincompress=threshold=0.08:ratio=1.4:attack=8:release=260[lod]',
         '[hi][k2]sidechaincompress=threshold=0.1:ratio=1.3:attack=12:release=300[hid]',
         '[lod][hid]amix=inputs=2:normalize=0[md]',
         '[2:a]lowpass=f=7500,highpass=f=40[sx]',
         f'[voc][md][sx]amix=inputs=3:normalize=0,apad,atrim=0:{dur:.3f}[m]']
    raw = out + '.raw.wav'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', voice, '-i', bedw, '-i', sfx, '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', raw], check=True)
    L, _ = tt_audio._lufs(raw)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', f'volume={lufs - L:.2f}dB,alimiter=limit=0.89:level=disabled', '-c:a', 'pcm_s16le', out], check=True)
    os.remove(raw); print(os.path.basename(out), tt_audio.report(out))


if __name__ == '__main__':
    ep, track, od = sys.argv[1:4]; off = float(sys.argv[4]) if len(sys.argv) > 4 else 22.2
    o = os.path.join(HERE, 'out', ep); T = json.load(open(os.path.join(o, 'timeline.json'))); dur = (np.ceil(T['dur'] * 30)) / 30
    os.makedirs(od, exist_ok=True)
    sw = os.path.join(od, 'sfx.wav'); VS.wav(sfx_track(json.load(open(os.path.join(o, 'cues.json'))), dur), sw)
    bw = os.path.join(od, 'bed.wav'); VS.wav(bed(track, dur, off, .25 if ep[:5] in ('v180s', 'v183s', 'v184s', 'v185s', 'v190s') else 1.4), bw)
    final(os.path.join(o, 'voice.wav'), sw, bw, os.path.join(od, 'mix.wav'), dur)
