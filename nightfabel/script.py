# NightFabel, ролик №1: «You just took one hit of weed» (EN).
# Разметка: {ПОКАЗ|как говорить} — на экране одно, озвучка другое; *слово — жёлтым; !слово — красным.
# Факты (проверено 08.11.2026):
#   НIDA — ТГК из лёгких в кровь и мозг за секунды; дофамин; гиппокамп и память; чувство времени;
#   пульс +20–50 уд/мин (NIDA Research Report); сухость во рту — CB1 в слюнных железах;
#   Koch et al., Nature 2015 — POMC-нейроны сытости запускают голод (мыши);
#   ElSohly et al., Biol Psychiatry 2016 — ТГК изъятой травы ~4 % (1995) → ~12 % (2014);
#   моча: однократно ~3 дня, тяжёлое ежедневное — 30+ дней (обзоры, Mayo Clin Proc);
#   NIDA — до 18 лет в 4–7 раз выше риск расстройства употребления; CDC — риск выше до 18;
#   Di Forti et al., Lancet Psychiatry 2019 — ежедневно крепкая (ТГК ≥10 %) → ОШ 4,8 для психоза.
S = [
    ("hook",    "You just took *one *hit of *weed."),
    ("brain",   "Within *seconds, {THC|T H C} rushes from your *lungs into your *blood... and straight into your *brain."),
    ("bliss",   "There, it pretends to be *anandamide — your brain's own *bliss *molecule."),
    ("dopa",    "It unlocks receptors all over your brain, and *dopamine floods your reward system."),
    ("dopa",    "That's the *high."),
    ("memory",  "Then it hits your *hippocampus — your memory center."),
    ("forget",  "That's why you forget what you were saying... *mid-sentence."),
    ("time",    "Time *stretches. A few minutes can feel like *forever."),
    ("eyes",    "Your blood vessels widen, so your eyes turn !red."),
    ("heart",   "Your heart rate can jump by {+20–50|twenty to fifty} beats per minute."),
    ("mouth",   "{THC|T H C} shuts down your salivary glands. Hello, *cottonmouth."),
    ("munch",   "And the *munchies? {THC|T H C} hijacks the brain cells that tell you you're *full... and turns them into *hunger signals instead."),
    ("munch",   "At least in mice."),
    ("potency", "Here's the catch: weed got about {3×|three times} *stronger."),
    ("potency", "From {4%|four percent} {THC|T H C} in {1995|nineteen ninety five}... to {12%|twelve percent} by {2014|twenty fourteen}."),
    ("anx",     "More {THC|T H C} means more !anxiety and !paranoia."),
    ("stay",    "And it doesn't leave fast. {THC|T H C} hides in your *fat."),
    ("stay",    "Try it once? About {3|three} days. Heavy daily use? It can show up for over a *month."),
    ("teen",    "Your brain keeps building itself until about {25|twenty five}."),
    ("teen",    "Start before {18|eighteen}, and you're {4–7×|four to seven times} more likely to get !hooked."),
    ("psych",   "One big study linked daily use of strong weed to nearly {5×|five times} the odds of !psychosis."),
    ("outro",   "So... what should we break down next? *Alcohol, or *energy *drinks?"),
]

import re


def parse(s):
    """→ (spoken_text, [ {d: показ, n: сколько озвученных слов, c: ''|'y'|'r'} ])"""
    out, spoken = [], []
    for m in re.finditer(r'\{([^|}]*)\|([^}]*)\}([.,?!…]*)|(\S+)', s):
        if m.group(4) is not None:
            w = m.group(4)
            c = ''
            if w.startswith('*'):
                c, w = 'y', w[1:]
            elif w.startswith('!'):
                c, w = 'r', w[1:]
            if w in ('—', '–'):
                spoken.append(w)
                continue
            out.append({'d': w, 'sp': [w], 'c': c})
            spoken.append(w)
        else:
            d, sp, pu = m.group(1), m.group(2).split(), m.group(3)
            # знак препинания сразу после скобки — и к показу, и к озвучке
            sp[-1] += pu
            out.append({'d': d + pu, 'sp': sp, 'c': 'y'})
            spoken += sp
    text = ' '.join(spoken)
    # «{X|y}» с точкой/запятой сразу после — точка уже в следующем токене? нет: склеиваем «… .»
    text = re.sub(r'\s+([.,?!])', r'\1', text)
    return text, out


if __name__ == '__main__':
    for k, s in S:
        t, o = parse(s)
        print(k, '|', t)
