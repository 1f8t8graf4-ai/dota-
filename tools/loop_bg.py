#!/usr/bin/env python3
# Бесшовная петля для фонов-наград (13.0). Фон в приложении крутится по кругу (<video loop>), поэтому конец файла
# должен незаметно переходить в начало.
#   python3 tools/loop_bg.py <выход.mp4> <ролик А> [ролик Б]
# • два ролика (петля на 2 кадрах: А = Кадр 1 → Кадр 2, Б = Кадр 2 → Кадр 1) — склеиваю А+Б, стыки сглаживаю
#   короткими наплывами (генератор попадает в кадры не пиксель в пиксель);
# • один ролик — конец плавно перетекает в начало (наплыв хвоста на голову), длина становится на секунду короче.
# На выходе: H.264 без звука, вертикаль 720×1280 или горизонталь 1280×720, ~1–2 МБ, + превью <выход>p.jpg
# (bg.mp4 → bgp.jpg, film-bg.mp4 → film-bgp.jpg) — его показывает «Коллекция», пока видео грузится.
import sys,subprocess,json,os
def probe(p):
    j=json.loads(subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate:format=duration','-of','json',p],capture_output=True,text=True).stdout)
    s=j['streams'][0];a,b=s['r_frame_rate'].split('/');return s['width'],s['height'],float(a)/float(b),float(j['format']['duration'])
def main(out,clips,X=None):
    W,H,fps,_=probe(clips[0]);port=H>W
    fps=min(30,round(fps)) or 24
    size='720:1280' if port else '1280:720'
    norm=f"scale={size}:force_original_aspect_ratio=increase,crop={size},setsar=1,fps={fps},format=yuv420p"
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
    print(f'{out}: {d:.1f} с, {os.path.getsize(out)//1024} КБ, {"вертикаль" if port else "горизонталь"} {size.replace(":","×")}, {fps} к/с; превью {os.path.basename(poster)}')
if __name__=='__main__':
    if len(sys.argv) not in (3,4):sys.exit(__doc__ or 'loop_bg.py <выход.mp4> <ролик А> [ролик Б]')
    main(sys.argv[1],sys.argv[2:])
