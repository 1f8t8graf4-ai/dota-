# Выравнивание фраз и субтитров сцены по звуку (pocketsphinx). Пути внутри под свою папку: /tmp/p (этот репо) и /tmp/out/scenes (репо scenes).
import json,re,subprocess
from pocketsphinx import Decoder
D=json.load(open('/tmp/p/data/scenes.json'))
dec=Decoder(samprate=16000)
def norm(w):
    w=w.lower().replace('’',"'");return re.sub(r"[^a-z']","",w).strip("'")
NUM={'24/7':'twenty four seven','365':'three sixty five','2400':'twenty four hundred','16':'sixteen','8':'eight','7':'seven','600':'six hundred','400':'four hundred','100':'hundred','50':'fifty','20':'twenty','10':'ten','5':'five','3':'three','2':'two'}
def pre(text):
    for k in sorted(NUM,key=len,reverse=True): text=re.sub(r'(?<![\d/])'+re.escape(k)+r'(?![\d/])',NUM[k],text)
    return text
def words(text): text=pre(text);return [x for x in (norm(w) for w in re.split(r"[\s\-—/…]+|\.\.\.",text)) if x]
def audio(path): return subprocess.run(['ffmpeg','-v','error','-i',path,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
rep=[]
for s in D['SCENES']:
    sid=s['id']
    for pi,p in enumerate(s['parts']):
        raw=audio(f'/tmp/out/scenes/{sid}/{pi+1:02d}.mp4')
        rows=[ri for ri,r in enumerate(s['subs']) if r[0]>=p['a']-0.3 and r[0]<p['b']]
        def al(rws,t0,t1,depth=0):
            seq=[(w,ri) for ri in rws for w in words(s['subs'][ri][2]) if dec.lookup_word(w)]
            if not seq: return []
            chunk=raw[int((t0-p['a'])*16000)*2:int((t1-p['a'])*16000)*2]
            ok=False
            try:
                dec.set_align_text(' '.join(w for w,_ in seq));dec.start_utt();dec.process_raw(chunk,full_utt=True);dec.end_utt()
                sg=dec.seg()
                if sg is not None:
                    ws=[(re.sub(r'\(\d+\)$','',x.word),t0+x.start_frame*0.01,t0+(x.end_frame+1)*0.01) for x in sg if not x.word.startswith('<') and not x.word.startswith('[')]
                    ok=len(ws)==len(seq)
            except Exception as e: ok=False
            if ok: return [(w,a,b,ri) for (w,a,b),(_,ri) in zip(ws,seq)]
            if len(rws)<2 or depth>6: print('FAIL',sid,pi,[s['subs'][r][2][:25] for r in rws]);return []
            gaps=[(s['subs'][rws[k+1]][0]-s['subs'][rws[k]][1],k) for k in range(len(rws)-1)]
            g,k=max(gaps);cut=max(t0+0.5,min(t1-0.5,(s['subs'][rws[k]][1]+s['subs'][rws[k+1]][0])/2+0.3))
            return al(rws[:k+1],t0,cut,depth+1)+al(rws[k+1:],cut,t1,depth+1)
        A=al(rows,p['a'],p['b'])
        lim=lambda w:max(0.35,0.09*len(w)+0.25)
        A=[(w,a,b,ri,lim(w)) for w,a,b,ri in A]
        S=lambda x:max(x[1],x[2]-x[4]);E=lambda x:min(x[2],x[1]+x[4])
        print(sid,pi,'aligned words',len(A))
        # строки субтитров
        for ri in rows:
            aw=[x for x in A if x[3]==ri]
            if not aw: continue
            r=s['subs'][ri];na=round(max(p['a'],S(aw[0])-0.12),2);nb=round(E(aw[-1])+0.35,2)
            if abs(na-r[0])>4: rep.append(('SUBSKIP',sid,r[2][:30],r[0],na));continue
            r[0],r[1]=na,max(nb,na+0.6)
        # фразы
        for f in p['ph']:
            pw=[w for w in words(f['en']) if dec.lookup_word(w)]
            if not pw: rep.append(('NOWORDS',sid,f['en']));continue
            best=None
            for i,(w,a,b,ri,_l) in enumerate(A):
                if w!=pw[0] or abs(a-f['a'])>6: continue
                j=i;m=0;last=i
                for tok in pw:
                    k=j
                    while k<len(A) and k<j+4 and A[k][0]!=tok: k+=1
                    if k<len(A) and A[k][0]==tok: m+=1;last=k;j=k+1
                sc=(m/len(pw))-abs(a-f['a'])*0.02
                if best is None or sc>best[0]: best=(sc,i,last,m)
            if not best or best[3]<max(1,len(pw)*0.6): rep.append(('NOMATCH',sid,f['en'],best and best[3],len(pw)));continue
            _,i,last=best[:3]
            st=S(A[i]);en=E(A[last])
            # хвост фразы не распознаётся словарём (числа, имена) — берём конец строки субтитров
            raw_last=words(f['en'])[-1]
            if not dec.lookup_word(raw_last):
                rr=s['subs'][A[last][3]];en=max(en,rr[1]-0.3)
            prevE=E(A[i-1]) if i>0 else p['a']
            nextS=S(A[last+1]) if last+1<len(A) else p['b']
            na=round(max(p['a'],st-0.25,min(st-0.05,prevE+0.03)),2)
            nb=round(min(p['b'],max(en+0.15,min(en+0.45,nextS+0.02))),2)
            rep.append(('PH',sid,f['en'][:40],f['a'],na,f['b'],nb))
            f['a'],f['b']=na,nb
json.dump(D,open('/tmp/scenes_aligned.json','w'),ensure_ascii=False)
json.dump(rep,open('/tmp/align_rep.json','w'),ensure_ascii=False)
for r in rep:
    if r[0]!='PH' or abs(r[3]-r[4])>1.2 or abs(r[5]-r[6])>1.5: print(r)
print('phrases moved',sum(1 for r in rep if r[0]=='PH'))
