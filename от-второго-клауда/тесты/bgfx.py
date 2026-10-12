# Тест tools/bg_fx.py на синтетике: комната с «неоном» (A — горит, B — погас), «дым» ходит по кругу (первый кадр = последний).
# Запуск: python3 от-второго-клауда/тесты/bgfx.py [папка]   (по умолчанию — временная папка; ~3–4 мин)
import sys,os,re,math,subprocess,tempfile,numpy as np
from PIL import Image
R=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))));FX=os.path.join(R,'tools','bg_fx.py')
sys.path.insert(0,os.path.join(R,'tools'));from bg_fx import load
D=sys.argv[1] if len(sys.argv)>1 else tempfile.mkdtemp(prefix='bgfx-');os.makedirs(D,exist_ok=True);os.chdir(D)
fails=0
def ok(n,c,d=''):
    global fails
    if not c:fails+=1
    print('PASS' if c else 'FAIL',n,d)
def enc(path,frames,fps=24):
    h,w=frames[0].shape[:2]
    p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r',str(fps),'-i','-','-c:v','libx264','-crf','18','-pix_fmt','yuv420p',path],stdin=subprocess.PIPE)
    for f in frames:p.stdin.write(f.tobytes())
    p.stdin.close();p.wait()
def scene(w,h,neon,n=192):
    yy,xx=np.mgrid[0:h,0:w].astype(np.float32);yy/=h;xx/=w
    room=np.stack([30+40*yy,28+30*yy,40+20*(1-yy)],-1)+np.random.default_rng(1).normal(0,4,(h,w,1));F=[]
    for i in range(n):
        t=i/n*2*math.pi;cx,cy=.5+.18*math.cos(t),.62+.06*math.sin(2*t)
        img=room+np.exp(-(((xx-cx)*w/h)**2+(yy-cy)**2)/.004)[...,None]*np.array([150,150,160])
        if neon:
            box=((xx>.3)&(xx<.7)&(yy>.18)&(yy<.26))[...,None]
            img=np.where(box,np.array([60,230,180]),img)+np.exp(-(((xx-.5)*w/h)**2+(yy-.22)**2)/.03)[...,None]*np.array([10,50,40])
        F.append(img.clip(0,255).astype(np.uint8))
    return F
def run(*a):
    r=subprocess.run(['python3',FX,*a],capture_output=True,text=True)
    if r.returncode:print(r.stdout,r.stderr)
    return r.stdout
def info(out):
    s=out;m=re.search(r': ([\d.]+) с, (\d+) КБ, (\d+)×(\d+)',s);sm=re.search(r'шов петли: Δ ([\d.]+)',s)
    ev=re.search(r'событие в файле на ([\d.]+) с \(нашёл по картинке: ([\d.]+) с\)',s)
    return dict(d=float(m[1]),kb=int(m[2]),w=int(m[3]),h=int(m[4]),seam=float(sm[1]) if sm else None,ev=float(ev[1]) if ev else None,found=float(ev[2]) if ev else None)
if not os.path.exists('A.mp4'):enc('A.mp4',scene(720,1280,True));enc('B.mp4',scene(720,1280,False))
# 1. switch: все переходы и концы
for how,end,a,b,exp in [('flicker','black=1.2',None,None,7.5),('cut','dip',None,None,8.0),('fade','back',None,None,7.3),('radial@0.5,0.22,0.2','xfade',None,None,6.3),('wipe-lr','dip','6','4',5.1)]:
    o=info(run('switch',f'sw-{how[:6]}.mp4','A.mp4','B.mp4','--how',how,'--end',end,*(['--a',a] if a else []),*(['--b',b] if b else [])))
    ok(f'switch {how} / {end}: 720×1280, шов незаметный, событие на {exp} с',o['w']==720 and o['h']==1280 and o['seam']<4 and o['ev'] is not None and abs(o['ev']-exp)<.15 and o['found'] is not None and -.3<o['found']-o['ev']<1.2,str(o))
# 2. switch --sync: B — перекрашенный A (recolor), событие ровно на --a
o=info(run('recolor','Bre.mp4','A.mp4','--hue','140:190','--to','358'))
F,_=load('Bre.mp4');FA,_=load('A.mp4');px=lambda G:G[40][int(.22*1280),360].astype(int)
ok('recolor: бирюзовый неон стал красным, остальное — как было',px(F)[0]>px(F)[1]+60 and px(FA)[1]>px(FA)[0]+60 and np.abs(F[40][1100,100].astype(int)-FA[40][1100,100].astype(int)).max()<30,f'{px(FA)} → {px(F)}')
o=info(run('switch','sync.mp4','A.mp4','Bre.mp4','--sync','--how','cut','--a','5','--b','3','--end','dip'))
ok('switch --sync: 8 с, событие на 5.0 с, по картинке там же',abs(o['d']-8)<.1 and o['ev']==5.0 and o['found'] is not None and abs(o['found']-5)<.2,str(o))
S,_=load('sync.mp4');ok('switch --sync: «дым» после события на том же месте, что в A (движение не прыгает)',np.abs(S[121].astype(int)-load('Bre.mp4')[0][121].astype(int)).mean()<3)
# 3. dim: комната темнее, зона keep — как была
o=info(run('dim','dim.mp4','A.mp4','--room','0.4','--keep','0.25,0.15,0.5,0.15'))
Dm,_=load('dim.mp4');ok('dim: комната темнее, неон (keep) светит как был',Dm[10][1100].mean()<FA[10][1100].mean()*.6 and np.abs(Dm[10][int(.22*1280),360].astype(int)-FA[10][int(.22*1280),360].astype(int)).max()<12)
# 4. flash: вспышка на заявленной секунде, после — как было
o=info(run('flash','fl.mp4','A.mp4','--preset','lightning','--at','4','--end','none'))
Fl,_=load('fl.mp4');ok('flash: вспышка на 4.0 с, через 2 с кадр как в исходнике',o['ev']==4.0 and o['found'] is not None and abs(o['found']-4)<.3 and Fl[97].mean()>FA[97].mean()+15 and np.abs(Fl[150].astype(int)-FA[150].astype(int)).mean()<4,str(o))
# 5. freeze: вне живой зоны — неподвижно, внутри — движется
o=info(run('freeze','fr.mp4','A.mp4','--live','0.25,0.5,0.5,0.25'))
Fr,_=load('fr.mp4');st=Fr.astype(np.float32).std(0).mean(2)
ok('freeze: вне живой зоны кадр стоит, в зоне «дым» ходит',st[200:300].mean()<1.0 and st[int(.55*1280):int(.7*1280),250:470].mean()>5 and o['seam']<4,f'вне {st[200:300].mean():.2f}, в зоне {st[int(.55*1280):int(.7*1280),250:470].mean():.1f}')
# 6. canvas + widen
enc('H.mp4',scene(1280,720,True,n=96))
run('canvas','cv.png','H.mp4','--band','0.45');C=np.asarray(Image.open('cv.png'))
ok('canvas: 720×1280, сверху и снизу чёрное, посередине кадр',C.shape[:2]==(1280,720) and C[:300].max()==0 and C[-300:].max()==0 and C[640].mean()>10)
Image.fromarray(np.where(C==0,90,C).astype(np.uint8)).save('painted.png')
o=info(run('widen','wd.mp4','H.mp4','painted.png','--band','0.45'));W,_=load('wd.mp4')
ok('widen: вертикаль 720×1280, верх — картинка (не двигается), середина — живая',o['w']==720 and o['h']==1280 and W.astype(np.float32).std(0)[:250].mean()<1 and W.astype(np.float32).std(0)[600:700].mean()>2,str(o))
print(f'\nИТОГ: {"всё PASS" if not fails else f"FAIL: {fails}"}  (папка {D})');sys.exit(1 if fails else 0)
