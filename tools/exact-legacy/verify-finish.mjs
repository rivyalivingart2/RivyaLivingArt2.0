/** Validate saved private evidence; no database access or production operations. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
const root=resolve('test-results/exact-legacy-2026-10-21');
const docs='docs/restoration/exact-legacy-2026-10-21';
const read=name=>JSON.parse(readFileSync(resolve(root,name),'utf8'));
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
const build=read('runtime/build.json');
const protectedRows=readFileSync(docs+'/inventory/protected-source.csv','utf8').trim().split(/\r?\n/).slice(1).map(row=>row.split(',').map(v=>v.replaceAll('"','')));
for(const [file,expected] of protectedRows)assert.equal(hash(file),expected,file);
const source=resolve('../OLDWEBSITE-reference');
assert.equal(execFileSync('git',['status','--porcelain'],{cwd:source,encoding:'utf8'}).trim(),'','Pinned old source must remain clean');
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
assert.equal(sourceCommit,'2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6');
const media=JSON.parse(readFileSync(docs+'/inventory/foundation-media.json','utf8'));
for(const m of media){assert.equal(m.sourceCommit,sourceCommit);assert.equal(hash(m.destination),m.sha256);assert.equal(hash(resolve(source,m.source)),m.sha256);}
const captures=read('finish-captures.json');assert.equal(new Set(captures.map(c=>c.path)).size,captures.length);
for(const c of captures){
 assert.match(c.path,/^screenshots\/finish-[a-z0-9-]+\.jpg$/);
 const metadata=await sharp(resolve(root,c.path)).metadata();
 assert.equal(metadata.width,c.width,c.path);assert.equal(metadata.height,c.height,c.path);assert.equal(c.width,c.requestedWidth);
 if(c.label==='candidate'){assert.equal(c.buildId,build.buildId,c.path);assert.ok(Date.parse(c.at)>Date.parse(build.at),c.path);assert.equal(c.height,640,'Current viewport captures avoid tall offscreen compositor tiling');const paired=captures.find(r=>r.label==='old'&&r.family===c.family&&r.width===c.width);if(paired)assert.equal(paired.height,c.height,'Matched reference viewport height');}
 if(c.scope==='old-live-deployment')assert.equal(c.sourceCommit,undefined,'Live deployment is not assumed equal to pinned source');
}
const layouts=read('finish-layouts.json');assert.equal(layouts.length,64);
assert.equal(new Set(layouts.map(c=>c.family+':'+c.width)).size,64);
for(const c of layouts){assert.ok(c.scrollWidth<=c.width);assert.equal(c.h1,1);assert.equal(c.brokenVisibleImages,0);assert.equal(c.unavailableImages,0);}
const login=read('finish-login-geometry.json');assert.deepEqual(login.map(c=>c.width),[1440,390]);for(const c of login)assert.equal(c.identical,true);
const observations=read('finish-checks.json');assert.ok(observations.length>=17);for(const c of observations)assert.equal(c.passed,true,c.name);
const suites={unit:411,http:403,preflight:12};
for(const [name,count] of Object.entries(suites)){const log=readFileSync(resolve(root,`runtime/${name}-finish.log`),'utf8');assert.ok(log.includes(`# pass ${count}`),name);assert.ok(log.includes('# fail 0'),name);}
assert.ok(readFileSync(resolve(root,'runtime/lint-finish.log'),'utf8').includes('0 errors, 62 warnings'));
const newsletter=read('newsletter-verification.json');assert.equal(newsletter.checks.length,7);
const data=read('finish-data-verification.json');assert.equal(data.latestBrowserSubscriptionPersistedExactlyOnce,true);
const old=read('old-runtime/observations.json');assert.equal(old.checks.discardedTitleUnchanged,true);assert.equal(old.checks.subscriberSavedExactlyOnce,true);
const result={at:new Date().toISOString(),build,scope:'LOCAL_PHASE_1_2_CONTINUATION_NOT_FULL_COMPLETION',sourceCommit,sourceCheckoutUnchanged:true,protectedSourceFiles:protectedRows.length,protectedSourceUnchanged:true,foundationMedia:{files:media.length,bytes:media.reduce((n,m)=>n+m.bytes,0),sourceHashesMatch:true},suites,eslint:{errors:0,inheritedWarnings:62},screenshots:{total:captures.length,finalCandidate:captures.filter(c=>c.label==='candidate').length,dimensionsVerified:true,candidateBuildVerified:true,excluded:'Full-footer compositor clips showed fixed overlays; actual viewport captures are used instead.'},layoutChecks:layouts.length,widths:[...new Set(layouts.map(c=>c.width))],login:{widths:login.map(c=>c.width),elements:7,identicalGeometry:true,sourceUnchanged:true},browserObservations:observations.length,browserObservationScope:'Recorded during this continuation; not all observations were repeated after the final CSS-only badge and separator adjustments.',newsletter:{checks:newsletter.checks,latestBrowserPersistedExactlyOnce:true,externalMessages:0},oldIsolatedObservations:{readOnlyVerification:true,discardedTitleUnchanged:true,subscriberSavedExactlyOnce:true,http:old.http,systemComponentStatusNotVerified:true},limitations:['Real old database baseline remains blocked by access; synthetic records cannot establish source records, counts or relationships.','No refreshed live destination row-digest comparison in this UI continuation.','Old isolated runtime uses documented local fonts, locale routing, crypto import and error-route adapters; vector workflows are not tested.','Old unpublished, archived and missing route probes returned HTTP 200; this is an observed old status defect, not a passing status-parity claim.','Representative Phase 2 compositions do not certify every Phase 4 route, role, error state or workflow.','Protected copy, logos, controls and data change wrapping and full-page heights; no pixel-identical whole-site claim.','No real record migration, CMS publication, push, PR, merge, deployment, external message or paid service.']};
writeFileSync(resolve(root,'finish-verification-private.json'),JSON.stringify({...result,captures,layouts,observations,login},null,2)+'\n');
writeFileSync(docs+'/phase12-finish-verification.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({build:build.buildId,protectedFiles:protectedRows.length,media:media.length,suites,screenshots:result.screenshots,layouts:layouts.length,observations:observations.length},null,2));
