/** Publish aggregate receipts only. Never copy private captured text or row data. */
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const root=resolve('test-results/exact-legacy-2026-10-21'),out=resolve('docs/restoration/exact-legacy-2026-10-21');
const read=path=>readFileSync(resolve(root,path),'utf8');
const json=path=>JSON.parse(read(path));
const tests=path=>{const log=read(path);const result={tests:Number(log.match(/^# tests (\d+)/m)?.[1]),pass:Number(log.match(/^# pass (\d+)/m)?.[1]),fail:Number(log.match(/^# fail (\d+)/m)?.[1])};assert.ok(result.tests>0&&result.tests===result.pass&&result.fail===0,'Test log must confirm passing suite: '+path);return result;};
const captures=json('captures.json');assert.equal(new Set(captures.map(c=>c.path)).size,captures.length,'Duplicate captures');
for(const c of captures){
 assert.match(c.path,/^screenshots\/[a-z0-9-]+\.jpg$/);
 assert.equal(c.captureMethod,'Selected tab native viewport with CDP capture','Uncorrected capture: '+c.path);
 const pixels=await sharp(resolve(root,c.path)).metadata();
 assert.equal(pixels.width,c.width,'Saved image width differs: '+c.path);
 assert.equal(pixels.height,c.height,'Saved image height differs: '+c.path);
}
const observations=captures.map(c=>({site:c.label,family:c.family,route:c.family==='studio-product-editor'?'/studio/products/[record]':c.route,width:c.width,height:c.height,scrollWidth:c.scrollWidth,motion:c.motion,pixelDimensionsVerified:true,scope:c.scope==='isolated-current-login'?'isolated unchanged current login':c.family.startsWith('studio-')?'authenticated read-only viewport':'public viewport'}));
for(const c of observations){assert.ok(c.width>0&&c.height>0);assert.ok(!/[?@]/.test(c.route));}
const protectedSource=readFileSync(resolve(out,'inventory/protected-source.csv'),'utf8');let protectedCount=0;
for(const match of protectedSource.matchAll(/^"([^"]+)","([a-f0-9]{64})"/gm)){
 assert.equal(createHash('sha256').update(readFileSync(resolve(match[1]))).digest('hex'),match[2],'Protected source changed: '+match[1]);protectedCount++;
}
assert.equal(protectedCount,21);
const fullAudit=JSON.parse(read('npm-audit-current.json').split(/\r?\nnpm notice/)[0]);
const productionAudit=json('npm-audit-production.json');
const assets=json('drive-manifest.json');
const receipt={schemaVersion:1,at:new Date().toISOString(),scope:'phase-1-local-baseline-not-restoration-acceptance',node:process.version,tests:{baselineUnit:tests('baseline-unit.log'),preflight:tests('baseline-preflight-final.log'),reconciliationAndGuard:tests('restoration-tests.log')},build:json('runtime/build.json'),dependencyAudit:{production:productionAudit.metadata.vulnerabilities,all:fullAudit.metadata.vulnerabilities,affectedPackages:Object.keys(fullAudit.vulnerabilities)},protectedSourceFilesUnchanged:protectedCount,liveDatabaseRowHashesCompared:false,localDatabase:{...json('runtime/receipt.json'),transport:json('runtime/transport-verification.json')},captures:{count:observations.length,families:new Set(observations.map(c=>c.family)).size,observations},drive:{folders:assets.folders.length,byteDeduplication:false,originalsModified:0},productionBusinessWrites:0,publishedRecords:0,releasePerformed:false,limits:['Read-only live UI observations do not certify mutation workflows.','Source field mapping is provisional; no live row reconciliation.','Screenshots are viewport/reduced-motion lab evidence, not complete animation/device/accessibility acceptance.','Source fixtures are distinct from current production data.','Local SQL adapter does not certify production Neon transport or external providers.']};
writeFileSync(resolve(out,'verification.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({tests:receipt.tests,captures:receipt.captures.count,protectedSourceFilesUnchanged:protectedCount,productionVulnerabilities:receipt.dependencyAudit.production.total,releasePerformed:false},null,2));
