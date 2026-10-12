# Проверка данных сцен: поля, тайминги, субтитры, пропуски, важные слова, ловушки, примеры, темы, словарик, wt.json.
# Запуск из корня dota-:  python3 tools/check_data.py [id сцены …] [--all]   (по умолчанию — короткий отчёт; --all — все предупреждения)
# Ошибки (ERR) — надо чинить; предупреждения (WARN) — посмотреть глазами. Код выхода 1, если есть ошибки.
import json,re,sys,os,collections
ARGS=[a for a in sys.argv[1:] if not a.startswith('--')];ALL='--all' in sys.argv
S=json.load(open('data/scenes.json',encoding='utf-8'))['SCENES']
TOP=json.load(open('data/topics.json',encoding='utf-8'))['TOPICS']
G=json.load(open('data/glossary.json',encoding='utf-8'))
SW=json.load(open('data/scenewords.json',encoding='utf-8'))['SCENEWORDS']
TOPICS=['знакомство','свидание','общение','работа','деньги','учёба','кафе и магазин','телефон и планы','эмоции','ссоры','здоровье','быт']
SCN=os.path.join('..','scenes')
ERR=[];WARN=[]
def err(i,m):ERR.append(f'{i}: {m}')
def warn(i,m):WARN.append(f'{i}: {m}')
CYR=re.compile('[А-Яа-яЁё]');LAT=re.compile('[A-Za-z]')
def low(t):return re.sub(r'\s+',' ',re.sub(r"[^\w'ßäöüÄÖÜéèàçñ ]+",' ',str(t).lower().replace('’',"'").replace('`',"'"))).strip()
def words(t):return [w for w in low(t).split(' ') if w]
def hasword(text,w):
    t=' '+low(text)+' ';w=low(w)
    return bool(w) and (' '+w+' ') in t
def textcheck(i,k,v,lang):
    if not isinstance(v,str):return
    if v!=v.strip():warn(i,f'{k}: пробел в начале/конце {v!r}')
    if '  ' in v.replace('\n',' \n'):warn(i,f'{k}: двойной пробел {v!r}')
    if re.search(r' [,.!?;:](?!\.)',v) and lang!='de':warn(i,f'{k}: пробел перед знаком {v!r}')
    if lang=='ru':
        if '"' in v:warn(i,f'{k}: прямые кавычки вместо «» {v!r}')
        if re.search(r'\s-\s',v):warn(i,f'{k}: дефис вместо тире {v!r}')
    if lang in('en','de') and CYR.search(v):err(i,f'{k}: кириллица в {lang} {v!r}')
for s in S:
    sid=s['id']
    if ARGS and sid not in ARGS:continue
    de=s.get('lang')=='de';OL='de' if de else 'en'
    for k in('id','title','show','kind','theme','lvl','use','parts','subs','mode','sub','ep'):
        if s.get(k) in(None,'',[]):err(sid,f'нет поля {k}')
    if s.get('kind') not in('film','series','interview','clip'):err(sid,f"kind={s.get('kind')}")
    if s.get('mode')!='mix':warn(sid,f"mode={s.get('mode')}")
    for m in s.get('music') or []:
        if not m.get('f') or not m.get('t'):err(sid,f'music без f/t {m}')
        elif not os.path.exists(os.path.join(SCN,sid,m['f'])):err(sid,f"нет файла музыки {m['f']}")
    end=max(p['b'] for p in s['parts'])
    prev=None
    for i,p in enumerate(s['parts'],1):
        pid=f'{sid}#{i}'
        if not p.get('t'):err(pid,'нет названия')
        if not p['a']<p['b']:err(pid,f"a>=b {p['a']} {p['b']}")
        if prev and p['a']<prev['b']-0.6:warn(pid,f"эпизод начинается раньше конца прошлого ({p['a']}<{prev['b']})")
        prev=p
        if not p.get('fact'):warn(pid,'нет факта эпизода')
        if not p.get('prize'):warn(pid,'нет prize')
        for f_ in('mp4','jpg'):
            fn=os.path.join(SCN,sid,f'{i:02d}.{f_}')
            if os.path.isdir(SCN) and not os.path.exists(fn):err(pid,f'нет файла {i:02d}.{f_}')
        fn=os.path.join(SCN,sid,f'{i:02d}-k.jpg')
        if os.path.isdir(SCN) and not os.path.exists(fn):warn(pid,f'нет кадра {i:02d}-k.jpg')
        act=0
        for n,f in enumerate(p['ph'],1):
            fid=f'{sid}#{i}.{n}';pas=bool(f.get('passive'));act+=not pas
            orig=f.get(OL) or ''
            for k in('en','ru','de'):
                if not f.get(k):err(fid,f'пусто {k}')
            if not(f['a']<f['b']):err(fid,f"a>=b {f['a']} {f['b']}")
            if f['a']<p['a']-1.5 or f['b']>p['b']+1.5:warn(fid,f"вне эпизода {f['a']}–{f['b']} (эп. {p['a']}–{p['b']})")
            textcheck(fid,'en',f.get('en'),'en');textcheck(fid,'de',f.get('de'),'de');textcheck(fid,'ru',f.get('ru'),'ru')
            for k in('use','more'):textcheck(fid,k,f.get(k),'ru')
            if not pas:
                if not f.get('use'):err(fid,'нет use')
                elif not f['use'].startswith('Когда'):warn(fid,f"use не с «Когда»: {f['use'][:70]!r}")
                g=f.get('gap')
                if not g:warn(fid,'нет gap')
                elif not hasword(orig,g):err(fid,f'gap «{g}» нет во фразе {orig!r}')
                if f.get('gx'):
                    for x in f['gx']:
                        if g and low(x)==low(g):err(fid,f'gx совпадает с gap {x!r}')
                tr=f.get('trap') or []
                if len(tr)<2:warn(fid,f'ловушек {len(tr)}')
                if len(set(map(low,tr)))<len(tr):err(fid,'ловушки повторяются')
                for x in tr:
                    if low(x)==low(f['ru']):err(fid,f'ловушка = перевод {x!r}')
                    textcheck(fid,'trap',x,'ru')
                tps=TOP.get(f"{sid}|{f['en']}")
                if not tps:warn(fid,'нет тем (topics)')
                else:
                    for t in tps:
                        if t not in TOPICS:err(fid,f'неизвестная тема {t!r}')
            lx=f.get('lx')
            if lx is not None:
                if not(isinstance(lx,list) and len(lx)==2 and all(lx)):err(fid,f'lx не [ориг, ru] {lx!r}')
                else:textcheck(fid,'lx.0',lx[0],OL);textcheck(fid,'lx.1',lx[1],'ru')
            for e in f.get('ex') or []:
                if not(isinstance(e,list) and len(e)==3 and all(e)):err(fid,f'ex не [en,ru,de] {e!r}')
                else:textcheck(fid,'ex.en',e[0],'en');textcheck(fid,'ex.ru',e[1],'ru');textcheck(fid,'ex.de',e[2],'de')
            for e in f.get('exDe') or []:
                if not(isinstance(e,list) and len(e)==2 and all(e)):err(fid,f'exDe не [de,ru] {e!r}')
                else:textcheck(fid,'exDe.de',e[0],'de');textcheck(fid,'exDe.ru',e[1],'ru')
            for j,k in enumerate(f.get('kw') or []):
                if not(isinstance(k,list) and len(k)==6):err(fid,f'kw.{j} не 6 полей {k!r}');continue
                if not all(k[:3]):err(fid,f'kw.{j} пустые поля {k!r}')
                if k[0] and low(k[0]) not in low(orig):warn(fid,f'kw.{j} «{k[0]}» нет во фразе {orig!r}')
                textcheck(fid,f'kw.{j}.3',k[3],OL);textcheck(fid,f'kw.{j}.4',k[4],'ru')
            # фраза ↔ субтитры: текст фразы должен быть в строках, которые идут в это время
            ov=[x for x in s['subs'] if x[1]>f['a']-0.3 and x[0]<f['b']+0.3]
            col=4 if de else 2
            joined=' '.join(low(x[col]) for x in ov)
            if not ov:warn(fid,f"нет строк субтитров в {f['a']}–{f['b']}")
            elif low(orig) not in joined:
                ws=words(orig);hit=sum(1 for w in ws if w in joined.split());
                (warn if pas or hit/ max(1,len(ws))>=.6 else err)(fid,f'текст фразы не совпадает со строками субтитров: {orig!r} vs {[x[col] for x in ov]!r}')
        if act==0:warn(pid,'нет активных фраз')
    # субтитры
    last=-1
    for k,x in enumerate(s['subs']):
        xid=f'{sid}@{k}'
        if len(x)!=5:err(xid,f'не 5 полей {x!r}');continue
        a,b,en,ru,dd=x
        if not a<b:err(xid,f'a>=b {a} {b}')
        if a<last-0.05:err(xid,f'не по порядку ({a} < {last})')
        last=a
        if k and a<s['subs'][k-1][1]-0.35:warn(xid,f'наезжает на прошлую строку на {s["subs"][k-1][1]-a:.2f} с')
        if b>end+2:warn(xid,f'после конца сцены ({b}>{end})')
        for v,l,nm in((en,'en','en'),(ru,'ru','ru'),(dd,'de','de')):
            if not v:err(xid,f'пусто {nm}')
            textcheck(xid,nm,v,l)
        if k and en==s['subs'][k-1][2] and ru==s['subs'][k-1][3]:warn(xid,'повтор строки')
    # wt.json
    if os.path.isdir(SCN) and not os.path.exists(os.path.join(SCN,sid,'wt.json')):warn(sid,'нет wt.json')
    for fn in('cover.jpg','poster.jpg'):
        if os.path.isdir(SCN) and not os.path.exists(os.path.join(SCN,sid,fn)):err(sid,f'нет {fn}')
    if s.get('bgv') and os.path.isdir(SCN):
        for fn in('bg.mp4','bgp.jpg'):
            if not os.path.exists(os.path.join(SCN,sid,fn)):err(sid,f'bgv:1, а нет {fn}')
    if s.get('filmbg') and os.path.isdir(SCN):
        for fn in('film-bg.mp4','film-bgp.jpg'):
            if not os.path.exists(os.path.join(SCN,sid,fn)):err(sid,f'filmbg:1, а нет {fn}')
# темы: ключи без фразы
keys={f"{s['id']}|{f['en']}" for s in S for p in s['parts'] for f in p['ph']}
orph=[k for k in TOP if k not in keys]
for k in orph:warn('topics',f'ключ без фразы: {k!r}')
# словарик: слова оригинала в субтитрах без перевода (как ищет приложение: swFind)
def norm(w):
    w=w.lower().replace('’',"'").replace('`',"'")
    w=re.sub(r"^[^a-zß-öø-ÿ']+|[^a-zß-öø-ÿ'.]+$",'',w);return re.sub(r'\.$','',w)
miss=collections.Counter();missd=collections.Counter();tot=0
for s in S:
    if ARGS and s['id'] not in ARGS:continue
    de=s.get('lang')=='de';GG=G['GLOSS_DE' if de else 'GLOSS_EN']
    for x in s['subs']:
        for w in re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ'’]+",x[4] if de else x[2]):
            n=norm(w);tot+=1
            if not n:continue
            b=re.sub(r"'s$",'',n)
            if not(GG.get(n) or GG.get(b) or GG.get(n.replace("'",'')) or GG.get(re.sub('s$','',n))):(missd if de else miss)[n]+=1
# ключевые слова эпизодов
nosw=[s['id'] for s in S if s['id'] not in SW]
print(f'Сцен: {len(S)} · фраз: {sum(len(p["ph"]) for s in S for p in s["parts"])} · строк субтитров: {sum(len(s["subs"]) for s in S)}')
print(f'ОШИБОК: {len(ERR)} · предупреждений: {len(WARN)}')
for e in ERR:print('ERR ',e)
cnt=collections.Counter(re.sub(r'[«"].*','',w.split(': ',1)[1])[:40] for w in WARN)
print('\nПредупреждения по видам:')
for k,v in cnt.most_common():print(f'  {v:4} × {k}')
if ALL:
    for w in WARN:print('WARN',w)
print(f'\nСловарик: слов в субтитрах {tot}; без перевода — EN {sum(miss.values())} ({len(miss)} разных), DE {sum(missd.values())} ({len(missd)} разных)')
if miss:print('  EN без перевода (частые):',', '.join(f'{w}×{c}' for w,c in miss.most_common(40)))
if missd:print('  DE без перевода (частые):',', '.join(f'{w}×{c}' for w,c in missd.most_common(40)))
print(f'Слова эпизодов (scenewords) есть у {len(S)-len(nosw)} из {len(S)} сцен')
sys.exit(1 if ERR else 0)
