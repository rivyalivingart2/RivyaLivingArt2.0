import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {expect} from '@playwright/test';
import {localBrowser,origin} from './local-browser.mjs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
import {referenceSectionStates} from '../../src/lib/home-reference-model.ts';
const {browser,context,api}=await localBrowser(),output='test-results/old-design-migration';
const report={at:new Date().toISOString(),candidate:candidateFingerprint(),scope:'M4 homepage section adapter only',completed:false,checks:[],browserErrors:[],human:false,physicalDevice:false};
const check=(name,details={})=>{report.checks.push({name,passed:true,...details});console.log('Passed: '+name);};
try{
 const page=await context.newPage(),preview=await context.newPage(),publicPage=await context.newPage();for(const p of [page,preview,publicPage])p.on('pageerror',e=>report.browserErrors.push(e.message.slice(0,180)));
 await publicPage.goto(origin+'/',{waitUntil:'networkidle'});const publicBefore=await publicPage.locator('[data-presentation-revision]').getAttribute('data-presentation-revision');
 const originalHeading=await publicPage.locator('h1').innerText(),originalSelections=await publicPage.locator('#selected article a[href^="/pieces/"]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')));
 await page.goto(origin+'/studio/sections',{waitUntil:'networkidle'});await expect(page.locator('[data-design-version]')).toBeVisible();
 const saveDraft=async()=>{const next=Number(await page.locator('[data-design-version]').innerText())+1;await page.getByRole('button',{name:'Save design draft',exact:true}).click();await expect(page.locator('[data-design-version]')).toHaveText(String(next));await expect(page.getByRole('button',{name:'Save design draft',exact:true})).toBeEnabled();};
 await page.getByRole('combobox',{name:'Page structure',exact:true}).selectOption('reference');
 await page.getByRole('combobox',{name:'Manifesto',exact:true}).selectOption('statement');await page.getByRole('combobox',{name:'Selected pieces',exact:true}).selectOption('bento');
 assert.equal(await page.getByRole('checkbox').count(),18);assert.equal(await page.getByRole('checkbox',{name:/^Hero /}).isDisabled(),true);
 assert.equal(await page.getByRole('checkbox',{name:/^Furniture concepts /}).isChecked(),false);assert.equal(await page.getByRole('checkbox',{name:/^Room concepts /}).isChecked(),false);
 check('Studio exposes all 18 source slots with fixed hero and separate default-off furniture/room controls');
 await saveDraft();
 let entry=(await api('/api/studio/presentation')).entry;const saved=entry.version,states=referenceSectionStates(entry.document.home,entry.document.reference,entry.document.layout.composition);
 assert.equal(entry.document.reference.pages.length,3);assert.deepEqual(entry.document.reference.issues,[]);
 await preview.goto(origin+'/studio/presentation/preview?version='+saved,{waitUntil:'networkidle'});
 const rendered=await preview.locator('[data-home-slot]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-home-slot')));assert.deepEqual(rendered,states.filter(s=>s.visible).map(s=>s.key));
 assert.equal(await preview.locator('h1').innerText(),originalHeading);assert.deepEqual(await preview.locator('#selected article a[href^="/pieces/"]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href'))),originalSelections);
 for(const key of ['work','words','workshops','print','furniture','rooms','journal'])assert.equal(rendered.includes(key),false);
 await expect(preview.getByRole('heading',{name:'Sections waiting for content'})).toBeVisible();check('Saved preview follows source order with exact current text/selections; unbound sections are explained privately',{rendered});
 await page.getByRole('checkbox',{name:/^Large format /}).uncheck();await saveDraft();entry=(await api('/api/studio/presentation')).entry;
 await preview.reload({waitUntil:'networkidle'});assert.equal(await preview.locator('[data-home-slot="large-format"]').count(),1);
 await publicPage.reload({waitUntil:'networkidle'});assert.equal(await publicPage.locator('[data-presentation-revision]').getAttribute('data-presentation-revision'),publicBefore);
 check('Changing section visibility leaves the previous saved preview and public design unchanged');
 await preview.goto(origin+'/studio/presentation/preview?version='+entry.version,{waitUntil:'networkidle'});assert.equal(await preview.locator('[data-home-slot="large-format"]').count(),0);
 await page.getByRole('checkbox',{name:/^Large format /}).check();await saveDraft();entry=(await api('/api/studio/presentation')).entry;
 await page.getByRole('button',{name:'Publish saved design',exact:true}).click();await expect(page.getByText('Public page confirmed design revision '+(entry.version+1)+'.',{exact:true})).toBeVisible();
 await publicPage.reload({waitUntil:'networkidle'});assert.deepEqual(await publicPage.locator('[data-home-slot]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-home-slot'))),rendered);assert.equal(await publicPage.getByRole('heading',{name:'Sections waiting for content'}).count(),0);
 check('Studio publishes the section composition; public readback matches and omits private dependency explanations');
 for(const width of [320,390,800,1440]){
  await publicPage.setViewportSize({width,height:width<700?844:1000});await publicPage.reload({waitUntil:'networkidle'});await publicPage.evaluate(()=>window.scrollTo(0,0));
  assert.equal(await publicPage.locator('h1').count(),1);assert.equal(await publicPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  if(width===390||width===1440){await publicPage.screenshot({path:output+'/screenshots/m4-home-'+width+'.png'});await publicPage.locator('#home-manifesto').evaluate(node=>window.scrollTo(0,node.getBoundingClientRect().top+scrollY-100));await publicPage.screenshot({path:output+'/screenshots/m4-manifesto-'+width+'.png'});}
 }
 check('Actual public homepage has one H1 and no overflow at four viewports');
 const links=publicPage.getByRole('navigation',{name:'On this page',exact:true}).locator('a');assert.equal(await links.count(),rendered.length);for(const link of await links.all()){assert.equal(await publicPage.locator(await link.getAttribute('href')).count(),1);}
 await links.nth(3).focus();await publicPage.keyboard.press('Enter');assert.equal(new URL(publicPage.url()).hash,'#home-large-format');check('Progress links resolve only to visible sections and work with keyboard activation');
 await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.screenshot({path:output+'/screenshots/m4-section-editor-mobile.png'});
 assert.deepEqual(report.browserErrors,[]);check('Section editor fits mobile and the browser reports no runtime errors');report.completed=true;
}finally{await browser.close();writeFileSync(output+'/m4-home-workflow.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({checks:report.checks.length,completed:report.completed}));
