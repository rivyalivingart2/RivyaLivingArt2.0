import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {writeFile,readFile} from 'node:fs/promises';
import {localBrowser,origin} from './redesign-phase6-session.mjs';
import {orderStages} from '../src/lib/studio-orders.ts';
const out='output/redesign-phase6/lifecycle.json';
let prior;try{prior=JSON.parse(await readFile(out,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
assert.ok(!prior?.staff,'Staff permission check already attempted; inspect receipt before repeating');
assert.ok(!prior?.fixture||prior.fixture.status==='CLOSED','Resume an incomplete order manually; do not duplicate it');
const {browser,context,api}=await localBrowser();
const report=prior??{scope:'New explicitly fictional local order and temporary editor account only. No original records changed, no messages sent.',checks:[],fixture:null,staff:null};
const check=(name,ok)=>{assert.ok(ok,name);report.checks.push(name);};
const suffix=randomUUID().slice(0,8),client='PHASE 6 QA '+suffix+' — fictional customer',title='Synthetic workflow check only; never contact or fulfil.';
let account;
try{
 let order=report.fixture;
 if(!order){
 const p=await context.newPage();await p.goto(origin+'/studio/inquiries',{waitUntil:'networkidle'});await p.getByRole('button',{name:'Add staff-entered order',exact:true}).click();await p.getByLabel('Customer-supplied name',{exact:true}).fill(client);await p.getByLabel('Brief',{exact:true}).fill(title);await p.getByRole('button',{name:'Review details',exact:true}).click();
 const created=p.waitForResponse(r=>r.url()===origin+'/api/studio/orders'&&r.request().method()==='POST');await p.getByRole('button',{name:'Save staff-entered order',exact:true}).click();const response=await created;check('Browser creates only new fictional manual QA order',response.status()===201);order=(await response.json()).order;report.fixture={id:order.id,version:order.version,status:order.status};await writeFile(out,JSON.stringify(report,null,2));
 await p.locator('dialog[open]').waitFor({state:'detached'});
 const seen=[order.status];for(const status of orderStages.slice(1)){
  const row=p.locator('tr').filter({has:p.locator('[data-inquiry-record="'+order.id+'"]')});await row.locator('select').waitFor();const stageResponse=p.waitForResponse(r=>r.url()===origin+'/api/studio/orders'&&r.request().method()==='POST');await row.locator('select').selectOption(status);
  if(status==='CLOSED'){await p.getByRole('heading',{name:'Explain this stage change',exact:true}).waitFor();check('Closing requires explicit reason',await p.getByRole('button',{name:'Save stage change',exact:true}).isDisabled());await p.getByLabel('Reason',{exact:true}).fill('Synthetic QA workflow completed; never contact or fulfil.');await p.getByRole('button',{name:'Save stage change',exact:true}).click();}
  await stageResponse;await p.getByText('Stage saved to history.',{exact:true}).waitFor();order=(await api('/api/studio/orders')).orders.find(o=>o.id===order.id);check('Stage persisted '+status,order.status===status);seen.push(status);report.fixture={id:order.id,version:order.version,status:order.status};await writeFile(out,JSON.stringify(report,null,2));
 }
 check('All eight stages exercised through real UI',seen.length===8);
 const stale=await p.evaluate(async id=>(await fetch('/api/studio/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'move',id,status:'NEW',version:1,reason:'Stale synthetic request should be rejected'})})).status,order.id);check('Stale stage update rejected',stale===409);
 const saved=await api('/api/studio/workspace?view=inquiry&id='+order.id);check('Stage history retains all workflow steps',saved.events.length===8);check('Synthetic order ends closed',saved.manual.status==='CLOSED');
 await p.goto(origin+'/studio/inquiries?record='+order.id,{waitUntil:'networkidle'});await p.getByLabel('Customer-supplied name',{exact:true}).waitFor();await p.screenshot({path:'output/playwright/redesign-phase6/1440-qa-closed-record.png'});await p.close();
 }
 const login='phase6.qa.'+suffix,password=randomUUID()+randomUUID();await api('/api/studio/workspace',{action:'staff',login,name:'Phase 6 isolated permission check',role:'editor',active:true,version:0,password});account=(await api('/api/studio/workspace')).staff.find(s=>s.login===login);assert.ok(account);report.staff={id:account.id,active:true};await writeFile(out,JSON.stringify(report,null,2));
 const editor=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),ep=await editor.newPage();await ep.goto(origin+'/studio/login',{waitUntil:'networkidle'});await ep.getByLabel('Staff ID',{exact:true}).fill(login);await ep.getByLabel('Password',{exact:true}).fill(password);await ep.getByRole('button',{name:'Sign in',exact:true}).click();await ep.waitForURL(origin+'/studio');await ep.locator('main h1').waitFor();
 check('Real local editor sign-in succeeds',!ep.url().includes('/login'));check('Admin navigation hidden for editor',await ep.getByRole('link',{name:'Staff access',exact:true}).count()===0);
 for(const path of ['/api/studio/settings','/api/studio/operations?view=exports','/api/studio/site-settings']){const status=await ep.evaluate(async path=>(await fetch(path)).status,path);check('Editor denied '+path,status===403);}
 const editorOrders=await ep.evaluate(async()=>await(await fetch('/api/studio/orders')).json());check('Manual order not exposed to editor',!editorOrders.orders.some(o=>o.id===order.id));
 const denied=await ep.goto(origin+'/studio/staff',{waitUntil:'networkidle'});check('Admin page unavailable to editor',denied.status()===404);await ep.screenshot({path:'output/playwright/redesign-phase6/1440-editor-permission.png'});await editor.close();
}finally{
 if(account){const current=(await api('/api/studio/workspace')).staff.find(s=>s.id===account.id);await api('/api/studio/workspace',{action:'staff',...current,active:false,password:''});const final=(await api('/api/studio/workspace')).staff.find(s=>s.id===account.id);report.staff={id:final.id,active:final.active,version:final.version};check('Temporary QA editor disabled after permission check',!final.active);}
 await browser.close();await writeFile(out,JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({checks:report.checks.length,orderClosed:report.fixture?.status==='CLOSED',qaEditorDisabled:report.staff?.active===false}));
