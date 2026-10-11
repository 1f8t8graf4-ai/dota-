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
#
# Фоны с событием (после 13.8.4) («4 с спокойно → событие → после», промты — tools/bg_event.py):
#   python3 tools/loop_bg.py <выход.mp4> <ролик> [--seam xfade|dip|cut|black[=сек]] [--calm auto|N] [--event auto|off|<сек>]
# • --event auto — сам находит, где начинается событие (резкий скачок движения после спокойной части);
# • --calm auto — спокойную часть повторяю ещё раз перед событием: на Главной событие раз в ~12 с, а не каждые 8 (мельтешит);
# • --seam — как склеить конец с началом: xfade — наплыв (событие «прошло само», петля «сама»), dip — короткое затемнение
#   (новое состояние держится до конца: топор исчез, шлюпку спустили), cut — резкий переход, black=1.2 — резко в чёрное
#   и из чёрного (финал «Сопрано»). По картинке это не определить: у Veo весь ролик медленно «ползёт» (свет, масштаб),
#   поэтому тип шва берётся из списка фонов (tools/bg_event.py, поле loop: сама → xfade, тьма → dip, чёрный → black).
# Ролик без события работает как раньше.
# • --calm-only — событие не вышло: беру только спокойную часть до него (≈3.7 с) и делаю из неё петлю наплывом.
#   Так любая попытка годится в дело: 2 попытки максимум, дальше — спокойная часть лучшей.
import sys,subprocess,json,os,statistics
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
def event_at(p,fps=12,w=96):
    """Начало события: первый кадр (после 1.2 с), где доля сильно изменившихся пикселей между соседними кадрами
    в 4+ раза выше, чем в спокойные первые 2.5 с. Нет такого — None (ролик без события)."""
    W,H,_,L=probe(p);h=round(w*H/W/2)*2
    raw=subprocess.run(['ffmpeg','-nostdin','-v','error','-i',p,'-vf',f'fps={fps},scale={w}:{h},format=gray','-f','rawvideo','-'],capture_output=True).stdout
    F=[raw[i*w*h:(i+1)*w*h] for i in range(len(raw)//(w*h))]
    if len(F)<fps*3:return None
    S=[0]+[sum(1 for x,y in zip(F[i],F[i-1]) if abs(x-y)>18)/(w*h) for i in range(1,len(F))]
    C=S[1:int(2.5*fps)];b=statistics.median(C);thr=max(4*b,1.5*max(C),b+0.010)   # 1 % кадра: пальмы и чат у «Клава» дают 0.7 %, кольцо/сыр/жемчуг — 1–3 %
    for i in range(int(1.2*fps),len(F)-int(0.6*fps)):
        if S[i]>thr:return i/fps
    return None
def main(out,clips,X=None,seam='xfade',calm='auto',event='auto',calm_only=False):
    W,H,fps,_=probe(clips[0]);cb=bars(clips[0],W,H)
    if cb:W,H=cb[0],cb[1]
    r=W/H;fps=min(30,round(fps)) or 24
    size='720:1280' if r<.77 else '1280:720' if r>1.3 else f'720:{round(720/r/2)*2}'   # почти квадрат — как есть: обрезать в 9:16 или 16:9 — потерять половину кадра
    port=r<.77
    norm=(f"crop={cb[0]}:{cb[1]}:{cb[2]}:{cb[3]}," if cb else '')+f"scale={size}:force_original_aspect_ratio=increase,crop={size},setsar=1,fps={fps},format=yuv420p"
    D=[probe(c)[3] for c in clips]
    fc=[];inp=[];note='';Eo=None
    for i,c in enumerate(clips):inp+=['-i',c];fc.append(f"[{i}:v]{norm},trim=0:{D[i]:.3f},setpts=PTS-STARTPTS[c{i}]")
    if len(clips)==2:   # А+Б со стыком-наплывом 0.3 с
        y=0.3;fc.append(f"[c0][c1]xfade=transition=fade:duration={y}:offset={D[0]-y:.3f}[ab]");L=D[0]+D[1]-y;X=X or y;src='ab'
    else:
        L=D[0];src='c0'
        E=None if event=='off' else event_at(clips[0]) if event=='auto' else float(event)
        if calm_only:   # 13.9.6: событие не вышло — берём только спокойную часть до него, петля наплывом (любая попытка даёт фон)
            if E:L=max(1.5,E-0.3);fc.append(f"[c0]trim=0:{L:.3f},setpts=PTS-STARTPTS[cc]");src='cc';note=f', только спокойная часть до события ({E:.1f} с)'
            else:note=', события не нашёл — весь ролик'
            E=None;seam='xfade'
        k=0 if not E else (1 if E>=2.5 else 0) if calm=='auto' else int(calm)
        if E:note=f', событие на {E:.1f} с'
        Eo=E   # 13.9.6: где событие окажется в готовом файле
        if E and k:   # спокойная часть ещё k раз перед событием, стыки — наплыв 0.4 с: …спокойно → спокойно → событие → после…
            Lc=E-0.3;d=0.4;fc.append(f"[c0]split={k+1}"+''.join(f'[s{j}]' for j in range(k+1)))
            for j in range(k):fc.append(f"[s{j}]trim=0:{Lc:.3f},setpts=PTS-STARTPTS[q{j}]")
            seq=[(f'q{j}',Lc) for j in range(k)]+[(f's{k}',L)];cur,cl=seq[0]
            for j,(lab,ln) in enumerate(seq[1:]):fc.append(f"[{cur}][{lab}]xfade=transition=fade:duration={d}:offset={cl-d:.3f}[x{j}]");cur,cl=f'x{j}',cl+ln-d
            src,L=cur,cl;note+=f', спокойная часть ×{k+1}';Eo=E+k*(Lc-d)
        X=X or min(1.0,L*0.2)
    if seam=='xfade' or len(clips)==2:
        # хвост (последние X с) наплывом поверх головы (первых X с): …середина → [хвост→голова] → (по кругу) середина…
        fc.append(f"[{src}]split=3[h0][m0][t0]")
        fc.append(f"[h0]trim=0:{X:.3f},setpts=PTS-STARTPTS[head]")
        fc.append(f"[m0]trim={X:.3f}:{L-X:.3f},setpts=PTS-STARTPTS[mid]")
        fc.append(f"[t0]trim={L-X:.3f}:{L:.3f},setpts=PTS-STARTPTS[tail]")
        fc.append(f"[tail][head]xfade=transition=fade:duration={X-1/fps:.4f}:offset=0[bl]")   # на кадр короче: последний кадр наплыва — чистая «голова», стык с серединой — обычная смена кадра
        fc.append("[mid][bl]concat=n=2:v=1:a=0[v]")
    elif seam=='dip':   # затемнение на стыке: конец гаснет за 0.25 с, начало проявляется за 0.25 с
        fc.append(f"[{src}]fade=t=in:st=0:d=0.25,fade=t=out:st={L-0.25:.3f}:d=0.25[v]")
    elif seam=='cut':
        fc.append(f"[{src}]null[v]")
    elif seam.startswith('black'):   # резко в чёрное, пауза, из чёрного проявляется начало
        b=float(seam.split('=')[1]) if '=' in seam else 1.2;w_,h_=size.split(':')
        fc.append(f"color=c=black:s={w_}x{h_}:r={fps}:d={b},format=yuv420p,setsar=1[blk]")
        fc.append(f"[{src}]fade=t=in:st=0:d=0.4[sf];[sf][blk]concat=n=2:v=1:a=0[v]")
    else:sys.exit('--seam: xfade | dip | cut | black[=сек]')
    if len(clips)==1 and Eo and (seam=='xfade'):Eo-=X   # при наплыве файл начинается с X-й секунды
    per=L-X if seam=='xfade' or len(clips)==2 else L+(float(seam.split('=')[1]) if '=' in seam else 1.2) if seam.startswith('black') else L
    note+=f', шов: {seam}'+(f' — событие раз в {per:.1f} с' if 'событие' in note else '')
    subprocess.run(['ffmpeg','-v','error','-y',*inp,'-filter_complex',';'.join(fc),'-map','[v]','-an','-c:v','libx264','-preset','slow','-crf','27',
                    '-maxrate','2M','-bufsize','4M','-profile:v','main','-pix_fmt','yuv420p','-movflags','+faststart',out],check=True)
    d=probe(out)[3];poster=out[:-4]+'p.jpg'
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{d/3:.2f}','-i',out,'-frames:v','1','-q:v','4',poster],check=True)
    print(f'{out}: {d:.1f} с, {os.path.getsize(out)//1024} КБ, {"вертикаль" if port else "горизонталь" if r>1.3 else "почти квадрат"} {size.replace(":","×")}{" (полосы срезаны)" if cb else ""}, {fps} к/с{note}; превью {os.path.basename(poster)}')
    if Eo:   # 13.9.6: в профиле, приглашении и дуэли ролик стартует прямо перед событием — для этого время события в data/scenes.json
        k='filmbgev' if os.path.basename(out).startswith('film-') else 'bgev'
        print(f'  событие в файле на {Eo:.1f} с → в data/scenes.json у сцены: "{k}":{Eo:.1f} (и python3 tools/rebuild_all_data.py)')
if __name__=='__main__':
    a=sys.argv[1:];o={'seam':'xfade','calm':'auto','event':'auto'};pos=[];co=False
    while a:
        x=a.pop(0);k,eq,v=x[2:].partition('=')
        if x=='--calm-only':co=True;continue
        if x.startswith('--') and k in o:o[k]=v if eq else a.pop(0)   # --seam dip и --seam=dip; --seam=black=1.5
        else:pos.append(x)
    if len(pos) not in (2,3):sys.exit('loop_bg.py <выход.mp4> <ролик А> [ролик Б] [--seam xfade|dip|cut|black[=сек]] [--calm auto|N] [--event auto|off|<сек>]')
    main(pos[0],pos[1:],seam=o['seam'],calm=o['calm'],event=o['event'],calm_only=co)
