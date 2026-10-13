import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname,extname} from 'node:path';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../..');
const assets=JSON.parse(readFileSync(resolve(here,'asset-map.json'),'utf8'));
const local=new Set(['/','/index.html','/styles.css','/preview.js','/preview-data.json']);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.woff2':'font/woff2'};
createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname;let file;
if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
if(name.startsWith('/assets/')&&Object.hasOwn(assets,name.slice(8)))file=resolve(root,assets[name.slice(8)]);
else if(local.has(name))file=resolve(here,name==='/'?'index.html':name.slice(1));
else {res.writeHead(404);res.end();return;}
try{const bytes=readFileSync(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:bytes);}catch{res.writeHead(404);res.end();}
}).listen(4178,'127.0.0.1',()=>console.log('Phase 1 preview: http://127.0.0.1:4178/'));
