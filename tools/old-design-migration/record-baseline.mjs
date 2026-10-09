import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const base='docs/redesign/old-design-migration-2026-10-08',privateBase='test-results/old-design-migration';
const read=(root,name)=>JSON.parse(readFileSync(root+'/'+name,'utf8'));
const write=(name,value)=>writeFileSync(base+'/'+name,JSON.stringify(value,null,2)+'\n');
const comparisons={};
for(const mode of ['local','live-read-only']){
  const before=read(privateBase,mode+'-before-summary.json'),after=read(privateBase,mode+'-m0-after-summary.json');
  assert.deepEqual(before.summary,after.summary,'Protected '+mode+' rows changed; reconcile legitimate owner edits rather than overwriting');
  comparisons[mode]={before:before.at,after:after.at,allCapturedRowsUnchanged:true,counts:Object.fromEntries(Object.entries(after.summary).map(([table,value])=>[table,value.count])),scopes:Object.keys(after.summary),privateEvidence:privateBase+'/'+mode+'-m0-after-private.json'};
}
const browser=read(privateBase,'browser-baseline.json'),reference=read(privateBase,'reference-baseline.json'),source=read(base,'source-reconciliation.json');
assert.equal(browser.samples.length,20);assert.equal(browser.screenshots.length,10);assert.equal(browser.errors.length,0);assert.equal(reference.rows.length,12);
write('m0-evidence.json',{
  at:new Date().toISOString(),status:'verified-for-stated-scope',branch:'codex/old-design-migration',base:browser.source,
  deployments:{current:{commit:browser.source,id:'dpl_HChTFo6iL9s8fxDBCEtaVb3VrXs9',state:'READY',domain:'https://www.rivyalivingart.com'},old:{commit:source.oldRevision,id:'dpl_71hEmTqT59ru4AqstL4gkZdJEitj',state:'READY',domain:'https://oldwebsite-one.vercel.app'}},
  protectedComparisons:comparisons,
  isolation:{target:'dedicated loopback PostgreSQL on port 55439',sourceOnlyFixtures:true,privateCustomerRecordsCopied:0,remoteSqlRefused:true,readOnlyEnforced:true,remoteObjectStoreCredential:false,productionWrites:false},
  validation:{guardTests:2,guardTestsPassed:true,transportChecksPassed:true,build:'PASS with installed Node 22.23.2 / Next 16.3.5',typeScript:'PASS during production build',changedToolingLint:'PASS'},
  browser:{environment:browser.environment,profile:browser.profile,screenshots:browser.screenshots,samples:browser.samples,keyboard:browser.keyboard,errors:browser.errors,referenceSamples:reference.rows},
  knownDefects:[{id:'M0-CLS-01',scope:'Local source-fixture Studio overview at 1440x1000',observation:'CLS 0.111791 in both baseline samples',status:'open',ownerPhase:'M2/M10',note:'Baseline defect; not a passing performance result. No field p75 inferred.'}],
  externalAcceptance:{nativeReader:'not-run',humanScreenReader:'not-run',physicalPhone:'not-run',fieldPerformance:'not-observed',genuineInquiry:'not-observed',newMediaRightsAndCrops:'not-approved-by-inventory'},
  release:'local-only; no push, PR, merge, deployment or production content publication'
});
const tracker=read(base,'implementation-tracker.json');tracker.status='local_implementation_in_progress';
for(const ticket of tracker.tickets.filter(t=>t.phase==='M0'))Object.assign(ticket,{status:'verified-for-stated-scope',owner:'Codex',evidence:'m0-evidence.json',protectedFieldComparison:'All captured local and live rows unchanged'});
for(const ticket of tracker.tickets.filter(t=>t.phase==='M1'))Object.assign(ticket,{status:'working',owner:'Codex',evidence:'source-reconciliation.json',note:'All source files reconciled; detailed adapters and state/visual acceptance sheets still in progress. No application parity claim.'});
tracker.note='M0 verified for baseline/isolation scope. M1 source reconciliation in progress. M2–M11 not implemented. Content readiness and external acceptance remain separate.';write('implementation-tracker.json',tracker);
console.log('M0 preservation verified; sanitized evidence and continuation register saved.');
