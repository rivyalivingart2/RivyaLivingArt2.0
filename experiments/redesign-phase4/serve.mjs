import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const pages=new Set(['/portfolio-detail','/testimonial-detail','/faq-detail','/portfolio-archive','/testimonial-archive','/landing','/receipt','/receipt-recovery','/loading','/error']);
createServer(async(req,res)=>{try{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
 const url=new URL(req.url,'http://127.0.0.1:4181');
 if(url.pathname==='/'||url.pathname==='/review'){const data=await readFile('experiments/redesign-phase4/review.html');res.writeHead(200,{'Content-Type':'text/html','X-Robots-Tag':'noindex, nofollow'}).end(req.method==='HEAD'?undefined:data);return;}
 if(/^\/review-images\/(?:1440|768|390|320)-[a-zA-Z0-9-]+\.png$/.test(url.pathname)){const data=await readFile('output/playwright/redesign-phase4/'+url.pathname.split('/').at(-1));res.writeHead(200,{'Content-Type':'image/png'}).end(req.method==='HEAD'?undefined:data);return;}
 if(pages.has(url.pathname)||url.pathname==='/fixtures.css'){const css=url.pathname==='/fixtures.css';const data=await readFile('output/redesign-phase4/'+(css?'fixtures.css':url.pathname.slice(1)+'.html'));res.writeHead(200,{'Content-Type':css?'text/css':'text/html','X-Robots-Tag':'noindex, nofollow'}).end(req.method==='HEAD'?undefined:data);return;}
 if(!/^\/(?:_next\/|media\/|brand\/)/.test(url.pathname)){res.writeHead(404).end();return;}
 const upstream=await fetch('http://127.0.0.1:4199'+url.pathname+url.search,{method:req.method});res.writeHead(upstream.status,{'Content-Type':upstream.headers.get('content-type')||'application/octet-stream'}).end(req.method==='HEAD'?undefined:Buffer.from(await upstream.arrayBuffer()));
}catch{res.writeHead(500).end('Local fixture unavailable');}}).listen(4181,'127.0.0.1',()=>console.log('Static fixture preview: http://127.0.0.1:4181/landing'));
