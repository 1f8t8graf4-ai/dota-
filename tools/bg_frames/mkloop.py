# настоящая петля из эпизода: самый длинный кусок без склеек вокруг t (до 9 с) → loop_bg.py (наплыв хвоста на голову)
import json, os, subprocess, sys
D = os.environ.get('BGF', os.getcwd())  # рабочая папка: vid/<сцена>__NN.mp4, сюда же пишутся json, out/, loops/; C = json.load(open(D + '/calm.json'))
LB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'loop_bg.py')
def run(name, t, out):
    ts = sorted(w['t'] for w in C[name]['win'])
    a = b = t
    while round(a - .4, 1) in ts and t - a < 4: a = round(a - .4, 1)
    while round(b + .4, 1) in ts and b - t < 5: b = round(b + .4, 1)
    s, e = a, min(b + 4.0, a + 9.0)
    w = C[name]['win'][0]['bar']
    seg = f"{D}/loops/{out}_src.mp4"
    cr = f"crop=iw:trunc(ih*{(w[1]-w[0])/54:.4f}/2)*2:0:trunc(ih*{w[0]/54:.4f}/2)*2"
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(s),'-i',f"{D}/vid/{name}.mp4",'-t',str(e-s),'-an','-vf',cr,'-c:v','libx264','-crf','16',seg], check=True)
    subprocess.run([sys.executable, LB, f"{D}/loops/{out}.mp4", seg], check=True, capture_output=True)
    # маленькое превью для страницы
    subprocess.run(['ffmpeg','-v','error','-y','-i',f"{D}/loops/{out}.mp4",'-vf','scale=480:-2','-c:v','libx264','-crf','30','-preset','slow','-movflags','+faststart',f"{D}/loops/{out}_s.mp4"], check=True)
    print(out, name, round(s,1), round(e,1), os.path.getsize(f"{D}/loops/{out}_s.mp4")//1024, 'КБ')
for name, t, out in [('taxi-driver-lonely__01', 26.8, 'taxi'), ('breaking-bad-gus__01', 42.8, 'pollos'), ('sopranos-mahaffey-de__03', 36.4, 'willow'),
                     ('american-psycho__03', 36.0, 'psycho'), ('sopranos-ralph__02', 44.0, 'badabing'), ('wolf-swiss-bank__01', 0.0, 'geneva'),
                     ('wolf-of-wall-street__01', 0.0, 'wolf')]:
    try: run(name, t, out)
    except Exception as e: print('ERR', out, e)
