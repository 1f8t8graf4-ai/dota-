// План ролика (кадры, переходы, время цитаты) из страницы: P10A=<голоса> node plan.mjs dlx8|dlx8g <ролик> > plan.json
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const {chromium}=require('/opt/node-tools/node_modules/playwright');
const here=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),shorts=path.resolve(here,'../..'),fonts=path.resolve(shorts,'../tools/tt_demo_fonts');
const MAP=[['/f/',fonts],['/s/',shorts],['/a/',process.env.P10A||''],['/',here]];
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);for(const [p,d] of MAP){if(!d||!u.startsWith(p))continue;const f=path.join(d,u.slice(p.length));
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory())break;r.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'application/octet-stream'});fs.createReadStream(f).pipe(r);return;}r.writeHead(404);r.end();});
await new Promise(r=>srv.listen(0,'127.0.0.1',r));const [clip,style]=process.argv.slice(2);
const br=await chromium.launch();const pg=await br.newPage();await pg.goto(`http://127.0.0.1:${srv.address().port}/stage.html?clip=${clip}&style=${style}`);
await pg.waitForFunction(()=>window.READY!==undefined,null,{timeout:120000});
const P=await pg.evaluate(()=>({...window.PLAN,words:VO.words}));process.stdout.write(JSON.stringify(P));await br.close();srv.close();
