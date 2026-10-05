import {login,request,sql,record,existingRows,fingerprint,preserve} from './common.mjs';
import {browserAcceptance} from './mutation-browser.mjs';
import {randomUUID,randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
const before=await existingRows(),protectedBefore=await fingerprint(),admin=await login(),prefix='C5UI-'+Date.now(),inquiryId=randomUUID(),pageId='custom-page:'+randomUUID(),pageRoute='/p/'+prefix.toLowerCase(),checks=[];
const fixture={login:'qa-c5-ui-'+Date.now(),name:prefix+' editor',role:'editor',active:true,password:randomBytes(32).toString('base64url')};
const staffRecord=async()=>(await request(admin,'/api/studio/workspace')).data.staff.find(s=>s.login===fixture.login);
const pageRecord=async()=>(await request(admin,'/api/studio/content?record='+encodeURIComponent(pageId))).data.entries.find(e=>e.document.id===pageId);
const pass=name=>{checks.push(name);console.log('PASS '+name);};let staff,created=false,complete=false;
try{
 assert.equal((await request(admin,'/api/studio/workspace',{action:'staff',...fixture})).status,200);staff=await staffRecord();const editor=await login(fixture.login,fixture.password);
 const product=(await request(admin,'/api/studio/workspace?view=catalogue')).data.products[0],media=(await request(admin,'/api/studio/media')).data.media[0];
 for(const operation of ['publish','hide'])assert.equal((await request(editor,'/api/studio/workspace',{action:'catalogue',product:product.product,version:product.version,operation})).status,403);
 assert.equal((await request(editor,'/api/studio/media',{media:media.media,version:media.version,operation:'publish'})).status,403);pass('Editor product publish/hide and media publication denied by real APIs');
 assert.equal((await request(admin,'/api/studio/orders',{action:'create',requestId:inquiryId,client:prefix+' synthetic person',title:prefix+' synthetic brief'})).status,201);created=true;
 await sql`INSERT INTO rivya_inquiries(id,reference,guest_hash,request_key,payload_hash,product_id,product_snapshot,name,phone,email,answers,notes,summary,assignee) VALUES(${inquiryId}::uuid,${'RLA-'+inquiryId.replaceAll('-','').slice(0,12).toUpperCase()},'c5-synthetic-browser',${randomUUID()}::uuid,'c5-synthetic','C5-NOT-A-PRODUCT',${JSON.stringify({id:'C5-NOT-A-PRODUCT',name:prefix+' synthetic request',category:'QA only'})}::jsonb,${prefix+' synthetic person'},'0000000000','',${JSON.stringify({'Synthetic preference':'Original immutable answer'})}::jsonb,'Original synthetic notes','Synthetic C5 browser acceptance',${staff.id}::uuid)`;
 const document={id:pageId,kind:'page',route:pageRoute,title:prefix+' original page',eyebrow:'Isolated QA',description:'Synthetic C5 browser publishing and recovery acceptance.',sections:[{id:'brief',heading:'Synthetic chapter',paragraphs:['Synthetic QA content, not business content.'],layout:'statement'}]};
 assert.equal((await request(admin,'/api/studio/content',{document,version:0,operation:'draft'})).status,200);
 await browserAcceptance({admin,editor,staff,inquiryId,pageId,pageRoute,prefix,pass});complete=true;
}finally{
 const content=await pageRecord();if(content){const d=structuredClone(content.document);delete d.pageSnapshot;assert.equal((await request(admin,'/api/studio/content',{document:d,version:content.version,operation:'hide'})).status,200);}
 staff=await staffRecord();if(staff)assert.equal((await request(admin,'/api/studio/workspace',{action:'staff',...staff,password:'',active:false})).status,200);fixture.password='';
 if(created){const row=(await request(admin,'/api/studio/workspace?view=inquiry&id='+inquiryId)).data.inquiry;assert.equal((await request(admin,'/api/studio/orders',{action:'move',id:inquiryId,version:row.version,status:'CLOSED',reason:'Synthetic C5 browser acceptance completed; history retained.'})).status,200);}
 await preserve(before,protectedBefore);record('browser-fixtures',{checkedAt:new Date().toISOString(),complete,checks,fixturePrefix:prefix,inquiryId,pageId,staffId:staff?.id,staffInactive:true,inquiryClosed:true,pageHidden:true,existingRecordsUnchanged:true,productionWrites:false});console.log('Synthetic fixtures closed; existing records unchanged.');
}
