/* =====================================================================================
   kino-pvp — сервер дуэлей по сценам для @languagegamesbot («Языки по кино» 11.0)
   Отдельный Cloudflare Worker, бота не трогает. Комнаты хранятся в D1 (таблица pvp_rooms создаётся сама).

   КАК ПОСТАВИТЬ (один раз, ~3 минуты):
   1. dash.cloudflare.com → Workers & Pages → Create → Create Worker → имя: kino-pvp → Deploy.
   2. Edit code → удалить всё → вставить ЭТОТ файл целиком → Deploy.
   3. Worker kino-pvp → Settings → Bindings → Add → D1 database → Variable name: DB → база — та же, что у бота → Save.
   4. (по желанию) Settings → Variables and Secrets → Add → Secret, имя BOT_TOKEN, значение — токен бота.
      Тогда сервер проверяет, что запросы приходят из Telegram. Без него тоже работает.
   Адрес получится https://kino-pvp.<твой-поддомен>.workers.dev — приложение ждёт https://kino-pvp.1f8t8graf4.workers.dev
   (если адрес другой — поменять PVP_API в js/app.js или window.PVP_API в index.html).

   API: POST / {a, code, uid, name, ...} → {ok, v: комната} | {ok:false, msg}
     a=create {room:{sid,ep,mode,bet,qs}}  → новая комната, ты — A
     a=join   {code}                       → второй игрок (B), игра стартует через 3 с
     a=state  {code}                       → состояние
     a=ans    {code,k,ok,ms}               → ответ на вопрос k (гонка — свой; вместе — общий, первый ответ засчитывается)
     a=help   {code,k}                     → «помоги»: вопрос k открывается у друга (режим «вместе»)
     a=leave  {code}                       → вышел
     a=rget                                → {t}: когда админ велел сбросить прогресс этому игроку (11.2)
     a=rset   {target:'tg<ID>'}            → сбросить игроку прогресс (только админ, нужен BOT_TOKEN)
   ===================================================================================== */
const CORS={'access-control-allow-origin':'*','access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type, x-init-data','access-control-max-age':'86400'};
const J=(o,st)=>new Response(JSON.stringify(o),{status:st||200,headers:{...CORS,'content-type':'application/json; charset=utf-8'}});
let READY=false;
async function ensure(db){if(READY)return;await db.prepare('CREATE TABLE IF NOT EXISTS pvp_rooms (code TEXT PRIMARY KEY, data TEXT NOT NULL, ver INTEGER NOT NULL, upd INTEGER NOT NULL)').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS kino_reset (uid TEXT PRIMARY KEY, t INTEGER NOT NULL)').run();READY=true;}
const ABC='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode=()=>{let s='';const b=crypto.getRandomValues(new Uint8Array(5));for(const x of b)s+=ABC[x%ABC.length];return s;};
// проверка Telegram initData (если задан BOT_TOKEN)
async function hmac(key,msg){const k=await crypto.subtle.importKey('raw',typeof key==='string'?new TextEncoder().encode(key):key,{name:'HMAC',hash:'SHA-256'},false,['sign']);return new Uint8Array(await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(msg)));}
async function tgUser(initData,token){try{const p=new URLSearchParams(initData),hash=p.get('hash');if(!hash)return null;p.delete('hash');
  const dcs=[...p.entries()].sort(([a],[b])=>a<b?-1:1).map(([k,v])=>k+'='+v).join('\n');
  const secret=await hmac('WebAppData',token),sig=[...await hmac(secret,dcs)].map(x=>x.toString(16).padStart(2,'0')).join('');
  if(sig!==hash)return null;const u=JSON.parse(p.get('user')||'{}');return u&&u.id?{uid:'tg'+u.id,name:(u.first_name||u.username||'Игрок').slice(0,20)}:null;}catch(e){return null;}}
async function load(db,code){const r=await db.prepare('SELECT data,ver FROM pvp_rooms WHERE code=?').bind(code).first();return r?{room:JSON.parse(r.data),ver:r.ver}:null;}
// изменить комнату без потери чужих ответов: перечитываем и пробуем снова, если кто-то успел раньше
async function mutate(db,code,fn){for(let i=0;i<8;i++){const cur=await load(db,code);if(!cur)return {err:'Комната не найдена — возможно, она устарела'};
    const res=fn(cur.room);if(res&&res.err)return res;cur.room.ver=cur.ver+1;cur.room.upd=Date.now();
    const r=await db.prepare('UPDATE pvp_rooms SET data=?, ver=?, upd=? WHERE code=? AND ver=?').bind(JSON.stringify(cur.room),cur.ver+1,Date.now(),code,cur.ver).run();
    const ch=r&&r.meta?r.meta.changes:(r&&r.changes);if(ch)return {room:cur.room};}
  return {err:'Сервер занят, попробуй ещё раз'};}
const roleOf=(room,uid)=>room.A&&room.A.id===uid?'A':room.B&&room.B.id===uid?'B':null;
export default{async fetch(req,env){
  if(req.method==='OPTIONS')return new Response(null,{headers:CORS});
  if(req.method!=='POST')return J({ok:true,msg:'kino-pvp работает'});
  if(!env.DB)return J({ok:false,msg:'У воркера нет базы: Settings → Bindings → D1 → DB'});
  let b;try{b=await req.json();}catch(e){return J({ok:false,msg:'bad json'},400);}
  const db=env.DB;await ensure(db);
  let uid=String(b.uid||'').slice(0,40),name=String(b.name||'Игрок').slice(0,20);
  if(env.BOT_TOKEN){const u=await tgUser(req.headers.get('x-init-data')||'',env.BOT_TOKEN);if(!u)return J({ok:false,msg:'Открой дуэль внутри Telegram'});uid=u.uid;name=u.name;}
  if(!uid)return J({ok:false,msg:'нет игрока'});
  const code=String(b.code||'').toUpperCase().slice(0,8),now=Date.now();
  if(b.a==='rget'){const r=await db.prepare('SELECT t FROM kino_reset WHERE uid=?').bind(uid).first();return J({ok:true,v:{t:r?r.t:0}});}
  if(b.a==='rset'){if(!env.BOT_TOKEN)return J({ok:false,msg:'Добавь воркеру секрет BOT_TOKEN — без него сброс по ID не включается'});
    if(uid!=='tg'+(env.ADMIN_ID||'876754050'))return J({ok:false,msg:'Только для админа'});
    const t=String(b.target||'');if(!/^tg\d{3,15}$/.test(t))return J({ok:false,msg:'Неверный ID'});
    await db.prepare('INSERT INTO kino_reset (uid,t) VALUES (?,?) ON CONFLICT(uid) DO UPDATE SET t=excluded.t').bind(t,now).run();return J({ok:true,v:{t:now}});}
  if(b.a==='create'){const R=b.room||{};if(!R.sid||!Array.isArray(R.qs)||!R.qs.length||R.qs.length>12)return J({ok:false,msg:'bad room'});
    await db.prepare('DELETE FROM pvp_rooms WHERE upd<?').bind(now-36*3600e3).run();
    const room={sid:String(R.sid).slice(0,60),ep:R.ep|0,mode:R.mode==='coop'?'coop':'race',bet:Math.max(0,Math.min(1000,R.bet|0)),qs:R.qs,
      A:{id:uid,n:name,ans:{},done:false},B:null,st:'wait',go:0,turn:0,co:{},help:-1,created:now};
    for(let i=0;i<5;i++){const c=newCode();room.code=c;room.ver=1;room.upd=now;
      try{await db.prepare('INSERT INTO pvp_rooms (code,data,ver,upd) VALUES (?,?,1,?)').bind(c,JSON.stringify(room),now).run();return J({ok:true,v:room});}catch(e){}}
    return J({ok:false,msg:'Не получилось создать комнату'});}
  if(!/^[A-Z0-9]{5}$/.test(code))return J({ok:false,msg:'Неверный код комнаты'});
  if(b.a==='state'){const cur=await load(db,code);return cur?J({ok:true,v:cur.room}):J({ok:false,msg:'Комната не найдена — возможно, она устарела'});}
  let out;
  if(b.a==='join')out=await mutate(db,code,room=>{const me=roleOf(room,uid);if(me)return;if(room.B)return {err:'В комнате уже двое'};
    room.B={id:uid,n:name,ans:{},done:false};room.st='go';room.go=Date.now()+3500;});
  else if(b.a==='ans')out=await mutate(db,code,room=>{const me=roleOf(room,uid);if(!me)return {err:'Ты не в этой комнате'};const k=b.k|0;if(k<0||k>=room.qs.length)return {err:'bad k'};
    const a={ok:!!b.ok,ms:Math.max(0,Math.min(600000,b.ms|0)),by:me};
    if(room.mode==='race'){if(room[me].ans[k])return;room[me].ans[k]=a;if(Object.keys(room[me].ans).length>=room.qs.length)room[me].done=true;}
    else{if(room.co[k]||k!==room.turn)return;const mine=(k%2===0?'A':'B')===me;if(!mine&&room.help!==k)return {err:'Сейчас ход друга'};
      room.co[k]=a;room.turn=k+1;room.help=-1;if(room.turn>=room.qs.length){room.A.done=true;if(room.B)room.B.done=true;}}
    if(room.A.done&&room.B&&room.B.done)room.st='end';});
  else if(b.a==='help')out=await mutate(db,code,room=>{const me=roleOf(room,uid);if(!me)return {err:'Ты не в этой комнате'};if(room.mode==='coop'&&(b.k|0)===room.turn)room.help=b.k|0;});
  else if(b.a==='leave')out=await mutate(db,code,room=>{const me=roleOf(room,uid);if(!me)return;room[me].left=true;if(room.st!=='end')room.st=room.B?'left':'closed';});
  else return J({ok:false,msg:'unknown action'});
  return out.err?J({ok:false,msg:out.err}):J({ok:true,v:out.room});}};
