import {login,launch,origin,record,fingerprint,preserve,existingRows} from './common.mjs';
import {expect as baseExpect} from '@playwright/test';
const expect=baseExpect.configure({timeout:30000});
import assert from 'node:assert/strict';
const before=await existingRows(),protectedBefore=await fingerprint(),{browser,context}=await launch(await login()),checks=[],errors=[];
// Every write in this suite is intercepted. Protected records never receive a mutation.
await context.route('**/api/studio/**',route=>route.request().method()==='POST'?route.fulfill({status:503,json:{error:'C5 controlled write rejection.'}}):route.continue());
const cases=[
 {name:'homepage',path:'/studio/content?record=page%3Ahome',field:'#content-field-title',save:'Save draft',api:'/api/studio/content',recovery:true},
 {name:'site-copy',path:'/studio/site-copy',field:'#content-field-section-collections',save:'Save draft',api:'/api/studio/content',recovery:true},
 {name:'media',path:'/studio/media',field:'#media-field-alt',save:'Save metadata draft',api:'/api/studio/media',recovery:true,setup:async p=>{await p.locator('button[aria-pressed]').filter({hasText:'DP001'}).first().click();}},
 {name:'site-images',path:'/studio/site-images?record=page%3Ahome',label:'Contextual image description',save:'Save image placements as draft',api:'/api/studio/content',recovery:true},
 {name:'products',path:'/studio/products?record=DP001',label:'Name',save:'Save draft',api:'/api/studio/workspace',recovery:true,setup:async p=>{await p.getByRole('button',{name:'Open existing product editing controls',exact:true}).click();}},
 {name:'navigation',path:'/studio/navigation',label:'English label',save:'Publish navigation & languages',api:'/api/studio/site-settings',committed:/Navigation was published, but saved settings could not refresh/},
 {name:'settings',path:'/studio/settings',field:'input[type=email]',save:'Publish contact details',api:'/api/studio/settings',setup:async p=>{await p.getByRole('button',{name:'Open existing contact editing controls',exact:true}).click();},beforeSave:async p=>{await p.getByRole('button',{name:'Review contact details',exact:true}).click();},committed:/Contact details were published, but saved details could not refresh/},
];
const done=name=>{checks.push(name);record('protected-browser',{checks,errors,complete:false});console.log('PASS '+name);};
try{
 for(const c of cases){
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(c.name+': '+e.message));
  try{
   await page.goto(origin+c.path);if(c.setup)await c.setup(page);const field=c.field?page.locator(c.field).first():page.getByLabel(c.label,{exact:true}).first();await expect(field).toBeVisible();const original=await field.inputValue(),typed=c.name==='settings'?'synthetic-c5@example.invalid':'C5 unsaved '+c.name;
   for(const status of [503,409,401]){
    await field.fill(typed);if(c.beforeSave)await c.beforeSave(page);let posts=0;
    const fault=route=>{if(route.request().method()==='POST'){posts++;return route.fulfill({status,json:{error:'C5 controlled '+status+' rejection.'}});}return route.continue();};
    await page.route('**'+c.api,fault);await page.getByRole('button',{name:c.save,exact:true}).click();await expect(page.getByRole('button',{name:c.save,exact:true})).toBeEnabled();
    if(status===401){await expect(page.getByRole('button',{name:'Check renewed access'})).toBeVisible();}else await expect(page.getByText('C5 controlled '+status+' rejection.',{exact:false}).first()).toBeVisible();await expect(field).toHaveValue(typed);assert.equal(posts,1);done(c.name+' '+status+' retains typed edit and sends one request');await page.unroute('**'+c.api,fault);
    if(c.name==='settings')await page.getByRole('dialog').getByRole('button',{name:'Keep editing',exact:true}).click();
    if(status===401){await page.getByRole('button',{name:'Check renewed access'}).click();await expect(page.getByRole('button',{name:'Check renewed access'})).toHaveCount(0);await expect(field).toHaveValue(typed);}
   }
   if(c.recovery){
    await page.getByRole('button',{name:'Load latest saved version',exact:true}).click();
    const unavailable=route=>route.request().method()==='GET'?route.fulfill({status:503,json:{error:'C5 reload unavailable.'}}):route.continue();await page.route('**'+c.api+'**',unavailable);await page.getByRole('button',{name:'Replace editor with latest saved',exact:true}).click();await expect(page.getByText('C5 reload unavailable.',{exact:false}).first()).toBeVisible();await expect(field).toHaveValue(typed);await expect(page.getByLabel('Local draft — select and copy')).toContainText(typed);done(c.name+' failed reload retains editable value and copyable draft');await page.unroute('**'+c.api+'**',unavailable);
    await page.getByRole('button',{name:'Replace editor with latest saved',exact:true}).click();await expect(field).toHaveValue(original);done(c.name+' explicit reload recovers real saved record');
   }
   if(['media','products','navigation','settings'].includes(c.name)){
    await field.fill(typed);if(c.beforeSave)await c.beforeSave(page);
    const simulate=route=>route.request().method()==='POST'?route.fulfill({status:200,json:{saved:true,version:999}}):route.fulfill({status:503,json:{error:'C5 post-commit refresh unavailable.'}});
    await page.route('**'+c.api+'**',simulate);await page.getByRole('button',{name:c.save,exact:true}).click();await expect(page.getByText(c.committed||/changes were saved, but the saved record could not refresh/).first()).toBeVisible();done(c.name+' simulated committed save plus failed refresh has explicit do-not-repeat message');await page.unroute('**'+c.api+'**',simulate);
   }
  }catch(e){errors.push(c.name+': '+e.message.slice(0,1100));console.log('FAIL '+c.name+' '+e.message.slice(0,200));}
  finally{await page.close();record('protected-browser',{checks,errors,complete:false});}
 }
 assert.deepEqual(errors,[]);await preserve(before,protectedBefore);done('All protected and pre-existing records unchanged; every browser POST was intercepted');record('protected-browser',{checkedAt:new Date().toISOString(),checks,errors,complete:true,actualWrites:0});
}finally{await browser.close();}
