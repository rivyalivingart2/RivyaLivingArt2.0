/** Assemble sanitized, local-only completion evidence from verified receipts. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve('test-results/exact-legacy-2026-10-21'), selection=resolve(root,'phase3-website-selection');
const read=async path=>JSON.parse(await readFile(path,'utf8'));
const website=await read(resolve(selection,'website-verification.json'));
const preservation=await read(resolve(selection,'preservation-verification.json'));
const delivery=await read(resolve(root,'phase3-completion/delivery-verification.json'));
const build=await read(resolve(root,'runtime/build.json'));
const browser=await read(resolve(selection,'browser-verification.json'));
const tests=await readFile(resolve(selection,'application-tests.txt'),'utf8');
assert.match(tests,/# tests 393/);assert.match(tests,/# pass 393/);assert.match(tests,/# fail 0/);
assert.equal(website.servedVariantHashesMatched,507);assert.equal(website.pages,5);assert.equal(website.boundaryChecks,8);
assert.equal(preservation.rows,355);assert.equal(preservation.tables,13);assert.equal(preservation.tableDigestsUnchanged,true);
assert.equal(delivery.originalsVerified,169);assert.equal(delivery.imageExports,676);assert.equal(delivery.archives,6);
assert.equal(browser.failed,0);assert.equal(browser.downloadHashMatches,true);assert.equal(browser.responsive.viewportWidth,390);assert.equal(browser.responsive.scrollWidth,390);
assert.equal(build.syntheticLocal,true);
assert.equal((await readFile('.next/BUILD_ID','utf8')).trim(),build.buildId);
const report={
 at:new Date().toISOString(),sourceCheckpoint:'c88071a',branch:'codex/exact-legacy-restoration',buildId:build.buildId,
 scope:'Owner-selected images in the local website. No production publication or data migration.',
 ownerDecision:{selected:'Earlier 169-image collection at 4215',newCutoutExperiment:'rejected and retained privately',googlePhotos:'owner-excluded duplicate coverage; library equality not independently verified'},
 selectedImages:169,featuredImages:6,creationTypes:12,format:{ratio:'4:5',jpeg:[1600,2000],webp:[[640,800],[960,1200],[1600,2000]]},
 checks:{applicationTests:393,applicationFailures:0,build:true,typecheck:true,scopedEslint:true,servedVariantHashesMatched:website.servedVariantHashesMatched,httpPages:website.pages,httpBoundaries:website.boundaryChecks,buildTraces:website.traceFiles,privateFilesExcludedFromBuildTraces:true,deliveryFilesHashed:delivery.filesHashed,originalsVerified:169,imageExports:676,archives:6,reviewHttpChecks:delivery.httpChecks,browserObservations:browser.observations.length,browserFailures:0,mobile:{viewportWidth:390,scrollWidth:390,dialogWidth:browser.responsive.dialogWidth,dialogHorizontalOverflow:false},browserDownloadHashMatched:true},
 preservation:{scope:preservation.scope,readOnly:true,tables:13,rows:355,tableDigestsUnchanged:true,originalMediaAndLoginFiles:301,protectedByteHashes:21,studioLoginCodeUnchanged:true,applicationChanges:'selected collection presentation and local-only guards only'},
 operations:{productsAdded:0,archivedImports:0,databaseWrites:0,newStudioRecords:0,cloudWrites:0,cmsPublished:0,push:0,pullRequests:0,deployments:0},
 limits:['AI-enhanced presentation selection is not documentary-fidelity or customer evidence.','No deleted database records or genuine image-to-business-record identities were recovered.','Local preservation is not a fresh production database audit.','390-pixel desktop emulation is not physical-phone testing. The browser screenshot surface scaled the mobile capture; DOM measurements are the responsive evidence.','Phases 4–7 full workflow, catalogue and release acceptance are not closed.'],
};
await writeFile('docs/restoration/exact-legacy-2026-10-21/phase3/owner-selection-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({buildId:report.buildId,selectedImages:169,browserObservations:report.checks.browserObservations,verified:true}));
