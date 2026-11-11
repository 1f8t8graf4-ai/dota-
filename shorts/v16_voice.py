#!/usr/bin/env python3
"""v16 (11.11): голос — старая запись v14.5 (ElevenLabs, уже оплачена; новых генераций нет).
  1) пауза перед репликой [14] — как в v14.5 (шипение затяжки + переход к доске);
  2) демонический слой — ТОЛЬКО на последнем слове «…затянуться?» (ТЗ 11.11): копия на ~5,7 полутона ниже
     (asetrate 0,72 + atempo 1,388 — длина та же), lowpass, эхо, подмешивается под основной голос.
python3 v16_voice.py [ep=v16f-ru] [--gap 0.95]  → out/<ep>/voice.wav, timeline.json (берёт out/v145m-ru/voice.clean.wav и timeline.raw.json)"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100
SRC = os.path.join(HERE, 'out', 'v145m-ru')
DEMON = 'asetrate=44100*0.72,aresample=44100,atempo=1.388,lowpass=f=900,aecho=0.8:0.88:40:0.4,volume=0.9'


def main(ep, gap=.95):
    out = os.path.join(HERE, 'out', ep); os.makedirs(out, exist_ok=True)
    T = json.load(open(os.path.join(SRC, 'timeline.raw.json'))); y, sr = sf.read(os.path.join(SRC, 'voice.clean.wav'), dtype='float32'); assert sr == SR
    txt = ' '.join(w['d'] for s in T['sent'] for w in s['words']).lower()
    assert 'на самом деле' not in txt, 'в голосе есть «на самом деле» — вырезать'
    S = T['sent']; i9 = next(i for i, s in enumerate(S) if s['scene'] == 's9'); a, b = S[i9 - 1]['words'][-1]['b'], S[i9]['words'][0]['a']
    G = max(0., gap - (b - a)); tb = (a + b) / 2; k = int(tb * SR)
    y = np.concatenate([y[:k], np.zeros(int(G * SR), np.float32), y[k:]])
    for s in S[i9:]:
        s['a'] = round(s['a'] + G, 3); s['b'] = round(s['b'] + G, 3)
        for w in s['words']: w['a'] = round(w['a'] + G, 3); w['b'] = round(w['b'] + G, 3)
    fi = int(tb * 30); T['env'] = T['env'][:fi] + [0.0] * int(round(G * 30)) + T['env'][fi:]; T['dur'] = round(len(y) / SR, 3); T['ep'] = ep
    v = os.path.join(out, 'voice.dry.wav'); sf.write(v, y, SR)
    # демон — только последнее слово фразы перед сценой 9
    W = S[i9 - 1]['words'][-1]; assert W['d'].lower().startswith('затянуться'), W['d']
    t0 = max(0., W['a'] - .03); t1 = W['b'] + .4
    fg = (f"[0:a]asplit=2[m][d];[d]atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS,{DEMON},afade=t=in:st=0:d=0.03,afade=t=out:st={max(0, t1 - t0 - .25):.3f}:d=0.25,"
          f"adelay={int(t0 * 1000)}|{int(t0 * 1000)}[dl];[m][dl]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[o]")
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', v, '-filter_complex', fg, '-map', '[o]', '-ar', str(SR), '-ac', '1', os.path.join(out, 'voice.wav')], check=True)
    json.dump(T, open(os.path.join(out, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(ep, f'пауза перед [14]: было {b - a:.2f} с, вставлено {G:.2f} с; демон на «{W["d"]}»: {t0:.2f}–{t1:.2f} с; длина {T["dur"]} с')


if __name__ == '__main__':
    a = sys.argv[1:]
    main(a[0] if a and not a[0].startswith('-') else 'v16f-ru', float(a[a.index('--gap') + 1]) if '--gap' in a else .95)
