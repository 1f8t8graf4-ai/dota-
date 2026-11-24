#!/usr/bin/env python3
"""v23.6 (22.11): полный фильм «Что вы знаете о никотине?» одним роликом — пролог + главы 1–5 (с финалом).
Андрей: «склипай уже ролик 1»; Gemini: на стыках глав музыка не должна обрываться и стартовать заново.

Картинка — готовые video.mp4 глав встык, кадр в кадр: последний кадр главы — кадр следующей за 1/30 с до её кадра 0;
если последний кадр главы совпадает с кадром 0 следующей (повтор), он выкидывается.
Звук:
  - пролог — его готовый звук (голос, звуки, его грув, который гаснет на низком ударе; хвост дождя заходит под главу 1);
  - главы 1–5 — голос и звуки по событиям каждой главы на своих местах, а музыка — ОДНА непрерывная дорожка поверх
    всех глав (грув Кашалота «из-за стены», как в главе 1 фильма: LP, в паузах на 6 дБ тише голоса, под голосом ещё −5,5 дБ),
    без afade на стыках глав — она не обрывается и не стартует заново;
  - в голосе: цифровая тишина между фразами больше не обрывается щелчком — у краёв тишины мягкие подъёмы/спады по 8 мс.
  python3 film_build.py ru [en|de]   → out/film-<язык>/film.mp4 (+ mix.wav, voice.wav, sfx.wav, bed.wav), проверка стыков
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import mix193 as M, v165_sound as VS, tt_audio, bedfill, v210_sound as V2
from v234_ep1_film import LP, QUIET, FADE
SR = M.SR; FPS = 30

# (ролик, голос, звуки по событиям) — пути относительно out/
def segs(lang):
    if lang == 'ru':
        return [('v231f-ru', None, None),   # пролог: готовый звук целиком
                ('v170e-ru', 'v170e-ru/voice.wav', 'v170e-ru/sfx226.wav'),
                ('v191y-ru', 'v191y-ru/voice.wav', 'v191y-ru/snd/sfx.wav'),
                ('v200y-ru', 'v200y-ru/voice.wav', 'v200y-ru/snd/sfx.wav'),
                ('v210y-ru', 'v210y-ru/voice.wav', 'v210y-ru/snd/sfx.wav'),
                ('v220y-ru', 'v220y-ru/voice.wav', 'v220y-ru/snd/sfx.wav')]
    L = lang
    pr = [(f'v231f-{L}', None, None)] if os.path.exists(os.path.join(HERE, 'out', f'v231f-{L}', 'snd', 'mix.wav')) else []
    return pr + [(f'{e}-{L}-vo', f'{e}-{L}-vo/voice.wav', f'{e}-{L}-vo/snd/sfx.wav') for e in ('v170e', 'v191y', 'v200y', 'v210y', 'v220y')]


def frames(p):
    return int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', p],
                              capture_output=True, text=True, check=True).stdout)


def grab(p, idx, tmp):   # кадр № idx, 270×480
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', p, '-vf', f'select=eq(n\\,{idx}),scale=iw/4:ih/4', '-vsync', '0', '-frames:v', '1', tmp], check=True)
    from PIL import Image
    return np.asarray(Image.open(tmp).convert('RGB'), float)


def load48(p, n=None):   # → стерео 48 кГц, float64
    tmp = p + '.48k.wav'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', p, '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_f32le', tmp], check=True)
    y, _ = sf.read(tmp, dtype='float64'); os.remove(tmp)
    if n is not None: y = np.pad(y, ((0, max(0, n - len(y))), (0, 0)))[:n]
    return y


def declick(v, mn=.02, f=.008):   # мягкие края у цифровой тишины между фразами (щелчок на «А в Америку»)
    a = np.abs(v).max(1) < 1e-6; F = int(f * SR); m = int(mn * SR); i = 0; n = len(a); cnt = 0
    while i < n:
        if a[i]:
            j = i
            while j < n and a[j]: j += 1
            if j - i >= m:
                if i > 0: k0 = max(0, i - F); v[k0:i] *= np.linspace(1, 0, i - k0)[:, None]
                if j < n: k1 = min(n, j + F); v[j:k1] *= np.linspace(0, 1, k1 - j)[:, None]; cnt += 1
            i = j
        else: i += 1
    return cnt


def calm(b, od):   # грув → «из-за стены», как в главе 1 фильма
    a = os.path.join(od, 'bed_raw.wav'); z = os.path.join(od, 'bed_lp.wav'); VS.wav(b, a)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', a, '-af', LP, '-c:a', 'pcm_f32le', z], check=True)
    y, _ = sf.read(z, dtype='float64'); os.remove(a); os.remove(z); return y[:len(b)]


def main(lang):
    S = segs(lang)
    if os.environ.get('FB_SEGS'): S = S[:int(os.environ['FB_SEGS'])]   # 24.11: часть фильма — первые N кусков (пролог + главы), например EN пролог + главы 1–3: FB_SEGS=4
    o = os.path.join(HERE, 'out', f'film-{lang}'); os.makedirs(o, exist_ok=True); tmpf = os.path.join(o, 'f.png')
    V = [os.path.join(HERE, 'out', e, os.environ.get('FB_VIDEO', 'video.mp4')) for e, _, _ in S]; N = [frames(p) for p in V]   # 23.11: FB_VIDEO=video_w.mp4 — фильм 16:9 (wide_render.py)
    keep = list(N)   # сколько кадров главы берём
    for i in range(len(S) - 1):   # стык: повтор кадра — выкидываем последний кадр главы
        a = grab(V[i], N[i] - 1, tmpf); b = grab(V[i + 1], 0, tmpf); d = np.abs(a - b).mean()
        b1 = grab(V[i + 1], 1, tmpf); step = np.abs(b1 - b).mean()
        if d < .35 * max(step, .5): keep[i] -= 1
        print(f'стык {S[i][0]} → {S[i + 1][0]}: разница {d:.2f} при шаге главы {step:.2f}' + (' — повтор кадра, выкинут' if keep[i] < N[i] else ''))
    off = np.concatenate([[0], np.cumsum(keep)]) / FPS; total = off[-1]; n = int(round(total * SR))
    pr = S[0][1] is None
    c0 = off[1] if pr else 0.   # отсюда — главы (общая музыка)
    # голос и звуки глав на своих местах
    voice = np.zeros((n, 2)); sfx = np.zeros((n, 2))
    for i, (e, vp, sp) in enumerate(S):
        if vp is None: continue
        i0 = int(round(off[i] * SR)); L = int(round(keep[i] / FPS * SR))
        voice[i0:i0 + L] += load48(os.path.join(HERE, 'out', vp), L)
        sfx[i0:i0 + L] += load48(os.path.join(HERE, 'out', sp), L)
    print('мягких краёв у тишины в голосе:', declick(voice))
    k0 = int(round(c0 * SR)); m = n - k0
    vw = os.path.join(o, 'voice.wav'); sf.write(vw, voice[k0:].astype(np.float32), SR)
    sw = os.path.join(o, 'sfx.wav'); sf.write(sw, sfx[k0:].astype(np.float32), SR)
    # одна музыка на все главы
    dur = m / SR; seq = list(range(40))
    while len(seq) < int(np.ceil(dur / M.BAR)) + 1: seq += list(range(20, 40))
    b = calm(bedfill.fill(V2.bed_from(V2.old_bed(), dur, 1.4, seq), SR), o)
    tmp = os.path.join(o, 'bed_t.wav'); VS.wav(b, tmp); Lv, _ = tt_audio._lufs(vw); Lm, _ = tt_audio._lufs(tmp); os.remove(tmp)
    env, spr, last = M.duck(vw, m, db=-5.5); b = b * 10 ** ((Lv - QUIET - Lm) / 20) * env
    t = np.arange(m) / SR
    b *= 10 ** (4 * np.clip((t - last) / .5, 0, 1) / 20)[:, None]      # после последней строки — поднимается
    b *= (np.clip(t / FADE, 0, 1) ** 1.5)[:, None]                       # вступает мягко с началом главы 1 (грув пролога гаснет на ударе)
    b *= np.clip((dur - t) / 2.5, 0, 1)[:, None]                         # в самом конце фильма гаснет
    bw = os.path.join(o, 'bed.wav'); VS.wav(b, bw)
    mc = os.path.join(o, 'mix_ch.wav'); M.final(vw, sw, bw, mc, dur)
    x = np.zeros((n + SR * 2, 2)); y = load48(mc); x[k0:k0 + len(y)] += y
    if pr:
        p, _ = sf.read(os.path.join(HERE, 'out', S[0][0], 'snd', 'mix.wav'), dtype='float64')
        if p.ndim == 1: p = np.repeat(p[:, None], 2, 1)
        x[:len(p)] += p
    x = x[:n]; pk = np.abs(x).max(); x = x / max(1, pk / .97)
    mw = os.path.join(o, 'mix.wav'); sf.write(mw, x.astype(np.float32), SR, subtype='PCM_16')
    if os.environ.get('FB_LN'):   # 24.11 (ТЗ YouTube): громкость −14 LUFS, пик не выше −1,5 dBTP — loudnorm в два прохода, линейно (без компрессии)
        I, TP = os.environ.get('FB_LN'), os.environ.get('FB_TP', '-1.5')
        js = subprocess.run(['ffmpeg', '-hide_banner', '-i', mw, '-af', f'loudnorm=I={I}:TP={TP}:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
        J = json.loads(js[js.rindex('{'):js.rindex('}') + 1]); ln = mw[:-4] + '_ln.wav'
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', mw, '-af', f"loudnorm=I={I}:TP={TP}:LRA=11:measured_I={J['input_i']}:measured_TP={J['input_tp']}:measured_LRA={J['input_lra']}:measured_thresh={J['input_thresh']}:offset={J['target_offset']}:linear=true,aresample=48000",
                        '-ar', '48000', '-c:a', 'pcm_s24le', ln], check=True); os.replace(ln, mw)
        print('loudnorm:', J['input_i'], '→', I, 'LUFS;', tt_audio.report(mw))
    print('звук фильма:', tt_audio.report(mw), f'речь {spr * 100:.0f} %', f'длина {total:.2f} с')
    # картинка встык
    inp, fl = [], []
    for i, p in enumerate(V):
        inp += ['-i', p]; fl.append(f'[{i}:v]settb=1/30,setpts=PTS-STARTPTS,trim=end_frame={keep[i]},setpts=PTS-STARTPTS[v{i}]')
    up = f",scale={os.environ['FB_SCALE']}:flags=lanczos" if os.environ.get('FB_SCALE') else ''   # 24.11: 1920×1080 → 2560×1440 (YouTube отдаёт VP9 — вектор не мылится)
    fl.append(''.join(f'[v{i}]' for i in range(len(V))) + f'concat=n={len(V)}:v=1:a=0{up},format=yuv420p[v]')
    out = os.path.join(o, os.environ.get('FB_OUT', 'film.mp4'))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *inp, '-i', mw, '-filter_complex', ';'.join(fl), '-map', '[v]', '-map', f'{len(V)}:a',
                    '-c:v', 'libx264', '-crf', os.environ.get('FB_CRF', '18'), '-preset', os.environ.get('FB_PRESET', 'medium'), '-c:a', 'aac', '-b:a', os.environ.get('FB_AB', '192k'), '-ar', '48000', '-shortest', '-movflags', '+faststart', out], check=True)   # FB_PRESET=veryfast — быстрее (фильм всё равно пережимается для отправки)
    json.dump({'seg': [e for e, _, _ in S], 'frames': keep, 'off': [round(float(v), 4) for v in off]}, open(os.path.join(o, 'film.json'), 'w'), indent=1)
    print(out, f'{frames(out)} кадров')
    os.remove(tmpf)


if __name__ == '__main__':
    for lang in sys.argv[1:] or ['ru']: main(lang)
