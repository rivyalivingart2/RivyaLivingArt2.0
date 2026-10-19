import {mkdir,writeFile} from 'node:fs/promises';
const origin='https://www.rivyalivingart.com',dir='test-results/rivya-master-audit';await mkdir(dir,{recursive:true});
const response=await fetch(origin+'/sitemap.xml'),xml=await response.text();
if(!response.ok||!xml.includes('<urlset'))throw new Error('Published sitemap unavailable');
const routes=[...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname))];
const report={at:new Date().toISOString(),scope:'Current published sitemap, public read-only HTML, SEO and media inventory; not per-record interactive validation',routes:[],assets:[],errors:[]};
let index=0;const assets=new Set();
const save=()=>writeFile(dir+'/published-inventory.json',JSON.stringify(report,null,2)+'\n');
await Promise.all(Array.from({length:2},async()=>{while(index<routes.length){const path=routes[index++];try{const r=await fetch(origin+path,{signal:AbortSignal.timeout(45000)}),html=await r.text(),title=html.match(/<title>(.*?)<\/title>/s)?.[1],h1=html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1],language=html.match(/<html[^>]+lang="([^"]+)/)?.[1];
 report.routes.push({path,status:r.status,title,hasH1:Boolean(h1),language});if(!r.ok||!title||!h1)report.errors.push({path,status:r.status,missingTitle:!title,missingH1:!h1});
 for(const tag of html.matchAll(/<(?:img|source|video)\b[^>]*>/g))for(const a of tag[0].matchAll(/\b(?:src|poster)="([^"]+)"/g)){const p=a[1].replaceAll('&amp;','&');if(p.startsWith('/')&&!p.startsWith('//'))assets.add(p);}
}catch(e){report.errors.push({path,error:e.message});}if(report.routes.length%30===0){console.log(JSON.stringify({routes:report.routes.length,total:routes.length,errors:report.errors.length}));await save();}}}));
for(const path of assets){try{const r=await fetch(origin+path,{method:'HEAD',signal:AbortSignal.timeout(30000)});report.assets.push({path,status:r.status,type:r.headers.get('content-type')});if(!r.ok)report.errors.push({path,status:r.status});}catch(e){report.errors.push({path,error:e.message});}}
report.finishedAt=new Date().toISOString();await save();console.log(JSON.stringify({routes:report.routes.length,assets:report.assets.length,errors:report.errors}));
