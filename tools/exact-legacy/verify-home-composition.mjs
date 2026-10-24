/** Private evidence verification for the second Phase 2 slice. No database access. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=resolve('test-results/exact-legacy-2026-10-21');
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const protectedRows=readFileSync('docs/restoration/exact-legacy-2026-10-21/inventory/protected-source.csv','utf8').trim().split(/\r?\n/).slice(1).map(line=>line.split(',').map(value=>value.replaceAll('"','')));
for(const [file,hash] of protectedRows)assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,file);
const captures=read('home2-captures.json'),build=read('runtime/build.json');
assert.equal(new Set(captures.map(c=>c.path)).size,captures.length);
for(const c of captures){assert.match(c.path,/^screenshots\/home2-[a-z0-9-]+\.jpg$/);const image=await sharp(resolve(root,c.path)).metadata();assert.equal(image.width,c.width,c.path);assert.equal(image.height,c.height,c.path);assert.equal(c.width,c.requestedWidth);if(c.label==='candidate'){assert.equal(c.buildId,build.buildId);assert.ok(Date.parse(c.at)>Date.parse(build.at));}}
const layouts=read('home2-browser-checks.json');assert.equal(layouts.length,8);
for(const c of layouts){assert.ok(c.scrollWidth<=c.width);assert.equal(c.h1,1);assert.equal(c.railCount,3);assert.equal(c.doorCount,6);assert.equal(c.masked,0);assert.equal(c.rulerDisplay,c.width>=1024?'block':'none');assert.equal(c.slots.length,11);}
const interactions=read('home2-interactions.json');assert.ok(interactions.length>=10);for(const check of interactions)assert.equal(check.passed,true,check.name);
const login=[],loginGeometry=read('home2-login-geometry.json');
for(const c of captures.filter(c=>c.family==='home2-login'&&c.label==='candidate')){
 // Compare fresh captures in the same confirmed reduced-motion state. The
 // historical login captures include an animated glass-gradient frame.
 const old=captures.find(b=>b.family==='home2-login'&&b.label==='current'&&b.width===c.width);assert.ok(old);
 const [a,b]=await Promise.all([old,c].map(x=>sharp(resolve(root,x.path)).removeAlpha().raw().toBuffer()));assert.equal(a.length,b.length);
 let sum=0,large=0;for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-b[i]);sum+=d;if(d>12)large++;}
 const difference={width:c.width,height:c.height,meanChannelDifference:Number((sum/a.length).toFixed(4)),channelsOver12Percent:Number((large/a.length*100).toFixed(4))};
 const before=loginGeometry.find(x=>x.width===c.width&&x.label==='current');
 const after=loginGeometry.find(x=>x.width===c.width&&x.label==='candidate');
 assert.ok(before.reduced&&after.reduced);assert.deepEqual(after.rects,before.rects);
 // Pixels remain diagnostic, not an exact-match claim: Chrome retained a
 // 1440px local image at mobile width while production selected 420px. The
 // protected source hash and all seven measured element bounds must match.
 login.push({...difference,pixelIdentical:a.equals(b),geometryIdentical:true,currentImageVariants:before.imageVariants,candidateImageVariants:after.imageVariants});
}
assert.equal(login.length,2);
const suites={unit:409,http:403,preflight:12};
for(const [suite,count] of Object.entries(suites)){const log=readFileSync(resolve(root,`runtime/${suite}-home.log`),'utf8');assert.ok(log.includes(`# pass ${count}`));assert.ok(log.includes('# fail 0'));}
const result={at:new Date().toISOString(),build,scope:'LOCAL_HOMEPAGE_FOUNDATION_ONLY',protectedSourceFiles:protectedRows.length,protectedSourceUnchanged:true,suites,additionalScreenshotFiles:captures.length,screenshotDimensionsVerified:true,layoutWidths:layouts.map(c=>c.width),layoutChecks:layouts,interactionChecks:interactions,loginPixelComparison:login,privateFixture:read('runtime/home-preview-fixture.json'),limitations:['Old live database export remains unavailable; no new live row-hash comparison was performed in this UI-only slice.','Current content/media differences and missing mapped slots prevent a claim of exact whole-page parity.','No production migration, CMS publication, GitHub push or deployment.','Resized browser viewports are not physical-device or screen-reader acceptance.']};
writeFileSync(resolve(root,'home2-verification-private.json'),JSON.stringify(result,null,2));
writeFileSync('docs/restoration/exact-legacy-2026-10-21/home-composition-verification.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({build:build.buildId,protectedSourceFiles:protectedRows.length,suites,screenshots:captures.length,layoutWidths:result.layoutWidths,interactions:interactions.length,login},null,2));
