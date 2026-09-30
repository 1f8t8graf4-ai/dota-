# Проверка: старое и новое окно каждой фразы распознаются, выбирается лучшее. Запускать после align_scenes.py.
import json,re,subprocess
from pocketsphinx import Decoder
exec(open('/tmp/align2.py').read().split("rep=[]")[0])
old=json.load(open('/tmp/p/data/scenes.json'));new=json.load(open('/tmp/scenes_aligned.json'))
dq=Decoder(samprate=16000)
cache={}
def part_audio(sid,pi):
    k=(sid,pi)
    if k not in cache: cache[k]=audio(f'/tmp/out/scenes/{sid}/{pi+1:02d}.mp4')
    return cache[k]
def hyp(raw,a,b,p0):
    c=raw[int((a-p0)*16000)*2:int((b-p0)*16000)*2]
    dq.start_utt();dq.process_raw(c,full_utt=True);dq.end_utt();h=dq.hyp()
    return (h.hypstr if h else '').split()
def score(pw,hw,dur):
    rec=sum(1 for w in pw if w in hw)/max(1,len(pw))
    extra=max(0,len(hw)-len(pw)*1.3)
    return rec-0.08*extra
res=[]
for so,sn in zip(old['SCENES'],new['SCENES']):
    for pi,(po,pn) in enumerate(zip(so['parts'],sn['parts'])):
        raw=part_audio(so['id'],pi)
        for fo,fn in zip(po['ph'],pn['ph']):
            if (fo['a'],fo['b'])==(fn['a'],fn['b']):continue
            pw=[w for w in words(fo['en']) if dq.lookup_word(w)]
            ho=hyp(raw,fo['a'],fo['b'],po['a']);hn=hyp(raw,fn['a'],fn['b'],po['a'])
            so_,sn_=score(pw,ho,fo['b']-fo['a']),score(pw,hn,fn['b']-fn['a'])
            res.append((so['id'],pi,fo['id'] if 'id' in fo else None,fo['en'][:38],round(so_,2),round(sn_,2),fo['a'],fo['b'],fn['a'],fn['b']))
json.dump(res,open('/tmp/qa.json','w'),ensure_ascii=False)
w=sum(1 for r in res if r[5]>r[4]+0.05);l=sum(1 for r in res if r[5]<r[4]-0.05)
print('new better',w,'old better',l,'same',len(res)-w-l)
for r in res:
    if r[5]<r[4]-0.05: print('OLD>',r)
