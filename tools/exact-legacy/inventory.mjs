/** Read tracked source only. Never imports either app, reads .env, or opens a DB. */
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const destination=process.cwd(), reference=resolve(process.argv[2]||'../OLDWEBSITE-reference');
const output=resolve('docs/restoration/exact-legacy-2026-10-21/inventory');
const git=(root,...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',windowsHide:true}).trim();
assert.match(git(reference,'remote','get-url','origin'),/github\.com[/:]rivyalivingart2\/OLDWEBSITE(?:\.git)?$/);
assert.match(git(destination,'remote','get-url','origin'),/github\.com[/:]rivyalivingart2\/RivyaLivingArt2\.0(?:\.git)?$/);
const files=root=>git(root,'ls-files','-z').split('\0').filter(Boolean).sort();
const oldFiles=files(reference),newFiles=files(destination);
const read=(root,path)=>readFileSync(resolve(root,path),'utf8');
const csv=(path,rows)=>{
  assert.ok(rows.length);
  const keys=Object.keys(rows[0]),quote=v=>'"'+String(v??'').replaceAll('"','""')+'"';
  writeFileSync(resolve(output,path),[keys,...rows.map(row=>keys.map(k=>row[k]))].map(row=>row.map(quote).join(',')).join('\n')+'\n');
};
const route=file=>'/'+file.replace(/^src\/app\//,'').split('/').filter(x=>!/^\(.+\)$/.test(x)&&x!=='[locale]').slice(0,-1).join('/');
const routes=(list)=>list.filter(f=>/^src\/app\/.+\/(?:page|route)\.tsx?$/.test(f)||f==='src/app/page.tsx').map(file=>({file,route:route(file),kind:file.endsWith('route.ts')?'handler':file.includes('/studio/')?'studio':'public'}));
const sourceRoutes=routes(oldFiles),destRoutes=routes(newFiles);
const publicMap={'/':'/','/about':'/our-story','/shop':'/search','/shop/[category]':'/search?category=<mapped category>','/shop/wishlist':'/saved-pieces','/product/[slug]':'/pieces/[mapped slug]','/large-resin-art':'/collectible-design','/custom-order':'/commission','/whatsapp-order':'/inquiry/received (current secure receipt; old token needs safe recovery mapping)','/blog':'/journal','/blog/[slug]':'/journal/[mapped slug]','/workshops':'/workshops (restore conditional offering)','/p/[slug]':'/p/[mapped slug]','/gone':'HTTP 410 system state','/too-many-requests':'HTTP 429 system state','/maintenance':'maintenance system state','/design-lab':'local-only design reference'};
const studioMap={'blog':'journal','users':'staff','custom-pages':'landing-pages','signup':'request-access','reset-password':'set-password'};
const moduleSource=read(destination,'src/lib/studio-modules.ts');
const moduleKeys=[...moduleSource.matchAll(/key:\s*['"]([^'"]+)['"],segment:\s*['"]([^'"]*)['"]/g)].map(m=>({key:m[1],segment:m[2]}));
const sourceRouteRows=sourceRoutes.map(row=>{
 let target=publicMap[row.route]||row.route,status='ADAPT_AND_VERIFY',reason='Route-level candidate; visual and workflow parity not certified.';
 if(row.kind==='studio'){
  const parts=row.route.split('/').filter(Boolean),segment=parts[1]||'';
  target='/studio'+(segment?'/'+(studioMap[segment]||segment):'');
  if(parts.length>2)target+=parts[2]==='new'?'?create=1':'?record=<mapped id>';
  if(row.route==='/studio/inquiries/[id]/card')target='/studio/inquiries/[mapped id]/card';
  if(segment==='scraper'||segment==='catalog-fill'){target=row.route;status='MISSING_WORKFLOW';reason='No current Studio module or pipeline; restore route, backend, jobs and permissions.';}
  else if(segment==='import'||segment==='subscribers'){status='STATUS_ONLY';reason='Current guarded ConditionalWorkspace is not an implemented workflow and is hidden from navigation.';}
  else if(segment==='research'||segment==='exports'){status='PARTIAL_DIFFERENT_BEHAVIOR';reason='Current editorial-research/activity-export destination does not establish legacy scraper/catalogue parity.';}
  else if(segment==='login'){status='PROTECTED_EXCEPTION';reason='Keep current login appearance and access controls.';}
 } else if(row.kind==='handler') {status='API_CONTRACT_REVIEW';reason='Inspect callers, authorization and downstream persistence; route existence is insufficient.';}
 if(row.route.includes('[slug]')||row.route.includes('[category]'))reason+=' Requires stable record/category crosswalk; do not match title alone.';
 return {sourceRoute:row.route,sourceFile:row.file,kind:row.kind,destinationCandidate:target,status,reason,visual:'NOT_VERIFIED',behavior:'NOT_VERIFIED'};
});

const modelMap={
 User:['rivya_staff','EXCLUDE_CREDENTIALS','src/lib/studio-staff.ts'],
 Category:['catalogue category contract + new category metadata','EXTEND','src/lib/catalogue-extra.ts'],
 Product:['rivya_catalogue draft/published','MAP_AND_PRESERVE','src/lib/shop-model.ts'],
 ProductImage:['catalogue gallery + editorial media','MAP_AND_PRESERVE','src/lib/editorial-media-model.ts'],
 CustomizationField:['ShopProduct.fields','ADAPT_VALIDATION','src/lib/field-schema.ts'],
 Inquiry:['rivya_inquiries + rivya_studio_orders','PRIVATE_MAPPING_REQUIRED','src/lib/inquiry.ts'],
 Portfolio:['rivya_content editorial portfolio','MAP_DRAFT','src/lib/editorial-record-model.ts'],
 PortfolioImage:['editorial gallery/media associations','MAP_AND_PRESERVE','src/lib/editorial-record-model.ts'],
 BlogCategory:['content discovery metadata','EXTEND_TAXONOMY','src/lib/editorial-metadata.ts'],
 Tag:['content discovery tags','EXTEND_TAXONOMY','src/lib/editorial-metadata.ts'],
 BlogPost:['rivya_content article','MAP_DRAFT','src/lib/content-model.ts'],
 Testimonial:['rivya_content editorial testimonial','VERIFY_GENUINE_EVIDENCE','src/lib/editorial-record-model.ts'],
 Faq:['rivya_content FAQ','MAP_DRAFT','src/lib/editorial-record-model.ts'],
 Media:['rivya_editorial_media / rivya_public_media','PROVENANCE_AND_PRIVACY','src/lib/editorial-media-model.ts'],
 RateLimitHit:['current rate-limit contracts','KEEP_CURRENT_RUNTIME','src/lib/studio-auth.ts'],
 Page:['rivya_content page','MAP_DRAFT','src/lib/content-model.ts'],
 SiteSettings:['business/site/shared-copy/presentation stores','SPLIT_PROTECTED_FIELDS','src/lib/business-settings-model.ts'],
 ActivityLog:['existing history + legacy append-only archive','PRESERVE_HISTORY','src/lib/studio-orders.ts'],
 SiteImage:['editorial usage + media','PRESERVE_CROP','src/lib/editorial-media-model.ts'],
 SiteCopy:['shared-copy/content translations','MAP_DRAFT','src/lib/shared-copy-model.ts'],
 FormOption:['commission option contract','EXTEND','src/lib/bespoke-schema.ts'],
 NavMenu:['site settings navigation','MAP_PROTECTED_DESTINATIONS','src/lib/site-settings-model.ts'],
 NavItem:['site settings navigation','MAP_PROTECTED_DESTINATIONS','src/lib/site-settings-model.ts'],
 ContentRevision:['legacy history archive linked to current revisions','PRESERVE_HISTORY','scripts/revision-schema.sql'],
 PageSection:['content sections + presentations','MAP_DRAFT','src/lib/presentation-model.ts'],
 CustomPage:['rivya_content landing document','MAP_DRAFT','src/lib/landing-model.ts'],
 CustomBlock:['landing blocks','MAP_DRAFT','src/lib/landing-model.ts'],
 Subscriber:['new consent-aware subscriber store','RESTORE_PRIVATE_STORE','src/components/studio/conditional-workspace.tsx'],
};
const schema=read(reference,'prisma/schema.prisma');
const models=[...schema.matchAll(/^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm)];
const fieldRows=[];
const entityRows=models.map(m=>{
 const name=m[1], fields=m[2].split('\n').map(l=>l.trim()).filter(l=>/^\w+\s+/.test(l));
 const [candidate,treatment,contract]=modelMap[name]||[(name==='ImportRun'||name==='DeletedImport'||name==='ImportConflict')?'new import ledger / conflict / tombstone stores':'new isolated legacy research/scraper store','RESTORE_ADDITIVE','prisma/schema.prisma (reference); destination adapter required'];
 for(const line of fields){const [field,type,...attributes]=line.split(/\s+/);const secret=/password|token|secret|credential|session/i.test(field);fieldRows.push({entity:name,field,type,attributes:attributes.join(' '),destinationEntity:candidate,destinationField:'UNRESOLVED_EXPLICIT_MAPPING_REQUIRED',treatment:secret?'EXCLUDE_AUTH_SECRET':treatment,conflict:'KEEP_DESTINATION_STAGE_DECISION',sourceRecordCount:'NOT_READ',status:'INVENTORIED_NOT_MIGRATED'});}
 return {entity:name,fieldCount:fields.length,destinationCandidate:candidate,treatment,contract,sourceRecordCount:'NOT_READ',status:'MAPPING_REQUIRED'};
});
const tableRows=[];
for(const file of newFiles.filter(f=>f.startsWith('scripts/')&&f.endsWith('.sql'))){for(const m of read(destination,file).matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-z_][a-z_0-9]*)/gi))tableRows.push({table:m[1],schemaSource:file,status:'SOURCE_CONTRACT_ONLY'});}
const actionRows=[];
for(const file of oldFiles.filter(f=>f.startsWith('src/actions/')&&/\.tsx?$/.test(f))){for(const m of read(reference,file).matchAll(/export\s+(?:async\s+)?function\s+(\w+)/g))actionRows.push({source:file,action:m[1],status:'CALLER_PERMISSION_PERSISTENCE_REVIEW_REQUIRED'});}
const docs=oldFiles.filter(f=>/\.md$/i.test(f)).map(file=>({source:file,purpose:/scrap|research|supplier|catalog/i.test(file)?'research/import/catalogue':/design|motion|style|ui|interaction/i.test(file)?'design reference':/deploy|setup|readme|database|schema|prisma/i.test(file)?'setup/data/operations':'historical guidance/evidence',destination:'docs/restoration/exact-legacy-2026-10-21/legacy-knowledge/',treatment:'REVIEW_THEN_ADAPT',status:'INVENTORIED_CONTENT_NOT_YET_MIGRATED'}));
const protectedFiles=newFiles.filter(f=>f.startsWith('public/brand/')||['src/styles/tokens.css','src/lib/contact.ts','src/lib/business-settings-model.ts','src/lib/shop-model.ts','src/lib/rivya/data.ts','src/lib/reviewed-product-copy.json','src/components/studio/access-shell.tsx','src/components/studio/login-form.tsx','src/components/studio/studio-access.module.css','src/app/studio/login/page.tsx'].includes(f));
const protectedRows=protectedFiles.map(file=>({file,sha256:createHash('sha256').update(readFileSync(resolve(destination,file))).digest('hex'),scope:'SOURCE_BYTES_ONLY_NOT_LIVE_DATABASE'}));
mkdirSync(output,{recursive:true});
csv('legacy-routes.csv',sourceRouteRows);csv('destination-routes.csv',destRoutes);csv('legacy-entities.csv',entityRows);csv('legacy-fields.csv',fieldRows);csv('destination-tables.csv',tableRows);csv('legacy-actions.csv',actionRows);csv('legacy-markdown.csv',docs);csv('protected-source.csv',protectedRows);
const result={schemaVersion:1,referenceCommit:git(reference,'rev-parse','HEAD'),destinationBaseline:git(destination,'rev-parse','HEAD'),sourceCounts:{routes:sourceRoutes.length,publicPages:sourceRoutes.filter(r=>r.kind==='public').length,studioPages:sourceRoutes.filter(r=>r.kind==='studio').length,handlers:sourceRoutes.filter(r=>r.kind==='handler').length,models:models.length,fields:fieldRows.length,actions:actionRows.length,markdown:docs.length},destinationCounts:{routes:destRoutes.length,studioModules:moduleKeys.length,uniqueTables:new Set(tableRows.map(r=>r.table)).size,protectedSourceFiles:protectedRows.length},limits:['Static source inventory, not a claim of working feature parity.','No database records read or migrated.','Draft field mappings require explicit validation before writes.','Markdown paths inventoried; content adaptation is Phase 2.'],networkRequests:0,databaseWrites:0};
writeFileSync(resolve(output,'summary.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
