import subprocess, os, sys
from PIL import Image, ImageDraw, ImageFont
R=os.environ.get('BOB_REF', os.path.expanduser('~/bob-ref'))   # 14 роликов Боба
OUR=sys.argv[1]   # наш ролик: python3 cmp.py <ролик.mp4> [номера сцен через запятую]
S=[('1 · колпачок → крыша магазина',[('starbucks',0,5,'#011/136/137 Starbucks')],(0,9)),
   ('2 · шторка → зал FDA и гильотина',[('apple',9.5,15,'#042 Apple'),('hovan',30,33.5,'#127 Хованский')],(9,20.8)),
   ('3 · валики → дыра → крест/конвейер',[('sobolev',5.5,10,'#112 Соболев'),('cola',11.8,15.5,'#005 Cola')],(20.8,33.5)),
   ('4 · конвейер → волна → лист отчёта',[('cola',19.5,28.5,'#007 Cola'),('madonna',55.5,59.5,'#109 Мадонна')],(33.9,43.0)),
   ('5 · капля → пакеты → анализатор → переворот',[('cola',3.2,5.5,'#002 Cola'),('insta',21.5,31.5,'#054/055 Insta'),('starbucks',39.5,43.5,'#019 Starbucks')],(43.0,53.2)),
   ('6 · чертежи с краном → торец',[('davinci',29.5,37,'#067 Да Винчи'),('cola',5.5,9.0,'#003 Cola')],(53.2,64.0)),
   ('7 · холм → змеевик → касса',[('cola',41.5,45.5,'#009 Cola'),('cola',45.5,60,'#010 Cola'),('starbucks',5.5,11,'#012 Starbucks')],(64.0,75.5)),
   ('8 · общежитие под Луной',[('wot',36,41,'#076 WoT')],(75.5,82.9)),
   ('9 · доска и ноутбук (петля)',[('wot',33,36,'#071 WoT')],(82.9,97.3))]
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',s)
def grab(src,t,w,h,out):
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{t:.2f}','-i',src,'-frames:v','1','-vf',f'scale={w}:{h}',out],check=True)
    return Image.open(out).convert('RGB')
for k,(title,refs,(a,b)) in enumerate(S,1):
    if len(sys.argv)>2 and str(k) not in sys.argv[2].split(','): continue
    N=8; tot=sum(r[2]-r[1] for r in refs); ts=[]
    cnt=[max(2,round(N*(r[2]-r[1])/tot)) for r in refs]
    while sum(cnt)>N: cnt[cnt.index(max(cnt))]-=1
    while sum(cnt)<N: cnt[cnt.index(min(cnt))]+=1
    for r,c in zip(refs,cnt):
        for i in range(c): ts.append((r, r[1]+(r[2]-r[1])*(i+.5)/c))
    W=1920; img=Image.new('RGB',(W,60+30+135+40+427+20),'#111'); d=ImageDraw.Draw(img)
    d.text((14,14),f'Сцена {title}',fill='#fff',font=F(30))
    d.text((14,62),'Референсы Gemini:',fill='#facc15',font=F(20))
    for i,(r,t) in enumerate(ts):
        im=grab(f'{R}/{r[0]}.mp4',t,240,135,f'qr{k}_{i}.jpg'); img.paste(im,(i*240,90))
        d.rectangle([i*240,90,i*240+239,90+134],outline='#000',width=2)
        d.text((i*240+6,94),f'{r[3]} {t:.1f}',fill='#fff',font=F(13),stroke_width=2,stroke_fill='#000')
    y=90+135+8; d.text((14,y),'Наш ролик:',fill='#38bdf8',font=F(20)); y+=32
    for i in range(N):
        t=a+(b-a)*(i+.5)/N; im=grab(OUR,t,240,427,f'qo{k}_{i}.jpg'); img.paste(im,(i*240,y))
        d.text((i*240+6,y+4),f'{t:.1f}',fill='#fff',font=F(16),stroke_width=2,stroke_fill='#000')
    img.save(f'q{k}.jpg',quality=80); print('ok',k)
