import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const origin='http://127.0.0.1:4199',base='docs/redesign/modern-design-2026-10-13/';
const previous=JSON.parse(await readFile(base+'phase4-route-coverage.json','utf8')).routes;
const xml=await(await fetch(origin+'/sitemap.xml')).text();
const routes=[...new Set(previous.map(r=>r.route).concat([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname)))];
const report={scope:'Local candidate HTTP inventory; compares status/destination with approved local Phase 4 evidence, not live publication',routes:[],assets:[],links:[],errors:[],unpublishedLocalDrafts:0};
const assets=new Set(),links=new Set();let index=0;
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&quot;','"');
await Promise.all(Array.from({length:4},async()=>{while(index<routes.length){const route=routes[index++];try{
 const response=await fetch(origin+route,{headers:{'User-Agent':'Twitterbot/1.0'},signal:AbortSignal.timeout(30000)}),html=await response.text(),destination=new URL(response.url).pathname,prior=previous.find(p=>p.route===route);
 const row={route,status:response.status,destination,expectedStatus:prior?.status,expectedDestination:prior?.destination};
 if(prior&&(response.status!==prior.status||destination!==prior.destination))report.errors.push('Route changed '+route);
 if(response.status===404&&prior?.status===404)report.unpublishedLocalDrafts++;
 if(response.ok){row.title=html.match(/<title>(.*?)<\/title>/s)?.[1];row.language=html.match(/<html[^>]+lang="([^"]+)/)?.[1];if(!row.title||!row.language)report.errors.push('Missing document title/language '+route);
  for(const m of html.matchAll(/<(?:img|video|source|script|link)\b[^>]*>/g)){for(const a of m[0].matchAll(/\b(?:src|poster|href)="([^"]+)"/g)){const value=decode(a[1]);if(value.startsWith('/')&&!value.startsWith('//')){if(m[0].startsWith('<link')&&!/rel="(?:preload|stylesheet|icon)/.test(m[0]))continue;assets.add(value);}}}
  for(const m of html.matchAll(/<a\b[^>]*href="([^"#]+)"/g)){const path=decode(m[1]);if(path.startsWith('/')&&!path.startsWith('//'))links.add(path.split('#')[0]);}
 }
 report.routes.push(row);
}catch(error){report.errors.push(route+' '+error.message);}}}));
let ai=0;const assetPaths=[...assets];await Promise.all(Array.from({length:4},async()=>{while(ai<assetPaths.length){const path=assetPaths[ai++];try{const response=await fetch(origin+path,{method:'HEAD',signal:AbortSignal.timeout(30000)});report.assets.push({path,status:response.status,type:response.headers.get('content-type'),bytes:response.headers.get('content-length')});if(!response.ok)report.errors.push('Asset unavailable '+path);}catch(error){report.errors.push('Asset '+path+' '+error.message);}}}));
const extras=[...links].filter(path=>!report.routes.some(r=>r.route===path)&&!/^\/(?:studio|api|preview)\b/.test(path));let li=0;await Promise.all(Array.from({length:3},async()=>{while(li<extras.length){const path=extras[li++];try{const response=await fetch(origin+path,{signal:AbortSignal.timeout(30000)});await response.body?.cancel();report.links.push({path,status:response.status});if(!response.ok)report.errors.push('Internal link unavailable '+path);}catch(error){report.errors.push('Link '+path+' '+error.message);}}}));
report.routes.sort((a,b)=>a.route.localeCompare(b.route));report.assets.sort((a,b)=>a.path.localeCompare(b.path));
await writeFile('output/redesign-phase7/http.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({routes:report.routes.length,available:report.routes.filter(r=>r.status===200).length,unpublishedLocalDrafts:report.unpublishedLocalDrafts,assets:report.assets.length,additionalLinks:report.links.length,errors:report.errors}));assert.equal(report.errors.length,0);
