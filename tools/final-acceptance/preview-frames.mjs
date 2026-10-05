import assert from 'node:assert/strict';
import {qa,login,request,launch,origin,record,fingerprint} from '../c6-acceptance/common.mjs';
assert.equal(qa.RIVYA_QA_TARGET,'local','Preview fixtures are local source-only records');
const before=await fingerprint(),cookie=await login(),cases=[];
for(const id of ['page:collectible-design','page:journal']){
 const result=await request(cookie,'/api/studio/content?view=editor&record='+encodeURIComponent(id));
 const entry=result.data.entries.find(e=>e.document.id===id);
 if(!entry.document.pageSnapshot){
  const saved=await request(cookie,'/api/studio/content',{document:entry.document,version:entry.version,operation:'draft'});
  assert.equal(saved.status,200);entry.version=saved.data.version;
 }
 cases.push({id,version:entry.version});
}
const {browser,page}=await launch(cookie),checks=[];
try{
 for(const item of cases){
  await page.goto(origin+'/studio/preview?record='+encodeURIComponent(item.id)+'&version='+item.version+'&viewport=mobile');
  await page.getByText('Mobile preview · revision '+item.version,{exact:true}).waitFor({timeout:20000});
  const frame=page.frameLocator('iframe');
  assert.equal(await frame.locator('[data-saved-content-revision="'+item.version+'"]').count(),1);
  assert.equal(await frame.locator('h1').count(),1);
  assert.equal(await page.getByText('Preview could not load this revision. Your draft is unchanged.').count(),0);
  checks.push({...item,ready:true,exactMarker:true});
 }
 await page.goto(origin+'/studio/preview?record=page%3Ajournal&version=999999&viewport=mobile');
 assert.equal(await page.getByText(/Mobile preview · revision/).count(),0,'Missing revision must not claim readiness');
 assert.deepEqual(await fingerprint(),before);
 record('local-preview-frames',{at:new Date().toISOString(),checks,missingRevisionRejected:true,protectedFixturesUnchanged:true,scope:'Loopback QA only. Journal source fixture saved once to capture dependencies. No production changes.'});
 console.log('Collection and journal mobile previews confirm their exact revisions; missing revision is rejected.');
}finally{await browser.close();}
