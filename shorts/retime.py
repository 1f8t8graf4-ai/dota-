# Тайминг без голоса: паузы между фразами и счёт «раз-два-три» по секундам.
#   python3 retime.py <ep-lang>   — правит out/<ep>/timeline.json по RT[ep] (оригинал → timeline.piper.json)
#   Когда придёт настоящий голос (voice.py --audio), timeline пересоберётся из записи — эти правки не нужны.
import json, os, sys

# ('pause', номер фразы, секунд после неё) | ('pace', номер фразы, [время каждого слова от начала фразы], длина фразы)
RT = {
    'nictyaga-ru': [('pause', 0, .3), ('pause', 1, .3), ('pause', 2, .4), ('pause', 3, .8), ('pause', 4, 1.6), ('pause', 5, .8),
                    ('pace', 7, [0, .9, 1.9, 2.9, 3.9], 4.6), ('pace', 8, [0, .9, 1.9, 2.9, 3.9], 4.6), ('pause', 8, .5),
                    ('pause', 9, 2.0), ('pause', 10, .5), ('pause', 11, .8), ('pause', 12, 1.0), ('pause', 13, .5), ('pause', 14, .6)],
    'nicme-ru': [('pace', 4, [0, .75, 1.75, 2.75, 3.45, 3.7, 3.95], 4.4), ('pause', 1, .2)],
    'nicw1-ru': [('pause', 2, .5), ('pause', 4, .3), ('pause', 5, .5), ('pause', 8, .2), ('pause', 10, .3), ('pause', 12, .2),
                 ('pace', 13, [0, 1.15, 1.4], 2.1), ('pause', 13, .3), ('pause', 14, .3), ('pause', 15, .6)],
    'nicw2-ru': [('pause', 2, .3), ('pause', 4, .2), ('pause', 9, .4), ('pause', 15, .2)],
    'nicb-ru': [('pause', 2, .3), ('pause', 4, .2), ('pause', 9, .4), ('pause', 15, .2)],
    'nicw3-ru': [('pause', 2, .4), ('pause', 3, .2), ('pause', 5, .2), ('pause', 12, .3)],
    'howto-ru': [('pause', 0, .2), ('pause', 2, .8), ('pause', 3, .8), ('pause', 4, .6), ('pause', 5, .3), ('pause', 6, 1.8)],
}


def main(ep):
    f = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', ep, 'timeline.json')
    src = f.replace('timeline.json', 'timeline.piper.json')
    if not os.path.exists(src):
        os.rename(f, src)
    tl = json.load(open(src))
    S = tl['sent']
    for op in RT.get(ep, []):
        if op[0] == 'pause':
            i, d = op[1], op[2]
            for s in S[i + 1:]:
                s['a'] += d; s['b'] += d
                for w in s['words']: w['a'] += d; w['b'] += d
            tl['dur'] += d
        elif op[0] == 'pace':
            i, ts, ln = op[1], op[2], op[3]
            s = S[i]; old = s['b'] - s['a']; a = s['a']
            for k, w in enumerate(s['words']):
                dur = w['b'] - w['a']
                w['a'] = a + ts[k] if k < len(ts) else w['a']
                w['b'] = w['a'] + min(dur, .55)
            s['b'] = a + ln; d = ln - old
            for s2 in S[i + 1:]:
                s2['a'] += d; s2['b'] += d
                for w in s2['words']: w['a'] += d; w['b'] += d
            tl['dur'] += d
    tl['dur'] = round(tl['dur'], 3)
    json.dump(tl, open(f, 'w'), ensure_ascii=False, indent=1)
    print(ep, 'длина', tl['dur'])


if __name__ == '__main__':
    main(sys.argv[1])
