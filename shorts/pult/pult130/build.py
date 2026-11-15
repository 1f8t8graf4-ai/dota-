import json,sys
d=json.load(open('out/fx195.json',encoding='utf-8'))
keep=['id','v','vn','tags','n','w','tech','ours','s','d','hot','x','tc','fps','ca','cb','file','dur','frames']
data=json.dumps([{k:(bool(r[k]) if k=='hot' else r[k]) for k in keep} for r in d],ensure_ascii=False,separators=(',',':'))
data=data.replace('</','<\\/')
t=open('pult.tpl.html',encoding='utf-8').read()
assert t.count('/*DATA*/[]')==1
assert t.count('960px 702px')==1
t=t.replace('960px 702px',f'960px {54*((len(d)+9)//10)}px')
open('out/pult_195_bob_fx.html','w',encoding='utf-8').write(t.replace('/*DATA*/[]',data))
print('ok',len(data))
