import cv2, numpy as np, json, math
res=[]
for i in range(1,266):
    im=cv2.imread('f25/%03d.png'%i); hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV).astype(int)
    S,V=hsv[...,1],hsv[...,2]; B,G,R=[im[...,k].astype(int) for k in range(3)]
    t=(i-1)/25
    pap=((V>=185)&(S<=75)&((B-R)<=4)).astype(np.uint8)*255
    pap=cv2.morphologyEx(pap,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
    n,lab,st,cen=cv2.connectedComponentsWithStats(pap,8)
    best=None
    for k in range(1,n):
        a=st[k,4]; x,y,w,h=st[k,:4]
        if 60000<a<330000 and w<900 and h<900 and (best is None or a>st[best,4]): best=k
    if best is None: res.append([t,None]); continue
    m=(lab==best).astype(np.uint8)
    hull=cv2.convexHull(np.column_stack(np.nonzero(m))[:,::-1].astype(np.int32))
    hm=np.zeros_like(m); cv2.fillConvexPoly(hm,hull,1)
    mm=cv2.moments(hm,True); cx,cy=mm['m10']/mm['m00'],mm['m01']/mm['m00']
    dark=((V<125)&(S<150)&(hm>0)).astype(np.uint8)*255
    dark=cv2.morphologyEx(dark,cv2.MORPH_OPEN,np.ones((7,7),np.uint8))
    md=cv2.moments(dark,True)
    if md['m00']<300: res.append([t,[round(cx,1),round(cy,1),None,int(hm.sum())]]); continue
    lx,ly=md['m10']/md['m00'],md['m01']/md['m00']
    th=math.degrees(math.atan2(lx-cx,cy-ly))
    res.append([t,[round(cx,1),round(cy,1),round(th,1),int(hm.sum()),round(math.hypot(lx-cx,ly-cy),1)]])
json.dump(res,open('stack2.json','w'))
for r in res[::2]: print('%.2f'%r[0],r[1])
