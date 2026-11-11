#!/usr/bin/env python3
"""v14.5: голос после ElevenLabs (out/<ep>/voice.wav + timeline.json, el13.py voice):
  1) пауза перед репликой [14] (сцена 9) — не меньше GAP с: шипение затяжки 0,6 с + глитч; голос не режется и не растягивается, вставляется тишина;
  2) демонический слой на «Признайтесь… затянуться?» по ТЗ: копия на ~5,7 полутона ниже (asetrate 0,72 + atempo 1,388 — длина та же),
     lowpass 900 Гц, эхо, громкость 0,85 — подмешивается ПОД основной голос на всю фразу, без нарастания.
python3 v145_post.py v145m-ru [--gap 0.95]   (повторный запуск безопасен: берёт voice.clean.wav и timeline.raw.json)"""
import json, os, shutil, subprocess, sys
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100
DEMON = 'asetrate=44100*0.72,aresample=44100,atempo=1.388,lowpass=f=900,aecho=0.8:0.88:40:0.4,volume=0.85'


def main(ep, gap=.95):
    out = os.path.join(HERE, 'out', ep); v = os.path.join(out, 'voice.wav'); tlf = os.path.join(out, 'timeline.json')
    raw, tlr = os.path.join(out, 'voice.clean.wav'), os.path.join(out, 'timeline.raw.json')
    if not os.path.exists(raw): shutil.copy(v, raw)
    if not os.path.exists(tlr): shutil.copy(tlf, tlr)
    T = json.load(open(tlr)); y, sr = sf.read(raw, dtype='float32'); assert sr == SR
    S = T['sent']; i9 = next(i for i, s in enumerate(S) if s['scene'] == 's9'); a, b = S[i9 - 1]['words'][-1]['b'], S[i9]['words'][0]['a']
    G = max(0., gap - (b - a)); tb = (a + b) / 2; k = int(tb * SR)
    y = np.concatenate([y[:k], np.zeros(int(G * SR), np.float32), y[k:]])
    for s in S[i9:]:
        s['a'] = round(s['a'] + G, 3); s['b'] = round(s['b'] + G, 3)
        for w in s['words']: w['a'] = round(w['a'] + G, 3); w['b'] = round(w['b'] + G, 3)
    fi = int(tb * 30); T['env'] = T['env'][:fi] + [0.0] * int(round(G * 30)) + T['env'][fi:]; T['dur'] = round(len(y) / SR, 3)
    sf.write(v, y, SR)
    # демонический слой — на всю последнюю фразу перед сценой 9
    L = S[i9 - 1]; t0 = max(0., L['words'][0]['a'] - .05); t1 = L['words'][-1]['b'] + .35
    fg = (f"[0:a]asplit=2[m][d];[d]atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS,{DEMON},afade=t=in:st=0:d=0.04,afade=t=out:st={max(0, t1 - t0 - .2):.3f}:d=0.2,"
          f"adelay={int(t0 * 1000)}|{int(t0 * 1000)}[dl];[m][dl]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[o]")
    tmp = os.path.join(out, 'voice.demon.wav')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', v, '-filter_complex', fg, '-map', '[o]', '-ar', str(SR), '-ac', '1', tmp], check=True)
    os.replace(tmp, v); json.dump(T, open(tlf, 'w'), ensure_ascii=False, indent=1)
    print(ep, f'пауза перед [14]: было {b - a:.2f} с, вставлено {G:.2f} с; демон на фразе {i9 - 1}: {t0:.2f}–{t1:.2f} с; длина {T["dur"]} с')


if __name__ == '__main__':
    a = sys.argv[1:]
    main(a[0], float(a[a.index('--gap') + 1]) if '--gap' in a else .95)
