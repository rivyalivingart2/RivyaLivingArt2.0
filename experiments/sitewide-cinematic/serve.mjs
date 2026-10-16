import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  const url=new URL(req.url,'http://127.0.0.1:4186');
  const evidence=/^\/evidence\/[a-zA-Z0-9.-]+\.(jpg|png)$/.test(url.pathname);
  const fixture=/^\/[a-zA-Z0-9-]+$/.test(url.pathname);
  const css=url.pathname==='/fixtures.css';
  if(!evidence&&!fixture&&!css){res.writeHead(404).end();return;}
  const name=url.pathname.split('/').at(-1);
  const file=evidence?'test-results/sitewide-cinematic/'+name:'output/sitewide-cinematic/'+(css?name:name+'.html');
  const data=await readFile(file);
  const type=evidence?(name.endsWith('.png')?'image/png':'image/jpeg'):css?'text/css':'text/html; charset=utf-8';
  res.writeHead(200,{'Content-Type':type,'X-Robots-Tag':'noindex, nofollow'}).end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404).end('Local review artifact unavailable');}
}).listen(4186,'127.0.0.1',()=>console.log('Website-wide review: http://127.0.0.1:4186/review'));
