import json,sys
d=json.load(open('out/fx130.json',encoding='utf-8'))
keep=['id','v','vn','k','n','w','s','d','why','ours','want','tc','fps','ca','cb','file','dur','frames']
data=json.dumps([{k:(bool(r[k]) if k=='want' else r[k]) for k in keep} for r in d],ensure_ascii=False,separators=(',',':'))
data=data.replace('</','<\\/')
t=open('pult.tpl.html',encoding='utf-8').read()
assert t.count('/*DATA*/[]')==1
open('out/pult_130_bob_fx.html','w',encoding='utf-8').write(t.replace('/*DATA*/[]',data))
print('ok',len(data))
