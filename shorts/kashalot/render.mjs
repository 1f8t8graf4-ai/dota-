// Рендер «Кашалота»: node render.mjs sf <папка> сцена:время,…  (стиль-кадры)
//                          node render.mjs video <папка> [R|RC] [длительность] [fps]
// Сайт поднимается сам (корень — shorts/), картинки карусели — _media/p1.webp, p2.webp (в git нет).
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PW||'/opt/node-tools/node_modules/playwright');
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'..');
const MIME={'.html':'text/html','.js':'text/javascript','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
await new Promise(r=>srv.listen(0,'127.0.0.1',r));
const port=srv.address().port,[mode,out,a3,a4,a5]=process.argv.slice(2);
fs.mkdirSync(out,{recursive:true});
const br=await chromium.launch({args:['--disable-web-security']});
const pg=await br.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
pg.on('console',m=>{if(m.type()==='error')console.log('console:',m.text());});pg.on('pageerror',e=>console.log('pageerror:',e.message));
await pg.goto(`http://127.0.0.1:${port}/kashalot/index.html`);
await pg.waitForFunction(()=>window.READY===true,null,{timeout:30000});
async function grab(fn,t,file){const d=await pg.evaluate(([fn,t])=>{window[fn](t);return document.getElementById('c').toDataURL('image/png');},[fn,t]);fs.writeFileSync(file,Buffer.from(d.split(',')[1],'base64'));}
const t0=Date.now();
if(mode==='sf'){const lang=a4||'en';for(const s of a3.split(',')){const [nm,u]=s.split(':');const d=await pg.evaluate(([nm,u,lang])=>{window.SF(nm,+u,lang);return document.getElementById('c').toDataURL('image/png');},[nm,u,lang]);fs.writeFileSync(path.join(out,`${nm}_${(+u).toFixed(2)}_${lang}.png`),Buffer.from(d.split(',')[1],'base64'));}}
else if(mode==='shots'){const fn=a4||'R';for(const s of a3.split(',')){const t=+s;await grab(fn,t,path.join(out,`${fn}_${t.toFixed(3)}.png`));}}
else{const fn=a3||'R',dur=+(a4||(fn==='RC'?await pg.evaluate(()=>window.T_SW2+3):3)),fps=+(a5||30),n=Math.round(dur*fps);
  for(let i=0;i<n;i++){await grab(fn,i/fps,path.join(out,`f${String(i).padStart(4,'0')}.png`));if(i%15===0)process.stdout.write(`${i}/${n} `);}
  console.log(`\nкадров: ${n}`);}
console.log(`готово за ${((Date.now()-t0)/1000).toFixed(1)} с`);
await br.close();srv.close();
