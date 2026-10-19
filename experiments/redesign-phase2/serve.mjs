import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {resolve,extname} from 'node:path';
const root=process.cwd(), assets={
 '/assets/logo.png':'public/brand/rivyalivingart-logo-horizontal-transparent.png',
 '/assets/room.webp':'public/media/product-scene-001-16x9.webp',
 '/assets/film-poster.jpg':'public/media/migration/hero-pour-loop-poster.jpg',
 '/assets/film.mp4':'public/media/migration/hero-pour-loop.mp4',
 '/assets/film.webm':'public/media/migration/hero-pour-loop.webm',
 '/assets/instrument.woff2':'src/styles/fonts/instrument-serif-normal-400.woff2',
 '/assets/inter-400.woff2':'src/styles/fonts/inter-common-400.woff2',
 '/assets/inter-500.woff2':'src/styles/fonts/inter-common-500.woff2',
 '/':'output/redesign-phase2/index.html','/studio':'output/redesign-phase2/studio.html',
 '/client.js':'output/redesign-phase2/client.js',
 '/styles.css':'experiments/redesign-phase2/styles.css',
 '/foundation.css':'experiments/redesign-phase2/foundation/foundation.css'
};
const media=JSON.parse(readFileSync('experiments/redesign-phase2/media-manifest.json','utf8'));
for(const a of media)for(const v of a.variants)assets[v.src]=`experiments/redesign-phase2/media/${v.src.split('/').at(-1)}`;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2'};
createServer((req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
 if(!Object.hasOwn(assets,path)){res.writeHead(404).end();return;}
 try{const bytes=readFileSync(resolve(root,assets[path]));const headers={'Content-Type':mime[extname(assets[path])]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):bytes.length-1,bytes.length-1);if(start>end){res.writeHead(416,{'Content-Range':`bytes */${bytes.length}`}).end();return;}res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${bytes.length}`});res.end(req.method==='HEAD'?undefined:bytes.subarray(start,end+1));}
 else{res.writeHead(200,{...headers,'Content-Length':bytes.length});res.end(req.method==='HEAD'?undefined:bytes);}
 }catch{res.writeHead(404).end();}
}).listen(4179,'127.0.0.1',()=>console.log('Phase 2 preview: http://127.0.0.1:4179/'));
