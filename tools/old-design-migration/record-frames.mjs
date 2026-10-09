import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
const base='docs/redesign/old-design-migration-2026-10-08',privateDir='test-results/old-design-migration';
const read=(dir,file)=>JSON.parse(readFileSync(dir+'/'+file,'utf8'));
const write=(file,value)=>writeFileSync(base+'/'+file,JSON.stringify(value,null,2)+'\n');
const browser=read(privateDir,'m2-final-browser.json'),frames=read(privateDir,'m2-frames.json');
const candidate=candidateFingerprint();
assert.deepEqual(browser.candidate,candidate);assert.deepEqual(frames.candidate,candidate);
assert.equal(browser.samples.length,20);assert.equal(browser.screenshots.length,10);assert.equal(browser.errors.length,0);
assert.ok(browser.samples.every(sample=>!sample.overflow));assert.equal(frames.checks.length,22);assert.equal(frames.errors.length,0);
const before=read(privateDir,'local-before-summary.json'),after=read(privateDir,'local-m2-after-summary.json');
assert.deepEqual(before.summary,after.summary);
const tests=readFileSync(privateDir+'/m2-unit.tap','utf8');assert.match(tests,/# pass 298/);assert.match(tests,/# fail 0/);
const contrast=[];const luminance=hex=>{const channels=hex.match(/\w\w/g).map(s=>parseInt(s,16)/255).map(s=>s<=.04045?s/12.92:((s+.055)/1.055)**2.4);return .2126*channels[0]+.7152*channels[1]+.0722*channels[2];};
for(const [role,fg,grounds,floor] of [['body','f4f1e9',['080a0e','08283a','0f3247','164e6b','1d6389'],4.5],['secondary','a9b4bc',['080a0e','08283a','0f3247'],4.5],['links','5fafd6',['080a0e','08283a','0f3247'],4.5],['control boundary','78828c',['080a0e','08283a','0f3247'],3]]){
 for(const bg of grounds){const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(ratio>=floor);contrast.push({role,foreground:'#'+fg,background:'#'+bg,ratio:Number(ratio.toFixed(3)),floor,pass:true});}
}
const report={at:new Date().toISOString(),candidate,scope:'M2 shared-frame engineering verification; not full template/section parity or external acceptance',status:'verified-for-stated-scope',build:'Node 22.23.2 / Next 16.3.5 production build and type validation passed',unitTests:{pass:298,fail:0},lint:'Changed TS/TSX and migration JS tools pass',fontEvidence:'m2-fonts.json',contrast:{method:'WCAG relative luminance for named semantic token pairs; not a whole-page contrast audit',pairs:contrast},frames:frames.checks,browser:{profile:browser.profile,samples:browser.samples,screenshots:browser.screenshots,keyboard:browser.keyboard,errors:browser.errors},protected:{mode:'local isolated QA',scopes:13,result:'Every captured row and publication identity unchanged; live M0 evidence remains historical, no production writes in M2'},content:{Journal:0,Portfolio:0,Testimonials:0,FAQs:0},externalAcceptance:{humanScreenReader:'not-run',physicalPhone:'not-run',nativeReader:'not-run',fieldPerformance:'not-observed'},remaining:'M3 saved presentation workflow; M4–M10 detailed pages/modules and full acceptance; M11 explicit release request'};
write('m2-evidence.json',report);
const tracker=read(base,'implementation-tracker.json');
for(const ticket of tracker.tickets.filter(t=>t.phase==='M1'))Object.assign(ticket,{status:'verified-for-stated-scope',owner:'Codex',evidence:'implementation-contracts.json; M1-CONTRACT-REVIEW.md; PARITY-ACCEPTANCE-SHEETS.html',note:'Complete specification coverage; visual target captures explicitly not-run'});
for(const ticket of tracker.tickets.filter(t=>t.phase==='M2'))Object.assign(ticket,{status:'verified-for-stated-scope',owner:'Codex',evidence:'m2-evidence.json',note:'Shared frames only; 32 planned destinations accounted for, 16 supported destinations active; detailed module parity remains M6'});
tracker.note='M0 baseline, M1 contracts and M2 shared-frame engineering scope verified locally. Earliest unfinished phase M3. New content 0/480; no release or production writes. Labelled concepts/samples authorized in owner decision of 9 October.';
write('implementation-tracker.json',tracker);
console.log('M1/M2 scoped evidence and phase register recorded; M3 next.');
