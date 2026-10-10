import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {localApi} from './local-api.mjs';
const root='docs/editorial-production/m9/',manifest=JSON.parse(await readFile(root+'content-manifest.json','utf8')),{request}=await localApi();
const results=[];
for(let i=0;i<manifest.length;i+=8){
 const checks=await Promise.allSettled(manifest.slice(i,i+8).map(async m=>{
  const response=await request('/studio/preview/frame?record='+encodeURIComponent(m.recordId)+'&version='+m.localStudioVersion);assert.equal(response.status,200,m.candidateId);const html=(await response.text()).replaceAll('&#x27;',"'").replaceAll('&amp;','&').replaceAll('&quot;','"');assert.ok(html.includes(m.title),m.candidateId+' title');assert.ok(html.includes('data-saved-content-revision="'+m.localStudioVersion+'"'));
  if(m.kind==='Portfolio')assert.ok(html.includes('Concept study — not a completed customer project'));
  if(m.kind==='Testimonials')assert.ok(html.includes('Fictional sample — not a customer review'));
  if(['J031','J032','J035','J040','P105','P109'].includes(m.candidateId)){assert.ok(html.includes('data-material-film='));assert.ok(html.includes('preload="none"'));assert.ok(html.includes('Play film'));}
  return {candidateId:m.candidateId,version:m.localStudioVersion,status:200,title:true,disclosure:m.kind==='Portfolio'||m.kind==='Testimonials'?'present':'not applicable'};
 }));for(const result of checks){if(result.status==='rejected')throw result.reason;results.push(result.value);}
 if(results.length%80===0)console.log(JSON.stringify({savedPreviews:results.length}));
}
for(const id of ['J001','P001','T001','F001']){const m=manifest.find(m=>m.candidateId===id);const response=await request(m.route);assert.equal(response.status,404,'M9 draft accidentally public: '+id);}
await writeFile(root+'preview-render-check.json',JSON.stringify({at:new Date().toISOString(),target:'isolated local built server',savedPreviews:results.length,publicDraftProbes:'4/4 not public',humanPreviewApproval:'Not performed',results},null,2)+'\n');
console.log(JSON.stringify({savedPreviews:results.length,publicDraftProbes:4}));
