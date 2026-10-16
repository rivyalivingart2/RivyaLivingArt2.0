import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const pages=new Set(['/all','/classic','/editorial','/empty']);
createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  const url=new URL(req.url,'http://127.0.0.1:4185');
  if(url.pathname==='/review'){
   const data=await readFile('output/cinematic-sections/review.html');
   res.writeHead(200,{'Content-Type':'text/html','X-Robots-Tag':'noindex, nofollow'}).end(req.method==='HEAD'?undefined:data);return;
  }
  if(/^\/evidence\/[a-z0-9.-]+\.(?:jpg|png)$/.test(url.pathname)){
   const data=await readFile('test-results/cinematic-sections/'+url.pathname.split('/').at(-1));
   res.writeHead(200,{'Content-Type':url.pathname.endsWith('.png')?'image/png':'image/jpeg','X-Robots-Tag':'noindex, nofollow'}).end(req.method==='HEAD'?undefined:data);return;
  }
  if(pages.has(url.pathname)||url.pathname==='/fixtures.css'){
   const css=url.pathname==='/fixtures.css';
   const data=await readFile('output/cinematic-sections/'+(css?'fixtures.css':url.pathname.slice(1)+'.html'));
   res.writeHead(200,{'Content-Type':css?'text/css':'text/html','X-Robots-Tag':'noindex, nofollow'}).end(req.method==='HEAD'?undefined:data);return;
  }
  if(!/^\/(?:_next\/|media\/|brand\/)/.test(url.pathname)){res.writeHead(404).end();return;}
  const upstream=await fetch('http://127.0.0.1:4199'+url.pathname+url.search,{method:req.method});
  res.writeHead(upstream.status,{'Content-Type':upstream.headers.get('content-type')||'application/octet-stream'}).end(req.method==='HEAD'?undefined:Buffer.from(await upstream.arrayBuffer()));
 }catch{res.writeHead(500).end('Local fixture unavailable');}
}).listen(4185,'127.0.0.1',()=>console.log('Static fixture preview: http://127.0.0.1:4185/all'));
