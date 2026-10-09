import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
const dir='docs/redesign/old-design-migration-2026-10-08',qa='test-results/old-design-migration';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const workflow=read(qa+'/m3-workflow.json'),schema=read(qa+'/m3-schema.json'),before=read(qa+'/local-before-summary.json'),after=read(qa+'/local-m3-after-summary.json');
assert.equal(workflow.completed,true);assert.equal(workflow.checks.length,17);assert.equal(workflow.browserErrors.length,0);assert.deepEqual(workflow.candidate,candidateFingerprint());
assert.deepEqual(before.summary,after.summary);assert.equal(schema.applications,2);
const tap=readFileSync(qa+'/m3-unit.tap','utf8');assert.match(tap,/# pass 301\r?\n/);assert.match(tap,/# fail 0\r?\n/);
const report={phase:'M3',at:new Date().toISOString(),status:'verified-for-stated-scope',candidate:workflow.candidate,schema,workflow,protectedComparison:{target:'dedicated loopback QA',all13ScopesUnchanged:true,summary:after.summary},validation:{unitTests:301,failures:0,productionBuild:'passed',typeValidation:'passed',changedSourceLint:'passed',diffCheck:'passed'},visualReview:{reviewer:'assistant',desktopAndMobile:'reviewed',featuredLayout:'reviewed; existing three selections retained rather than fabricating a fourth old product',actualHumanAcceptance:false},limits:['Fault injection affects only new QA presentation records/tables; missing-reference tests simulate saved dependency mismatch, not a real production withdrawal.','No live writes or release. The schema is not installed in production.','No human, native-reader, physical-device or field acceptance.','The full 18-section and other-page templates are M4 onward.','Editorial content remains 0 of 480; Drive deliveries remain 0.']};
writeFileSync(dir+'/m3-evidence.json',JSON.stringify(report,null,2)+'\n');
const tracker=read(dir+'/implementation-tracker.json');
for(const task of tracker.tickets.filter(t=>t.phase==='M3')){task.status='verified-for-stated-scope';task.owner='Codex local implementation';task.evidence='m3-evidence.json; M3-PRESENTATION-WORKFLOW.md';}
tracker.note='M0–M3 verified for recorded local engineering scope. Earliest unfinished phase M4. New content 0/480; Drive deliveries 0; no release or production writes.';
writeFileSync(dir+'/implementation-tracker.json',JSON.stringify(tracker,null,2)+'\n');
console.log('M3 scoped evidence recorded; M4 is next.');
