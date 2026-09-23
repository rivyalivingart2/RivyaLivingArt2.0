/** Source inventory only: no environment loading, network, database or publication. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const candidate=read('docs/redesign/reviewed-publication.json');
const instances=read('docs/redesign/instances.json');
const review=read('docs/redesign/product-review.json');
const manifest=read('docs/redesign/media-manifest.json');
const copy=read('src/lib/reviewed-product-copy.json');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const assets=new Map(manifest.assets.map(a=>['/'+(a.path||a.file).replace(/^public\//,''),a]));
const media=new Map(candidate.media.map(m=>[m.path,m]));
const ids=new Set(),slugs=new Set();
const rows=candidate.products.map(p=>{
 if(ids.has(p.id)||slugs.has(p.slug))throw new Error('Duplicate product identity');
 ids.add(p.id);slugs.add(p.slug);
 const original=instances.products.find(x=>x.id===p.id),prior=review.records.find(x=>x.id===p.id);
 if(!original||!prior||p.slug!==original.slug||p.slug!==prior.slug)throw new Error('Identity reconciliation failed: '+p.id);
 if(Object.entries(copy[p.id]).some(([k,v])=>JSON.stringify(p[k])!==JSON.stringify(v)))throw new Error('Reviewed copy drift: '+p.id);
 const paths=[...new Set([p.image,p.scene,...(p.gallery||[]).map(g=>g.src)].filter(Boolean))];
 const images=paths.map(src=>{
  const record=media.get(src),asset=assets.get(src),absolute=path.join(root,'public',src);
  if(!src.startsWith('/media/')||src.includes('..')||!fs.existsSync(absolute)||!record?.products.includes(p.id)||!asset)throw new Error('Media reconciliation failed: '+p.id);
  const digest=hash(fs.readFileSync(absolute));
  if(asset.sha256&&digest!==asset.sha256)throw new Error('Asset bytes changed: '+p.id);
  return {path:src,classification:asset.classification,alt:record.alt,sha256:digest,bytes:fs.statSync(absolute).size,association:'Same product ID in reviewed media registry',visualReview:'Phase 9/11 pending; source mapping is not rendered-image proof'};
 });
 const fields=p.fields.map(f=>f.id);
 if(JSON.stringify(fields)!==JSON.stringify(prior.fields))throw new Error('Schema inventory drift: '+p.id);
 const schemaIssues=[];
 if(['DP110','DP119'].includes(p.id))schemaIssues.push({task:'P5.1',issue:'Broad /ring/ type matching adds required jewellery size to '+p.subtitle+'. Replace with explicit product capabilities before publication.'});
 return {id:p.id,slug:p.slug,legacySlug:original.legacySlug,name:p.name,tier:p.tier,category:p.category,
  detailRoute:'/pieces/'+p.slug,customizationRoute:'/pieces/'+p.slug+'/customize',legacyCustomizationRoute:'/pieces/'+original.legacySlug+'/customize',
  fields,sourceSchemaRevision:p.revision,schemaSelection:'Exact durable published product and published_version; current source definition retained for Phase 5 review',schemaIssues,
  copySource:'src/lib/reviewed-product-copy.json',dimensions:p.dimensions||'Final dimensions require atelier agreement',material:p.material,
  specificationStatus:'Approved design direction, not a manufactured-object guarantee; fixture prices excluded',
  images,relatedIds:candidate.products.filter(x=>x.tier===p.tier&&x.id!==p.id).sort((a,b)=>Number(b.category===p.category)-Number(a.category===p.category)||a.id.localeCompare(b.id,'en')).slice(0,3).map(x=>x.id),
  careProfile:p.tier,sourceDisposition:'DISCOVERY_SOURCE_READY',publicationDisposition:'HELD_FOR_INTEGRATION_AND_FINAL_REVIEW',
  holdReasons:[...(schemaIssues.length?['Explicit product capability correction in P5.1']:[]),'No Phase 4 database publication; current live record visibility not inspected','Integration/commercial activation gates and final content/media/QA review remain'],
  databaseEvidence:'Phase 2 read-only Preview catalogue count was zero; historical observation only, not a fresh Phase 4 count',verification:'Source inventory/identity/copy/media hash reconciliation only; no application QA'};
});
if(rows.length!==120||instances.products.length!==120||review.records.length!==120)throw new Error('Unexpected scope: review before changing the 120-product inventory');
const report={version:1,date:'2026-09-23',planRevision:'3.4',sourceBaseline:'47323c51a9c225cac0ee719203612bc579d5ede0',scope:'P4.1–P4.6 source reconciliation; no record publication',candidateSha256:hash(fs.readFileSync(path.join(root,'docs/redesign/reviewed-publication.json'))),counts:{products:rows.length,large:rows.filter(p=>p.tier==='large').length,memory:rows.filter(p=>p.tier==='memory').length,personal:rows.filter(p=>p.tier==='personal').length,uniquePrimaryImages:new Set(candidate.products.map(p=>p.image)).size,reviewedMedia:candidate.media.length,schemaFollowUps:rows.filter(p=>p.schemaIssues.length).length},products:rows,otherContent:{articles:36,pages:11,disposition:'Preserved reviewed candidates; Phase 8 factual/copy review, no publication'},heldExamples:{projects:instances.projects.map(p=>({id:p.id,reason:p.status})),testimonials:'Explicitly fictional; never promoted as customer proof',orders:'Fictional demonstrations; never imported as customer inquiries'}};
fs.writeFileSync(path.join(root,'docs/redesign/phase-4-products.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.counts));
