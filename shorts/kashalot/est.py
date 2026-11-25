# Оценка длины ролика и знаков для голоса: python3 est.py
import re, sys
sys.path.insert(0, __import__('os').path.dirname(__file__))
from data import V
WPS = {'en': 2.75, 'de': 2.55, 'ru': 2.6}   # слов в секунду (темп как у рефов)
GAP = 0.28                                   # пауза между строками
CR = 0.5                                     # кредита ElevenLabs за знак (eleven_v4, по прошлым записям)
for vid, v in V.items():
    for lang in ('en', 'de', 'ru'):
        txt = [re.sub(r'\*', '', l[lang]) for l in v['lines']]
        words = sum(len(re.findall(r"[\w'’-]+", t)) for t in txt)
        chars = sum(len(t) for t in txt)
        dur = words / WPS[lang] + GAP * (len(txt) - 1) + 1.2
        print(f"{vid} {lang}: {words} слов, {chars} знаков, ≈ {dur:.0f} с, голос ≈ {chars*CR:.0f} кредитов")
