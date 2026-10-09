#!/usr/bin/env python3
# Бесшовная петля для фонов-наград (13.0). Фон в приложении крутится по кругу (<video loop>), поэтому конец файла
# должен незаметно переходить в начало.
#   python3 tools/loop_bg.py <выход.mp4> <ролик А> [ролик Б]
# • два ролика (петля на 2 кадрах: А = Кадр 1 → Кадр 2, Б = Кадр 2 → Кадр 1) — склеиваю А+Б, стыки сглаживаю
#   короткими наплывами (генератор попадает в кадры не пиксель в пиксель);
# • один ролик — конец плавно перетекает в начало (наплыв хвоста на голову), длина становится на секунду короче.
# На выходе: H.264 без звука, вертикаль 720×1280 или горизонталь 1280×720 (почти квадрат — 720×720, как есть), ~1–2 МБ,
# чёрные полосы с двух сторон срезаются сами, + превью <выход>p.jpg
# (bg.mp4 → bgp.jpg, film-bg.mp4 → film-bgp.jpg) — его показывает «Коллекция», пока видео грузится.
import sys,subprocess,json,os
def probe(p):
    j=json.loads(subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate:format=duration','-of','json',p],capture_output=True,text=True).stdout)
    s=j['streams'][0];a,b=s['r_frame_rate'].split('/');return s['width'],s['height'],float(a)/float(b),float(j['format']['duration'])
def bars(p,W,H):
    # 13.5: чёрные полосы (генератор вписал квадрат в 16:9 и т.п.) — срезаю, только если они с ОБЕИХ сторон и шире 4 %:
    # тёмный пол/угол комнаты с одной стороны — это картинка, не полоса. Яркость — максимум по 12 кадрам на сетке 640 px
    # (cropdetect путается: в «Таксисте» находил «картинку» посреди чёрной полосы)
    w,h=640,round(640*H/W/2)*2;raw=subprocess.run(['ffmpeg','-nostdin','-v','error','-i',p,'-vf',f"select='not(mod(n,20))',scale={w}:{h},format=gray",'-vsync','0','-frames:v','12','-f','rawvideo','-'],capture_output=True).stdout
    n=len(raw)//(w*h)
    if not n:return None
    col=[0]*w;row=[0]*h
    for k in range(n):
        fr=raw[k*w*h:(k+1)*w*h]
        for y in range(h):
            r=fr[y*w:(y+1)*w];m=max(r)
            if m>row[y]:row[y]=m
            if m>16:
                for x,v in enumerate(r):
                    if v>col[x]:col[x]=v
    on=lambda L:[i for i,v in enumerate(L) if v>16]
    X=on(col);Y=on(row)
    if not X or not Y:return None
    sx=W/w;sy=H/h;x0,x1,y0,y1=X[0]*sx,(X[-1]+1)*sx,Y[0]*sy,(Y[-1]+1)*sy
    if not(x0>W*.04 and W-x1>W*.04):x0,x1=0,W
    else:x0+=4;x1-=4                       # пара пикселей с края — там бывает серый ореол
    if not(y0>H*.04 and H-y1>H*.04):y0,y1=0,H
    else:y0+=4;y1-=4
    if (x0,x1,y0,y1)==(0,W,0,H):return None
    x0=int(x0)//2*2;y0=int(y0)//2*2;return int(x1-x0)//2*2,int(y1-y0)//2*2,x0,y0
def main(out,clips,X=None):
    W,H,fps,_=probe(clips[0]);cb=bars(clips[0],W,H)
    if cb:W,H=cb[0],cb[1]
    r=W/H;fps=min(30,round(fps)) or 24
    size='720:1280' if r<.77 else '1280:720' if r>1.3 else f'720:{round(720/r/2)*2}'   # почти квадрат — как есть: обрезать в 9:16 или 16:9 — потерять половину кадра
    port=r<.77
    norm=(f"crop={cb[0]}:{cb[1]}:{cb[2]}:{cb[3]}," if cb else '')+f"scale={size}:force_original_aspect_ratio=increase,crop={size},setsar=1,fps={fps},format=yuv420p"
    D=[probe(c)[3] for c in clips]
    fc=[];inp=[]
    for i,c in enumerate(clips):inp+=['-i',c];fc.append(f"[{i}:v]{norm},trim=0:{D[i]:.3f},setpts=PTS-STARTPTS[c{i}]")
    if len(clips)==2:   # А+Б со стыком-наплывом 0.3 с
        y=0.3;fc.append(f"[c0][c1]xfade=transition=fade:duration={y}:offset={D[0]-y:.3f}[ab]");L=D[0]+D[1]-y;X=X or y;src='ab'
    else:L=D[0];X=X or min(1.0,L*0.2);src='c0'
    # хвост (последние X с) наплывом поверх головы (первых X с): …середина → [хвост→голова] → (по кругу) середина…
    fc.append(f"[{src}]split=3[h0][m0][t0]")
    fc.append(f"[h0]trim=0:{X:.3f},setpts=PTS-STARTPTS[head]")
    fc.append(f"[m0]trim={X:.3f}:{L-X:.3f},setpts=PTS-STARTPTS[mid]")
    fc.append(f"[t0]trim={L-X:.3f}:{L:.3f},setpts=PTS-STARTPTS[tail]")
    fc.append(f"[tail][head]xfade=transition=fade:duration={X-1/fps:.4f}:offset=0[bl]")   # на кадр короче: последний кадр наплыва — чистая «голова», стык с серединой — обычная смена кадра
    fc.append("[mid][bl]concat=n=2:v=1:a=0[v]")
    subprocess.run(['ffmpeg','-v','error','-y',*inp,'-filter_complex',';'.join(fc),'-map','[v]','-an','-c:v','libx264','-preset','slow','-crf','27',
                    '-maxrate','2M','-bufsize','4M','-profile:v','main','-pix_fmt','yuv420p','-movflags','+faststart',out],check=True)
    d=probe(out)[3];poster=out[:-4]+'p.jpg'
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{d/3:.2f}','-i',out,'-frames:v','1','-q:v','4',poster],check=True)
    print(f'{out}: {d:.1f} с, {os.path.getsize(out)//1024} КБ, {"вертикаль" if port else "горизонталь" if r>1.3 else "почти квадрат"} {size.replace(":","×")}{" (полосы срезаны)" if cb else ""}, {fps} к/с; превью {os.path.basename(poster)}')
if __name__=='__main__':
    if len(sys.argv) not in (3,4):sys.exit(__doc__ or 'loop_bg.py <выход.mp4> <ролик А> [ролик Б]')
    main(sys.argv[1],sys.argv[2:])
