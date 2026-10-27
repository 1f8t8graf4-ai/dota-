# Время слов реплики по голосу — Vosk (27.10). Когда faster-whisper не поставить (в облаке закрыт huggingface).
# Текст реплики известен — распознаём с «грамматикой» из её же слов и сопоставляем по порядку,
# слова, которых нет в словаре модели (имена, редкие), — по соседям.
# Модель: vosk-model-small-en-us-0.15 (есть в npm-пакете transcribe2texts — registry.npmjs.org из облака открыт),
# pip install --no-deps vosk (+ заглушка srt.py, если srt не ставится).
#   python3 tools/wt_vosk.py <модель> <голос.mp3> "<текст>"            → JSON [[начало, конец, "слово"], …]
#   from wt_vosk import align; align(model, mp3, text)
import difflib, json, re, subprocess, sys

_M = {}


def toks(text):
    # слова как на экране: «[Breaks into laughter]» — ремарка, не слово
    text = re.sub(r'\[[^\]]*\]', ' ', text)
    return [w for w in re.split(r'\s+', text.replace('…', '... ').strip()) if re.search(r'[A-Za-z0-9]', w)]


def norm(w):
    w = w.lower().replace('’', "'")
    w = re.sub(r"[^a-z0-9']", '', w)
    return w.strip("'")


def pcm(mp3):
    return subprocess.run(['ffmpeg', '-v', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                          capture_output=True, check=True).stdout


def recognize(model_dir, mp3, vocab):
    from vosk import Model, KaldiRecognizer, SetLogLevel
    SetLogLevel(-1)
    if model_dir not in _M:
        _M[model_dir] = Model(model_dir)
    rec = KaldiRecognizer(_M[model_dir], 16000, json.dumps(sorted(set(vocab)) + ['[unk]']))
    rec.SetWords(True)
    data, out = pcm(mp3), []
    for i in range(0, len(data), 8000):
        if rec.AcceptWaveform(data[i:i + 8000]):
            out += json.loads(rec.Result()).get('result', [])
    out += json.loads(rec.FinalResult()).get('result', [])
    return [(r['word'], r['start'], r['end']) for r in out if r['word'] != '[unk]']


def align(model_dir, mp3, text):
    T = toks(text)
    N = [norm(w) for w in T]
    R = recognize(model_dir, mp3, [n for n in N if n])
    sm = difflib.SequenceMatcher(a=N, b=[r[0] for r in R], autojunk=False)
    tm = [None] * len(T)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            tm[a + k] = (R[b + k][1], R[b + k][2])
    dur = len(pcm(mp3)) / 32000.0
    # пропуски — по соседям, пропорционально длине слов
    i = 0
    while i < len(T):
        if tm[i]:
            i += 1
            continue
        j = i
        while j < len(T) and not tm[j]:
            j += 1
        s = tm[i - 1][1] if i > 0 else 0.05
        e = tm[j][0] if j < len(T) else min(dur, s + 0.35 * (j - i) + 0.2)
        if e <= s:
            e = s + 0.12 * (j - i)
        L = [max(1, len(N[k])) for k in range(i, j)]
        tot, a = sum(L), s
        for k, l in zip(range(i, j), L):
            b = a + (e - s) * l / tot
            tm[k] = (a, b)
            a = b
        i = j
    hit = sum(1 for a, b, n in sm.get_matching_blocks() for _ in range(n))
    return [[round(a, 2), round(b, 2), w] for (a, b), w in zip(tm, T)], hit / max(1, len(T))


if __name__ == '__main__':
    W, q = align(sys.argv[1], sys.argv[2], sys.argv[3])
    print(json.dumps(W, ensure_ascii=False))
    print('распознано слов: %d%%' % round(q * 100), file=sys.stderr)
