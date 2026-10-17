import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const out='test-results/cinematic-acceptance',docs='docs/redesign/sitewide-cinematic-2026-10-16';
const read=async name=>JSON.parse(await readFile(out+'/'+name+'.json','utf8'));
const [inventory,published,conditional,interactions,base,repair,controls]=await Promise.all(['published-inventory','published-browser','conditional','interactions','contrast','contrast-access-recheck','contrast-controls'].map(read));
const key=r=>[r.path,r.width,r.selector,r.state].join('|'),samples=new Map(base.samples.map(r=>[key(r),r]));
for(const r of [...repair.samples,...controls.samples])samples.set(key(r),r);
const controlsRecheck=await read('contrast-controls-recheck');assert.equal(controlsRecheck.errors.length,0);
for(const r of controlsRecheck.samples)samples.set(key(r),r);
const current=[...samples.values()];
assert.equal(current.length,600,'Expected complete merged contrast matrix');
assert.equal(inventory.errors.length+published.issues.length+conditional.issues.length+interactions.issues.length+base.errors.length+repair.errors.length+controls.errors.length,0);
assert.equal(current.filter(r=>r.failures.length).length,0);
assert.ok(current.filter(r=>r.state.startsWith('frame-')).every(r=>r.media.length&&r.media.every(m=>m.decoded)),'Actual video samples must have decoded frames');
const performance={};
for(const label of ['production-performance','production-performance-isolated','local-candidate-performance']){
 const p=await read(label);assert.equal(p.errors.length,0);assert.ok(p.finishedAt,'Performance run must finish');assert.ok(p.samples.length>=16);performance[label]={scope:p.scope,at:p.at,finishedAt:p.finishedAt,samples:p.samples.length,routes:[]};
 for(const profile of [...new Set(p.samples.map(r=>r.profile))])for(const route of [...new Set(p.samples.map(r=>r.route))]){
  const rows=p.samples.filter(r=>r.profile===profile&&r.route===route),cold=rows.filter(r=>r.cache==='cold-browser'),sorted=cold.map(r=>r.lcp).sort((a,b)=>a-b);
  performance[label].routes.push({profile,route,coldLcpMs:sorted,medianLcpMs:sorted[Math.floor(sorted.length/2)],repeatLcpMs:rows.find(r=>r.cache==='repeat-visit')?.lcp,maxCls:Math.max(...rows.map(r=>r.cls)),allColdWithin2500ms:cold.every(r=>r.lcp>0&&r.lcp<=2500),allHttp200:rows.every(r=>r.status===200),brokenImages:rows.reduce((s,r)=>s+r.failedImages,0),overflow:rows.some(r=>r.overflow)});
 }
}
const files=[];for(const name of await readdir(out)){if(name==='summary.txt'||!/\.(json|png|txt)$/.test(name))continue;const bytes=await readFile(out+'/'+name);files.push({path:out+'/'+name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
const changed=execFileSync('git',['diff','--name-only'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(p=>p.startsWith('src/'));
const source=[];for(const path of changed){const bytes=await readFile(path);source.push({path,bytes:(await stat(path)).size,sha256:createHash('sha256').update(bytes).digest('hex')});}
const report={at:new Date().toISOString(),baseCommit:'66e82ef04f76b8460654bab4329ccbadfb47f28e',branch:'codex/cinematic-acceptance',release:'Local changes; no push, merge, deployment or production data mutation in this follow-up',published:{urls:inventory.routes.length,assets:inventory.assets.length,httpIssues:inventory.errors.length,browserPages:published.pages.length,renderedImagePlacements:published.pages.reduce((s,r)=>s+r.images,0),browserIssues:published.issues.length,width:390,touchEmulated:true},conditional:{checks:conditional.checks.length,states:conditional.states.length,issues:conditional.issues,blockedWriteAttempts:conditional.blockedWrites.length,scope:conditional.scope},interactions:{checks:interactions.checks.length,issues:interactions.issues},contrast:{uniqueCurrentSamples:current.length,renderedTextObservations:current.reduce((s,r)=>s+r.texts,0),decodedVideoSamples:current.filter(r=>r.state.startsWith('frame-')).length,controlStates:controls.samples.length,failures:[],widths:[1920,1440,1200,992,768,512,390,320],method:controls.method,repair:'Final mobile access scrim rechecked at 512,390,320; these 60 samples replace earlier rows. Other source unchanged.',historicalFailureCounts:{initialBaseline:25,expandedBeforeMobileResetFix:2},limits:['Finite measured samples and synthetic bright/dark bounds, not every frame or every saved layout combination.','Occluded, partly offscreen and fading text excluded.','Focus styling and forced-colors behavior verified separately in interactions.json.']},checks:{build:'pass',types:'pass',lint:{errors:0,existingWarnings:62},unit:350,runtime:403,preflight:12},performance,source,artifacts:files};
await writeFile(docs+'/acceptance-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({published:report.published,conditional:report.conditional,interactions:report.interactions,contrast:report.contrast,performance:report.performance},null,2));
