import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const read=async p=>JSON.parse(await readFile(p,'utf8')),root='test-results/old-design-migration/';
const before=await read(root+'local-phase7-before-private.json'),after=await read(root+'local-phase7-after-private.json'),original=await read(root+'local-phase3-before-private.json');
const scopes={};let phase7Rows=0,originalRows=0;
for(const [table,rows]of Object.entries(before.records)){
 assert.deepEqual(after.records[table],rows,'Phase 7 protected records changed');
 for(const [id,digest]of Object.entries(original.records[table]))assert.equal(after.records[table][id],digest,'Pre-redesign original record changed');
 const old=Object.keys(original.records[table]).length,current=Object.keys(rows).length;phase7Rows+=current;originalRows+=old;scopes[table]={preRedesignOriginals:old,current,originalsUnchanged:true,phase7Added:0,phase7Changed:0,phase7Deleted:0,earlierSyntheticAdditions:current-old};
}
assert.equal(phase7Rows,1657);assert.equal(originalRows,1641);
const report={at:new Date().toISOString(),scope:'Per-ID row hashes across 13 protected isolated QA scopes; no production snapshot',phase7Rows,phase7Added:0,phase7Changed:0,phase7Deleted:0,preRedesignOriginalRows:originalRows,originalsUnchanged:true,earlierSyntheticAdditions:16,earlierSyntheticReceipts:['phase5-preservation.json','phase6-preservation.json'],scopes,limits:'Authentication, session, rate-limit and audit bookkeeping are outside these scopes. No original private values are exported.'};
await writeFile('docs/redesign/modern-design-2026-10-13/phase7-preservation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({phase7Rows,phase7Changes:0,preRedesignOriginalRows:originalRows,originalsUnchanged:true}));
