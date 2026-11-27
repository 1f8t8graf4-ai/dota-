#!/usr/bin/env python3
"""«Акула» RU (27.11): тестовый ролик «Представь… правила» по формату референса «инсульт».
Черновой голос — бесплатный Piper (ru_RU-ruslan-medium, локально), не для публикации: чистовой — ElevenLabs после «да» Андрея.
  python3 vo.py build   → $VO/shk.wav (паузы ≤ PAUSE) — нужен Piper: PIPER=<piper> PVOICE=<.onnx>
  python3 vo.py words   → $VO/shk.words.json по распознаванию ($VO/shk.wav.words.json из dyn/tr.py), текст — из сценария
"""
import json, os, re, subprocess, sys, difflib
import numpy as np, soundfile as sf

OUT = os.environ.get('VO', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vo'))
PAUSE = float(os.environ.get('PAUSE', '.26'))      # пауза внутри и между фразами, не больше
LEN = float(os.environ.get('LEN', '1.0'))          # length-scale Piper (меньше — быстрее)

# фразы; номер правила — у фразы, где оно звучит (для значков слева)
S = [
 'Представь: ты плаваешь вечером в море, и что-то тяжёлое толкает тебя в ногу.',
 'Не больно. Просто толчок. Под тобой проходит тень — длиннее тебя.',
 'Ты один. До берега метров сорок.',
 'Правило первое. Не греби изо всех сил и не плескайся.',
 'Для акулы плеск — это звук раненой рыбы. Она приплывает проверить.',
 'Правило второе. Повернись к ней лицом и не своди с неё глаз.',
 'Акула охотится из засады. Если ты её видишь — засады нет.',
 'Отплывай к берегу медленно. Спиной к ней — никогда.',
 'Тень делает круг. Тот толчок — не случайность: так акулы делают перед укусом.',
 'Правило третье. Если она идёт на тебя — бей. Не в нос: прямо под носом пасть.',
 'Бей в глаза и в жабры. Мёртвым не притворяйся.',
 'Удар. Ещё удар. Она уходит.',
 'Ты выползаешь на песок. Ничего не болит. Встаёшь — и падаешь.',
 'Нога в крови. Боли нет — это адреналин.',
 'Правило четвёртое. Сначала кровь. После укуса акулы чаще умирают не от зубов, а от потери крови.',
 'Ремень — на ладонь выше раны. Тяни, пока кровь не остановится. Запомни время.',
 'Звонишь сто двенадцать. Скорая едет.',
 'Проходит двадцать минут. Нога синеет и немеет. Ремень жжёт так, что хочется орать.',
 'Ты тянешься его ослабить. Совсем чуть-чуть…',
]

def toks():
    T = []
    for si, s in enumerate(S):
        for w in s.split():
            if any(ch.isalnum() for ch in w): T.append((si, w))
    return T

def norm(w): return re.sub(r'[^а-яa-z0-9]', '', w.lower().replace('ё', 'е'))

def build():
    piper, voice = os.environ['PIPER'], os.environ['PVOICE']; os.makedirs(OUT, exist_ok=True)
    seg = []; SR = None
    for i, s in enumerate(S):
        f = f'{OUT}/s{i:02d}.wav'
        subprocess.run([piper, '-m', voice, '-f', f, '--length-scale', str(LEN)], input=s.encode(), check=True, capture_output=True)
        y, SR = sf.read(f); seg.append(y.astype(np.float32))
    gap = np.zeros(int(PAUSE * SR), np.float32)
    y = np.concatenate([np.concatenate([s, gap]) for s in seg])
    # тишина длиннее PAUSE (внутри фраз — на запятых и точках) ужимается
    fr = int(.01 * SR); e = np.array([np.sqrt(np.mean(y[i:i + fr] ** 2)) for i in range(0, len(y) - fr, fr)])
    quiet = e < .012; keep = np.ones(len(y), bool); i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            n = (j - i) * fr; lim = int(PAUSE * SR)
            if n > lim: a = i * fr + lim // 2; keep[a:a + (n - lim)] = False
            i = j
        else: i += 1
    z = y[keep]; z = z / (np.max(np.abs(z)) or 1) * .9
    z = np.concatenate([np.zeros(int(.05 * SR), np.float32), z, np.zeros(int(.5 * SR), np.float32)])
    sf.write(f'{OUT}/shk.wav', z, SR)
    print('голос', round(len(z) / SR, 2), 'с, слов', len(toks()))

def words():
    R = json.load(open(f'{OUT}/shk.wav.words.json')); W = [w for s in R for w in s['w']]
    T = toks(); a = [norm(w) for _, w in T]; b = [norm(w[2]) for w in W]
    out = [None] * len(T)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1): out[i1 + k] = [W[j1 + k][0], W[j1 + k][1]]
        elif tag == 'replace' and j2 > j1:   # «сто двенадцать» ↔ «112» и т. п.: делим отрезок по длине слов
            A, B = W[j1][0], W[j2 - 1][1]; L = [len(a[k]) + 1 for k in range(i1, i2)]; acc = 0
            for k in range(i1, i2): out[k] = [A + (B - A) * acc / sum(L), A + (B - A) * (acc + L[k - i1]) / sum(L)]; acc += L[k - i1]
    for k in range(len(out)):   # пропущенные — между соседями
        if out[k] is None:
            p = next((out[j][1] for j in range(k - 1, -1, -1) if out[j]), 0); q = next((out[j][0] for j in range(k + 1, len(out)) if out[j]), p + .3)
            out[k] = [p, max(p + .05, q)]
    dur = sf.info(f'{OUT}/shk.wav').duration
    res = [{'a': round(o[0], 3), 'b': round(o[1], 3), 'w': w, 's': si} for (si, w), o in zip(T, out)]
    json.dump({'dur': round(dur, 3), 'sents': S, 'words': res}, open(f'{OUT}/shk.words.json', 'w'), ensure_ascii=False, indent=0)
    span = res[-1]['b'] - res[0]['a']; miss = sum(1 for k, (_, w) in enumerate(T) if norm(w) not in b)
    print('слов', len(res), 'длина', round(dur, 2), 'с; темп', round(len(res) / span, 2), 'слова/с; не распознано', miss)

if __name__ == '__main__':
    {'build': build, 'words': words}[sys.argv[1]]()
