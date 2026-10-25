import json, os, subprocess, re
D = os.environ.get('BGF', os.getcwd())  # рабочая папка: vid/<сцена>__NN.mp4, сюда же пишутся json, out/, loops/
C = {k: {'win': v} for k, v in json.load(open(D + '/calm2.json')).items()}
G = {'film:wolf':['wolf-of-wall-street','wolf-swiss-bank','wolf-lunch-de','wolf-naomi-de'],'film:psycho':['american-psycho','american-psycho-cards'],
 'film:taxi':['taxi-driver-lonely','taxi-driver-betsy'],'film:titanic':['titanic-boat','titanic-andrews-de','titanic-mother-de'],'film:bunker':['downfall-bunker'],
 'season:sopranos:S01':['sopranos-s01e01','sopranos-arc','sopranos-mahaffey-de','sopranos-hasid-de'],'season:sopranos:S04':['sopranos-ralph'],'season:sopranos:S06':['sopranos-phil-de'],
 'season:bb:S01':['breaking-bad-pilot'],'season:bb:S02':['breaking-bad-gus'],'season:bb:S04':['breaking-bad-knocks','bb-knocks-de'],'season:bb:S05':['bb-mike-de']}
PER = 10
sel = {}
for g, sids in G.items():
    cand = []
    for name, v in C.items():
        sid, ep = name.split('__')
        if sid not in sids: continue
        ws = sorted(v['win'], key=lambda w: (w['face'] > .015, w['face'] > 0, w['mot']))
        took = []
        for w in ws:
            if all(abs(w['t'] - x['t']) > 7 for x in took): took.append(w)
            if len(took) == 3: break
        for w in took: cand.append(dict(w, sid=sid, ep=int(ep), file=name))
    cand.sort(key=lambda w: (w['face'] > .015, w['face'] > 0, w['mot']))
    # не больше 3 с одного эпизода
    out, cnt = [], {}
    for w in cand:
        if cnt.get(w['file'], 0) >= 2: continue
        cnt[w['file']] = cnt.get(w['file'], 0) + 1; out.append(w)
        if len(out) == PER: break
    sel[g] = out
os.makedirs(D + '/out', exist_ok=True)
for g, L in sel.items():
    for k, w in enumerate(L):
        a, b = w['bar']
        src = f"{D}/vid/{w['file']}.mp4"; t = w['t'] + 2
        base = f"{D}/out/{g.replace(':','_')}_{k}"
        cr = f"crop=iw:trunc(ih*{(b-a)/54:.4f}/2)*2:0:trunc(ih*{a/54:.4f}/2)*2"
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',src,'-frames:v','1','-vf',cr+',scale=640:-2','-q:v','5',base+'_w.jpg'])
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',src,'-frames:v','1','-vf',cr+',crop=trunc(ih*9/16/2)*2:ih,scale=270:-2','-q:v','5',base+'_v.jpg'])
        w['img'] = os.path.basename(base)
json.dump(sel, open(D + '/sel.json', 'w'), ensure_ascii=False, indent=1)
print({g: len(L) for g, L in sel.items()})
