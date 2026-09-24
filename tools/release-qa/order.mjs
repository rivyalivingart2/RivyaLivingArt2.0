import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
const repo=process.cwd(),load=createRequire(path.join(repo,'package.json'));
const output=path.resolve('test-results/release-qa');fs.mkdirSync(output,{recursive:true});
const {chromium}=load('@playwright/test');
const {neon}=load('@neondatabase/serverless');
const qa=parseEnv(fs.readFileSync(repo+'/.env.qa.local','utf8')),live=parseEnv(fs.readFileSync(repo+'/.env.local','utf8'));
assert.equal(new URL(qa.DATABASE_URL).pathname,'/rivya_qa_20260924');assert.notEqual(qa.DATABASE_URL,live.DATABASE_URL);assert.notEqual(qa.BLOB_READ_WRITE_TOKEN,live.BLOB_READ_WRITE_TOKEN);
const sql=neon(qa.DATABASE_URL),base='http://localhost:4187',results=[];
const pass=name=>{results.push({name,status:'pass'});console.log('PASS',name)};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
 const errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));
 await context.route(/https:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/,r=>{external.push(r.request().url());return r.abort()});
 await page.goto(base+'/pieces/river-channel/customize');await page.getByText('Your secure form is ready.',{exact:true}).waitFor();pass('QA form establishes secure guest session');
 await page.getByRole('button',{name:'Your details →',exact:true}).click();await page.getByRole('alert').filter({hasText:'Please check:'}).waitFor();pass('Required customization fields block progression');
 for(const el of await page.locator('fieldset input[required]').all())await el.fill((await el.getAttribute('type'))==='number'?'120':(await el.getAttribute('id')).includes('city')?'Surat':'Isolated QA dining-room request');
 for(const el of await page.locator('fieldset select[required]').all())await el.selectOption({index:1});
 await page.getByRole('button',{name:'Your details →',exact:true}).click();await page.getByLabel('Your name *',{exact:true}).waitFor();
 const qaName='Isolated QA '+Date.now();await page.getByLabel('Your name *',{exact:true}).fill(qaName);await page.getByLabel('Phone number *',{exact:true}).fill('9000000000');await page.getByLabel('Email (optional)',{exact:true}).fill('isolated-qa@example.invalid');
 await page.getByLabel('Notes (optional)',{exact:true}).fill('Isolated release verification; no message is to be sent.');
 await page.locator('#reference-files').setInputFiles(repo+'/public/media/product-hero-001-4x5.webp');
 await page.getByText(/product-hero-001-4x5.webp · Saved privately/).waitFor({timeout:60000});pass('Private reference uploads to isolated storage');
 await page.locator('#contact-consent').check();await page.getByRole('button',{name:'Review your brief →',exact:true}).click();
 await page.getByRole('button',{name:'Save order details →',exact:true}).click();await page.waitForURL('**/inquiry/received**',{timeout:60000});
 await page.getByRole('heading',{name:'Your brief is with us.',exact:true}).first().waitFor({timeout:30000});
 const rows=await sql`SELECT i.id,i.reference,i.message_state,i.reference_count,o.client FROM rivya_inquiries i JOIN rivya_studio_orders o ON o.id=i.id WHERE o.client=${qaName}`;
 assert.equal(rows.length,1);assert.equal(Number(rows[0].reference_count),1);assert.equal(external.length,0);pass('One inquiry and order saved before any WhatsApp navigation');
 const refs=await sql`SELECT id,storage_provider,state FROM rivya_references WHERE inquiry_id=${rows[0].id}::uuid`;assert.equal(refs.length,1);assert.equal(refs[0].storage_provider,'vercel');pass('Uploaded private reference linked to saved inquiry');
 const unauthorized=await context.request.get(base+'/api/studio/references/'+refs[0].id);assert.equal(unauthorized.status(),401);pass('Guest cannot access private Studio reference');
 await page.reload();await page.getByRole('heading',{name:'Your brief is with us.',exact:true}).first().waitFor();assert.equal(external.length,0);pass('Reload retains receipt without opening WhatsApp');
 const studio=await browser.newContext(),staff=await studio.newPage();await staff.goto(base+'/studio/login');await staff.getByLabel('Staff ID',{exact:true}).fill(qa.STUDIO_ADMIN_ID);await staff.getByLabel('Password',{exact:true}).fill(qa.STUDIO_ADMIN_PASSWORD);await staff.getByRole('button',{name:'Sign in',exact:true}).click();await staff.waitForURL(base+'/studio',{timeout:30000});pass('Owner signs into isolated Studio');
 const list=await studio.request.get(base+'/api/studio/orders?q='+encodeURIComponent(qaName));assert.equal(list.status(),200);assert.equal((await list.json()).orders.length,1);pass('Saved customer request appears in Studio order list');
 const image=await studio.request.get(base+'/api/studio/references/'+refs[0].id);assert.equal(image.status(),200);assert.match(image.headers()['cache-control'],/no-store/);assert.match(image.headers()['content-type'],/image\/jpeg/);pass('Authorized Studio reads normalized private image with no-store');
 assert.equal(errors.length,0);pass('Customer flow has no uncaught browser errors');
 fs.writeFileSync(output+'/order-browser.json',JSON.stringify({at:new Date().toISOString(),scope:'isolated QA only',results,orderId:rows[0].id,referenceId:refs[0].id},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error('FAIL',e.message);fs.writeFileSync(output+'/order-browser-failure.json',JSON.stringify({results,error:e.message},null,2));process.exitCode=1});

