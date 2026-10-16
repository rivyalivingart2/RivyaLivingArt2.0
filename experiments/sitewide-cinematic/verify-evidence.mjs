import {readFile,readdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

// Read-only evidence aggregation. No application/database imports or mutations.
const docs='docs/redesign/sitewide-cinematic-2026-10-16';
const evidence='test-results/sitewide-cinematic';
const json=async path=>JSON.parse(await readFile(path,'utf8'));
const groups=[['public-breakpoints.json',240],['studio-workspaces.json',74],['studio-breakpoints.json',24],['saved-previews.json',24],['access-breakpoints.json',24],['specimen-breakpoints.json',176]];
const layouts=[];
for(const [file,expected] of groups){
 const receipt=await json(evidence+'/'+file),rows=Array.isArray(receipt)?receipt:receipt.checks;
 assert.equal(rows.length,expected,file);
 const issues=rows.filter(row=>row.overflow||row.clippedHeadings?.length||row.brokenVisibleImages?.length);
 assert.equal(issues.length,0,file);
 layouts.push({file,observations:rows.length,issues:issues.length,widths:[...new Set(rows.map(row=>row.width))].sort((a,b)=>b-a),staticOnly:file.startsWith('specimen')});
}
const suites=[];
for(const [file,count] of [['unit.txt',350],['final-runtime.txt',403],['preflight.txt',12]]){
 const log=await readFile(evidence+'/'+file,'utf8');assert.match(log,new RegExp('# pass '+count+'\\b'));assert.match(log,/# fail 0\b/);
 suites.push({file,passed:count,failed:0});
}
const build=await readFile(evidence+'/build.txt','utf8');assert.match(build,/Compiled successfully/);assert.match(build,/Finished TypeScript/);
const lint=await readFile(evidence+'/lint.txt','utf8');assert.match(lint,/0 errors, 62 warnings/);
const interactions=await json(evidence+'/interaction-checks.json');assert.ok(interactions.every(row=>row.result==='passed'));
const accessibility=await json(evidence+'/accessibility-checks.json');assert.equal(accessibility.length,9);assert.ok(accessibility.every(row=>row.violations.length===0));
const preservation=await json(docs+'/preservation.json');assert.equal(preservation.summary.allProtectedRowsEqual,true);
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',windowsHide:true}).trim();
const paths=[...new Set([...git('diff','--name-only','HEAD').split('\n'),...git('ls-files','--others','--exclude-standard').split('\n')])].filter(path=>path.startsWith('src/')).sort();
const sources=[];for(const path of paths){const bytes=await readFile(path);sources.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
const captures=(await readdir(evidence)).filter(file=>/\.(jpg|png)$/.test(file));
const result={
 schemaVersion:1,verifiedAt:new Date().toISOString(),branch:git('branch','--show-current'),baseHead:git('rev-parse','HEAD'),scope:'Local implementation and representative template/state evidence, not production or exhaustive dynamic-record acceptance',
 build:{passed:true,typescriptPassed:true,file:'build.txt'},lint:{errors:0,existingWarnings:62,full:'lint.txt',finalFocused:'final-focused-lint.txt'},suites,
 layoutObservations:layouts.reduce((count,row)=>count+row.observations,0),layouts,
 interactionChecks:interactions.length,allInteractionsPassed:true,motionReceipt:'motion-checks.json',
 accessibility:{views:accessibility.length,automaticViolations:0,contextualChecksIncomplete:true,details:accessibility.map(row=>({path:row.url,passes:row.passes,incomplete:row.incomplete}))},
 localPerformance:await json(evidence+'/local-performance.json'),
 solidTokenContrast:[{foreground:'#f4f1e9',background:'#080a0e',ratio:17.55},{foreground:'#c4ccd1',background:'#08283a',ratio:9.39},{foreground:'#f4f1e9',background:'#164e6b',ratio:7.96},{foreground:'#b89b63',background:'#080a0e',ratio:7.46}],
 preservation:preservation.summary,sourceFiles:sources,screenshotCount:captures.length,
 screenshotLimits:['Before desktop capture overscan repeats are disclosed and gallery comparisons use equal display-only crops; raw evidence retained','After captures show local source/data and are not production publication evidence','Static component specimens have no hydration or working interactions'],
 externalState:{push:false,pr:false,deployment:false,publication:false,productionDatabaseWrite:false,driveWrite:false},
 remaining:['Owner visual review and separately authorized release','Contextual contrast over gradients/media; no blanket WCAG certification','Native screen-reader/physical-device/field-performance observations not performed','No exhaustive opening of all historical dynamic URLs or every conditional record/permission state','Historical Studio access-request production-table activation remains separate']
};
await writeFile(docs+'/verification.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({layouts:result.layoutObservations,interactionChecks:result.interactionChecks,accessibilityViews:accessibility.length,sourceFiles:sources.length,screenshots:captures.length,protectedRows:preservation.summary.protectedRows},null,2));
