#!/usr/bin/env python3
# Тест-приложение «Языки по кино»: данные 10 сцен + картинки + 2 настоящих эпизода
import json, os, subprocess, urllib.request, io, re
from PIL import Image
R='/home/user/wtm'; O='/home/user/work/app3'; B='https://dota.1f8t8graf4.workers.dev/m/scenes'
S=json.load(open(R+'/data/scenes.json')); S=S['SCENES'] if isinstance(S,dict) else S
CE=json.load(open(R+'/data/ctx-en.json')); CE=CE.get('CTX_EN',CE)
CD=json.load(open(R+'/data/ctx-de.json')); CD=CD.get('CTX_DE',CD)
TOP=json.load(open(R+'/data/topics.json')) if os.path.exists(R+'/data/topics.json') else {}
IDS=['titanic-boat','wolf-of-wall-street','sopranos-s01e01','breaking-bad-knocks','american-psycho-cards','taxi-driver-betsy','durov-tucker','clavicular-burger','downfall-bunker','wolf-naomi-de']
PLAY={'titanic-boat':0,'wolf-of-wall-street':0}
LVW=['','Начинающий','Базовый','Средний','Выше среднего','Продвинутый']
def get(url):
    r=subprocess.run(['curl','-sfL','--max-time','120',url],capture_output=True)
    if r.returncode: raise Exception('curl %d %s'%(r.returncode,url))
    return r.stdout
def img(sid,name,out,w,q=78):
    p=f'{O}/a/{out}'
    if os.path.exists(p): return out
    try: b=get(f'{B}/{sid}/{name}')
    except Exception as e: return None
    im=Image.open(io.BytesIO(b)).convert('RGB')
    if im.width>w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    im.save(p,'JPEG',quality=q,optimize=True,progressive=True); return out
out=[]
for sid in IDS:
    s=[x for x in S if x['id']==sid][0]; de=s.get('lang')=='de'
    sc={'id':sid,'t':s['title'].replace('⁠',''),'show':s.get('show'),'kind':s.get('kind'),'lang':s.get('lang','en'),'lvl':s.get('lvl',2),'lw':LVW[s.get('lvl',2)],
        'ep':s.get('ep',''),'sub':s.get('sub',''),'lvlWhy':s.get('lvlWhy',''),'useWhy':s.get('useWhy',''),
        'poster':img(sid,'poster.jpg',f'{sid}-p.jpg',360),'cover':img(sid,'cover.jpg',f'{sid}-c.jpg',760),'parts':[]}
    for i,p in enumerate(s['parts']):
        n=f'{i+1:02d}'
        ph=[]
        for j,f in enumerate(p.get('ph',[])):
            if f.get('passive'): continue
            kw=(f.get('kw') or [[None,None,None]])[0]
            ph.append({'j':j,'en':f.get('de') if de else f['en'],'ru':f['ru'],'a':f['a'],'b':f['b'],'use':f.get('use',''),'trap':(f.get('trap') or [])[:3],'x':f.get('x',''),
                       'kw':[kw[0],kw[2]] if kw and kw[0] else None,'gap':f.get('gap','')})
        pt={'t':p['t'],'a':p['a'],'b':p['b'],'fact':p.get('fact',''),'ph':ph,'th':img(sid,f'{n}.jpg',f'{sid}-{n}.jpg',360),'k':img(sid,f'{n}-k.jpg',f'{sid}-{n}k.jpg',640)}
        if sid in PLAY and PLAY[sid]==i:
            vf=f'{O}/v/{sid}-{n}.mp4'
            if not os.path.exists(vf):
                raw=f'/tmp/{sid}-{n}.mp4'; open(raw,'wb').write(get(f'{B}/{sid}/{n}.mp4'))
                subprocess.run(['ffmpeg','-y','-loglevel','error','-i',raw,'-vf','scale=-2:540','-c:v','libx264','-preset','slow','-crf','27','-profile:v','high','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',vf],check=True)
            pt['video']=f'v/{sid}-{n}.mp4'
            ctx=(CD if de else CE).get(sid,[])
            subs=[]
            for k,x in enumerate(s['subs']):
                if x[1]<=p['a'] or x[0]>=p['b']: continue
                c=ctx[k] if k<len(ctx) else None
                subs.append({'a':round(x[0]-p['a'],2),'b':round(x[1]-p['a'],2),'en':x[4] if de else x[2],'ru':x[3],'here':(c[1] if c else {}),'xp':(c[2] if c else []),'g':(c[3] if c and len(c)>3 else {})})
            pt['subs']=subs
            try:
                wt=json.loads(get(f'{B}/{sid}/wt.json'))['w']
                pt['wt']=[[round(w[0]-p['a'],2),round(w[1]-p['a'],2),w[2]] for w in wt if p['a']<=w[0]<p['b']]
            except Exception: pt['wt']=[]
        sc['parts'].append(pt)
    out.append(sc)
# Deadlock: герои
w={}; exec_js=subprocess.run(['node','-e',"const fs=require('fs');const w={};new Function('window',fs.readFileSync('%s/restless/data.js','utf8'))(w);const H=w.RL_DATA.heroes;console.log(JSON.stringify([65,84,79,17,81,69,2,78].map(i=>({id:i,n:H[i].n,col:H[i].col,ty:H[i].ty}))))"%R],capture_output=True,text=True)
HE=json.loads(exec_js.stdout)
for h in HE:
    p=f"{O}/h/{h['id']}.webp"
    if not os.path.exists(p):
        im=Image.open(f"{R}/restless/art/{h['id']}.webp"); im.thumbnail((420,420)); im.save(p,'WEBP',quality=80)
    h['img']=f"h/{h['id']}.webp"
open(f'{O}/data.js','w').write('window.SC='+json.dumps(out,ensure_ascii=False)+';\nwindow.HE='+json.dumps(HE,ensure_ascii=False)+';\n')
tot=sum(os.path.getsize(os.path.join(d,f)) for d in [O+'/a',O+'/v',O+'/h'] for f in os.listdir(d))
print('сцен',len(out),'данные',os.path.getsize(O+'/data.js')//1024,'КБ; медиа',tot//1024,'КБ')
