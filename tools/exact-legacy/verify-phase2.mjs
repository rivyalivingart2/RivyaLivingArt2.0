/** Verify local evidence, protected source bytes and private destination digests. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=resolve('test-results/exact-legacy-2026-10-21');
const json=path=>JSON.parse(readFileSync(resolve(root,path),'utf8'));
const protectedRows=readFileSync('docs/restoration/exact-legacy-2026-10-21/inventory/protected-source.csv','utf8').trim().split(/\r?\n/).slice(1).map(line=>line.split(',').map(v=>v.replaceAll('"','')));
for(const [file,hash] of protectedRows)assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,file);
const before=json('live/phase1-destination-before-private.json'),after=json('live/phase2-destination-after-private.json');
assert.equal(before.readOnly,true);assert.equal(after.readOnly,true);
assert.deepEqual(before.identity,after.identity);
assert.deepEqual(before.summary,after.summary,'Runtime-visible row scope changed; investigate without overwriting');
const captures=json('phase2-captures.json'),baseline=json('captures.json');
assert.equal(new Set(captures.map(c=>c.path)).size,captures.length);
for(const capture of captures){assert.match(capture.path,/^screenshots\/[a-z0-9-]+\.jpg$/);const info=await sharp(resolve(root,capture.path)).metadata();assert.equal(info.width,capture.width,capture.path);assert.equal(info.height,capture.height,capture.path);}
const login=[];
for(const current of captures.filter(c=>c.family==='login'&&c.label==='candidate')){
 const prior=baseline.find(c=>c.family==='login'&&c.label==='current'&&c.width===current.width);
 assert.ok(prior);assert.equal(prior.height,current.height);
 const [a,b]=await Promise.all([prior,current].map(c=>sharp(resolve(root,c.path)).removeAlpha().raw().toBuffer()));
 assert.equal(a.length,b.length);let sum=0,changed=0;
 for(let i=0;i<a.length;i++){const difference=Math.abs(a[i]-b[i]);sum+=difference;if(difference>12)changed++;}
 login.push({width:current.width,height:current.height,meanChannelDifference:Number((sum/a.length).toFixed(4)),channelsOver12Percent:Number((changed/a.length*100).toFixed(4))});
}
const browser=json('phase2-browser-checks.json');assert.equal(browser.length,8);for(const c of browser){assert.ok(c.scrollWidth<=c.width);assert.equal(c.headerHeight,80);assert.equal(c.overlay,'block');}
assert.equal(login.length,8,'All eight protected-login counterparts required');
const result={at:new Date().toISOString(),build:json('runtime/build.json'),protectedSourceFiles:protectedRows.length,protectedSourceUnchanged:true,runtimeVisibleTableScopes:Object.keys(before.summary).length,runtimeVisibleDigestsUnchanged:true,additionalCaptureFiles:captures.length,dimensionsVerified:true,viewportChecks:browser,loginPixelComparison:login,limitations:['Runtime-visible destination scope only; source database export remains unavailable.','JPEG pixels are a comparison measure, not an assertion of byte-identical dynamic rendering.','No release, complete motion parity, physical-device or complete workflow acceptance is implied.']};
writeFileSync(resolve(root,'phase2-verification-private.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
