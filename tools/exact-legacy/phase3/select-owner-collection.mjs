/** Record the owner's explicit choice of the earlier 4215 image set for local website use. */
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {collectionRoot,inside,digest,immutable} from './prepare-owner-collection.mjs';
const root=resolve(collectionRoot,'../phase3-website-selection');
await mkdir(root,{recursive:true});
const collection=JSON.parse(await readFile(inside(collectionRoot,'collection-private.json'),'utf8'));
assert.equal(collection.records.length,169);
const images=[];
for(const r of collection.records){
 assert.equal(r.classification,'design-visualization');
 assert.equal(digest(await readFile(inside(collectionRoot,r.original))),r.originalSha256);
 const files=r.variants.map(f=>({width:f.width,path:f.path,sha256:f.sha256}));
 for(const f of files)assert.equal(digest(await readFile(inside(collectionRoot,f.path))),f.sha256);
 images.push({index:r.index,category:r.review.category,classification:'design-visualization',variants:files});
}
const selection={schemaVersion:1,sourceCheckpoint:'c88071a',selectedCollection:'phase3-completion',scope:'local-website-only',ownerSelected:true,photosExcluded:true,cutoutExperimentSelected:false,productionPublicationApproved:false,featured:[6,7,8,30,33,44],images};
await immutable(inside(root,'selection-private.json'),Buffer.from(JSON.stringify(selection,null,2)));
const annotation={date:'2026-10-24',source:'Direct owner chat and browser annotation on the 4215 gallery',ownerInstruction:'Use the previous 169 created images shown in the original gallery in the website; reject the newer cutout experiment.',scope:'Local website only. Preserve existing data, media relationships and Studio login. No products or archived imports.',interpretation:'Aesthetic selection for illustrated website presentation, not evidence of exact documentary fidelity or genuine customer/project identities.',photos:'Owner excludes Google Photos as the same collection as Drive. Independent library equality is not claimed.'};
await immutable(inside(root,'owner-annotation-private.json'),Buffer.from(JSON.stringify(annotation,null,2)));
await writeFile(inside(root,'selection-summary.json'),JSON.stringify({images:169,featured:selection.featured.length,sourceCheckpoint:selection.sourceCheckpoint,source:'previous AI collection at port 4215',ownerSelected:true,scope:selection.scope,photosExcluded:true,newCutoutsUsed:0,productsAdded:0,archivedImports:0,published:0},null,2));
console.log(JSON.stringify({images:169,featured:6,localOnly:true,newCutoutsUsed:0,productsAdded:0,published:0}));
