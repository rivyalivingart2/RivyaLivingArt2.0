import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const root='test-results/old-design-migration/';
const before=JSON.parse(await readFile(root+'local-phase5-before-private.json','utf8'));
const after=JSON.parse(await readFile(root+'local-phase5-after-private.json','utf8'));
const fixture=JSON.parse(await readFile('output/redesign-phase5/lifecycle.json','utf8')).fixture;
const scopes={};let originalRows=0,addedRows=0;
for(const [table,rows] of Object.entries(before.records)){
  for(const [id,digest] of Object.entries(rows))assert.equal(after.records[table][id],digest,'Original protected record changed');
  const additions=Object.keys(after.records[table]).filter(id=>!(id in rows));
  for(const id of additions)assert.ok(table==='rivya_content'?id===fixture.id:table==='rivya_revisions'&&id.startsWith('content:'+fixture.id+':'),'Unexpected added record');
  scopes[table]={original:Object.keys(rows).length,originalsUnchanged:true,added:additions.length,after:Object.keys(after.records[table]).length};
  originalRows+=Object.keys(rows).length;addedRows+=additions.length;
}
assert.equal(originalRows,1641);assert.equal(addedRows,5);
const final=after.contentIdentities.find(row=>row.id===fixture.id);assert.equal(final.visible,false);assert.equal(final.version,4);
const report={at:new Date().toISOString(),scope:'Isolated local QA database; 13 inventoried scopes',originalRows,originalsUnchanged:true,addedRows,scopes,fixture:{id:fixture.id,route:final.route,version:final.version,publishedVersion:final.published_version,visible:final.visible,purpose:'Clearly labelled synthetic local save/publish/hide check'},limits:'No production snapshot. Session and rate-limit bookkeeping outside this inventory. Private IDs and hashes remain ignored.'};
await writeFile('docs/redesign/modern-design-2026-10-13/phase5-preservation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({originalRows,originalsUnchanged:true,addedRows,fixtureHidden:true}));
