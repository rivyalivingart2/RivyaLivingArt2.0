/** Validate saved, private browser evidence. Never connects to a database. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=resolve('test-results/exact-legacy-2026-10-21');
const read=name=>JSON.parse(readFileSync(resolve(root,name),'utf8'));
const build=read('runtime/build.json');
const protectedRows=readFileSync('docs/restoration/exact-legacy-2026-10-21/inventory/protected-source.csv','utf8').trim().split(/\r?\n/).slice(1).map(row=>row.split(',').map(v=>v.replaceAll('"','')));
for(const [file,hash] of protectedRows)assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,file);
const captures=read('phase12-captures.json');
assert.equal(new Set(captures.map(c=>c.path)).size,captures.length);
for(const c of captures){
 assert.match(c.path,/^screenshots\/phase12-[a-z0-9-]+\.jpg$/);
 const metadata=await sharp(resolve(root,c.path)).metadata();
 assert.equal(metadata.width,c.width,c.path);assert.equal(metadata.height,c.height,c.path);
 assert.equal(c.width,c.requestedWidth);assert.equal(c.buildId,build.buildId,c.path);
 assert.ok(Date.parse(c.at)>Date.parse(build.at),c.path);
}
const layouts=read('phase12-layouts.json');assert.equal(layouts.length,64);
for(const c of layouts){assert.ok(c.scrollWidth<=c.width,`${c.family} ${c.width}`);assert.equal(c.h1,1);assert.equal(c.brokenVisibleImages,0);}
const interactions=read('phase12-interactions.json');assert.ok(interactions.length>=20);
for(const c of interactions)assert.equal(c.passed,true,c.name);
const suites={unit:409,http:403,preflight:12};
for(const [suite,count] of Object.entries(suites)){const log=readFileSync(resolve(root,`runtime/${suite}-phase12.log`),'utf8');assert.ok(log.includes(`# pass ${count}`),suite);assert.ok(log.includes('# fail 0'),suite);}
const lint=readFileSync(resolve(root,'runtime/lint-full-phase12.log'),'utf8');assert.ok(lint.includes('0 errors, 62 warnings'));
const audit={production:read('runtime/audit-production-phase12.json').metadata.vulnerabilities,all:read('runtime/audit-all-phase12.json').metadata.vulnerabilities};assert.equal(audit.production.total,0);
const provenance=JSON.parse(readFileSync('docs/restoration/exact-legacy-2026-10-21/inventory/phase12-source-provenance.json','utf8'));
assert.equal(provenance.material.frames,121);assert.equal(provenance.material.exactHashesMatch,true);
const result={at:new Date().toISOString(),build,scope:'LOCAL_PHASE_1_DISCOVERY_AND_PHASE_2_REPRESENTATIVE_FOUNDATIONS',protectedSourceFiles:protectedRows.length,protectedSourceUnchanged:true,suites,eslint:{errors:0,inheritedWarnings:62},audit,screenshots:captures.length,screenshotDimensionsAndBuildVerified:true,layoutChecks:layouts.length,widths:[...new Set(layouts.map(c=>c.width))],interactions,provenance,limitations:['Source live SQL export remains unavailable; no source record-level reconciliation or migration acceptance.','Destination live data digests were verified at the earlier Phase 1 continuation, not refreshed by this UI-only slice.','Different protected records and retained baselines are not a pixel-equivalence or identity-mapping claim.','Project preview uses explicitly synthetic concept data; no actual project/review evidence is invented.','Scraper source register is a working Phase 2 shell only; no extraction/import/jobs are implemented by this checkpoint.','Resized desktop viewports do not certify physical phones, screen readers, real providers or every conditional workflow.','No production migration, CMS publication, push, merge or deployment.']};
writeFileSync(resolve(root,'phase12-verification-private.json'),JSON.stringify({...result,captures,layouts},null,2)+'\n');
writeFileSync('docs/restoration/exact-legacy-2026-10-21/phase12-verification.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({build:build.buildId,protectedFiles:protectedRows.length,suites,screenshots:captures.length,layouts:layouts.length,interactions:interactions.length},null,2));
