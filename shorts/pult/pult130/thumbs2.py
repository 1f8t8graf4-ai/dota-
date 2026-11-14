import json,subprocess,os,numpy as np
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
OUT='out';d=json.load(open(f'{OUT}/fx130.json'))
os.makedirs(f'{OUT}/th2',exist_ok=True)
def best(r):
    p=f"{OUT}/{r['file']}";cands=[]
    for q in (.25,.4,.55,.7,.85):
        t=r['ca']+q*(r['cb']-r['ca'])
        raw=subprocess.run(['ffmpeg','-v','error','-ss',f'{t:.3f}','-i',p,'-frames:v','1','-vf','scale=192:108','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
        if len(raw)!=192*108*3: continue
        a=np.frombuffer(raw,np.uint8).reshape(108,192,3).astype(np.float32)
        g=a.mean(2);score=g.std()+0.5*np.abs(np.diff(g,axis=1)).mean()*4
        if q==.55: score*=1.08   # чуть предпочитаем середину приёма
        cands.append((score,a))
    a=max(cands,key=lambda c:c[0])[1]
    Image.fromarray(a.astype(np.uint8)).save(f"{OUT}/th2/{r['id']}.jpg",quality=88)
with ThreadPoolExecutor(4) as ex: list(ex.map(best,d))
sp=Image.new('RGB',(1920,1404))
for i,r in enumerate(d):
    sp.paste(Image.open(f"{OUT}/th2/{r['id']}.jpg"),((i%10)*192,(i//10)*108))
sp.save(f'{OUT}/thumbs.jpg',quality=82,optimize=True,progressive=True)
print('ok',os.path.getsize(f'{OUT}/thumbs.jpg'))
