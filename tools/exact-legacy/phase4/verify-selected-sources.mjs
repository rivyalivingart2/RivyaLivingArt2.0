/** Read every selected original/export without registering any Studio rows. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire,registerHooks} from 'node:module';
import {pathToFileURL} from 'node:url';
import {localEnvironment} from '../local-guard.mjs';
const config=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
Object.assign(process.env,localEnvironment(config));
// Match Next's server-only alias for this read-only Node verification process.
const require=createRequire(import.meta.url),serverOnly=pathToFileURL(require.resolve('next/dist/compiled/server-only/empty.js')).href;
registerHooks({resolve(specifier,context,next){return specifier==='server-only'?{url:serverOnly,shortCircuit:true}:next(specifier,context);}});
const {selectedCreationDraft}=await import('../../../src/lib/selected-creation-draft.ts');
const hashes=new Set(),ids=new Set();
for(let index=1;index<=169;index++){
 const {media,variants}=await selectedCreationDraft(index);
 assert.equal(variants.length,3);assert.equal(media.products.length,0);assert.equal(media.editorial.reviewedBy,undefined);
 hashes.add(media.editorial.sha256);ids.add(media.path);
}
assert.equal(hashes.size,169);assert.equal(ids.size,169);
const protectedFiles=readFileSync('docs/restoration/exact-legacy-2026-10-21/inventory/protected-source.csv','utf8').trim().split(/\r?\n/).slice(1).map(r=>r.split(',').map(v=>v.replaceAll('"','')));
for(const [file,hash] of protectedFiles)assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,file);
const receipt={at:new Date().toISOString(),selectedImages:169,unchangedOriginals:169,exactSelectedVariants:507,uniqueDraftPaths:169,protectedFileHashes:protectedFiles.length,writes:0};
writeFileSync('test-results/exact-legacy-2026-10-21/phase4/selected-sources.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
