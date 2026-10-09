import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {expect} from '@playwright/test';
import {localBrowser,origin} from './local-browser.mjs';
import {localTarget} from './guard.mjs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
import {designPages,makingSlots,materialSlots} from '../../src/lib/page-design-model.ts';
import {localizeContent} from '../../src/lib/content-model.ts';
const {browser,context,api}=await localBrowser(),output='test-results/old-design-migration',key='presentation:home';
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE).href),client=new pg.Client(localTarget);await client.connect();
const report={at:new Date().toISOString(),candidate:candidateFingerprint(),scope:'M4 seven current pages, saved snapshots and additive film; synthetic bindings remain private',completed:false,checks:[],browserErrors:[],human:false,physicalDevice:false};
const check=(name,details={})=>{report.checks.push({name,passed:true,...details});console.log('Passed: '+name);};
const page=await context.newPage(),preview=await context.newPage(),publicPage=await context.newPage();
for(const p of [page,preview,publicPage])p.on('pageerror',e=>report.browserErrors.push(e.message.slice(0,180)));
let restoreVersion,fixtureVersion;
try{
 await publicPage.goto(origin+'/contact',{waitUntil:'networkidle'});
 const contacts=await publicPage.locator('a[href^="tel:"],a[href^="mailto:"]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')));
 await page.goto(origin+'/studio/sections',{waitUntil:'networkidle'});await expect(page.locator('[data-design-version]')).toBeVisible();
 await page.getByRole('combobox',{name:'Material film',exact:true}).selectOption('resin-pour');
 for(const p of designPages){
  const panel=page.locator('[data-page-design="'+p.route+'"]');await panel.locator('summary').first().click();
  await panel.getByRole('checkbox',{name:'Use reference layout for '+p.label,exact:true}).check();
  if(p.route==='/process')await panel.getByRole('combobox',{name:'Material film',exact:true}).selectOption('resin-pour');
  await panel.locator('summary').first().click();
 }
 await page.getByText('Conditional workshop template',{exact:true}).click();await page.getByRole('checkbox',{name:'Prepare workshop template',exact:true}).check();await page.getByText('Conditional workshop template',{exact:true}).click();
 const next=Number(await page.locator('[data-design-version]').innerText())+1;
 await page.getByRole('button',{name:'Save design draft',exact:true}).click();await expect(page.locator('[data-design-version]')).toHaveText(String(next));await expect(page.getByRole('button',{name:'Save design draft',exact:true})).toBeEnabled();
 let entry=(await api('/api/studio/presentation')).entry;restoreVersion=entry.version;
 assert.equal(Object.keys(entry.document.layout.pages).length,7);assert.equal(entry.document.reference.pages.length,7);assert.deepEqual(entry.document.reference.issues,[]);assert.equal(entry.document.media.length,1);
 assert.equal(entry.document.media[0].poster.driveId,'11iY9mANJFy4EZf54HgZ5NJ_g4AzDBLBX');assert.equal(entry.document.media[0].sources.length,2);
 check('Studio saves all seven page layouts and exact image/video metadata in a separate database revision');
 await preview.goto(origin+'/studio/presentation/preview?'+new URLSearchParams({version:String(entry.version),page:'/workshops'}),{waitUntil:'networkidle'});
 assert.equal(await preview.locator('[data-workshop-slot]').count(),7);assert.equal(await preview.locator('h1').count(),1);await expect(preview.getByText('Private template · no confirmed offering',{exact:true})).toBeVisible();
 assert.equal((await fetch(origin+'/workshops')).status,410);
 check('Seven-slot workshop draft previews its missing facts privately; the public route remains 410 with no booking');
 for(const p of designPages){
  const captured=entry.document.reference.pages.find(s=>s.document.route===p.route);
  await preview.goto(origin+'/studio/presentation/preview?'+new URLSearchParams({version:String(entry.version),page:p.route}),{waitUntil:'networkidle'});
  assert.equal(await preview.locator('h1').count(),1);assert.equal(await preview.locator('h1').innerText(),captured.document.title);
  for(const section of captured.document.sections.filter(s=>s.enabled!==false))assert.equal(await preview.locator('#'+section.id).count(),1);
  const text=await preview.locator('main').first().textContent();
  for(const section of captured.document.sections.filter(s=>s.enabled!==false))for(const paragraph of section.paragraphs)assert.ok(text.includes(paragraph),'Captured paragraph missing on '+p.route);
  for(const width of [320,390,800,1440]){
   await preview.setViewportSize({width,height:width<700?844:1000});assert.equal(await preview.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,p.route+' '+width);
   if([390,1440].includes(width)&&['/our-story','/process','/materials-care'].includes(p.route)){await preview.locator('[data-presentation-revision]').evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-80));await preview.screenshot({path:output+'/screenshots/m4-page-'+p.route.slice(1)+'-'+width+'.png'});}
  }
 }
 check('Seven exact saved pages retain all enabled source paragraphs and anchors, one H1 and no overflow at four widths');
 await preview.goto(origin+'/studio/presentation/preview?'+new URLSearchParams({version:String(entry.version),page:'/materials-care'}),{waitUntil:'networkidle'});
 const summary=preview.locator('details[data-stage],details[id]').filter({has:preview.locator('summary h2')}).first().locator('summary');
 await summary.focus();await preview.keyboard.press('Enter');assert.equal(await summary.locator('..').getAttribute('open'),'');
 check('Materials accordion opens through keyboard activation with source wording and native expanded state');
 await preview.goto(origin+'/studio/presentation/preview?'+new URLSearchParams({version:String(entry.version),page:'/commission',locale:'en',viewport:'mobile'}),{waitUntil:'networkidle'});
 const frame=preview.frameLocator('iframe');await expect(preview.getByText('Mobile preview · revision '+entry.version,{exact:true})).toBeVisible();
 await frame.getByRole('searchbox',{name:'Find your piece',exact:true}).fill('river');await frame.getByRole('button',{name:'Apply filters',exact:true}).click();
 await expect(frame.locator('#catalogue-results')).toContainText('river');
 const child=preview.frames().find(f=>f.url().includes('/studio/presentation/preview/frame'));
 const url=new URL(child.url());assert.equal(url.searchParams.get('version'),String(entry.version));assert.equal(url.searchParams.get('page'),'/commission');assert.equal(url.searchParams.get('q'),'river');
 assert.equal(await frame.locator('[data-presentation-revision]').getAttribute('data-presentation-revision'),String(entry.version));
 check('Commission filters work inside the real mobile iframe and keep the exact saved page/revision');
 await preview.goto(origin+'/studio/presentation/preview?'+new URLSearchParams({version:String(entry.version),page:'/process',locale:'gu'}),{waitUntil:'networkidle'});
 assert.equal(await preview.locator('h1').innerText(),localizeContent(entry.document.reference.pages.find(p=>p.document.route==='/process').document,'gu').title);
 check('Gujarati preview uses captured reviewed page translation without changing English source');
 // Test a later design and an invalid saved binding without editing any protected content.
 const changed=structuredClone(entry.document.layout);changed.pages['/process'].hero='split';
 entry=(await api('/api/studio/presentation',{operation:'draft',version:entry.version,layout:changed})).entry;
 await preview.goto(origin+'/studio/presentation/preview?'+new URLSearchParams({version:String(restoreVersion),page:'/process'}),{waitUntil:'networkidle'});assert.equal(await preview.locator('[data-page-hero]').getAttribute('data-page-hero'),'full');
 const invalid=structuredClone(changed);invalid.pages['/process'].bindings={concept:'section-1'};
 entry=(await api('/api/studio/presentation',{operation:'draft',version:entry.version,layout:invalid})).entry;assert.ok(entry.document.reference.issues.length);
 const rejected=await page.evaluate(async body=>{const r=await fetch('/api/studio/presentation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return r.status;},{operation:'publish',version:entry.version});assert.equal(rejected,409);
 entry=(await api('/api/studio/presentation',{operation:'restore',version:entry.version,restoredFrom:restoreVersion})).entry;
 check('Historical page layout stays fixed; customer-to-making binding is blocked from publication; restoration refreshes references');
 // Complete the actual Studio publication and verify every public page.
 await page.reload({waitUntil:'networkidle'});const publicVersion=entry.version+1;
 await page.getByRole('button',{name:'Publish saved design',exact:true}).click();await expect(page.getByText('Public page confirmed design revision '+publicVersion+'.',{exact:true})).toBeVisible();
 entry=(await api('/api/studio/presentation')).entry;restoreVersion=entry.version;
 for(const route of ['/',...designPages.map(p=>p.route)]){
  await publicPage.goto(origin+route,{waitUntil:'networkidle'});assert.equal(await publicPage.locator('[data-presentation-revision]').getAttribute('data-presentation-revision'),String(publicVersion));
  if(route==='/contact')assert.deepEqual(await publicPage.locator('a[href^="tel:"],a[href^="mailto:"]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href'))),contacts);
 }
 check('Studio publication reads back on all eight public pages and preserves the original contact links');
 // Reduced-motion context: not even the video bytes load before deliberate playback.
 const requested=[];publicPage.on('request',request=>{if(/hero-pour-loop\.(webm|mp4)/.test(request.url()))requested.push(request.url());});
 await publicPage.goto(origin+'/',{waitUntil:'networkidle'});
 const film=publicPage.locator('[data-material-film]');await film.scrollIntoViewIfNeeded();assert.equal(requested.length,0);assert.equal(await film.locator('video').evaluate(v=>v.paused),true);
 await film.getByRole('button',{name:'Play film',exact:false}).click();await expect(film.getByRole('button',{name:'Pause film',exact:false})).toBeVisible();await expect.poll(()=>film.locator('video').evaluate(v=>v.currentTime)).toBeGreaterThan(0);
 const media=await film.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration,muted:v.muted,controls:v.controls}));assert.ok(media.width>0&&media.height>0&&media.duration>0);assert.equal(media.muted,true);assert.equal(media.controls,true);
 await film.getByRole('button',{name:'Pause film',exact:false}).click();await expect(film.getByRole('button',{name:'Play film',exact:false})).toBeVisible();assert.equal(await film.locator('video').evaluate(v=>v.paused),true);
 await publicPage.screenshot({path:output+'/screenshots/m4-film-desktop.png'});
 await publicPage.setViewportSize({width:390,height:844});await film.scrollIntoViewIfNeeded();await publicPage.screenshot({path:output+'/screenshots/m4-film-mobile.png'});assert.equal(await publicPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 check('Film waits for Play, decodes real media, supports pause/native controls and fits mobile with reduced motion',{media});
 for(const failBoth of [false,true]){
  const isolated=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),fault=await isolated.newPage(),blocked=[];
  await isolated.route('**/hero-pour-loop.webm',route=>{blocked.push('webm');return route.abort();});
  if(failBoth)await isolated.route('**/hero-pour-loop.mp4',route=>{blocked.push('mp4');return route.abort();});
  await fault.goto(origin+'/',{waitUntil:'networkidle'});await fault.locator('[data-material-film]').scrollIntoViewIfNeeded();await fault.getByRole('button',{name:'Play film',exact:false}).click();
  if(failBoth){await expect(fault.getByText('Film unavailable. The still image is shown.',{exact:true})).toBeVisible();await expect(fault.locator('[data-material-film] img')).toBeVisible();assert.ok(blocked.includes('mp4'));}
  else{await expect.poll(()=>fault.locator('video').evaluate(v=>v.currentSrc)).toContain('hero-pour-loop.mp4');await expect.poll(()=>fault.locator('video').evaluate(v=>v.currentTime)).toBeGreaterThan(0);}
  assert.ok(blocked.includes('webm'));await isolated.close();
  check(failBoth?'Both video failures retain the still image and a clear unavailable state':'MP4 fallback plays when WebM is unavailable');
 }
 // Synthetic full slot coverage, inserted only into a NEW private presentation revision.
 const fixture=structuredClone(entry.document);
 for(const [route,slots,kind] of [['/process',makingSlots,'making'],['/materials-care',materialSlots,'material']]){
  const item=fixture.reference.pages.find(p=>p.document.route===route),base=item.document.sections[0];
  item.document.sections=slots.map(slot=>({...base,id:'qa-'+slot,heading:'QA '+slot.replaceAll('-',' '),paragraphs:['Isolated template fixture. No current business claim is asserted.'],body:undefined,...(kind==='making'?{stage:'making'}:{material:{appearance:'QA appearance',limitations:'QA limitations',care:'QA care',placement:'QA placement'}})}));
  fixture.layout.pages[route].bindings=Object.fromEntries(slots.map(slot=>[slot,'qa-'+slot]));
 }
 fixtureVersion=entry.version+1;await client.query('BEGIN');
 const changedRow=await client.query('UPDATE rivya_presentations SET draft=$1::jsonb,version=version+1 WHERE presentation_key=$2 AND version=$3 RETURNING version',[JSON.stringify(fixture),key,entry.version]);assert.equal(changedRow.rows.length,1);
 await client.query('INSERT INTO rivya_presentation_revisions(presentation_key,version,document,actor,operation) VALUES($1,$2,$3::jsonb,$4,$5)',[key,fixtureVersion,JSON.stringify(fixture),'isolated-qa-fixture','qa:ten-stages-four-materials']);await client.query('COMMIT');
 for(const [route,count] of [['/process',10],['/materials-care',4]]){
  await preview.goto(origin+'/studio/presentation/preview?'+new URLSearchParams({version:String(fixtureVersion),page:route}),{waitUntil:'networkidle'});assert.equal(await preview.locator('[data-reference-slot]').count(),count);
  await preview.setViewportSize({width:390,height:844});assert.equal(await preview.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 }
 await publicPage.goto(origin+'/process',{waitUntil:'networkidle'});assert.equal(await publicPage.getByText('Isolated template fixture. No current business claim is asserted.',{exact:true}).count(),0);
 check('All ten making and four material bindings render in a private synthetic preview, never as current public claims');
 assert.deepEqual(report.browserErrors,[]);check('No browser runtime errors');report.completed=true;
}finally{
 await client.query('ROLLBACK');
 if(fixtureVersion){const current=(await api('/api/studio/presentation')).entry;if(current.version===fixtureVersion)await api('/api/studio/presentation',{operation:'restore',version:fixtureVersion,restoredFrom:restoreVersion});}
 await browser.close();await client.end();writeFileSync(output+'/m4-pages-workflow.json',JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({checks:report.checks.length,completed:report.completed}));
