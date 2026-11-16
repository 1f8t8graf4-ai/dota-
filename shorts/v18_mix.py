#!/usr/bin/env python3
"""v18 (15.11, ночь): сведение выпусков 1 и 2 по ТЗ Gemini (звук):
  — без «пищалок»: ding, tick, pin и шипения swish (синтетика sfx13/sfx8) — их cue выкидываются;
  — музыка громче на 7 дБ (bed −4 → +3 дБ к голосу до сжатия) и мягче проседает под голосом (sidechain ratio 1,8/2 → 1,3/1,4);
  — трек длиннее ролика не нужен: если короче — продолжается сам собой (кусок с 40 с, наплыв 2 с), без провала в тишину.
python3 v18_mix.py <ролик> [трек=music/v164a-pulse.wav]   → out/<ролик>/mix18.wav"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); os.chdir(HERE)
import v165_sound as V
import tt_audio
SR = 48000
BAN = {'ding', 'tick', 'pin', 'swish'}
DIRS = ('sfx18',) + V.DIRS
GAIN = dict(V.GAIN, frost=.5, icecrack=.55, blade=.55, splash=.4, conveyor=.3, wave=.45, pop=.4, register=.5, scroll=.4, drip=.45, cryptex=.5, lipstick=.45, truck=.35, icewind=.4, bubble=.35)


def sfx_track(cues, dur):
    buf = np.zeros((int((dur + 3) * SR), 2)); cache = {}; last = {}
    for t0, name, g0, pan in sorted(cues):
        name, _, cut = name.partition(':')
        if name in BAN: continue
        f = next((p for p in (os.path.join(HERE, d, name + '.mp3') for d in DIRS) if os.path.exists(p)), '')
        if not f or t0 - last.get(name, -9) < .25: continue
        last[name] = t0
        if name not in cache: cache[name] = V.dec_mono(f)
        x = cache[name]
        if cut: x = x[:int(float(cut) * SR)].copy(); m = min(len(x) // 3, int(.25 * SR)); x[-m:] *= np.linspace(1, 0, m)
        x = x.copy(); a, b = min(len(x) // 4, int(.004 * SR)), min(len(x) // 4, int(.03 * SR)); x[:a] *= np.linspace(0, 1, a); x[-b:] *= np.linspace(1, 0, b)
        V.put(buf, x, t0, GAIN.get(name, .3) * g0, pan * .4)
    return buf[:int(dur * SR)]


def music(track, dur, out):
    y = subprocess.run(['ffmpeg', '-v', 'error', '-i', track, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    y = np.frombuffer(y, np.float32).reshape(-1, 2).astype(np.float64)
    e = np.sqrt((y ** 2).mean(1)); nz = np.nonzero(e > 10 ** (-50 / 20))[0]; y = y[:nz[-1] + 1] if len(nz) else y   # хвост тишины трека — прочь
    need = int((dur + .5) * SR); X = int(2.0 * SR); seg = y[int(40 * SR):]
    while len(y) < need:
        w = np.linspace(0, 1, X)[:, None]; y = np.concatenate([y[:-X], y[-X:] * (1 - w) + seg[:X] * w, seg[X:]])
    y = y[:need]; fo = int(.6 * SR); y[-fo:] *= np.linspace(1, 0, fo)[:, None]
    V.wav(y, out)


def final(voice, sfx, bedw, out, dur, lufs=-12.5, bed_db=3.0):
    Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(bedw); g = Lv + bed_db - Lm
    f = ['[0:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000,asplit=3[voc][k1][k2]',
         f'[1:a]aformat=channel_layouts=stereo,volume={g:.2f}dB,acrossover=split=180[lo][hi]',
         '[lo][k1]sidechaincompress=threshold=0.05:ratio=1.3:attack=8:release=260[lod]',
         '[hi][k2]sidechaincompress=threshold=0.07:ratio=1.4:attack=12:release=300[hid]',
         '[lod][hid]amix=inputs=2:normalize=0[md]',
         f'[voc][md][2:a]amix=inputs=3:normalize=0,apad,atrim=0:{dur:.3f}[m]']
    raw = out + '.raw.wav'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', voice, '-i', bedw, '-i', sfx, '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', raw], check=True)
    L, _ = tt_audio._lufs(raw)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', f'volume={lufs - L:.2f}dB,alimiter=limit=0.89:level=disabled', '-c:a', 'pcm_s16le', out], check=True)
    os.remove(raw); print(os.path.basename(out), tt_audio.report(out))


if __name__ == '__main__':
    ep = sys.argv[1]; track = sys.argv[2] if len(sys.argv) > 2 else 'music/v164a-pulse.wav'
    o = os.path.join('out', ep); T = json.load(open(os.path.join(o, 'timeline.json'))); dur = T['dur']
    cues = json.load(open(os.path.join(o, 'cues.json')))
    sw, mw = os.path.join(o, 'sfx18.wav'), os.path.join(o, 'music18.wav')
    V.wav(sfx_track(cues, dur), sw); music(track, dur, mw)
    final(os.path.join(o, 'voice.wav'), sw, mw, os.path.join(o, 'mix18.wav'), dur)
