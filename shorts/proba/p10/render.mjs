// Пробники по 10 с: node render.mjs <клип> <стиль|-> <выход.mp4>          — ролик 300 кадров (NW потоков, по умолчанию 4)
//                   node render.mjs <клип> <стиль|-> <папка> shots 0.5,4.2,… — отдельные кадры
// Корни сайта: / — эта папка, /s/ — shorts/, /f/ — tools/tt_demo_fonts/, /a/ — скачанные стоки (P10A=<папка>).
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PW||'/opt/node-tools/node_modules/playwright');
const here=path.dirname(fileURLToPath(import.meta.url)),shorts=path.resolve(here,'../..'),fonts=path.resolve(shorts,'../tools/tt_demo_fonts');
const MAP=[['/f/',fonts],['/s/',shorts],['/a/',process.env.P10A||''],['/',here]];
const MIME={'.html':'text/html','.js':'text/javascript','.woff2':'font/woff2','.ttf':'font/ttf','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.json':'application/json'};
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);
  for(const [p,d] of MAP){if(!d||!u.startsWith(p))continue;const f=path.join(d,u.slice(p.length));
    if(!f.startsWith(d)||!fs.existsSync(f)||fs.statSync(f).isDirectory())break;
    r.writeHead(200,{'content-type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream'});fs.createReadStream(f).pipe(r);return;}
  r.writeHead(404);r.end();});
await new Promise(r=>srv.listen(0,'127.0.0.1',r));
const port=srv.address().port,[clip,style,out,mode,list]=process.argv.slice(2);
const N=+(process.env.N||300),NW=+(process.env.NW||4);
const br=await chromium.launch({args:['--disable-web-security']});
async function page(){const pg=await br.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  pg.on('console',m=>{if(m.type()==='error'||m.type()==='warning')console.log('console:',m.text());});pg.on('pageerror',e=>console.log('pageerror:',e.message));
  await pg.goto(`http://127.0.0.1:${port}/stage.html?clip=${clip}&style=${style}`);
  await pg.waitForFunction(()=>window.READY!==undefined,null,{timeout:180000});if(await pg.evaluate(()=>window.READY)!==true)throw new Error('клип не загрузился');return pg;}
async function grab(pg,i,file){const d=await pg.evaluate(i=>{window.F(i);return document.getElementById('c').toDataURL('image/jpeg',0.95);},i);
  fs.writeFileSync(file,Buffer.from(d.split(',')[1],'base64'));}
const t0=Date.now();
if(mode==='shots'){fs.mkdirSync(out,{recursive:true});const pg=await page();
  for(const s of list.split(',')){const t=+s;await grab(pg,Math.round(t*30),path.join(out,`${clip}-${style}-${t.toFixed(2)}.jpg`));}}
else{const fd=out.replace(/\.mp4$/,'')+'_f';fs.rmSync(fd,{recursive:true,force:true});fs.mkdirSync(fd,{recursive:true});
  const pages=await Promise.all(Array.from({length:NW},page));let done=0;
  await Promise.all(pages.map(async(pg,w)=>{for(let i=w;i<N;i+=NW){await grab(pg,i,path.join(fd,`f${String(i).padStart(4,'0')}.jpg`));if(++done%50===0)process.stdout.write(done+' ');}}));
  const ff=spawnSync('ffmpeg',['-y','-v','error','-framerate','30','-i',path.join(fd,'f%04d.jpg'),'-frames:v',String(N),'-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:'inherit'});
  if(ff.status!==0)throw new Error('ffmpeg');fs.rmSync(fd,{recursive:true,force:true});
  spawnSync('ffmpeg',['-y','-v','error','-i',out,'-vf','fps=2,scale=216:384:flags=lanczos,tile=10x2','-frames:v','1',out.replace(/\.mp4$/,'_sheet.jpg')]);}
console.log(`\nготово за ${((Date.now()-t0)/1000).toFixed(1)} с`);
await br.close();srv.close();
