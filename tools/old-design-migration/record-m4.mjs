import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
const dir='docs/redesign/old-design-migration-2026-10-08',qa='test-results/old-design-migration';
const read=file=>JSON.parse(readFileSync(file,'utf8')),candidate=candidateFingerprint();
const workflows=[['m3-workflow.json',17],['m4-home-workflow.json',7],['m4-conditional-workflow.json',5],['m4-pages-workflow.json',13]].map(([file,count])=>{
 const report=read(qa+'/'+file);assert.equal(report.completed,true,file);assert.equal(report.checks.length,count);assert.ok(report.checks.every(c=>c.passed));assert.deepEqual(report.candidate,candidate);assert.equal(report.browserErrors?.length||0,0);return report;
});
const before=read(qa+'/local-before-summary.json'),after=read(qa+'/local-m4-final-summary.json');assert.deepEqual(before.summary,after.summary);
const unit=readFileSync(qa+'/m4-unit.tap','utf8');assert.match(unit,/# pass 311\r?\n/);assert.match(unit,/# fail 0\r?\n/);
assert.equal(readFileSync(qa+'/m4-lint.log','utf8').trim(),'');assert.match(readFileSync(qa+'/m4-build.log','utf8'),/server-rendered on demand/);
const media=read(dir+'/m4-media-evidence.json');assert.ok(media.files.every(f=>f.driveReadbackMatches));
const report={phase:'M4',at:new Date().toISOString(),status:'verified-for-stated-local-engineering-scope',candidate,workflows,validation:{unitTests:311,workflowChecks:42,browserErrors:0,productionBuild:'passed',typeValidation:'passed',changedSourceLint:'passed',diffCheck:'passed'},protectedComparison:{target:'dedicated loopback QA',all13ScopesUnchanged:true,summary:after.summary},mediaEvidence:'m4-media-evidence.json',visualReview:{reviewer:'assistant',reviewed:['Homepage desktop/mobile','Concept and fictional-feedback labels','Our story mobile full-image opening','Process desktop full-image opening','Material film desktop/mobile'],actualHumanAcceptance:false},phaseBoundary:{next:'M5',authorization:'required from owner; not yet received',source:'docs/decisions/2026-10-09-phase-permission-and-media.md'},limits:['Source fixtures are local QA only; no production data mutation or deployment.','The 18-slot full-content test and ten-making/four-material test use private synthetic presentation revisions, not new public editorial records or factual approval.','Workshop structure remains private and unconfirmed; its public route remains 410. Printing remains conditional with no invented current offering.','Unavailable real maker/studio facts, actual making claims and structured material evidence remain unbound.','Full 85-template parity, all long locales, human screen-reader, native-reader, physical-device, field performance and genuine-inquiry acceptance remain open for their later gates.','New editorial production remains 0/480. One material film and poster do not count toward those targets.']};
writeFileSync(dir+'/m4-evidence.json',JSON.stringify(report,null,2)+'\n');
const tracker=read(dir+'/implementation-tracker.json');
for(const ticket of tracker.tickets.filter(t=>t.phase==='M4')){ticket.status='verified-for-stated-scope';ticket.owner='Codex local implementation';ticket.evidence='m4-evidence.json; M4-PAGE-TEMPLATES.md; conditional factual and human gates remain open';}
tracker.nextPhaseAuthorization={phase:'M5',state:'awaiting-owner-permission',source:'docs/decisions/2026-10-09-phase-permission-and-media.md'};
tracker.note='M0–M4 verified for recorded local engineering scope. M5 not started and requires explicit owner permission. M5–M11 unfinished. New content 0/480; one MP4 copied to Drive and verified, two existing matching media files verified; no production writes or release.';
writeFileSync(dir+'/implementation-tracker.json',JSON.stringify(tracker,null,2)+'\n');
console.log(JSON.stringify({phase:'M4',checks:42,unitTests:311,protectedScopesUnchanged:13,nextPhase:'M5',permission:'required'}));
