import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {login,request,origin,record,fingerprint,existingRows,preserve} from './common.mjs';
const before=await existingRows(),protectedBefore=await fingerprint(),cookie=await login(),checks=[];
const pass=(name,value)=>{assert.ok(value,name);checks.push(name);};
const clean=document=>{const copy=structuredClone(document);delete copy.homeSnapshot;delete copy.pageSnapshot;return copy;};
let fixture,complete=false;
async function save(document,operation='draft',extra={}){
 const result=await request(cookie,'/api/studio/content',{document:clean(document),version:fixture.version,operation,...extra});
 assert.equal(result.status,200,'Synthetic QA operation succeeds without changing pre-existing records');
 fixture={document:result.data.document,version:result.data.version};
}
try{
 const full=await request(cookie,'/api/studio/content'),compact=await request(cookie,'/api/studio/content?view=editor');
 pass('Anonymous content remains inaccessible',(await request('','/api/studio/content?view=editor')).status===401);
 pass('Compact list keeps every content identity',JSON.stringify(compact.data.entries.map(e=>e.document.id))===JSON.stringify(full.data.entries.map(e=>e.document.id)));
 pass('Compact list marks every row for exact-record loading',compact.data.entries.every(e=>e.detailPending&&!e.document.homeSnapshot&&!e.document.pageSnapshot));
 const selected=await request(cookie,'/api/studio/content?view=editor&record=page%3Ahome');
 pass('Selected homepage retains the complete exact draft, public snapshot and revision',isDeepStrictEqual(selected.data.entries.find(e=>e.document.id==='page:home'),full.data.entries.find(e=>e.document.id==='page:home')));
 const listBytes=Buffer.byteLength(JSON.stringify(compact.data)),fullBytes=Buffer.byteLength(JSON.stringify(full.data));
 pass('Content list response is less than one quarter of full detail',listBytes<fullBytes/4);
 const marker='C6-'+randomUUID(),title=marker+' publication check';
 fixture={version:0,document:{id:'custom-page:'+randomUUID(),kind:'page',route:'/p/'+marker.toLowerCase(),title,eyebrow:'Isolated QA',description:'Synthetic C6 publication freshness and saved revision verification.',sections:[{id:'check',heading:'Synthetic QA chapter',paragraphs:['This fixture contains no business or customer information.']}]}};
 pass('Unknown fixture starts unavailable',(await fetch(origin+fixture.document.route)).status===404);
 await save(fixture.document);const saved=structuredClone(fixture);
 const preview='/studio/preview/frame?record='+encodeURIComponent(fixture.document.id)+'&version='+saved.version;
 pass('Exact saved preview is private',(await fetch(origin+preview,{redirect:'manual'})).status!==200);
 await save(fixture.document,'publish');let html=await(await fetch(origin+fixture.document.route)).text();
 pass('Warm public source immediately sees the new publication',html.includes('data-content-revision="'+fixture.version+'"')&&html.includes(title));
 const publicVersion=fixture.version;await save({...fixture.document,title:marker+' changed draft'});
 html=await(await fetch(origin+fixture.document.route)).text();pass('Saving a draft never changes public content',html.includes('data-content-revision="'+publicVersion+'"')&&!html.includes(marker+' changed draft'));
 await save(fixture.document,'publish');html=await(await fetch(origin+fixture.document.route)).text();
 pass('A second publication refreshes the warm public source immediately',html.includes('data-content-revision="'+fixture.version+'"')&&html.includes(marker+' changed draft'));
 const response=await fetch(origin+preview,{headers:{Cookie:cookie}}),oldHtml=await response.text();
 pass('Saved preview remains on its captured revision after later publication',response.status===200&&oldHtml.includes('data-content-revision="'+saved.version+'"')&&oldHtml.includes(title)&&!oldHtml.includes(marker+' changed draft'));
 await save(saved.document,'draft',{restoredFrom:saved.version});await save(fixture.document,'publish');html=await(await fetch(origin+fixture.document.route)).text();
 pass('Recovery publishes a new revision with the earlier saved content',html.includes('data-content-revision="'+fixture.version+'"')&&html.includes(title));
 record('content-response-sizes',{fullBytes,listBytes,selectedBytes:Buffer.byteLength(JSON.stringify(selected.data)),records:full.data.entries.length});complete=true;
}finally{
 if(fixture?.version){await save(fixture.document,'hide');pass('Withdrawal removes the synthetic page immediately and retains history',(await fetch(origin+fixture.document.route)).status===404);}
 await preserve(before,protectedBefore);record('data-contracts',{at:new Date().toISOString(),complete,checks,protectedRecordsUnchanged:true,fixture:fixture?.version?{id:fixture.document.id,version:fixture.version,visibility:'hidden',history:'retained'}:null,scope:'Only a newly generated synthetic QA page was saved, published, recovered and hidden. All pre-existing catalogue, media, content, inquiry, order, staff and business rows are unchanged.'});
}
