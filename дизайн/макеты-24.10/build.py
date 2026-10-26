# Собирает макеты 24.10 в отдельные html: картинки и видео вшиваются base64.
# Готовый файл открывается двойным кликом или публикуется артефактом (Artifact → publish).
#   python3 build.py   →   glavnaya-dd.html (главная и ДД, 5+5 вариантов), tri-dizajna.html (три дизайна)
# Правишь только *.tpl.html и assets/ — собранные html в .gitignore.
import base64, glob, json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
I = {os.path.basename(p)[:-5]: 'data:image/webp;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
     for p in sorted(glob.glob(D + '/assets/img/*.webp'))}
V = {os.path.basename(p)[:-4]: base64.b64encode(open(p, 'rb').read()).decode()
     for p in sorted(glob.glob(D + '/assets/vid/*.mp4'))}
# голоса героев (v11): короткие mp3, играют по ▶ в макете
AU = {os.path.basename(p)[:-4]: base64.b64encode(open(p, 'rb').read()).decode()
      for p in sorted(glob.glob(D + '/assets/aud/*.mp3'))}
t = open(D + '/glavnaya-dd.tpl.html', encoding='utf8').read()
open(D + '/glavnaya-dd.html', 'w', encoding='utf8').write(t.replace('__ASSETS__', json.dumps({'I': I, 'V': V, 'A': AU})))
# python3 build.py --pub → pub/index.html + pub/a/{img,vid,aud}/… (ассеты файлами рядом; публиковать с files)
if '--pub' in sys.argv:
    import shutil
    P = D + '/pub'
    shutil.rmtree(P, ignore_errors=True)
    for sub, ext in (('img', 'webp'), ('vid', 'mp4'), ('aud', 'mp3')):
        os.makedirs(P + '/a/' + sub)
        for f in glob.glob(D + '/assets/%s/*.%s' % (sub, ext)): shutil.copy(f, P + '/a/' + sub)
    rel = lambda sub, ext, L: {k: 'a/%s/%s.%s' % (sub, k, ext) for k in L}
    A2 = {'I': rel('img', 'webp', I), 'V': rel('vid', 'mp4', V), 'A': rel('aud', 'mp3', AU)}
    h = t.replace('__ASSETS__', json.dumps(A2))
    # видео и звук — по пути, а не из base64
    h = h.replace("function vurl(k){if(VU[k])return VU[k];", "function vurl(k){if(VU[k])return VU[k];if(String(A.V[k]).startsWith('a/'))return VU[k]=A.V[k];", 1)
    h = h.replace("function aurl(k){k=AU11[k]||k;if(AUU[k])return AUU[k];const s=A.A&&A.A[k];if(!s)return null;", "function aurl(k){k=AU11[k]||k;if(AUU[k])return AUU[k];const s=A.A&&A.A[k];if(!s)return null;if(s.startsWith('a/'))return AUU[k]=s;", 1)
    assert h.count("startsWith('a/'))return") >= 2, 'не нашёл vurl/aurl'
    open(P + '/index.html', 'w', encoding='utf8').write(h)
    print('pub: index.html + a/', len(I), len(V), len(AU))
t = open(D + '/tri-dizajna.tpl.html', encoding='utf8').read()
open(D + '/tri-dizajna.html', 'w', encoding='utf8').write(t.replace('__IMG__', json.dumps(I)))
print('собрано: glavnaya-dd.html, tri-dizajna.html')
