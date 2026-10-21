/** Private loopback comparison. Only explicit screenshot paths are served. */
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import assert from 'node:assert/strict';
const root=resolve('test-results/exact-legacy-2026-10-21');
const readCaptures=()=>{
 const baseline=JSON.parse(readFileSync(resolve(root,'captures.json'),'utf8'));
 const extension=resolve(root,'phase2-captures.json');
 const candidate=existsSync(extension)?JSON.parse(readFileSync(extension,'utf8')):[];
 const homePath=resolve(root,'home2-captures.json');
 const home=existsSync(homePath)?JSON.parse(readFileSync(homePath,'utf8')):[];
 const homeBaselines=baseline.filter(c=>c.family==='login'||c.family==='home'&&c.label==='current').map(c=>({...c,family:c.family==='login'?'home2-login':'home2-hero'})).filter(c=>!home.some(h=>h.family===c.family&&h.label===c.label&&h.width===c.width));
 const currentHome=baseline.filter(c=>c.family==='home'&&c.label==='current').map(c=>({...c,family:'restoration-home'}));
 return [...baseline,...currentHome,...candidate,...homeBaselines,...home];
};
const captures=readCaptures();
for(const c of captures){assert.match(c.path,/^screenshots\/[a-z0-9-]+\.jpg$/);assert.equal(c.width,c.requestedWidth);assert.ok(existsSync(resolve(root,c.path)));}
const data=JSON.stringify(captures).replaceAll('<','\\u003c');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rivya — local restoration comparison</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0a1218;color:#eee9df;font:16px/1.5 system-ui,sans-serif}header{padding:28px 32px 22px;border-bottom:1px solid #ffffff30}h1{font-size:28px;margin:4px 0}p{max-width:1050px;margin:8px 0;color:#c6cdd2}.status{font:12px monospace;text-transform:uppercase;color:#9ab9ca;letter-spacing:.1em}a{color:#b7d9e9}nav{display:flex;gap:20px;align-items:end;flex-wrap:wrap;margin-top:20px}label{display:grid;gap:4px;font-size:13px}select{font:inherit;color:inherit;background:#173240;border:1px solid #54707f;padding:9px 14px;min-width:150px}main{padding:24px 32px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0;min-width:0}h2{font-size:17px;margin:0 0 4px}figcaption{min-height:76px;font-size:13px;color:#bdc8ce}img[hidden]{display:none}img{display:block;width:100%;height:auto;border:1px solid #ffffff30;background:#fff}#note{margin:0 0 22px;font-size:14px}footer{padding:20px 32px;border-top:1px solid #ffffff30;font-size:13px;color:#bdc8ce}@media(max-width:700px){header,main,footer{padding:20px}.pair{grid-template-columns:1fr}h1{font-size:23px}}</style>
<header><div class="status">Phase 2 homepage continuation • Local only</div><h1>Exact restoration: reference and working candidate</h1><p>The latest home2 comparisons show the restored homepage section order, progress ruler, product rail, collection doors, material layout, timeline and journal. Protected current content and images explain visible record differences. The journal candidate is an unpublished local test preview. Full feature and Studio parity remain pending.</p>
<nav><label>Page / state<select id="family"></select></label><label>Width<select id="width"></select></label><label>Compare reference with<select id="version"><option value="candidate">Local restoration candidate</option><option value="current">Current site baseline</option></select></label><a href="http://127.0.0.1:4210/" target="_blank" rel="noreferrer">Open working local preview ↗</a></nav></header>
<main><p id="note"></p><section class="pair"><figure><h2 id="left-title">OLDWEBSITE — reference</h2><figcaption id="old-caption"></figcaption><a id="old-link"><img id="old-image" alt="Old website reference"></a></figure><figure><h2 id="right-title"></h2><figcaption id="right-caption"></figcaption><a id="right-link"><img id="right-image" alt="Comparison candidate"></a></figure></section></main>
<footer>DPR 1, resized desktop-browser viewport. Comparisons use reduced motion; pointer-preview evidence is labelled separately. These are bounded state captures, not physical-phone, animation or complete-flow acceptance. Product/article pairs compare different records and do not establish identity mappings. Missing views remain explicitly unverified. Screenshots and private database evidence remain outside Git.</footer>
<script>
const captures=${data};
const family=document.querySelector('#family'),width=document.querySelector('#width'),version=document.querySelector('#version');
for(const f of [...new Set(captures.map(c=>c.family))])family.add(new Option(f,f));
family.value=captures.some(c=>c.family==='home2-pieces')?'home2-pieces':'restoration-home';
function widths(){const previous=width.value;width.replaceChildren();for(const w of [...new Set(captures.filter(c=>c.family===family.value).map(c=>c.width))].sort((a,b)=>b-a))width.add(new Option(w+' px',w));width.value=[...width.options].some(o=>o.value===previous)?previous:[...width.options].some(o=>o.value==='1440')?'1440':width.options[0].value;render();}
function render(){
 const protectedLogin=family.value==='home2-login';
 document.querySelector('#left-title').textContent=protectedLogin?'Current protected login — reference':'OLDWEBSITE — reference';
 document.querySelector('#right-title').textContent=version.value==='candidate'?(family.value.startsWith('home2-')?'Local restoration — homepage checkpoint':'Local restoration — earlier foundation checkpoint'):'Current site — before restoration';
 for(const [slot,label] of [['old',protectedLogin?'current':'old'],['right',version.value]]){
  const c=captures.find(c=>c.family===family.value&&c.width===Number(width.value)&&c.label===label);
  const caption=document.querySelector('#'+slot+'-caption'),img=document.querySelector('#'+slot+'-image'),link=document.querySelector('#'+slot+'-link');
  if(!c){caption.textContent='Not captured for this version / width. No parity claim.';img.hidden=true;link.removeAttribute('href');continue;}
  img.hidden=false;img.src=c.path;img.alt=label+' '+c.family+' at '+c.width+' pixels';link.href=c.path;link.target='_blank';
  caption.textContent=c.route+' • '+c.width+' × '+c.height+' • '+(c.heading||'Recorded UI state')+(c.scope?.startsWith('isolated')?' • Isolated fixture build':' • Live baseline')+(c.motion?' • '+c.motion:'')+(c.family==='home2-journal'&&c.label==='candidate'?' • Unpublished synthetic test snapshot':'')+(c.scrollWidth>c.width?' • Horizontal overflow observed':'');
 }
 document.querySelector('#note').textContent=family.value.includes('login')?'Protected exception: current Studio login source remains unchanged.':'Exact legacy layout is the target. This checkpoint is partial; content and media differences reflect the protected current records and local fixture scope.';
}
family.addEventListener('change',widths);width.addEventListener('change',render);version.addEventListener('change',render);widths();
</script></html>`;
writeFileSync(resolve(root,'comparison.html'),html);
console.log('Generated private comparison for '+captures.length+' views');
if(process.argv.includes('--serve')){
 const paths=()=>new Set(readCaptures().filter(c=>/^screenshots\/[a-z0-9-]+\.jpg$/.test(c.path)).map(c=>'/'+c.path));
 createServer((request,response)=>{
  if(request.headers.host!=='127.0.0.1:4211'||!['GET','HEAD'].includes(request.method)){response.writeHead(400);response.end();return;}
  const path=new URL(request.url,'http://127.0.0.1:4211').pathname;
  const file=path==='/'||path==='/comparison.html'?'comparison.html':paths().has(path)?path.slice(1):null;
  if(!file){response.writeHead(404);response.end('Not found');return;}
  response.writeHead(200,{'Content-Type':file.endsWith('.jpg')?'image/jpeg':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'});
  response.end(request.method==='HEAD'?undefined:readFileSync(resolve(root,file)));
 }).listen(4211,'127.0.0.1',()=>console.log('Comparison: http://127.0.0.1:4211/'));
}
