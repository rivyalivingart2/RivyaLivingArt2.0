import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const pages=new Set(['/all','/classic','/editorial','/empty']);
createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  const url=new URL(req.url,'http://127.0.0.1:4180');
  if(pages.has(url.pathname)||url.pathname==='/fixtures.css'){
   const css=url.pathname==='/fixtures.css';
   const data=await readFile('output/redesign-phase3/'+(css?'fixtures.css':url.pathname.slice(1)+'.html'));
   res.writeHead(200,{'Content-Type':css?'text/css':'text/html','X-Robots-Tag':'noindex, nofollow'}).end(req.method==='HEAD'?undefined:data);return;
  }
  if(!/^\/(?:_next\/|media\/|brand\/)/.test(url.pathname)){res.writeHead(404).end();return;}
  const upstream=await fetch('http://127.0.0.1:4199'+url.pathname+url.search,{method:req.method});
  res.writeHead(upstream.status,{'Content-Type':upstream.headers.get('content-type')||'application/octet-stream'}).end(req.method==='HEAD'?undefined:Buffer.from(await upstream.arrayBuffer()));
 }catch{res.writeHead(500).end('Local fixture unavailable');}
}).listen(4180,'127.0.0.1',()=>console.log('Static fixture preview: http://127.0.0.1:4180/all'));
