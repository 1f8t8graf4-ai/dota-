# трекинг рук: жёсткий спрайт (маска из hands.json) → поза в каждом кадре (центр бокса, угол), matchTemplate по маскам
import cv2, numpy as np, json, math, sys
H=json.load(open('hands.json'))
SKIN={'skin','skinShadow','skinLight'}
def sprite_mask(h, names):
    x0,y0,x1,y1=h['box']; m=np.zeros((y1-y0,x1-x0),np.uint8)
    for L in h['layers']:
        if L['name'] in names:
            for p in L['paths']:
                cv2.fillPoly(m,[np.array(p,np.float32).reshape(-1,2).round().astype(np.int32)],255)
    return m
def frame_mask(im, which):
    hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV).astype(int); Hh,S,V=hsv[...,0],hsv[...,1],hsv[...,2]
    yy=np.arange(im.shape[0])[:,None]*np.ones((1,im.shape[1]),int)
    sk=(Hh>=8)&(Hh<=24)&(S>=50)&(S<=190)&(V>=140)
    if which=='h1': sl=(Hh>=92)&(Hh<=112)&(S>=60)&(V>=70)&(V<=160)&(yy<170)
    else: sl=((Hh<=12)|(Hh>=172))&(S>=110)&(V>=150)
    m=((sk|sl)).astype(np.uint8)*255
    return cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
PAD=400
def rot(m, ang):
    h,w=m.shape; c=(w/2,h/2); M=cv2.getRotationMatrix2D(c,ang,1)
    cs,sn=abs(M[0,0]),abs(M[0,1]); nw,nh=int(h*sn+w*cs)+2,int(h*cs+w*sn)+2
    M[0,2]+=nw/2-c[0]; M[1,2]+=nh/2-c[1]
    return cv2.warpAffine(m,M,(nw,nh),flags=cv2.INTER_NEAREST)
def track(key, names, which, t0, t1, angs, sc=0.5):
    h=H[key]; sm=sprite_mask(h,names)
    sms=cv2.resize(sm,None,fx=sc,fy=sc,interpolation=cv2.INTER_AREA)
    temps=[(a,rot(sms,a).astype(np.float32)/255) for a in angs]
    out=[]
    for i in range(int(round(t0*25))+1,int(round(t1*25))+2):
        im=cv2.imread('f25/%03d.png'%i); fm=frame_mask(im,which)
        if fm.sum()/255<1500: out.append([round((i-1)/25,2),None]); continue
        fp=cv2.copyMakeBorder(fm,PAD,PAD,PAD,PAD,cv2.BORDER_CONSTANT,0)
        fs=cv2.resize(fp,None,fx=sc,fy=sc,interpolation=cv2.INTER_AREA).astype(np.float32)/255
        best=None
        for a,tp in temps:
            r=cv2.matchTemplate(fs,tp,cv2.TM_CCORR)
            # нормируем на площадь: Dice-подобная мера 2*inter/(A+B)
            A=tp.sum(); 
            ii=cv2.integral(fs)  # сумма маски кадра под окном
            th,tw=tp.shape
            B=ii[th:,tw:]-ii[:-th,tw:]-ii[th:,:-tw]+ii[:-th,:-tw]
            B=B[:r.shape[0],:r.shape[1]]
            d=2*r/(A+B+1e-6)
            _,mv,_,ml=cv2.minMaxLoc(d)
            if best is None or mv>best[0]: best=(mv,a,ml,tp.shape)
        mv,a,(mx,my),(th,tw)=best
        cx=(mx+tw/2)/sc-PAD; cy=(my+th/2)/sc-PAD
        out.append([round((i-1)/25,2),[round(cx,1),round(cy,1),a,round(mv,3)]])
    return out
which=sys.argv[1]
res={}
if which=='h1':
    angs=list(range(-50,51,2))
    res['hold']=track('hand1',SKIN|{'sleeve'},'h1',0.9,3.4,angs)
    res['open']=track('hand1open',SKIN|{'sleeve'},'h1',2.8,4.0,angs)
else:
    angs=list(range(-20,61,2))
    res['h2']=track('hand2',SKIN|{'sleeve','nails'},'h2',3.1,8.7,angs)
json.dump(res,open('trk_%s.json'%which,'w'))
for k,v in res.items():
    print(k)
    for r in v[::2]: print('  ',r)
