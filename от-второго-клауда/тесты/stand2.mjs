import http from 'node:http';import {DatabaseSync} from 'node:sqlite';import W from './botw.mjs';   // botw.mjs = копия bot/worker.js (cp ../../bot/worker.js botw.mjs)
const db=new DatabaseSync(':memory:');
const D1={prepare(q){let args=[];const st={bind(...a){args=a;return st;},async run(){const r=db.prepare(q).run(...args);return {meta:{changes:r.changes}};},async first(){return db.prepare(q).get(...args)||null;},async all(){return {results:db.prepare(q).all(...args)};}};return st;}};
const env={DB:D1,BOT_TOKEN:'123:TEST',ADMIN_ID:'876754050'};
http.createServer(async(req,res)=>{let body='';req.on('data',c=>body+=c);req.on('end',async()=>{
  const r=await W.fetch(new Request('http://x'+req.url,{method:req.method,headers:req.headers,body:req.method==='POST'?body:undefined}),env);
  res.writeHead(r.status,Object.fromEntries(r.headers));res.end(await r.text());});}).listen(8788,()=>console.log('stand2 8788'));
