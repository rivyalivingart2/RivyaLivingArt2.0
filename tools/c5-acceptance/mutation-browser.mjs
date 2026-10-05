import {launch,origin,request,output,record} from './common.mjs';
import {expect as baseExpect} from '@playwright/test';
const expect=baseExpect.configure({timeout:30000});
import assert from 'node:assert/strict';

export async function browserAcceptance({admin,editor,inquiryId,pageId,pageRoute,prefix,pass}){
 const {browser,context,page}=await launch(admin),checks=[],errors=[];
 const resultName=process.argv.includes('--inquiries-only')?'inquiry-browser':'mutation-browser';
 const done=name=>{pass(name);checks.push(name);record(resultName,{checks,errors,complete:false});};
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('**/api/studio/**',route=>{
  if(route.request().method()!=='POST')return route.continue();
  const body=route.request().postDataJSON();
  if(body.document?.id===pageId||body.id===inquiryId)return route.continue();
  return route.fulfill({status:503,json:{error:'C5 protected-record mutation blocked by test harness.'}});
 });
 const editorPath='/studio/content?record='+encodeURIComponent(pageId);
 const title=page.locator('#content-field-title');
 const savedPage=async()=>(await request(admin,'/api/studio/content?record='+encodeURIComponent(pageId))).data.entries.find(e=>e.document.id===pageId);
 try{
  if(!process.argv.includes('--inquiries-only')){
  await page.goto(origin+editorPath);await expect(title).toBeVisible();const savedTitle=await title.inputValue();
  for(const mode of ['503','409','401-html','network','truncated']){
   const typed=prefix+' retained '+mode;await title.fill(typed);let posts=0;
   const fault=async route=>{if(route.request().method()!=='POST')return route.continue();posts++;if(mode==='network')return route.abort('failed');if(mode==='401-html'||mode==='truncated')return route.fulfill({status:mode==='401-html'?401:200,contentType:mode==='401-html'?'text/html':'application/json',body:mode==='401-html'?'<h1>Expired</h1>':'{'});return route.fulfill({status:Number(mode),json:{error:'C5 simulated '+mode+' write failure.'}});};
   await page.route('**/api/studio/content',fault);await page.getByRole('button',{name:'Save draft',exact:true}).click();
   await expect(page.getByRole('button',{name:'Save draft',exact:true})).toBeEnabled();
   if(mode==='401-html'){await expect(page.getByRole('button',{name:'Check renewed access'})).toBeVisible();await page.getByRole('button',{name:'Check renewed access'}).click();await expect(page.getByRole('button',{name:'Check renewed access'})).toHaveCount(0);}
   else await expect(page.locator('#main-content')).toContainText(mode==='network'?'connection was interrupted':mode==='truncated'?'response was interrupted':'C5 simulated '+mode);
   await expect(title).toHaveValue(typed);assert.equal(posts,1);done('Content '+mode+' retains edits with no automatic retry');await page.unroute('**/api/studio/content',fault);
  }
  await page.getByRole('button',{name:'Show local draft for copying'}).click();await expect(page.getByLabel('Local draft — select and copy')).toContainText(prefix+' retained truncated');
  await page.getByRole('button',{name:'Load latest saved version',exact:true}).click();await page.getByRole('button',{name:'Keep my edits',exact:true}).click();await expect(title).toHaveValue(prefix+' retained truncated');done('Conflict copy and cancel preserve the entire local draft');
  const unavailable=route=>route.fulfill({status:200,json:{entries:[]}});await page.route('**/api/studio/content?*',unavailable);
  await page.getByRole('button',{name:'Load latest saved version',exact:true}).click();await page.getByRole('button',{name:'Replace editor with latest saved',exact:true}).click();await expect(page.getByText('Saved page is unavailable. Your local draft is retained.')).toBeVisible();await expect(title).toHaveValue(prefix+' retained truncated');done('Missing saved record cannot erase the local draft');await page.unroute('**/api/studio/content?*',unavailable);
  await page.getByRole('button',{name:'Replace editor with latest saved',exact:true}).click();await expect(title).toHaveValue(savedTitle);done('Explicit reload recovers latest saved record');
  await title.fill(prefix+' local draft for navigation');
  await page.getByRole('button',{name:'New custom page',exact:true}).click();await expect(page.getByRole('dialog',{name:'Keep your unsaved edits?'})).toBeVisible();await page.getByRole('dialog').getByRole('button',{name:'Keep editing',exact:true}).click();await expect(title).toHaveValue(prefix+' local draft for navigation');done('Record-switch dialog cancel retains content and returns control');
  const dialog=page.waitForEvent('dialog');const nav=page.locator('nav a[href="/studio/media"]').first().click();const prompt=await dialog;assert.match(prompt.message(),/unsaved|discard/i);await prompt.dismiss();await nav;await expect(title).toHaveValue(prefix+' local draft for navigation');done('Native navigation cancel retains dirty content');
  await title.fill(prefix+' browser saved revision');const saving=page.waitForResponse(r=>r.url().endsWith('/api/studio/content')&&r.request().method()==='POST');await page.getByRole('button',{name:'Save draft',exact:true}).click();assert.equal((await saving).status(),200);await expect(page.getByRole('link',{name:'Preview saved page ↗',exact:true})).toBeVisible();let current=await savedPage();const draftVersion=current.version;
  const [preview]=await Promise.all([context.waitForEvent('page'),page.getByRole('link',{name:'Preview saved page ↗',exact:true}).click()]);await preview.waitForLoadState('domcontentloaded',{timeout:30000});await expect(preview.locator('[data-content-revision="'+draftVersion+'"]')).toBeVisible();await preview.close();done('Browser saved preview renders the exact server-saved revision');
  let publishCount=0;page.on('request',r=>{if(r.method()==='POST'&&r.url().endsWith('/api/studio/content')&&r.postDataJSON()?.operation==='publish')publishCount++;});
  const verifyFault=route=>route.fulfill({status:503,body:'Unavailable'});await page.route('**'+pageRoute+'?verify=*',verifyFault);await page.getByRole('button',{name:'Publish this revision',exact:true}).click();await expect(page.getByText('Published; verification needs attention.',{exact:false})).toBeVisible();done('Committed publication is distinguished from failed public verification');await page.unroute('**'+pageRoute+'?verify=*',verifyFault);
  await page.getByRole('button',{name:'Retry public verification',exact:true}).click();await expect(page.getByText('Published and verified:',{exact:false})).toBeVisible();assert.equal(publishCount,1);done('Public verification retries without duplicate publication');
  current=await savedPage();const originalPublic=current.version;
  await title.fill(prefix+' later browser draft');await page.getByRole('button',{name:'Save draft',exact:true}).click();await expect(page.getByRole('link',{name:'Preview saved page ↗',exact:true})).toBeVisible();assert.ok((await(await fetch(origin+pageRoute)).text()).includes('data-content-revision="'+originalPublic+'"'));
  await page.getByText('Saved revision history',{exact:true}).click();await page.getByRole('button',{name:'Load recent revisions',exact:true}).click();const compare=page.getByText('Compare version '+originalPublic+' with current draft',{exact:true});await expect(compare).toBeVisible();await compare.click();await expect(compare.locator('..')).toContainText(prefix+' later browser draft');
  const revision=page.locator('div').filter({has:page.getByRole('link',{name:'Preview saved revision '+originalPublic+' ↗',exact:true})}).filter({has:page.getByRole('button',{name:'Restore to draft',exact:true})}).last();await revision.getByRole('button',{name:'Restore to draft',exact:true}).click();await page.getByRole('button',{name:'Use version '+originalPublic+' in draft',exact:true}).click();await expect(title).toHaveValue(prefix+' browser saved revision');await expect(page.getByRole('button',{name:'Publish this revision',exact:true})).toBeDisabled();done('Revision comparison and restoration create an unsaved draft without publishing');
  await page.getByRole('button',{name:'Save draft',exact:true}).click();await expect(page.getByRole('button',{name:'Publish this revision',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Publish this revision',exact:true}).click();await expect(page.getByText('Published and verified:',{exact:false})).toBeVisible();done('Recovered draft saves and publishes as a new verified revision');
  await page.screenshot({path:output+'/publishing-recovery.png',fullPage:false});
  record('publishing-browser',{checkedAt:new Date().toISOString(),checks:[...checks],errors:[...errors],complete:true});
  }
  await page.goto(origin+'/studio/inquiries?mode=list&q='+prefix);await page.locator('[data-inquiry-record="'+inquiryId+'"]').first().click();const note=page.getByRole('textbox',{name:'Add a private note',exact:true});await expect(note).toBeVisible();await note.fill(prefix+' unsaved note');
  const closePrompt=page.waitForEvent('dialog');const closeClick=page.getByRole('button',{name:'Return to inquiry list',exact:true}).click();const close=await closePrompt;assert.match(close.message(),/discard unsaved edits/i);await close.dismiss();await closeClick;await expect(note).toHaveValue(prefix+' unsaved note');done('Native inquiry-close cancel preserves unsaved note');
  const block=route=>route.request().method()==='POST'?route.fulfill({status:503,json:{error:'C5 simulated note failure.'}}):route.continue();await page.route('**/api/studio/workspace',block);await page.getByRole('button',{name:'Save note',exact:true}).click();await expect(page.getByText('C5 simulated note failure.',{exact:false}).first()).toBeVisible();await expect(note).toHaveValue(prefix+' unsaved note');done('Failed inquiry note retains text');await page.unroute('**/api/studio/workspace',block);
  await page.getByRole('button',{name:'Save note',exact:true}).click();await expect(note).toHaveValue('');await expect(page.getByText(prefix+' unsaved note',{exact:true})).toBeVisible();done('Inquiry note saves and returns through record refresh');
  await page.getByLabel('Follow-up date (IST)').fill('2026-12-12');
  const detail=(await request(admin,'/api/studio/workspace?view=inquiry&id='+inquiryId)).data.inquiry;assert.equal((await request(admin,'/api/studio/workspace',{action:'assign',id:inquiryId,version:detail.version,assignee:detail.assignee,followUp:'2026-12-13'})).status,200);
  await page.getByRole('button',{name:'Save assignment and date',exact:true}).click();await expect(page.getByText('Your typed text is retained.', {exact:false}).first()).toBeVisible();await expect(page.getByLabel('Follow-up date (IST)')).toHaveValue('2026-12-12');done('Real concurrent inquiry change retains local date and blocks stale write');
  await page.goBack();await expect(page.getByLabel('Follow-up date (IST)')).toHaveValue('2026-12-12');done('Browser Back preserves dirty inquiry record');
  assert.deepEqual(errors,[]);done('No unhandled browser errors during mutations and recovery');
  const editorSession=await launch(editor);
  try{for(const path of ['navigation','legacy','route-review','staff','settings']){await editorSession.page.goto(origin+'/studio/'+path);await expect(editorSession.page.getByText('Administrator access is required.',{exact:true})).toBeVisible();}done('Editor direct administrator routes denied in browser');await editorSession.page.goto(origin+editorPath);await expect(editorSession.page.locator('#content-field-title')).toBeVisible();await expect(editorSession.page.getByRole('button',{name:'Publish this revision',exact:true})).toHaveCount(0);done('Editor content controls exclude publication');}finally{await editorSession.browser.close();}
  record(resultName,{checkedAt:new Date().toISOString(),checks,errors,complete:true});
 }finally{await browser.close();}
}
