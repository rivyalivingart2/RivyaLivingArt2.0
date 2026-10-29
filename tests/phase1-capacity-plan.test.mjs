import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {assessCapacity,buildCapacityPlan} from '../tools/phase1-capacity-plan.mjs';

const repo=fileURLToPath(new URL('../',import.meta.url));
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const profilePath='docs/netlify-free-first-2026-10-28/phase1/source-profile.json';
const policyPath='docs/netlify-free-first-2026-10-28/phase1/capacity-policy.json';
const [profile,schema,policy]=await Promise.all([read(profilePath),read('src/lib/google-workspace/schema.json'),read(policyPath)]);

test('actual source volume cannot fit the sandbox or Content default; absent tables stay absent',async()=>{
  const report=await buildCapacityPlan(repo,profilePath,policyPath);
  assert.equal(report.sourceRows,3454);
  assert.equal(report.absentTables.length,6);
  assert.equal(report.workbooks.find(x=>x.workbook==='content').defaultRowsShort,211);
  assert.equal(report.workbooks.find(x=>x.workbook==='operations').sandboxRowsShort,17);
  assert.equal(report.tables.find(x=>x.table==='rivya_newsletter_subscribers').rows,null);
});

test('row fit alone can never certify a provider or migration',()=>{
  const small={...profile,totalRows:0,tables:[]};
  const result=assessCapacity(small,schema,policy);
  assert.equal(result.providerVerified,false);
  assert.equal(result.targetRowsVerified,null);
  assert.match(result.status,/blocked/);
  assert.ok(result.unmeasured.includes('signedResponseBytes'));
});

test('quota model charges readback separately and does not treat four batch subrequests as four API calls',()=>{
  const result=assessCapacity(profile,schema,policy).quotaModel;
  assert.equal(result.noContentionWholeMutationsPerMinute,10);
  assert.equal(result.withReadbackWholeMutationsPerMinute,7);
  assert.equal(result.sourceImportMinutesAtWholeMinuteBudget,494);
});

test('reject incomplete arithmetic, duplicate tables, unknown sources and invalid counts',()=>{
  for(const bad of [
    {...profile,totalRows:profile.totalRows+1},
    {...profile,tables:[...profile.tables,profile.tables[0]]},
    {...profile,tables:[...profile.tables,{table:'rivya_unregistered',rows:0,inline:0,driveArtifactsRequired:0}]},
    {...profile,tables:profile.tables.map((x,i)=>i?x:{...x,rows:-1})},
  ]) assert.throws(()=>assessCapacity(bad,schema,policy),/Invalid or stale/);
});

test('aggregate report excludes arbitrary private input fields and has no source record identifiers',()=>{
  const result=assessCapacity({...profile,privateToken:'secret-sentinel',tables:profile.tables.map(x=>({...x,privateRecord:'secret-sentinel'}))},schema,policy);
  assert.ok(!JSON.stringify(result).includes('secret-sentinel'));
  assert.equal(result.runtimeActivated,false);
  assert.equal(result.databaseExceptionSelected,false);
});
