# Звук «Боба» v16.5 (13.11, ТЗ Андрея): тяжёлые звуки sfx17/ поверх событий ролика, машины на старте тише,
# саб-удары на поворотах, музыка — чужой трек под наш текст (bed_cachalot.bed: провалы, доска), итог −12,5 LUFS.
# Пробы:
#   A — трек замедлен до 0,92 (ниже тоном, тяжелее), бас музыки прижат под голосом
#   B — то же, но под речью «через стену»; доска — открыто
#   C — весь ролик ×1,07 (голос, звуки, картинка), кроме «Признайтесь… затянуться?» с паузой; трек 1,0×
#   python3 v165_sound.py v165a-ru <трек.mp3> <папка> [A B C]
import json, os, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import bed_cachalot as BC  # noqa: E402
import tt_audio  # noqa: E402

SR = 48000
GAIN = {'boom': .5, 'stamp': .5, 'thud': .42, 'impact': .45, 'vault': .55, 'vaultopen': .45, 'papers': .4, 'drawer': .42, 'vape': .5, 'puff': .5,
        'whoosh': .26, 'dive': .32, 'ding': .3, 'pin': .3, 'tick': .25, 'heart': .45, 'swish': .25, 'coins': .4, 'typing': .34, 'carriage': .3,
        'city': .26 * .35, 'carby': .3 * .4, 'bin': .32, 'factory': .26, 'pour': .3, 'glass': .26, 'marker': .3, 'school': .22, 'keys': .26, 'deep': .3, 'xray': .26}
DIRS = ('sfx17', 'sfx16', 'sfx13', 'sfx8')
SPEED_AB = .92          # пробы А и Б: трек медленнее и ниже тоном
SPEED_C = 1.07          # проба В: ролик быстрее


def dec_mono(path):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).astype(np.float64)


def put(buf, x, t, g, pan):
    i = int(round(t * SR)); n = min(len(x), len(buf) - i)
    if n <= 0 or i < 0: return
    a = (pan + 1) * np.pi / 4; buf[i:i + n, 0] += x[:n] * g * np.cos(a); buf[i:i + n, 1] += x[:n] * g * np.sin(a)


def words(T):
    return [w for s in T['sent'] for w in s['words']]


def wt(T, q, n=0):
    k = 0
    for w in words(T):
        if w['d'].lower().strip('«».,?!…:;') == q:
            if k == n: return w['a']
            k += 1
    raise KeyError(q)


def sfx_track(T, cues, dur):
    cues = [list(c) for c in cues]
    # саб-удары на поворотах сюжета (кроме мест, где уже есть сейф и штампы — там удар внутри звука)
    for q in ('вернёмся', 'четырнадцать', 'мальборо'):
        cues.append([wt(T, q), 'boom', 1, 0])
    buf = np.zeros((int((dur + 3) * SR), 2)); cache = {}; last = {}
    for t0, name, g0, pan in sorted(cues):
        name, _, cut = name.partition(':')
        f = next((p for p in (os.path.join(HERE, d, name + '.mp3') for d in DIRS) if os.path.exists(p)), '')
        if not f or t0 - last.get(name, -9) < (.07 if name == 'tick' else .25): continue
        last[name] = t0
        if name not in cache: cache[name] = dec_mono(f)
        x = cache[name]
        if cut: x = x[:int(float(cut) * SR)].copy(); m = min(len(x) // 3, int(.25 * SR)); x[-m:] *= np.linspace(1, 0, m)
        x = x.copy(); a, b = min(len(x) // 4, int(.004 * SR)), min(len(x) // 4, int(.03 * SR)); x[:a] *= np.linspace(0, 1, a); x[-b:] *= np.linspace(1, 0, b)
        put(buf, x, t0, GAIN.get(name, .3) * g0, pan * .4)
    return buf[:int(dur * SR)]


def wav(x, path):
    x = np.atleast_2d(x.T).T if x.ndim == 1 else x
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', str(x.shape[1]), '-i', '-', '-c:a', 'pcm_s16le', path],
                   input=np.ascontiguousarray(x, np.float32).tobytes(), check=True)


def final(voice, sfx, bedw, out, dur, lufs=-12.5, bed_db=-4.0):
    Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(bedw); g = Lv + bed_db - Lm
    f = ['[0:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000,asplit=3[voc][k1][k2]',
         f'[1:a]aformat=channel_layouts=stereo,volume={g:.2f}dB,acrossover=split=180[lo][hi]',
         '[lo][k1]sidechaincompress=threshold=0.04:ratio=1.8:attack=6:release=220[lod]',
         '[hi][k2]sidechaincompress=threshold=0.06:ratio=2:attack=10:release=260[hid]',
         '[lod][hid]amix=inputs=2:normalize=0[md]',
         f'[voc][md][2:a]amix=inputs=3:normalize=0,apad,atrim=0:{dur:.3f}[m]']
    raw = out + '.raw.wav'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', voice, '-i', bedw, '-i', sfx, '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', raw], check=True)
    L, _ = tt_audio._lufs(raw)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', f'volume={lufs - L:.2f}dB,alimiter=limit=0.89:level=disabled', '-c:a', 'pcm_s16le', out], check=True)
    os.remove(raw); print(os.path.basename(out), tt_audio.report(out))


# ---------- проба В: время ролика ×1,07, кроме «Признайтесь… затянуться?» с паузой ----------
def cmap(T):
    S = T['sent']; a, b = S[14]['a'] - .02, S[15]['a'] - .02
    def f(t): return t / SPEED_C if t < a else a / SPEED_C + (t - a) if t < b else a / SPEED_C + (b - a) + (t - b) / SPEED_C
    return f, a, b


def speed_audio(src, dst, a, b):
    s = SPEED_C
    flt = (f'[0:a]atrim=0:{a:.3f},asetpts=PTS-STARTPTS,atempo={s}[x];[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[y];'
           f'[0:a]atrim={b:.3f},asetpts=PTS-STARTPTS,atempo={s}[z];[x][y][z]concat=n=3:v=0:a=1[o]')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-filter_complex', flt, '-map', '[o]', '-ar', '48000', '-c:a', 'pcm_s16le', dst], check=True)


def speed_video(src, dst, a, b):
    s = SPEED_C
    flt = (f'[0:v]trim=0:{a:.3f},setpts=(PTS-STARTPTS)/{s}[x];[0:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS[y];'
           f'[0:v]trim={b:.3f},setpts=(PTS-STARTPTS)/{s}[z];[x][y][z]concat=n=3:v=1:a=0,fps=30[o]')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-filter_complex', flt, '-map', '[o]', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', dst], check=True)


def run(ep, track, out_dir, kinds):
    o = os.path.join(HERE, 'out', ep); T = json.load(open(os.path.join(o, 'timeline.json'))); dur = T['dur']
    cues = json.load(open(os.path.join(o, 'cues.json'))); voice = os.path.join(o, 'voice.wav')
    os.makedirs(out_dir, exist_ok=True)
    sfxw = os.path.join(out_dir, 'sfx-heavy.wav'); wav(sfx_track(T, cues, dur), sfxw)
    for k in kinds:
        if k in 'AB':
            sp = SPEED_AB; BC.DROP1, BC.DROP3 = 21.069 / sp, 76.321 / sp
            af = f'asetrate={int(48000 * sp)},aresample=48000'
            full = BC.dec(track, af=af); muff = BC.dec(track, af=af + ',lowpass=f=420,lowpass=f=420,volume=3dB')
            bw = os.path.join(out_dir, f'bed-{k}.wav'); BC.enc(BC.bed(T, full, muff, k == 'B'), bw)
            final(voice, sfxw, bw, os.path.join(out_dir, f'mix-{k}.wav'), dur)
        if k == 'C':
            f, a, b = cmap(T); T2 = json.loads(json.dumps(T))
            for s in T2['sent']:
                s['a'], s['b'] = f(s['a']), f(s['b'])
                for w in s['words']: w['a'], w['b'] = f(w['a']), f(w['b'])
            T2['dur'] = f(dur)
            v2, s2 = os.path.join(out_dir, 'voice-C.wav'), os.path.join(out_dir, 'sfx-C.wav'); speed_audio(voice, v2, a, b); speed_audio(sfxw, s2, a, b)
            BC.DROP1, BC.DROP3 = 21.069, 76.321
            full = BC.dec(track); muff = BC.dec(track, af='lowpass=f=420,lowpass=f=420,volume=3dB')
            bw = os.path.join(out_dir, 'bed-C.wav'); BC.enc(BC.bed(T2, full, muff, False), bw)
            final(v2, s2, bw, os.path.join(out_dir, 'mix-C.wav'), T2['dur'])
            json.dump({'a': a, 'b': b, 'dur': T2['dur']}, open(os.path.join(out_dir, 'C.json'), 'w'))


if __name__ == '__main__':
    ep, track, out_dir = sys.argv[1:4]
    run(ep, track, out_dir, sys.argv[4:] or ['A', 'B', 'C'])
