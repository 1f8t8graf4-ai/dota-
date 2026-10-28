# Звук роликов TikTok без пустот (28.10; Андрей: «анализируй аудио, чтобы тишины не было», 5 примеров).
# Что у примеров (замер ffmpeg ebur128 + Vosk): речь идёт 87–93 % времени, паузы между репликами ≤ 0,5–0,9 с,
# между словами уровень не падает ниже −34…−43 dBFS (комнатный фон, у мультика — музыка), громкость −12…−16 LUFS,
# разброс громкости (LRA) 1–1,5 LU — голос плотный, ровный.
# У наших проб было: речь 51–67 %, паузы до 4,5 с, вне речи −48…−60 dBFS, местами цифровая тишина, LRA 7–9.
# Поэтому каждый сборщик (tt_lines, tt_chat, tt_guest) отдаёт сюда свою смесь:
#   - голос сжат (компрессор) — ровный, как у примеров;
#   - фон места идёт всё время на ~22 дБ тише голоса и проседает под голос; нет фона — тихий «воздух» (коричневый шум);
#   - фон с первой и до последней миллисекунды: в начале и конце ролика — наплыв 0,15 с, не из тишины;
#   - итог −14 LUFS, пик ≤ −1 dBFS.
#   from tt_audio import master, report
#   master(voice_wav, out_wav, dur, bed=None, extra=None)   → out_wav
#   report(wav) → {'lufs', 'lra', 'floor'} — проверка: floor (самая тихая 0,1 с) должна быть выше −50 dBFS
import os, re, subprocess

import numpy as np

BED_DB = -22      # фон относительно голоса, LU
FLOOR = -50       # ниже этого dBFS в ролике не бывает ни одной 0,1 с


def _run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(r.stderr[-2000:])
    return r


def _lufs(p):
    r = _run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'ebur128', '-f', 'null', '-'])
    i = re.findall(r'I:\s+(-?[\d.]+) LUFS', r.stderr)
    lra = re.findall(r'LRA:\s+(-?[\d.]+) LU', r.stderr)
    return float(i[-1]), float(lra[-1]) if lra else 0.0


def _floor(p):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True)
    x = np.frombuffer(r.stdout, '<i2').astype(float) / 32768
    k = 1600
    n = len(x) // k
    if not n:
        return -120.0
    e = np.sqrt((x[:n * k].reshape(n, k) ** 2).mean(1))
    return float(20 * np.log10(max(e.min(), 1e-6)))


def report(p):
    L, lra = _lufs(p)
    return {'lufs': round(L, 1), 'lra': round(lra, 1), 'floor': round(_floor(p), 1)}


def master(voice, out, dur, bed=None, extra=None, ir=None, wet=0.12):
    # voice — голоса (wav, тишина между репликами), extra — шорохи/вжухи (wav той же длины или None),
    # bed — фон места (петля, любой длины) или None — тогда тихий «воздух», ir — эхо места для голоса (afir) или None
    Lv, _ = _lufs(voice)
    ins = ['-i', voice]
    n = 1
    if ir:
        ins += ['-i', ir]
        irn = n
        n += 1
    if bed:
        ins += ['-stream_loop', '-1', '-i', bed]
    else:
        ins += ['-f', 'lavfi', '-i', 'anoisesrc=color=brown:amplitude=0.5:sample_rate=48000:seed=7']
    bn = n
    n += 1
    if extra:
        ins += ['-i', extra]
        xn = n
        n += 1
    # громкость фона: меряем его отдельно, ставим на BED_DB под голос
    if bed:
        Lb, _ = _lufs(bed)
        bed_f = f'[{bn}:a]aresample=48000,aformat=channel_layouts=stereo'
    else:
        Lb = -18.0   # коричневый шум после фильтров ниже — примерно столько
        bed_f = f'[{bn}:a]aformat=channel_layouts=stereo,highpass=f=60,lowpass=f=900'
    gb = Lv + BED_DB - Lb
    f = [f'[0:a]aresample=48000,aformat=channel_layouts=stereo,'
         f'acompressor=threshold=0.06:ratio=3.5:attack=4:release=120:makeup=2.5[vc]']
    if ir:
        f.append(f'[vc]asplit=2[vd][vr];[{irn}:a]aformat=channel_layouts=stereo[irs];'
                 f'[vr][irs]afir=gtype=gn,volume={wet},lowpass=f=5200[vrv];[vd][vrv]amix=inputs=2:normalize=0[voc]')
    else:
        f.append('[vc]anull[voc]')
    f.append('[voc]asplit=2[voc1][sc]')
    f.append(f'{bed_f},volume={gb:.2f}dB,atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,'
             f'afade=t=in:d=0.15,afade=t=out:st={max(0, dur - .2):.3f}:d=0.2[bd]')
    # проседает под голос всего на ~4 дБ: фон слышно и между словами
    f.append('[bd][sc]sidechaincompress=threshold=0.05:ratio=2.5:attack=15:release=350[bdd]')
    mixin = '[voc1][bdd]' + (f'[{xn}:a]' if extra else '')
    f.append(f'{mixin}amix=inputs={3 if extra else 2}:normalize=0,apad,atrim=0:{dur:.3f}[m]')
    tmp = out + '.raw.wav'
    _run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', ';'.join(f), '-map', '[m]', '-ar', '48000', '-c:a', 'pcm_s16le', tmp])
    L, _ = _lufs(tmp)
    _run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-af', f'volume={-14 - L:.2f}dB,alimiter=limit=0.89:level=disabled',
          '-c:a', 'pcm_s16le', out])
    os.remove(tmp)
    return out


if __name__ == '__main__':
    import json, sys
    for p in sys.argv[1:]:
        print(p, json.dumps(report(p), ensure_ascii=False))
