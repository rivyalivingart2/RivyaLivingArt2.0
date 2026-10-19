import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {localBrowser,origin} from '../old-design-migration/local-browser.mjs';
import {designPages} from '../../src/lib/page-design-model.ts';
import {localTarget} from '../old-design-migration/guard.mjs';
import {pathToFileURL} from 'node:url';

const out='test-results/cinematic-acceptance';await mkdir(out,{recursive:true});
const {browser,context,api}=await localBrowser();
const report={at:new Date().toISOString(),scope:'Isolated local application. Existing records read only; all mutations blocked in the browser. Unsaved selector changes and labelled intercepted failures are discarded. No production operations.',checks:[],issues:[],states:[],blockedWrites:[],captures:[]};
const check=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,...detail&&{detail}});if(!pass)report.issues.push(name);};
const save=()=>writeFile(out+'/conditional.json',JSON.stringify(report,null,2)+'\n');
await context.route('**/api/studio/**',async route=>{if(!['GET','HEAD'].includes(route.request().method())){report.blockedWrites.push(new URL(route.request().url()).pathname);await route.abort();}else await route.continue();});
const entries=(await api('/api/studio/content?view=editor')).entries;
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE));
const client=new pg.Client(localTarget);await client.connect();
let revisions;try{revisions=new Set((await client.query("SELECT entity_key,version FROM rivya_revisions WHERE kind='content'")).rows.map(r=>r.entity_key+':'+r.version));}finally{await client.end();}
const modules=JSON.parse(await readFile('docs/redesign/modern-design-2026-10-13/studio-coverage.json','utf8'));
try{for(const width of [1440,390,320]){
 const page=await context.newPage();await page.setViewportSize({width,height:width<600?844:1000});page.setDefaultTimeout(15000);page.on('dialog',d=>d.accept());page.on('pageerror',e=>report.issues.push('JS '+e.message));
 const go=async path=>{await page.goto(origin+path,{waitUntil:'networkidle',timeout:60000});await page.locator('main h1').first().waitFor();};
 const state=async(name,locator=page.locator('main'))=>{await locator.first().scrollIntoViewIfNeeded();await page.waitForTimeout(100);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);check(width+' '+name+' fits',!overflow);report.states.push({width,name,route:new URL(page.url()).pathname,overflow});};
 const capture=async name=>{const filename=width+'-'+name+'.png';await page.screenshot({path:out+'/'+filename});report.captures.push(filename);};
 const attempt=async(name,fn)=>{try{await fn();}catch(e){report.issues.push(width+' '+name+': '+e.message.split('\n')[0]);}await save();};
 await attempt('product child tabs',async()=>{
  await go('/studio/products');await page.getByRole('searchbox',{name:'Find a piece',exact:true}).fill('River Channel');await page.getByRole('button',{name:/River Channel.*Published/}).first().click();
  await page.getByRole('button',{name:'Open existing product editing controls',exact:true}).click();
  for(const name of ['General Details','Story & Specs','Images & Visuals','Customization Form','Translations','History & Compare']){const tab=page.getByRole('tab',{name,exact:true});await tab.click();check(width+' '+name+' active',await tab.getAttribute('aria-selected')==='true');await state('product '+name,page.getByRole('tabpanel'));}
  await capture('product-history');
 });
 for(const [area,predicate] of [['journal',e=>e.document.kind==='article'],['portfolio',e=>e.document.editorial?.kind==='portfolio'],['testimonials',e=>e.document.editorial?.kind==='testimonial'],['faqs',e=>e.document.editorial?.kind==='faq'],['pages',e=>e.document.kind==='page'&&!e.document.homepage&&!e.document.landing],['landing-pages',e=>e.document.landing]])await attempt(area+' child',async()=>{
  const entry=entries.find(e=>predicate(e)&&revisions.has(e.document.id+':'+e.version))||entries.find(predicate);if(!entry)throw new Error('No existing record for this child view');
  await go('/studio/'+area+'?record='+encodeURIComponent(entry.document.id));await page.locator('#content-field-title').waitFor();await state(area+' existing child',page.locator('[data-studio-part=editor]'));
  const disclosure=page.locator('summary').filter({hasText:'Translations and review'});if(await disclosure.count()){await disclosure.click();for(const language of ['hi','gu']){await page.getByLabel(/^Translation language/).selectOption(language);check(width+' '+area+' '+language+' translation controls',await page.locator('textarea[lang='+language+']').count()>0);await state(area+' '+language+' translation',page.getByLabel(/^Translation language/));}}
  const preview=page.getByRole('link',{name:/Preview saved page/});if(await preview.count()){const href=await preview.getAttribute('href');await go(href);check(width+' '+area+' exact saved preview',await page.locator('[data-saved-content-revision]').count()>0);await state(area+' saved preview');}
 });
 await attempt('page design conditional controls',async()=>{
  await go('/studio/sections');await page.locator('[data-design-version]').waitFor();
  for(const [label,values] of [['Page structure',['reference','current']],['Opening image',['cinematic','split']],['Manifesto',['strip','statement']],['Material film',['','resin-pour']],['Selected pieces',['row','bento']]]){
   const select=page.getByLabel(new RegExp('^'+label)).first();for(const value of values){await select.selectOption(value);check(width+' '+label+' '+value,await select.inputValue()===value);await state(label+' '+value,select);}
  }
  for(const {route,label} of designPages){const group=page.locator('[data-page-design="'+route+'"]');await group.locator(':scope>summary').click();const enabled=group.getByRole('checkbox',{name:'Use reference layout for '+label});if(await enabled.isDisabled()){report.states.push({width,name:label+' intentionally disabled: source unpublished'});continue;}await enabled.check();
   for(const [name,values] of [['Opening layout',['split','full']],['Chapter layout',['numbered','timeline','accordion','alternating']]])for(const value of values){const control=group.getByLabel(new RegExp('^'+name));await control.selectOption(value);check(width+' '+route+' '+name+' '+value,await control.inputValue()===value);await state(route+' '+name+' '+value,control);}
   const styles=group.locator('details').filter({has:page.locator('summary',{hasText:'Individual chapter styles'})});await styles.locator('summary').click();for(const select of await styles.locator('select').all())for(const value of ['','prose','split','reverse','statement']){await select.selectOption(value);check(width+' '+route+' chapter style '+value,await select.inputValue()===value);}await state(route+' chapter styles',styles);
   const bindings=group.locator('details').filter({has:page.locator('summary',{hasText:'Source section bindings'})});if(await bindings.count()){await bindings.locator('summary').click();await state(route+' bindings',bindings);check(width+' '+route+' missing evidence keeps unbound option',await bindings.locator('option[value=""]').count()>0);}
   await group.locator(':scope>summary').click();
  }
  await capture('page-design');
  const workshop=page.locator('details').filter({has:page.locator('summary',{hasText:'Conditional workshop template'})});await workshop.locator(':scope>summary').click();await workshop.getByRole('checkbox',{name:'Prepare workshop template'}).check();for(const value of ['full','split']){await workshop.getByLabel(/^Workshop opening/).selectOption(value);await state('private workshop '+value,workshop);}check(width+' workshop hero stays mandatory',await workshop.locator('input:disabled').count()===1);
 });
 await attempt('authoring state gallery',async()=>{await go('/studio/preview/states');for(const label of ['Loading','Empty','Draft saved','Validation error','Conflict','Session expired','Published; verification needed','Unavailable image','Long content']){await page.getByLabel(/^State/).selectOption({label});check(width+' synthetic '+label+' present',await page.getByRole('heading',{name:label,exact:true}).count()===1);await state('synthetic '+label);}await capture('long-authoring-state');});
 await attempt('real workspace error and recovery',async()=>{
  await page.route('**/api/studio/orders?*',r=>r.fulfill({status:503,json:{error:'Synthetic acceptance unavailable response. No records changed.'}}));await go('/studio/inquiries');await page.getByText('Synthetic acceptance unavailable response.',{exact:false}).waitFor();await state('intercepted unavailable inquiries');
  check(width+' retry remains operable',await page.getByRole('button',{name:'Refresh inquiries',exact:true}).isEnabled());await page.unroute('**/api/studio/orders?*');await page.getByRole('button',{name:'Refresh inquiries',exact:true}).click();await page.getByText('Saved records loaded.',{exact:false}).waitFor();check(width+' inquiry recovery succeeds',true);
  await page.evaluate(()=>window.dispatchEvent(new Event('studio-session-expired')));check(width+' session renewal control',await page.getByRole('button',{name:'Check renewed access',exact:true}).isVisible());await state('session renewal');await capture('session-renewal');
 });
 await attempt('missing linked record',async()=>{await go('/studio/journal?record=qa-nonexistent-record');check(width+' missing record has no editable title',await page.locator('#content-field-title').count()===0);await state('missing linked record');});
 await attempt('unavailable historical preview',async()=>{await go('/studio/preview?record=DB001&version=1');check(width+' unsaved fixture history has safe fallback',await page.getByRole('heading',{name:'This revision cannot be previewed'}).count()===1);await state('unavailable historical fixture revision');});
 await page.close();
}
 const guest=await browser.newContext(),page=await guest.newPage();for(const row of modules){await page.goto(origin+row.route,{waitUntil:'domcontentloaded'});check('anonymous denied '+row.key,new URL(page.url()).pathname==='/studio/login');}
 for(const path of ['/api/studio/workspace','/api/studio/presentation','/api/studio/content?view=editor','/api/studio/media','/api/studio/orders','/api/studio/site-settings']){const response=await page.request.get(origin+path);check('anonymous API denied '+path,[401,403].includes(response.status()));}await guest.close();
}finally{await browser.close();await save();}
console.log(JSON.stringify({checks:report.checks.length,states:report.states.length,issues:report.issues,blockedWrites:report.blockedWrites}));
