#!/usr/bin/env python3
"""v23.3 (22.11): голос Макса (out/<ролик>/voice.wav — v233_tl.py) — той же обработкой и на том же уровне, что голос главы 1 в её сведении
(mix193.final: компрессор, −3 дБ на 7 кГц, общий множитель громкости); гул и звуки под голосом на 3 дБ тише. Без «бульканья» и молнии:
капля садится мягким ударом (land), под втягивание капли — саб-подъём (sub), на вспышке кольца — лёгкий выдох пара (steam).
v23.2 (22.11): хвост пролога — грув Кашалота (глава 1 теперь на нём, v226_ep1_sound.py): такты 18–19 подложки «Льда» из-под фильтра,
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
TAILF, XF = 1.5, 0.   # v23.6, фильм: хвост звука пролога под главу 1; картинка — встык: последний кадр пролога = кадр главы 1 за 1/30 с до её кадра 0


def ch1_gains(bedf='bed226.wav'):   # → (подложка главы 1 на старте / нарезанный грув, множитель громкости её финала — mix193.final); фильм — bed234f.wav
    T = json.load(open(os.path.join(C1, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30
    seq = list(range(40))
    while len(seq) < int(np.ceil(dur / M.BAR)) + 1: seq += list(range(20, 40))
    raw = bedfill.fill(V2.bed_from(V2.old_bed(), dur, 1.4, seq), SR)
    bed, _ = sf.read(os.path.join(C1, bedf), dtype='float64'); w = slice(int(.02 * SR), int(.2 * SR))
    k_bed = np.sqrt((bed[w] ** 2).mean() / max(1e-12, (raw[w] ** 2).mean()))
    tmp = os.path.join(C1, 'raw_probe.wav')
    f = ['[0:a]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000[voc]',
         '[1:a]aformat=channel_layouts=stereo,highpass=f=35[md]', '[2:a]lowpass=f=7500,highpass=f=40[sx]', f'[voc][md][sx]amix=inputs=3:normalize=0,apad,atrim=0:{dur:.3f}[m]']
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(C1, 'voice.wav'), '-i', os.path.join(C1, bedf), '-i', os.path.join(C1, 'sfx226.wav'),
                    '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', tmp], check=True)
    L, _ = tt_audio._lufs(tmp); os.remove(tmp)
    return k_bed, 10 ** ((-12.5 - L) / 20)


def ch1_gain(): k, g = ch1_gains(); return k * g


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


def speech_rms(y, sr):   # громкость речи (окна по 50 мс, верхние 60 % по громкости)
    h = int(.05 * sr); n = len(y) // h; e = np.sqrt((y[:n * h].reshape(n, h) ** 2).mean(1)); e = np.sort(e)[int(n * .4):]; return np.sqrt((e ** 2).mean())


def preroll_film(n, K):   # v23.4, фильм: тот же грув пролога раскрывается с «Начнём», на низком ударе (K['hit'], сильная доля такта) гаснет за ~1,3 с
    g = ch1_gain(); src = V2.old_bed(); B = M.BAR
    seg = bedfill.fill(V2.bed_from(src, 3 * B + .01, .002, [17, 18, 19]), SR) * g
    i0 = int(round((K['hit'] - 2 * B) * SR)); t = (np.arange(len(seg)) + i0) / SR; h = K['hit']
    k = np.clip((t - (K['grow'] - .15)) / (h - (K['grow'] - .15)), 0, 1); d = np.clip((t - h) / 1.25, 0, 1)
    fc = np.where(t < h, 180 * (18000 / 180) ** (k ** 1.6), 18000 * (260 / 18000) ** d)
    gain = np.where(t < h, k ** 1.8, np.exp(-(t - h) / .42) * (1 - d))
    y = V.lowpass_tv(seg, fc) * gain[:, None]
    out = np.zeros((n, 2)); j0, j1 = max(0, i0), min(n, i0 + len(y)); out[j0:j1] = y[j0 - i0:j1 - i0]; return out


def rain(L, rise=1.0, fall=1.3, db=-31.):   # мягкий дождь: шум 900–7000 Гц и редкие капли; вступает за rise с, к концу гаснет за fall с
    rng = np.random.default_rng(234); t = np.arange(L) / SR; z = rng.standard_normal((L, 2))
    F = np.fft.rfft(z, axis=0); fr = np.fft.rfftfreq(L, 1 / SR)[:, None]; F *= np.exp(-((np.log(fr + 1) - np.log(2600)) ** 2) / .9); x = np.fft.irfft(F, L, axis=0)
    x /= np.sqrt((x ** 2).mean()); x *= 10 ** (db / 20) * (1 + .15 * np.sin(2 * np.pi * .7 * t))[:, None]
    for _ in range(int(L / SR * 9)):   # капли
        i = rng.integers(0, L - 2000); d = V.click(.004, .7) * rng.uniform(.004, .012); x[i:i + len(d), rng.integers(0, 2)] += d
    env = np.minimum(1, t / rise) * np.clip((t[-1] - t) / fall, 0, 1); return x * env[:, None]


def voice(o, n, bedf='bed226.wav'):   # голос пролога → как голос главы 1 в её финале (уровень речи, компрессор, тембр, множитель громкости)
    vp = os.path.join(o, 'voice.wav')
    if not os.path.exists(vp): return np.zeros((n, 2)), np.zeros(n)
    y, sr = sf.read(vp, dtype='float64'); y = y if y.ndim == 1 else y.mean(1); c, sr1 = sf.read(os.path.join(C1, 'voice.wav'), dtype='float64'); c = c if c.ndim == 1 else c.mean(1)
    tmp = os.path.join(o, 'snd', 'voice_lv.wav'); sf.write(tmp, (y * speech_rms(c, sr1) / speech_rms(y, sr)).astype(np.float32), sr)
    pr = os.path.join(o, 'snd', 'voice_pr.wav')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-af', 'aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5,treble=g=-3:f=7000',
                    '-c:a', 'pcm_f32le', pr], check=True)
    v, _ = sf.read(pr, dtype='float64'); os.remove(tmp); v = np.concatenate([v, np.zeros((max(0, n - len(v)), 2))])[:n] * ch1_gains(bedf)[1]
    h = int(.02 * SR); m = len(v) // h; e = np.sqrt((v[:m * h].reshape(m, h, 2) ** 2).mean(axis=(1, 2)))
    act = np.repeat((e > .02).astype(float), h); act = np.concatenate([act, np.zeros(n - len(act))])
    k = np.exp(-1 / (.18 * SR)); a = np.copy(act)   # плавно: подъём и спад ≈ 0,2 с
    for i in range(1, n): a[i] = max(act[i], a[i - 1] * k) if act[i] >= a[i - 1] else a[i - 1] * k + act[i] * (1 - k)
    return v, a


def sub_rise(dur):   # мягкий саб-подъём: 34 → 58 Гц (и тише октава выше, чтобы было слышно на телефоне), нарастает и гаснет
    L = int((dur + .35) * SR); t = np.arange(L) / SR; u = np.clip(t / dur, 0, 1); f = 34 + 24 * u ** 1.4; ph = 2 * np.pi * np.cumsum(f) / SR
    e = (u ** 1.7) * np.where(t > dur, np.exp(-(t - dur) / .12), 1) * np.minimum(1, t / .3)
    return (np.sin(ph) + .28 * np.sin(2 * ph + .4)) * e


def steam(dur=.7):   # лёгкий выдох пара: шум 500–4000 Гц, быстрый вдох-атака и мягкий спад
    L = int(dur * SR); t = np.arange(L) / SR; nz = np.random.default_rng(233).standard_normal(L)
    F = np.fft.rfft(nz); fr = np.fft.rfftfreq(L, 1 / SR); F *= np.exp(-((np.log(fr + 1) - np.log(1500)) ** 2) / .7); x = np.fft.irfft(F, L); x /= np.abs(x).max()
    return x * np.minimum(1, t / .07) * np.exp(-np.maximum(0, t - .07) / .2)


def styk(o, TE, mw, sec):   # пролог + первые sec с главы 1 (картинка и звук встык; глава 1 — со звуком на груве Кашалота, mix226.wav)
    v1 = os.path.join(C1, f'first{sec}.mp4'); a, _ = sf.read(mw, dtype='float64'); b, _ = sf.read(os.path.join(C1, 'mix226.wav'), dtype='float64')
    ab = np.concatenate([a, b[:int(sec * SR)]]); aw = os.path.join(o, 'snd', 'styk.wav'); sf.write(aw, ab.astype(np.float32), SR, subtype='PCM_16')
    lst = os.path.join(o, 'snd', 'styk.txt'); open(lst, 'w').write(f"file '{os.path.join(o, 'video.mp4')}'\nfile '{v1}'\n")
    out = os.path.join(o, 'styk.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-i', aw, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
    print(out, tt_audio.report(aw))


def limit(x, ceil=.95):   # огибающая усиления только у пиков выше ceil: атака ~8 мс, отпускание ~60 мс (без scipy)
    a = np.abs(x).max(1); g = np.ones(len(a)); W = int(.008 * SR)
    for i in np.where(a > ceil)[0]: g[max(0, i - W):i + W] = np.minimum(g[max(0, i - W):i + W], ceil / a[i])
    if g.min() >= 1: return g
    r = np.exp(-1 / (.06 * SR)); out = g.copy(); idx = np.where(g < 1)[0]
    for k in range(idx[0], min(len(out), idx[-1] + int(.5 * SR))):
        if k: out[k] = min(g[k], r * out[k - 1] + (1 - r))
    ra = np.exp(-1 / (.003 * SR))   # и атака — плавным спуском заранее, без ступеньки
    for k in range(min(len(out), idx[-1] + int(.5 * SR)) - 2, max(0, idx[0] - int(.05 * SR)) - 1, -1):
        out[k] = min(out[k], ra * out[k + 1] + (1 - ra))
    return out


def build(ep):
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd'); os.makedirs(od, exist_ok=True)
    T = json.load(open(os.path.join(o, 'timeline.json'))); TE = T['dur']; FILM = ep.startswith('v231f')
    n = int(round((TE + (TAILF if FILM else 0)) * SR))   # фильм: хвост удара и дождь заходят под наплыв в главу 1
    C = json.load(open(os.path.join(o, 'cues.json')))
    fl = next(c[0] for c in C if c[1] == 'drop') + .03
    K = {'TE': TE, 'crack': fl - .5, 'flare': fl, 'grow': next(c[0] for c in C if c[1] == 'sub') + .06}
    if FILM: K['hit'] = next(c[0] for c in C if c[1] == 'hit')
    buf = np.zeros((n + SR, 2))
    V.put(buf, V.drone(int(round(TE * SR)), K), 0, .2)
    for t0, nm, g0, pan in C:
        if nm == 'hb': V.put(buf, V.thump(92, 46, .32, .11), t0, .5 * g0); V.put(buf, .55 * V.thump(80, 44, .3, .1), t0 + .19, .5 * g0); V.put(buf, V.click(.003), t0, .07 * g0)
        elif nm == 'drop': V.put(buf, V.thump(120, 31, 1.8, .75), t0, .75); V.put(buf, V.click(.02, .3), t0, .16)
        elif nm == 'land': V.put(buf, V.thump(78, 40, .55, .14), t0, .55 * g0)
        elif nm == 'sub': ts = next(c[0] for c in C if c[1] == 'steam' and c[0] > t0 + .5); V.put(buf, sub_rise(ts - t0), t0, .42 * g0)
        elif nm == 'hit': V.put(buf, V.thump(66, 28, 2.6, .75), t0, .85 * g0); V.put(buf, V.click(.02, .3), t0, .08)   # низкий удар — бит на нём гаснет
        elif nm == 'rain': r = rain(n - int(t0 * SR)); buf[int(t0 * SR):int(t0 * SR) + len(r)] += r * g0
        elif nm == 'steam': V.put(buf, steam(), t0, .1 * g0, .05)
    SYN = ('hb', 'drop', 'land', 'sub', 'steam', 'hit', 'rain')
    sfx = sfx_track([c for c in C if c[1] not in SYN], TE + 1); buf[:len(sfx)] += 1.7 * sfx[:len(buf)]
    v, act = voice(o, n, 'bed234f.wav' if FILM else 'bed226.wav')
    x = np.tanh(buf[:n] * 1.4) / 1.4 * (1 - .29 * act)[:, None] + v   # гул и звуки под голосом — на 3 дБ тише
    x += preroll_film(n, K) if FILM else preroll(n, K) + riser(n)
    f = int(.003 * SR); x[-f:] *= np.linspace(1, 0, f)[:, None]
    x *= limit(x)[:, None]   # v23.6: у немецкого голоса пики выше 1 — мягкий лимитер вместо среза в PCM_16
    mw = os.path.join(od, 'mix.wav'); sf.write(mw, x.astype(np.float32), SR, subtype='PCM_16')
    print(os.path.basename(mw), tt_audio.report(mw), 'пик %.2f' % np.abs(x).max())
    fin = os.path.join(o, 'final.mp4')
    if FILM: film(o, TE, mw); return o, TE, mw
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'video.mp4'), '-i', mw, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', fin], check=True)
    return o, TE, mw


def film(o, TE, mw):   # v23.4: пролог фильма + глава 1 для фильма (с ночного города, film234.mp4) — наплыв XF с через темноту; звук внахлёст
    ch = os.path.join(C1, 'film234.mp4'); cw = os.path.join(C1, 'mix234f.wav'); CUT = 0.0   # v23.6: глава с начала
    a, _ = sf.read(mw, dtype='float64'); b, _ = sf.read(cw, dtype='float64'); b = b[int(round(CUT * SR)):]
    i = int(round((TE - XF) * SR)); x = np.zeros((max(len(a), i + len(b)), 2)); x[:len(a)] += a; x[i:i + len(b)] += b
    pk = np.abs(x).max(); x = x / max(1, pk / .97)
    aw = os.path.join(o, 'snd', 'film.wav'); sf.write(aw, x.astype(np.float32), SR, subtype='PCM_16')
    for nm, sec in (('film_styk.mp4', 10.0), ('film_ch1.mp4', None)):
        out = os.path.join(o, nm); dur = [] if sec is None else ['-t', f'{TE - XF + sec:.3f}']
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'video.mp4'), '-i', ch, '-i', aw,
                        '-filter_complex', f'[0:v]settb=1/30,setpts=PTS-STARTPTS[a];[1:v]settb=1/30,setpts=PTS-STARTPTS[b];' + (f'[a][b]xfade=transition=fade:duration={XF}:offset={TE - XF:.4f},format=yuv420p[v]' if XF else '[a][b]concat=n=2:v=1:a=0,format=yuv420p[v]'),
                        '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-shortest', *dur, '-movflags', '+faststart', out], check=True)
        print(out, tt_audio.report(aw) if sec is None else '')


if __name__ == '__main__':
    ep = sys.argv[1]; o, TE, mw = build(ep)
    if len(sys.argv) > 2 and sys.argv[2] == 'styk': styk(o, TE, mw, int(sys.argv[3]) if len(sys.argv) > 3 else 8)
