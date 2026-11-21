#!/usr/bin/env python3
"""21.11: проверка озвучки перевода — запись распознаётся (Vosk) и сравнивается с текстом по словам:
какие слова голос пропустил, заменил или добавил. Модель — vosk-model-small-en-us-0.15 (npm-пакет transcribe2texts,
как в tools/wt_vosk.py), путь — переменная VOSK_EN; vosk ставится pip install --no-deps vosk (+ заглушки srt.py, tqdm.py).
Немецкой модели в контейнере нет — для de проверка не запускается."""
import difflib, json, os, re, subprocess, wave


def toks(t): return [w for w in re.sub(r"[^a-z0-9' ]", ' ', t.lower().replace('’', "'").replace('-', ' ')).split() if w]


NUM = {'2014': 'twenty fourteen', '2016': 'twenty sixteen', '2020': 'twenty twenty', '2021': 'twenty twenty one', '2024': 'twenty twenty four',
       '2025': 'twenty twenty five', '2026': 'twenty twenty six', '1973': 'nineteen seventy three', '1954': 'nineteen fifty four',
       '1972': 'nineteen seventy two', '1990': 'nineteen ninety', '1924': 'nineteen twenty four'}


def run(base, lang):
    if lang != 'en': print('проверка распознаванием — только для английского'); return
    import vosk
    vosk.SetLogLevel(-1); m = vosk.Model(os.environ['VOSK_EN'])
    wav = base + '.check.wav'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', base + '.mp3', '-ac', '1', '-ar', '16000', wav], check=True)
    rec = vosk.KaldiRecognizer(m, 16000); wf = wave.open(wav); heard = []
    while True:
        b = wf.readframes(8000)
        if not b: break
        if rec.AcceptWaveform(b): heard.append(json.loads(rec.Result()).get('text', ''))
    heard.append(json.loads(rec.FinalResult()).get('text', '')); os.remove(wav)
    meta = json.load(open(base + '.json')); txt = ' '.join(x['text'] for x in meta['items'])
    for k, v in NUM.items(): txt = txt.replace(k, v)
    A, B = toks(txt), toks(' '.join(heard))
    sm = difflib.SequenceMatcher(None, A, B, autojunk=False); bad = 0
    for op, i0, i1, j0, j1 in sm.get_opcodes():
        if op == 'equal': continue
        if op == 'replace' and (i1 - i0) <= 2 and (j1 - j0) <= 3: continue   # одно-два слова «не так услышаны» — обычное дело для маленькой модели
        bad += 1; print(f"  {op:7s} текст: «{' '.join(A[max(0, i0 - 3):i1 + 3])}» | слышно: «{' '.join(B[max(0, j0 - 3):j1 + 3])}»")
    print(f'совпало слов: {sum(b.size for b in sm.get_matching_blocks())} из {len(A)}; подозрительных мест: {bad}')
