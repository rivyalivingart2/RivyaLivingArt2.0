/** Verify mapping artifacts only. No DB connection, media edit or import operation. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const docs='docs/restoration/exact-legacy-2026-10-21/phase3',privateDir='test-results/exact-legacy-2026-10-21/phase3';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const run=args=>execFileSync(process.execPath,args,{encoding:'utf8',maxBuffer:8*1024*1024});
// Generate once, then prove regeneration preserves every generated mapping byte.
const generators=['build-fields.mjs','build-media.mjs','build-copy-decisions.mjs'];
for(const script of generators)run(['tools/exact-legacy/phase3/'+script]);
const generated=readdirSync(docs).filter(p=>p!=='verification.json'&&/\.(json|csv)$/.test(p)).sort();
const hashes=()=>generated.map(path=>({path,sha256:sha(docs+'/'+path)}));
const first=hashes();for(const script of generators)run(['tools/exact-legacy/phase3/'+script]);assert.deepEqual(hashes(),first);
const summary=read(docs+'/mapping-summary.json'),media=read(docs+'/media-summary.json'),copy=read(docs+'/copy-mapping.json');
const fields=read(docs+'/field-decision-ledger.json'),crosswalk=read(docs+'/source-record-crosswalk.json');
assert.equal(fields.length,566);assert.equal(new Set(fields.map(f=>f.key)).size,566);assert.equal(new Set(fields.map(f=>f.key.split('.')[0])).size,45);
assert.equal(summary.relations,48);assert.equal(summary.correction.removedCommentLines.length,9);assert.equal(crosswalk.recordCrosswalk.length,0);
assert.ok(fields.every(f=>!f.sourceValueAvailable&&!f.replacementApproved));assert.equal(summary.productAdditionsAllowed,false);assert.equal(summary.archivedProductImportsAllowed,false);
assert.equal(media.slots,78);assert.equal(media.metadataErrors,0);assert.equal(media.missingBundledUsages,0);assert.ok(Object.values(media.writes).every(v=>v===0));
assert.equal(copy.conflicts,20);assert.equal(copy.unchanged,4);assert.equal(copy.changesApplied,0);
const before=read(privateDir+'/before-private.json'),after=read(privateDir+'/after-private.json');
assert.ok(before.readOnly&&after.readOnly);assert.deepEqual(before.tables,after.tables);assert.deepEqual(before.source,after.source);
assert.ok(after.source.every(f=>sha(f.path)===f.sha256),'Application/media changed after preservation snapshot');
const browser=read(privateDir+'/browser-checks.json');assert.equal(browser.checks.length,8);assert.ok(browser.checks.every(c=>c.pass));
const tests=run(['--test','tools/exact-legacy/phase3/mapping.test.mjs','tools/exact-legacy/reconcile.test.mjs']);writeFileSync(privateDir+'/tests.log',tests);
const testCount=Number(tests.match(/^# tests (\d+)$/m)?.[1]);assert.equal(testCount,46);assert.match(tests,/^# fail 0$/m);
const lint=run(['node_modules/eslint/bin/eslint.js','tools/exact-legacy/phase3','tools/exact-legacy/inventory.mjs']);writeFileSync(privateDir+'/lint.log',lint);
execFileSync('git',['diff','--check'],{stdio:'pipe'});
const privatePaths=['before-private.json','after-private.json','drive-refresh-private.json','drive-media-mapping-private.json','copy-decisions-private.json','current-media-usage-private.json','browser-checks.json','mapping-desktop.png','mapping-mobile.png'];
for(const path of privatePaths)execFileSync('git',['check-ignore','--quiet',privateDir+'/'+path]);
const report={
 at:new Date().toISOString(),baseCommit:summary.baseCommit,sourceCommit:summary.sourceCommit,status:'CONTRACT_AND_AVAILABLE_FILE_MAPPING_VERIFIED_LOCALLY',
 scope:'Mapping only; no installed app/schema extension, original editing, association application or migration',
 checks:{mappingFields:566,entities:45,relationshipContracts:48,mediaSlots:78,mediaFamilies:9,deterministicGeneratedArtifacts:generated.length,unitTests:testCount,unitFailures:0,scopedLint:'PASS',browserChecks:browser.checks.length,browserFailures:0,diffCheck:'PASS',privateEvidenceIgnored:true},
 preservation:{scope:after.scope,productionBaseline:false,readOnly:true,unchangedBusinessTables:after.tables.length,unchangedBusinessRows:after.tables.reduce((n,t)=>n+t.rows,0),unchangedCatalogueRows:after.tables.find(t=>t.table==='rivya_catalogue').rows,unchangedApplicationAndMediaFiles:after.source.length,studioLoginSourceUnchanged:true},
 comparisons:{bundledCopyStates:copy.statesCompared,conflictsKeptCurrent:copy.conflicts,identicalCopyStates:copy.unchanged,existingMediaReferences:media.currentUsageReferences,missingBundledReferences:media.missingBundledUsages,oldAssetsWithExactDestinationBytes:media.sourceFilesWithExactByteMatches},
 exclusions:{productsAdded:0,productRowsChanged:0,archivedCatalogueOrSheetsImports:0,sourceDatabaseRecordsInvented:0,databaseWrites:0,mediaBytesOrAssociationsChanged:0,cloudWrites:0,published:0,pushed:0,deployed:0},
 limits:['Source DB owner-reported deleted; no real record crosswalk can be verified.','Drive inventory mixes 280 refreshed metadata observations and 533 dated observations; 787 originals remain unassigned.','Remote byte identity/dimensions and Photos file-level identities are unverified.','Proposed schema/editor/media extensions and derivative preparation are subsequent work, not completed by mapping.','Current app build was not rebuilt; its 897 tracked source/media files are byte-identical. Earlier app test/build receipts retain their original scope.'],
 artifacts:first,evidence:{privateRoot:'test-results/exact-legacy-2026-10-21/phase3/',screenshots:browser.screenshots,mappingPreview:'http://127.0.0.1:4213/',appPreview:'http://127.0.0.1:4210/',phase2Comparisons:'http://127.0.0.1:4211/'}
};
writeFileSync(docs+'/verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,...report.checks,preservation:report.preservation},null,2));
