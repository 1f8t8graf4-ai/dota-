# Motion curve + timestamped contact sheets for each Bob video.
import subprocess, json, sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFont
REF = '/tmp/claude-0/-home-user-mein-deutsch/bf28a988-a9ef-5d0c-968e-5904c7d80ec8/scratchpad/ref'
VIDS = ['santa','cola','google','insta','apple','starbucks','davinci','wot','mdk','tinder','madonna','sobolev','hovan']
OUT = os.path.dirname(os.path.abspath(__file__))
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)

def probe(p):
    r = subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=r_frame_rate:format=duration','-of','json',p],capture_output=True,text=True)
    j = json.loads(r.stdout); a,b = j['streams'][0]['r_frame_rate'].split('/')
    return float(a)/float(b), float(j['format']['duration'])

def motion(p, fps):
    W,H = 64,36
    cmd = ['ffmpeg','-v','error','-i',p,'-vf',f'scale={W}:{H},format=gray','-f','rawvideo','-']
    raw = subprocess.run(cmd,capture_output=True).stdout
    fr = np.frombuffer(raw,np.uint8).reshape(-1,H,W).astype(np.float32)
    d1 = np.abs(np.diff(fr,axis=0)).mean(axis=(1,2))          # frame-to-frame change
    k = int(round(fps*0.5))
    dh = np.abs(fr[k:]-fr[:-k]).mean(axis=(1,2))              # change over half a second
    return d1.tolist(), dh.tolist(), len(fr)

def sheet(name, p, dur, step=0.5, cols=8, rows=6, tw=192, th=108):
    tmp = os.path.join(OUT,'fr',name); os.makedirs(tmp,exist_ok=True)
    subprocess.run(['ffmpeg','-v','error','-y','-i',p,'-vf',f'fps={1/step},scale={tw}:{th}',os.path.join(tmp,'%04d.jpg')],check=True)
    files = sorted(os.listdir(tmp)); per = cols*rows; out=[]
    for si in range(0,len(files),per):
        im = Image.new('RGB',(cols*tw,rows*th),'black'); d = ImageDraw.Draw(im)
        for j,f in enumerate(files[si:si+per]):
            t = (si+j)*step   # fps filter: frame n shows time n*step (approx, first at 0)
            x,y = (j%cols)*tw,(j//cols)*th
            im.paste(Image.open(os.path.join(tmp,f)),(x,y))
            lab = f'{int(t//60)}:{t%60:04.1f}'
            d.rectangle([x,y,x+58,y+18],fill=(0,0,0)); d.text((x+3,y+1),lab,fill=(255,230,0),font=FONT)
        fn = os.path.join(OUT,f'sh-{name}-{si//per+1}.jpg'); im.save(fn,quality=82); out.append(fn)
    return out

res = {}
for v in (sys.argv[1:] or VIDS):
    p = os.path.join(REF,v+'.mp4'); fps,dur = probe(p)
    d1,dh,n = motion(p,fps)
    res[v] = {'fps':fps,'dur':dur,'n':n,'d1':[round(x,2) for x in d1],'dh':[round(x,2) for x in dh]}
    sh = sheet(v,p,dur); print(v, fps, round(dur,2), n, len(sh), flush=True)
json.dump(res, open(os.path.join(OUT,'motion.json'),'w'))
