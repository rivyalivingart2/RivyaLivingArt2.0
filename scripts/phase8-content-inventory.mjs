/** Source inventory only. No environment loading, database, network or publication. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const candidate=read('docs/redesign/reviewed-publication.json'),journal=read('src/lib/reviewed-journal.json');
const modules=new Map();
// Fixed pure content modules only; product identity comes from the preserved 120-row candidate.
function source(name){
 if(modules.has(name))return modules.get(name);
 const exports={};modules.set(name,exports);
 const code=ts.transpileModule(fs.readFileSync(path.join(root,'src/lib',name+'.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 vm.runInNewContext(code,{exports,require:id=>{
  if(id==='./reviewed-journal.json')return journal;
  if(id==='./shop-model')return {baselineProducts:candidate.products};
  if(['./shop-editorial','./public-media'].includes(id))return source(id.slice(2));
  throw Error('Unexpected source dependency: '+id);
 }},{timeout:1000,filename:name+'.ts'});
 return exports;
}
const {baselineContent,validContent,articleAliases}=source('content-model');
const {approvedPublicMedia}=source('public-media');
const historical=candidate.content;
if(!Array.isArray(historical))throw Error('Review historical content shape before continuing');
const ids=new Set(),routes=new Set(),assets=read('docs/redesign/media-manifest.json').assets;
const changed=[];
const rows=baselineContent.map(d=>{
 const old=historical.find(x=>x.id===d.id);
 if(!old||old.route!==d.route||old.kind!==d.kind||ids.has(d.id)||routes.has(d.route)||!validContent(d,d))throw Error('Content identity or source shape requires review: '+d.id);
 ids.add(d.id);routes.add(d.route);
 if(old.sections.some(b=>!d.sections.some(n=>n.id===b.id)))throw Error('Original section identity removed: '+d.id);
 const altered=JSON.stringify(d)!==JSON.stringify(old);
 if(altered)changed.push(d.id);
 const image=d.image?approvedPublicMedia.find(m=>m.path===d.image):null;
 const asset=image?assets.find(a=>'/'+(a.path||a.file).replace(/^public\//,'')===image.path):null;
 let imageEvidence=null;
 if(d.image){
  if(!image||!asset)throw Error('Missing approved source media: '+d.id);
  const bytes=fs.readFileSync(path.join(root,'public',image.path));
  const digest=hash(bytes);
  if(digest!==asset.sha256)throw Error('Approved image bytes changed: '+d.id);
  imageEvidence={path:image.path,alt:d.imageAlt,classification:asset.classification,sha256:digest,bytes:bytes.length,visualVerification:'P9/P11 pending; hash/association review only'};
 }
 const words=[d.description,...d.sections.flatMap(b=>[b.heading,...b.paragraphs,...(b.checklist||[])])].join(' ').trim().split(/\s+/).length;
 return {id:d.id,kind:d.kind,route:d.route,title:d.title,topic:d.eyebrow,sectionIds:d.sections.map(b=>b.id),words,copySha256:hash(JSON.stringify(d)),changedSinceOriginalCandidate:altered,image:imageEvidence,relatedProductIds:d.relatedProductIds||[],review:'Full paragraph source review; planning/care guidance, no fabricated completed work or product performance promise',disposition:['/privacy','/terms','/shipping-delivery','/returns-cancellations'].includes(d.route)?'Factual draft ready; missing retention/fulfilment particulars remain a publication gate':'Source ready; deliberate Studio publication and final QA still required'};
});
if(rows.length!==47||rows.filter(r=>r.kind==='article').length!==36)throw Error('Preserve the 47-document/36-article inventory');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const routeFiles=walk(path.join(root,'src/app')).filter(f=>/[/\\](?:page\.tsx|route\.ts)$/.test(f)).map(f=>path.relative(root,f).replaceAll('\\','/')).sort();
const routeInventory=routeFiles.map(file=>{
 const route='/'+file.replace(/^src\/app\//,'').replace(/\/(?:page\.tsx|route\.ts)$/,'').replace(/^page\.tsx$/,'');
 let disposition='Public route; published data only, explicit availability boundary';
 if(route.startsWith('/api/'))disposition='API only; request/session/role scope and private response; never sitemap';
 else if(route.startsWith('/preview/studio'))disposition='Authenticated legacy Studio adapter; redirects to Studio, never public content';
 else if(route.startsWith('/studio'))disposition='Staff-only Studio or sign-in; no customer account, noindex';
 else if(route.startsWith('/preview/'))disposition='Visual system presentation only; denied in production and shared data mode';
 else if(route.startsWith('/inquiry/'))disposition='Guest-bound saved receipt; noindex/private, expiry does not remove saved order';
 else if(['/about','/care','/materials'].includes(route))disposition='Permanent retained alias with query preservation and care/material anchors';
 else if(['/personalize','/preserve'].includes(route))disposition='Legacy selection/customization adapter; real published product context, noindex';
 else if(route.includes('/customize'))disposition='Published product or bespoke brief; noindex, writes gated, saves before order-only handoff';
 else if(route.startsWith('/portfolio'))disposition='Approved real projects only; currently zero, truthful empty list or 404 detail';
 else if(route==='/[collection]')disposition='Only collectible-design, memory-art and personal-art; all other values 404';
 else if(route==='/search')disposition='Published catalogue query/filter form; noindex; no WhatsApp';
 return {file,route,disposition};
});
const formFiles=walk(path.join(root,'src')).filter(f=>/\.tsx$/.test(f)&&fs.readFileSync(f,'utf8').includes('<form')).map(f=>path.relative(root,f).replaceAll('\\','/')).sort();
const formInventory=formFiles.map(file=>({file,scope:file==='src/components/shop/order-form.tsx'?'Public product/bespoke customization; sole order-save form; no direct unsaved handoff':file==='src/components/shop/header.tsx'?'Public GET search only':file==='src/components/shop/catalogue-browser.tsx'?'Public GET catalogue search/filter only':file==='src/components/studio-login.tsx'?'Staff sign-in; no customer account or WhatsApp':file==='src/components/studio-orders-board.tsx'?'Shared authenticated Kanban; legacy form export is not a public entry':file.startsWith('src/components/studio/')?'Authenticated Studio editing/operations; existing saved-order actions only':'Historical component preserved; not an active public-form entry'}));
const report={version:1,date:'2026-09-23',planRevision:'3.9',sourceBaseline:'630521de2f228d2fe935585e12e4639e98da8839',scope:'P8 source/content review; no runtime QA or data write',counts:{documents:rows.length,articles:36,pages:11,faqs:baselineContent.find(d=>d.id==='page:faq').sections.length,changedDocuments:changed.length,approvedRealProjects:0,routeFiles:routeInventory.length,formSourceFiles:formInventory.length},copyReview:rows,aliases:{articles:articleAliases,products:'Preserved 120 stable/current/legacy mappings in phase-4-products.json; only redirect to a currently published target',pages:{'/about':'/our-story','/materials':'/materials-care#materials','/care':'/materials-care#care'}},routes:routeInventory,forms:formInventory,states:{loading:'Shared ReadingLoading for editorial, journal, portfolio and policies',missing:'Existing 404 presentation; unpublished record never falls back to a source candidate',error:'Existing retry boundary distinguishes an unavailable fetch from a missing document; no synthetic successful response',empty:'Published-only journal and portfolio show factual empty copy and relevant links',expired:'Existing guest-bound receipt is available up to 24 hours; recovery never starts a replacement inquiry'},publication:'Original reviewed-publication.json preserved as historical input. Use current Studio source proposals deliberately, compare saved drafts and publish only after factual/runtime/commercial gates. No import script was run.',verification:'Source, identity, section preservation and image-byte review only. Rendered crop, route/redirect/metadata behavior and all browser/API/accessibility verification remain P11.'};
fs.writeFileSync(path.join(root,'docs/redesign/phase-8-content.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/redesign/phase-8-content-proposals.json'),JSON.stringify({version:1,planRevision:'3.9',scope:'Reviewed source proposals, not a database snapshot or instruction to overwrite drafts',publication:'Held for deliberate Studio review and release prerequisites',content:baselineContent},null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/redesign/current-route-source.json'),JSON.stringify({updated:'2026-09-23',status:'Phase 8 source inventory; runtime responses and behavior remain unverified',files:routeFiles},null,2)+'\n');
console.log(JSON.stringify(report.counts));
