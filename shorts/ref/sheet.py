# Плотные кадры ролика Боба: python3 sheet.py <ролик> <от, с> <до, с> <шаг, с> <выход.jpg> [колонок]
# пример: python3 sheet.py hovan 29.6 34.0 0.3 s2b.jpg 5   (ролик = имя файла без .mp4 в BOB_REF)
import subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont
R=os.environ.get('BOB_REF', os.path.expanduser('~/bob-ref'))   # папка с 14 роликами Боба (apple.mp4, cola.mp4 …)
v,a,b,st,out=sys.argv[1],float(sys.argv[2]),float(sys.argv[3]),float(sys.argv[4]),sys.argv[5]
cols=int(sys.argv[6]) if len(sys.argv)>6 else 5; W,H=384,216
ts=[];t=a
while t<=b+1e-6: ts.append(round(t,2)); t+=st
os.makedirs('f',exist_ok=True)
rows=(len(ts)+cols-1)//cols; img=Image.new('RGB',(cols*W,rows*(H+4)),'#000'); d=ImageDraw.Draw(img)
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
for i,t in enumerate(ts):
    p=f'f/{v}_{t:.2f}.jpg'
    if not os.path.exists(p): subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',f'{R}/{v}.mp4','-frames:v','1','-vf',f'scale={W}:{H}',p],check=True)
    x,y=(i%cols)*W,(i//cols)*(H+4); img.paste(Image.open(p),(x,y)); d.text((x+6,y+4),f'{t:.2f}',fill='#ff0',font=F,stroke_width=2,stroke_fill='#000')
img.save(out,quality=82); print(out,img.size)
