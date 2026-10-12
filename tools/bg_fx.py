#!/usr/bin/env python3
# Фоны-награды: событие и «живая картинка» без генерации (второй Claude, 12.10). Дополняет loop_bg.py, его не трогает.
# Зачем: Veo хорошо делает спокойное движение (рыбы, дым, пар, вода) и плохо — события (предметы едут сами, рой денег,
# лишние предметы). Поэтому событие собираем здесь, из спокойных роликов:
#
#   switch <выход.mp4> <A.mp4> <B.mp4> [--how flicker|cut|fade|wipe-lr|wipe-rl|wipe-tb|wipe-bt|radial@x,y] [--dur С]
#          [--a С] [--b С] [--end dip|black[=С]|back|xfade] [--sync] [--poster кадр.jpg]
#       A — спокойная петля кадра «до», B — кадра «после» (картинка «после» = правка картинки «до» в Nano Banana:
#       «то же фото, только неон выключен»). Событие — переключение A → B: свет, экран, неон, лампы.
#       --sync: B — тот же ролик, что A, только перекрашен (recolor) — B идёт с того же места, что A.
#   recolor <выход.mp4> <ролик> --hue 160:215 [--to 0] [--sat 1.3] [--glow 0.32] [--tint ff3020:0.12] [--box x,y,w,h]
#       перекрасить светящееся (экраны, неон) — получить B для switch --sync (котировки зелёные → красные).
#   dim <выход.mp4> <ролик> [--room 0.5] [--keep x,y,w,h]… [--lampbox x,y,w,h] [--lamps 0.86]
#       свет в комнате выключен (лампы — тусклое стекло, без ореола), зоны --keep светят как были (окно, экран) —
#       получить «до/после» из одного ролика: switch --sync (свет гаснет / загорается).
#   flash <выход.mp4> <ролик> [--preset blast|lightning|sweep-lr|sweep-rl] [--at С] [--color rrggbb] [--from top|bottom|left|right|all|x,y]
#       вспышка света с затуханием поверх ролика: взрыв вдали, молния, фары проезжающей машины.
#   freeze <выход.mp4> <ролик> --live x,y,w,h[,мягкость] [--live …] [--base кадр.jpg]
#       «синемаграф»: всё, кроме зон --live, — неподвижная картинка (первый кадр или --base). Лечит «предмет поехал сам»,
#       дрейф света и масштаба у Veo; шов петли — только в живых зонах.
#   motion <выход.png> <ролик>           — карта, что в ролике движется (подсказка для --live), сетка в долях кадра.
#   canvas <выход.png> <ролик|кадр> [--t С] [--band 0.5]
#       кадр горизонтального фона в холст 9:16 с чёрными полями сверху и снизу — дорисовать их в Nano Banana (outpaint).
#   widen <выход.mp4> <горизонтальный.mp4> <дорисованный.png> [--band 0.5]
#       вертикаль из горизонтального фона без Veo: дорисованная картинка + живая полоса старого ролика посередине.
#
# Доли кадра (x,y,w,h) — от 0 до 1 от левого верхнего угла. Выход — как у loop_bg.py: H.264 CRF 27 без звука,
# 720×1280 (горизонталь — 1280×720), превью <выход>p.jpg, время события для data/scenes.json (bgev / filmbgev).
import sys,os,subprocess,math
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from loop_bg import probe,bars

VID=('.mp4','.mov','.webm','.mkv','.m4v')
def tsize(W,H):   # как в loop_bg: вертикаль 720×1280, горизонталь 1280×720, почти квадрат — как есть
    r=W/H
    return (720,1280) if r<.77 else (1280,720) if r>1.3 else (720,round(720/r/2)*2)
def load(p,size=None,fps=None,t=None,frames=None):
    """Кадры ролика/картинки → uint8 [n,h,w,3]. Чёрные полосы с двух сторон срезаются (как в loop_bg), потом cover в size."""
    isv=p.lower().endswith(VID);W,H,f,_=probe(p) if isv else (*Image.open(p).size,24,0)
    cb=bars(p,W,H) if isv else None
    if cb:W,H=cb[0],cb[1]
    w,h=size or tsize(W,H);fps=fps or min(30,round(f)) or 24
    vf=(f"crop={cb[0]}:{cb[1]}:{cb[2]}:{cb[3]}," if cb else '')+f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h},setsar=1"+(f",fps={fps}" if isv else '')+",format=rgb24"
    cmd=['ffmpeg','-nostdin','-v','error']+(['-ss',f'{t:.3f}'] if t is not None else [])+['-i',p,'-vf',vf]+(['-frames:v',str(frames)] if frames else [])+['-f','rawvideo','-']
    raw=subprocess.run(cmd,capture_output=True,check=True).stdout;n=len(raw)//(w*h*3)
    if not n:sys.exit(f'{p}: не прочитал кадры')
    return np.frombuffer(raw,np.uint8)[:n*w*h*3].reshape(n,h,w,3).copy(),fps
def save(out,frames,fps,poster=None,ev=None,note=''):
    h,w=frames[0].shape[:2]
    p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r',str(fps),'-i','-','-an','-c:v','libx264','-preset','slow','-crf','27',
                        '-maxrate','2M','-bufsize','4M','-profile:v','main','-pix_fmt','yuv420p','-movflags','+faststart',out],stdin=subprocess.PIPE)
    for f in frames:p.stdin.write(np.ascontiguousarray(f,dtype=np.uint8).tobytes())
    p.stdin.close()
    if p.wait():sys.exit('ffmpeg: не записал '+out)
    pp=out[:-4]+'p.jpg';Image.fromarray(np.asarray(poster if poster is not None else frames[len(frames)//4],np.uint8)).save(pp,quality=86)
    # проверка: шов (последний → первый кадр) против обычной разницы соседних кадров; где событие на самом деле
    g=lambda f:np.asarray(f[::8,::8],np.float32).mean(2)
    st=[float(np.abs(g(frames[i])-g(frames[i-1])).mean()) for i in range(1,len(frames),max(1,len(frames)//60))]
    seam=float(np.abs(g(frames[0])-g(frames[-1])).mean());typ=float(np.median(st)) if st else 0
    d=len(frames)/fps;sz=os.path.getsize(out)//1024
    print(f'{out}: {d:.1f} с, {sz} КБ, {w}×{h}, {fps} к/с{note}; превью {os.path.basename(pp)}')
    print(f'  шов петли: Δ {seam:.2f} (обычная смена кадра {typ:.2f}) — {"незаметно" if seam<=max(4,typ*5) else "ЗАМЕТНО — проверь глазами"}')
    if ev is not None:
        found=spike(frames,fps,ev)
        k='filmbgev' if os.path.basename(out).startswith('film-') else 'bgev'
        print(f'  событие в файле на {ev:.1f} с (нашёл по картинке: {found:.1f} с)' if found is not None else f'  событие в файле на {ev:.1f} с (по картинке не видно — проверь)')
        print(f'  → в data/scenes.json у сцены: "{k}":{ev:.1f} (и python3 tools/rebuild_all_data.py)')
    return seam,typ
def spike(frames,fps,ev):
    """Где на самом деле меняется картинка около заявленного события: средний кадр за 0.4 с до момента против
    среднего за 0.4 с после — только по пикселям, которые в спокойной части стоят (дым, рыбы, вода не мешают).
    Возвращает момент самой резкой смены около ev (у плавных переходов — их середину)."""
    g=np.stack([np.asarray(f[::6,::6],np.float32).mean(2) for f in frames]);C=np.concatenate([np.zeros((1,)+g.shape[1:],np.float32),np.cumsum(g,0)])
    m=lambda a,b:(C[b]-C[a])/max(1,b-a);W=max(2,round(.4*fps));G=max(1,round(.08*fps))
    a=round(.8*fps);b=round((ev-.6)*fps);calm=g[a:b] if b>a+4 else g[:max(5,round(ev*fps)-2)]
    still=calm.std(0)<4;ns=max(1,int(still.sum()))
    def step(i):
        if i-G-W<0 or i+G+W>len(g):return 0.0
        return float(((np.abs(m(i+G,i+G+W)-m(i-G-W,i-G))>14)&still).sum()/ns)
    V=[(i,step(i)) for i in range(max(G+W,round((ev-.6)*fps)),min(len(g)-G-W,round((ev+1.6)*fps)))]
    best=max((v for _,v in V),default=0.0)
    if best<=.004:return None
    top=[i for i,v in V if v>=.85*best];return float(np.median(top))/fps   # у резкой смены «плато» шириной ~0.8 с — берём середину
def hexrgb(s):s=s.lstrip('#');return np.array([int(s[i:i+2],16) for i in (0,2,4)],np.float32)/255
def smooth(x):x=np.clip(x,0,1);return x*x*(3-2*x)
def blend(a,b,m):   # a,b uint8; m — число или карта [h,w,1] 0..1
    return (a.astype(np.float32)*(1-m)+b.astype(np.float32)*m).round().clip(0,255).astype(np.uint8)
def black(f):return np.zeros_like(f)
def fadev(f,k):return (f.astype(np.float32)*k).round().astype(np.uint8)

# ---------- переходы A → B (k = 0…T-1) ----------
FLICK=[('B',.06),('A',.10),('B',.05),('A',.16),('B',.07),('A',.05)]   # неон / лампа «чихает» и гаснет: ≈0.5 с, 3 мигания
def plan(how,T,h,w):
    """Карта для k-го кадра перехода: число (вся картинка) или маска [h,w,1]."""
    if how=='cut':return lambda k:1.0
    if how=='flicker':
        seq=[];fps=T/sum(d for _,d in FLICK)
        for s,d in FLICK:seq+= [1.0 if s=='B' else 0.0]*max(1,round(d*fps))
        return lambda k:seq[k] if k<len(seq) else 1.0
    if how=='fade':return lambda k:(k+1)/(T+1)
    yy,xx=np.mgrid[0:h,0:w].astype(np.float32);yy/=h;xx/=w;soft=.18;G=.4
    # лампы загораются по очереди: рядом с лампой свет меняется сразу (местная часть), во всей комнате — понемногу
    # с каждой лампой (общая часть G) — иначе выходит «шторка» поперёк кадра
    if how.startswith('wipe-'):
        c={'lr':xx,'rl':1-xx,'tb':yy,'bt':1-yy}[how[5:]]
        return lambda k:(G*(k+1)/(T+1)+(1-G)*smooth(((k+1)/(T+1)*(1+soft)-c)/soft))[...,None]
    if how.startswith('radial'):   # radial@x,y[,r] — по кругу вокруг (x,y), r — радиус кольца ламп в долях высоты
        v=[float(x) for x in how.split('@')[1].split(',')] if '@' in how else [.5,.5];cx,cy=v[0],v[1];R=v[2] if len(v)>2 else .22
        ang=((np.arctan2((xx-cx)*w/h,-(yy-cy))/(2*math.pi))%1.0)   # 0 = «12 часов», по часовой
        dist=np.sqrt(((xx-cx)*w/h)**2+(yy-cy)**2);near=np.exp(-(((dist-R)/(.45*R))**4))   # 1 на кольце ламп; в середине и снаружи — только общая часть (без «сектора» посреди кадра)
        return lambda k:(G*(k+1)/(T+1)+(1-G)*(near*smooth(((k+1)/(T+1)*(1+soft*.5)-ang)/(soft*.5))+(1-near)*(k+1)/(T+1)))[...,None]
    sys.exit('--how: flicker | cut | fade | wipe-lr | wipe-rl | wipe-tb | wipe-bt | radial@x,y')
def tdur(how,d):return d if d else {'cut':0,'flicker':sum(x for _,x in FLICK),'fade':.35,'radial':1.1}.get(how.split('@')[0],.9 if how.startswith('wipe') else .5)

def cmd_switch(out,A,B,how='flicker',dur=None,a=None,b=None,end='dip',sync=False,poster=None):
    FA,fps=load(A);h,w=FA.shape[1:3];FB,_=load(B,size=(w,h),fps=fps);nA,nB=len(FA),len(FB)
    T=round(tdur(how,dur)*fps);M=plan(how,T,h,w)
    a=round((a if a is not None else nA/fps)*fps);b=round((b if b is not None else (4.0 if sync else nB/fps))*fps)
    if not sync:a=min(a,nA);b=min(b,nB)
    gA=(lambda i:FA[i%nA]);gB=(lambda i:FB[i%nB]) if sync else (lambda i:FB[min(i,nB-1)])
    seq=[]
    # A до перехода, переход (A и B вместе), B после перехода; у --sync B идёт с того же места, что A
    s=max(0,a-T) if not sync else a
    for i in range(s):seq.append(gA(i))
    for k in range(T):
        iA=(s+k);iB=(s+k) if sync else k
        m=M(k);seq.append(gB(iB) if isinstance(m,float) and m>=1 else gA(iA) if isinstance(m,float) and m<=0 else blend(gA(iA),gB(iB),m))
    st=s+T if sync else T;nb=b-T if not sync else b
    for i in range(st,st+max(0,nb)):seq.append(gB(i))
    ev=s/fps;note=f', событие: {how} на {ev:.1f} с'
    # конец: как петля возвращается к началу
    if end=='dip':   # конец гаснет в чёрное, начало проявляется из чёрного — шов петли в темноте
        q=round(.25*fps)
        for k in range(q):seq[k]=fadev(seq[k],k/q);seq[-1-k]=fadev(seq[-1-k],k/q)
    elif end.startswith('black'):
        sec=float(end.split('=')[1]) if '=' in end else 1.2;q=round(.4*fps)
        for k in range(q):seq[k]=fadev(seq[k],k/q)   # из чёрного: первый кадр файла — чёрный, как и последний
        seq+= [black(seq[0])]*round(sec*fps)
    elif end in ('back','xfade'):
        X=T if end=='back' and T else round(.6*fps);RM=M if end=='back' and T else plan('fade',X,h,w)
        tail=seq[-X:];head=seq[:X];del seq[-X:];del seq[:X]
        for k in range(X):   # конец B переходит обратно в начало A (тот же переход наоборот) — файл начинается с X-го кадра
            m=RM(k);seq.append(head[k] if isinstance(m,float) and m>=1 else tail[k] if isinstance(m,float) and m<=0 else blend(tail[k],head[k],m))
        ev-=X/fps;note+=f', обратно в начало — {"тем же переходом" if end=="back" else "наплывом"}'
    else:sys.exit('--end: dip | black[=с] | back | xfade')
    note+=f', конец: {end}, событие раз в {len(seq)/fps:.1f} с'
    if how=='flicker':   # мигание большой площади — не больше 3 раз в секунду (светочувствительность), иначе cut/fade
        dif=np.abs(gA(s).astype(np.int16)-gB(0 if not sync else s).astype(np.int16)).max(2)>40
        if dif.mean()>.25:print('  ⚠ мигает больше четверти кадра — для экранов/общего света лучше --how cut или fade')
    pst=load(poster,size=(w,h))[0][0] if poster else gA(round(min(a,nA)*.33))
    return save(out,seq,fps,poster=pst,ev=ev,note=note)

def hsv(x):   # x float 0..1 [...,3] → h(0..1),s,v
    r,g,b=x[...,0],x[...,1],x[...,2];mx=x.max(-1);mn=x.min(-1);d=mx-mn;dd=np.where(d>0,d,1)
    h=np.where(mx==r,((g-b)/dd)%6,np.where(mx==g,(b-r)/dd+2,(r-g)/dd+4))/6;h=np.where(d>0,h,0)
    return h,np.where(mx>0,d/np.where(mx>0,mx,1),0),mx
def rgb(h,s,v):
    i=np.floor(h*6)%6;f=h*6-np.floor(h*6);p=v*(1-s);q=v*(1-f*s);t=v*(1-(1-f)*s)
    c=[(v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)]
    o=np.zeros(h.shape+(3,),np.float32)
    for k,(r_,g_,b_) in enumerate(c):m=(i==k);o[...,0]+=np.where(m,r_,0);o[...,1]+=np.where(m,g_,0);o[...,2]+=np.where(m,b_,0)
    return o
def blurmap(m,r):   # размытие карты 0..1 (PIL), r — в пикселях
    im=Image.fromarray((np.clip(m,0,1)*255).astype(np.uint8),'L').filter(ImageFilter.GaussianBlur(max(1,r)))
    return np.asarray(im,np.float32)/255
def cmd_recolor(out,src,hue='160:215',to=0.0,sat=1.3,tint=None,box=None,glow=.32,smin=.12,vmin=.3):
    """Перекрасить то, что светится цветом hue (экраны, неон), в цвет to; вокруг — отсвет нового цвета, по всему кадру — tint.
    Маска — одна на весь ролик (по медиане 9 кадров): экраны не двигаются, их мерцание маску не дёргает."""
    F,fps=load(src);n,h,w,_=F.shape;h0,h1=(float(v)/360 for v in hue.split(':'));to=float(to)/360
    reg=np.ones((h,w),np.float32)
    if box:
        x,y,bw,bh=[float(v) for v in box.split(',')][:4]
        im=Image.new('L',(w,h),0);ImageDraw.Draw(im).rectangle([x*w,y*h,(x+bw)*w,(y+bh)*h],fill=255)
        reg=np.asarray(im.filter(ImageFilter.GaussianBlur(min(w,h)*.02)),np.float32)/255
    ref=np.median(F[::max(1,n//9)][:9],axis=0).astype(np.float32)/255;H,S,V=hsv(ref)
    mid=(h0+h1)/2;half=(h1-h0)/2;dh=np.abs(((H-mid+.5)%1)-.5)
    m0=smooth((half+.03-dh)/.06)*smooth((S-smin)/.1)*smooth((V-vmin)/.12)*reg
    m1=np.clip(blurmap(m0,w*.004)*2.2,0,1)*reg*smooth((V-.2)/.15)   # весь светящийся экран, вместе с белёсой серединой
    gl=blurmap(m0,w*.05);gl=gl/(gl.max()+1e-6)                       # отсвет вокруг экранов
    col=rgb(np.array([to]),np.array([1.0]),np.array([1.0]))[0]
    idx=m1>.01;mi=m1[idx][:,None];tc=None
    if tint:c,_,k=tint.partition(':');tc=(hexrgb(c),float(k or .12))
    O=[]
    for f in F:
        x=f.astype(np.float32)/255;p=x[idx];Hp,Sp,Vp=hsv(p)
        q=rgb(np.full_like(Hp,to),np.maximum(np.clip(Sp*sat,0,1),.62*mi[:,0]),Vp)
        x[idx]=p*(1-mi)+q*mi
        if glow:x=1-(1-x)*(1-(col*gl[...,None]*glow))   # свет экранов ложится вокруг
        if tc is not None:x=x*(1-tc[1])+x*tc[0]*tc[1]*2.2  # общий отсвет: весь кадр чуть в цвет события
        O.append((x.clip(0,1)*255).round().astype(np.uint8))
    return save(out,O,fps,note=f', перекрашено {hue}° → {to*360:.0f}° ({float(m1.mean())*100:.1f} % кадра)'+(f', отсвет {tint}' if tint else ''))

PRE={'blast':dict(color='ffb066',frm='.7,.36',peak=.95,rise=.05,decay=.6,echo=.35),   # взрыв вдали: вспышка из-за горизонта, быстро гаснет
     'lightning':dict(color='dfe9ff',frm='all',peak=.9,rise=.02,decay=.16,echo=.8),
     'sweep-lr':dict(color='fff4dc',frm='sweep-lr',peak=.55,rise=.0,decay=1.3,echo=0),
     'sweep-rl':dict(color='fff4dc',frm='sweep-rl',peak=.55,rise=.0,decay=1.3,echo=0)}
def cmd_flash(out,src,preset='blast',at=4.0,color=None,frm=None,peak=None,end='xfade'):
    P=dict(PRE.get(preset,PRE['blast']))
    if color:P['color']=color
    if frm:P['frm']=frm
    if peak:P['peak']=float(peak)
    F,fps=load(src);n,h,w,_=F.shape;yy,xx=np.mgrid[0:h,0:w].astype(np.float32);yy/=h;xx/=w
    c=hexrgb(P['color']);fr=P['frm']
    if fr=='top':L=smooth(1.15-yy*1.1)
    elif fr=='bottom':L=smooth(yy*1.1+.05)
    elif fr=='left':L=smooth(1.15-xx*1.1)
    elif fr=='right':L=smooth(xx*1.1+.05)
    elif fr=='all' or fr.startswith('sweep'):L=np.ones_like(xx)
    else:cx,cy=(float(v) for v in fr.split(','));L=.22+.78*np.exp(-(((xx-cx)*w/h)**2+(yy-cy)**2)/.1)   # точка: ярко у источника, чуть-чуть везде
    def env(t):   # вспышка: быстрый подъём, затухание; у молнии/взрыва — второй отблеск
        d=t-at
        if d<0:return 0.0
        e=min(1.0,d/P['rise']) if P['rise']>0 else 1.0
        e*=math.exp(-max(0,d-P['rise'])/P['decay'])
        if P['echo']:d2=d-.22;e+=P['echo']*(math.exp(-max(0,d2)/(P['decay']*.6)) if d2>=0 else 0)*(1 if d2<.6 else 0)
        return min(1.0,e)
    O=[]
    for i,f in enumerate(F):
        t=i/fps;e=env(t)*P['peak'];x=f.astype(np.float32)/255
        if e<=.002:O.append(f);continue
        Lm=L
        if fr.startswith('sweep'):   # полоса света едет через кадр за ~1.2 с (фары проезжающей машины)
            p=(t-at)/1.2;p=p if fr=='sweep-lr' else 1-p;Lm=np.exp(-((xx-p)/.16)**2)
            e=P['peak']*(1.0 if 0<=t-at<=1.2 else 0.0)
        a=(c*Lm[...,None]*e).clip(0,1)
        z=1-(1-x)*(1-a)   # «экран»: свет добавляется, ничего не выжигает в чёрное
        O.append((z.clip(0,1)*255).round().astype(np.uint8))
    seq=O;X=round(.6*fps);ev=at
    if end=='xfade':   # хвост наплывом на голову, файл с X-го кадра (как loop_bg); --end none — ролик уже петля
        head=seq[:X];tail=seq[-X:];seq=seq[X:-X]+[blend(tail[k],head[k],(k+1)/(X+1)) for k in range(X)];ev-=X/fps
    return save(out,seq,fps,poster=F[round(at*fps*.4)],ev=ev,note=f', вспышка {preset} на {ev:.1f} с')

def cmd_dim(out,src,room=.5,keep=(),lamps=.86,lampbox=None,cool=.12):
    """Свет в комнате выключен: всё темнее (room), чуть холоднее (ночь); зоны keep светят как были (окно, экран, неон);
    сами лампы (самое яркое и белое, внутри lampbox) — тусклое стекло, без ореола. Тот же ролик → B для switch --sync."""
    F,fps=load(src);n,h,w,_=F.shape;K=boxmask(w,h,list(keep),.03) if keep else np.zeros((h,w,1),np.float32)
    ref=np.median(F[::max(1,n//9)][:9],axis=0).astype(np.float32)/255;_,S,V=hsv(ref)
    lb=boxmask(w,h,[lampbox],.01)[...,0] if lampbox else np.ones((h,w),np.float32)
    L0=smooth((V-lamps)/.08)*smooth((.35-S)/.15)*lb             # нити ламп
    Lc=np.clip(blurmap(L0,w*.004)*1.6,0,1)[...,None]            # сама лампа целиком
    Lg=blurmap(L0,w*.03)[...,None];Lg=Lg/(Lg.max()+1e-6)        # её ореол
    tint=np.array([1-cool*.6,1-cool*.25,1+cool*.4],np.float32)
    O=[]
    for f in F:
        x=f.astype(np.float32)/255
        d=x*room*tint*(1-.55*Lg)                                  # комната без ламп
        d=d*(1-Lc)+(x*.32*np.array([.9,.92,1.0],np.float32))*Lc   # лампа — тёмное стекло
        z=d*(1-K)+x*K
        O.append((z.clip(0,1)*255).round().astype(np.uint8))
    return save(out,O,fps,note=f', свет выключен: комната ×{room}, светят как были зон: {len(keep)}, ламп ≈{float((L0>.5).mean())*100:.2f} % кадра')
def boxmask(w,h,boxes,feather=.04):
    im=Image.new('L',(w,h),0);dr=ImageDraw.Draw(im);rad=0
    for bx in boxes:
        v=[float(x) for x in bx.split(',')];x,y,bw,bh=v[:4];f=v[4] if len(v)>4 else feather;rad=max(rad,f)
        dr.rounded_rectangle([x*w,y*h,(x+bw)*w,(y+bh)*h],radius=min(bw*w,bh*h)*.25,fill=255)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(max(1,rad*min(w,h)))),np.float32)[...,None]/255
def cmd_freeze(out,src,live,base=None,end='xfade'):
    F,fps=load(src);n,h,w,_=F.shape;B=load(base,size=(w,h))[0][0] if base else F[0];M=boxmask(w,h,live)
    seq=[blend(B,f,M) for f in F];X=round(.6*fps)
    if end=='xfade':head=seq[:X];tail=seq[-X:];seq=seq[X:-X]+[blend(tail[k],head[k],(k+1)/(X+1)) for k in range(X)]
    return save(out,seq,fps,poster=blend(B,F[0],M),note=f', живые зоны: {len(live)}, остальное — неподвижный кадр')

def grid(im,step=.1,col=(255,255,255,110)):
    d=ImageDraw.Draw(im,'RGBA');w,h=im.size;f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',max(11,w//48))
    for k in range(1,int(1/step)):
        x=int(k*step*w);y=int(k*step*h);d.line([(x,0),(x,h)],fill=col);d.line([(0,y),(w,y)],fill=col)
        d.text((x+2,2),f'{k*step:.1f}',font=f,fill=(255,255,255,200));d.text((2,y+2),f'{k*step:.1f}',font=f,fill=(255,255,255,200))
    return im
def cmd_motion(out,src):
    W,H,_,_=probe(src);w,h=tsize(W,H);w,h=w//2,h//2;F,fps=load(src,size=(w,h))
    g=F.astype(np.float32).mean(3);sd=g.std(0);sd=sd/(np.percentile(sd,99.5)+1e-6)
    heat=np.zeros((h,w,3),np.float32);heat[...,0]=np.clip(sd*2,0,1);heat[...,1]=np.clip(sd*2-1,0,1)*.9;heat[...,2]=np.clip(1-sd*3,0,1)*.15
    base=F[0].astype(np.float32)/255*.55;im=Image.fromarray(((base+heat*.85).clip(0,1)*255).astype(np.uint8)).convert('RGBA')
    grid(im).convert('RGB').save(out);print(f'{out}: красное — движется сильнее; сетка — доли кадра для --live x,y,w,h')
def cmd_canvas(out,src,t=2.0,band=.5):
    isv=src.lower().endswith(VID);W,H=(probe(src)[:2] if isv else Image.open(src).size)
    bh=round(1280*band/2)*2;bw=round(W*bh/H/2)*2
    f=load(src,size=(bw,bh),t=t if isv else None,frames=1)[0][0]
    cw=720;x0=(bw-cw)//2;strip=f[:,x0:x0+cw] if bw>=cw else np.pad(f,((0,0),((cw-bw)//2,cw-bw-(cw-bw)//2),(0,0)))
    C=np.zeros((1280,cw,3),np.uint8);y0=(1280-bh)//2;C[y0:y0+bh]=strip
    Image.fromarray(C).save(out);print(f'{out}: холст 720×1280, живая полоса {y0}–{y0+bh} px ({y0/1280:.0%}–{(y0+bh)/1280:.0%} высоты)')
    print('  Nano Banana: «Fill the black areas above and below with a natural continuation of this exact photo — same room, same light and colors, same camera; do not change anything in the middle. Vertical 9:16, no text.»')
def cmd_widen(out,src,painted,band=.5,feather=.06):
    W,H,_,_=probe(src);bh=round(1280*band/2)*2;bw=round(W*bh/H/2)*2
    F,fps=load(src,size=(bw,bh));P=load(painted,size=(720,1280))[0][0]
    cw=720;x0=(bw-cw)//2;y0=(1280-bh)//2
    m=np.zeros((1280,1,1),np.float32);fy=int(1280*feather)
    m[y0:y0+bh]=1;ramp=smooth(np.linspace(0,1,fy))[:,None,None];m[y0:y0+fy]=ramp;m[y0+bh-fy:y0+bh]=ramp[::-1]
    seq=[]
    for f in F:
        L=np.array(P);L[y0:y0+bh]=f[:,x0:x0+cw] if bw>=cw else L[y0:y0+bh];seq.append(blend(P,L,m))
    return save(out,seq,fps,poster=seq[0],note=f', вертикаль из горизонтального: живая полоса {y0/1280:.0%}–{(y0+bh)/1280:.0%}, сверху и снизу — дорисованная картинка')

def args(a,flags):
    o={};pos=[]
    while a:
        x=a.pop(0)
        if x.startswith('--'):
            k,eq,v=x[2:].partition('=')
            if k in flags and flags[k] is bool:o[k]=True
            elif k in ('live','keep'):o.setdefault(k,[]).append(v if eq else a.pop(0))
            elif k in flags:o[k]=v if eq else a.pop(0)
            else:sys.exit('неизвестный ключ '+x)
        else:pos.append(x)
    return o,pos
if __name__=='__main__':
    if len(sys.argv)<2:sys.exit(__doc__ or open(__file__).read().split('import sys')[0])
    c,a=sys.argv[1],sys.argv[2:]
    if c=='switch':
        o,p=args(a,{'how':str,'dur':str,'a':str,'b':str,'end':str,'sync':bool,'poster':str})
        if len(p)!=3:sys.exit('switch <выход.mp4> <A.mp4> <B.mp4> [--how …] [--a С] [--b С] [--end …] [--sync]')
        cmd_switch(p[0],p[1],p[2],how=o.get('how','flicker'),dur=float(o['dur']) if 'dur' in o else None,a=float(o['a']) if 'a' in o else None,
                   b=float(o['b']) if 'b' in o else None,end=o.get('end','dip'),sync=o.get('sync',False),poster=o.get('poster'))
    elif c=='recolor':
        o,p=args(a,{'hue':str,'to':str,'sat':str,'tint':str,'box':str,'glow':str})
        cmd_recolor(p[0],p[1],hue=o.get('hue','160:215'),to=float(o.get('to',0)),sat=float(o.get('sat',1.3)),tint=o.get('tint'),box=o.get('box'),glow=float(o.get('glow',.32)))
    elif c=='flash':
        o,p=args(a,{'preset':str,'at':str,'color':str,'from':str,'peak':str,'end':str})
        cmd_flash(p[0],p[1],preset=o.get('preset','blast'),at=float(o.get('at',4)),color=o.get('color'),frm=o.get('from'),peak=o.get('peak'),end=o.get('end','xfade'))
    elif c=='dim':
        o,p=args(a,{'room':str,'keep':list,'lamps':str,'lampbox':str,'cool':str})
        cmd_dim(p[0],p[1],room=float(o.get('room',.5)),keep=o.get('keep',[]),lamps=float(o.get('lamps',.86)),lampbox=o.get('lampbox'),cool=float(o.get('cool',.12)))
    elif c=='freeze':
        o,p=args(a,{'live':list,'base':str,'end':str})
        if not o.get('live'):sys.exit('freeze: нужна хотя бы одна --live x,y,w,h')
        cmd_freeze(p[0],p[1],o['live'],base=o.get('base'),end=o.get('end','xfade'))
    elif c=='motion':cmd_motion(a[0],a[1])
    elif c=='canvas':
        o,p=args(a,{'t':str,'band':str});cmd_canvas(p[0],p[1],t=float(o.get('t',2)),band=float(o.get('band',.5)))
    elif c=='widen':
        o,p=args(a,{'band':str});cmd_widen(p[0],p[1],p[2],band=float(o.get('band',.5)))
    else:sys.exit('команды: switch | recolor | dim | flash | freeze | motion | canvas | widen')
