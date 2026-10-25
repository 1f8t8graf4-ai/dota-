# для спокойных окон: доля кадра под лицами (Haar, анфас+профиль); пишет calm2.json
import json, os, subprocess, numpy as np, cv2
from concurrent.futures import ProcessPoolExecutor
D = os.environ.get('BGF', os.getcwd())  # рабочая папка: vid/<сцена>__NN.mp4, сюда же пишутся json, out/, loops/
C = json.load(open(D + '/calm.json'))
F1 = F2 = None
def init():
    global F1, F2
    cv2.setNumThreads(1)
    F1 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    F2 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
def frame(src, t, a, b):
    cr = f"crop=iw:trunc(ih*{(b-a)/54:.4f}/2)*2:0:trunc(ih*{a/54:.4f}/2)*2,scale=480:-2"
    r = subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',src,'-frames:v','1','-vf',cr,'-f','image2pipe','-vcodec','png','-'], capture_output=True)
    return cv2.imdecode(np.frombuffer(r.stdout, np.uint8), cv2.IMREAD_GRAYSCALE)
def job(arg):
    name, w = arg
    g = frame(f"{D}/vid/{name}.mp4", w['t'] + 2, *w['bar'])
    if g is None: return name, w, 1.0
    A = g.shape[0] * g.shape[1]; m = 0
    for cc in (F1, F2):
        for img in (g, cv2.flip(g, 1)):
            for (x, y, ww, hh) in cc.detectMultiScale(img, 1.1, 5, minSize=(20, 20)):
                m = max(m, ww * hh / A)
    return name, w, round(float(m), 4)
jobs = []
for name, v in C.items():
    ws = sorted(v['win'], key=lambda w: w['mot']); took = []
    for w in ws:
        if all(abs(w['t'] - x['t']) > 3 for x in took): took.append(w)
        if len(took) == 14: break
    jobs += [(name, w) for w in took]
out = {}
if __name__ == '__main__':
  with ProcessPoolExecutor(8, initializer=init) as ex:
    for name, w, f in ex.map(job, jobs, chunksize=4):
        w = dict(w, face=f); out.setdefault(name, []).append(w)
  json.dump(out, open(D + '/calm2.json', 'w'))
  fs = [w['face'] for L in out.values() for w in L]
  print(len(fs), 'без лиц:', sum(1 for f in fs if f == 0), 'мелкие <1.5%:', sum(1 for f in fs if 0 < f < .015))
