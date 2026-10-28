# -*- coding: utf-8 -*-
# ТЗ-ZAI-v15 п.1: время слов во всех репликах героев.
# heroes-voice/*.mp3 -> faster-whisper medium.en (word_timestamps, без VAD), вход 16 кГц моно через ffmpeg.
# Выход data/dd-wt.json: {"<имя без .mp3>": [[начало, конец, "слово"], ...]}, секунды 2 знака.
# Плохо распознанное слово -> "?" в конце. Несовпадения с текстом в данных -> data/dd-wt-mismatch.json.
# Перезапускаемый: готовые файлы пропускает.
import json, os, subprocess, sys, wave, glob, re
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
OUT = os.path.join(ROOT, 'data', 'dd-wt.json')
MIS = os.path.join(ROOT, 'data', 'dd-wt-mismatch.json')
MODEL = 'medium.en'

def norm(ws):
    return [re.sub(r"[^a-z0-9'’]+", '', w.lower()).replace('’', "'") for w in ws]

def main():
    from faster_whisper import WhisperModel
    wt = json.load(open(OUT, encoding='utf-8')) if os.path.exists(OUT) else {}
    mis = json.load(open(MIS, encoding='utf-8')) if os.path.exists(MIS) else []
    # задачи: тексты из games-new.json
    g = json.load(open(os.path.join(ROOT, 'data', 'games-new.json'), encoding='utf-8'))
    tasks = {}
    for d in g['dialogs']:
        for ln in d['lines']:
            tasks[os.path.basename(ln['a'])[:-4]] = ln['en']
    for h in (g['heroes'].values() if isinstance(g['heroes'], dict) else g['heroes']):
        for ln in h['lines']:
            tasks[os.path.basename(ln['a'])[:-4]] = ln['en']
    files = sorted(glob.glob(os.path.join(ROOT, 'heroes-voice', '*', '*.mp3')))
    todo = [f for f in files if os.path.basename(f)[:-4] not in wt]
    print(f'всего mp3 {len(files)}, готово {len(wt)}, осталось {len(todo)}', flush=True)
    if todo:
        m = WhisperModel(MODEL, device='cpu', compute_type='int8')
    for i, f in enumerate(todo):
        key = os.path.basename(f)[:-4]
        wav = f[:-4] + '.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-ac', '1', '-ar', '16000', wav], check=True)
        w = wave.open(wav)
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768.0
        w.close(); os.remove(wav)
        segs, _ = m.transcribe(a, word_timestamps=True, vad_filter=False)
        words = []
        for s in segs:
            for x in s.words:
                tok = x.word.strip()
                if not tok:
                    continue
                tok = tok if x.probability >= 0.6 else tok + ' ?'
                words.append([round(x.start, 2), round(x.end, 2), tok])
        wt[key] = words
        # сравнение с текстом в данных
        en = tasks.get(key)
        if en is not None:
            got = [w[2] for w in words]
            a_, b_ = norm(en.split()), norm(got)
            a_ = [x for x in a_ if x]; b_ = [x for x in b_ if x and x != '?']
            if a_ != b_:
                mis.append(dict(file=key, in_data=en, heard=' '.join(got)))
        if (i + 1) % 10 == 0 or i == len(todo) - 1:
            json.dump(wt, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False)
            json.dump(mis, open(MIS, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            print(f'{i + 1}/{len(todo)} (несовпадений {len(mis)})', flush=True)
    json.dump(wt, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(mis, open(MIS, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'готово: {len(wt)} файлов, несовпадений {len(mis)}')

if __name__ == '__main__':
    main()
