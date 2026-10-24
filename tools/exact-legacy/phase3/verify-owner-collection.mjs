/** Validate private delivery bytes and preview boundaries, without touching business data. */
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdtemp, rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {request} from 'node:http';
import {once} from 'node:events';
import sharp from 'sharp';
import {unzipSync} from 'fflate';
import {collectionRoot as root, digest, inside, immutable, standardize} from './prepare-owner-collection.mjs';
import {makeServer, allowedPath} from './serve-owner-collection.mjs';
const read = async path => JSON.parse(await readFile(inside(root,path),'utf8'));
const collection=await read('collection-private.json'), gallery=await read('gallery.json'), inspections=await read('inspection-private.json');
const complete=!process.argv.includes('--partial');
assert.equal(collection.sourceImages,169);
if(complete){assert.equal(collection.editedCandidates,169);assert.deepEqual(collection.missing,[]);}
assert.equal(collection.records.length,collection.editedCandidates); assert.equal(gallery.images.length,collection.editedCandidates);
assert.equal(new Set(collection.records.map(r=>r.index)).size,collection.records.length);
let files=0,maxWebpBytes=0;
for(const r of collection.records){
 assert.equal(r.classification,'design-visualization');assert.equal(r.assignment,null);assert.equal(r.publicationApproved,false);
 assert.ok(r.review.flags.includes('fidelity-review'));assert.ok(r.prompt.length>20);
 for(const [path,hash] of [[r.original,r.originalSha256],[r.generationMaster,r.generationMasterSha256],[r.normalizedPath,r.normalizedSha256]]){assert.equal(digest(await readFile(inside(root,path))),hash);files++;}
 const inspection=inspections.records.find(i=>i.index===r.index);assert.ok(inspection&&!inspection.error);assert.equal(digest(await readFile(inside(root,r.reviewSource))),inspection.reviewSha256);files++;
 for(const f of [r.jpeg,...r.variants]){
  const bytes=await readFile(inside(root,f.path)),metadata=await sharp(bytes).metadata();assert.equal(digest(bytes),f.sha256);assert.equal(bytes.length,f.bytes);
  assert.equal(metadata.width,f.width);assert.equal(metadata.height,f.height);assert.equal(metadata.width/metadata.height,0.8);
  assert.equal(metadata.format,f===r.jpeg?'jpeg':'webp');assert.equal(metadata.exif,undefined);
  if(f!==r.jpeg){assert.ok(bytes.length<=600000);maxWebpBytes=Math.max(maxWebpBytes,bytes.length);}files++;
 }
}
let archiveImages=0;
for(const archive of gallery.archives){
 const bytes=await readFile(inside(root,archive.path));assert.equal(digest(bytes),archive.sha256);const entries=unzipSync(bytes);
 const prompts=JSON.parse(new TextDecoder().decode(entries['prompts.json']));assert.equal(prompts.length,archive.images);archiveImages+=archive.images;
 assert.equal(Object.keys(entries).length,archive.images*4+2);
 for(const prompt of prompts){const record=collection.records.find(r=>r.index===prompt.image);assert.equal(prompt.prompt,record.prompt);for(const f of [record.jpeg,...record.variants])assert.equal(digest(entries[f.path.split('/').pop()]),f.sha256);}
}
assert.equal(archiveImages,collection.editedCandidates);
// A repeated byte write must be safe, while conflicting bytes must never overwrite a file.
const temporary=await mkdtemp(resolve(root,'verification-'));
try{const file=inside(temporary,'sample.bin');await immutable(file,Buffer.from('original'));await immutable(file,Buffer.from('original'));await assert.rejects(immutable(file,Buffer.from('different')));assert.equal((await readFile(file)).toString(),'original');}
finally{assert.ok(temporary.startsWith(root+'\\')||temporary.startsWith(root+'/'));await rm(temporary,{recursive:true});}
for(const name of ['../secret','C:/secret','/secret'])assert.throws(()=>inside(root,name));
for(const name of ['collection-private.json','originals/owner-001.jpg','generated-record-007-private.json','../gallery.json'])assert.equal(allowedPath(name),false);
// Verify no crop in normalization: original proportions remain inside a 4:5 canvas.
const sample=await sharp({create:{width:120,height:300,channels:3,background:'#ff0000'}}).png().toBuffer();
const contained=await standardize(sample),pixels=await sharp(contained).raw().toBuffer({resolveWithObject:true});
assert.equal(pixels.info.width,1600);assert.equal(pixels.info.height,2000);assert.deepEqual([...pixels.data.subarray(0,3)],[8,40,58]);
const server=makeServer();server.listen(0,'127.0.0.1');await once(server,'listening');const port=server.address().port;
const get=(path,headers={},method='GET')=>new Promise((accept,reject)=>{const req=request({hostname:'127.0.0.1',port,path,method,headers:{host:'127.0.0.1:4215',...headers}},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>accept({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)}));});req.on('error',reject);req.end();});
let httpChecks=0;
try{
 for(const [path,headers,method,status] of [['/',{},'GET',200],['/gallery.json',{},'GET',200],['/gallery.json',{},'HEAD',200],['/collection-private.json',{},'GET',404],['/originals/owner-001.jpg',{},'GET',404],['/%2e%2e/owner-inventory-private.json',{},'GET',404],['/gallery.json',{host:'evil.example'},'GET',403],['/gallery.json',{origin:'https://evil.example'},'GET',403],['/gallery.json',{'sec-fetch-site':'cross-site'},'GET',403],['/gallery.json',{},'POST',403]]){
  const response=await get(path,headers,method);assert.equal(response.status,status);if(method==='HEAD')assert.equal(response.body.length,0);httpChecks++;
 }
 const image=await get('/'+collection.records[0].jpeg.path);assert.equal(image.status,200);assert.equal(image.headers['content-type'],'image/jpeg');assert.equal(digest(image.body),collection.records[0].jpeg.sha256);httpChecks++;
 const payload=(await get('/gallery.json')).body.toString();assert.ok(!payload.includes('drive.google')&&!payload.includes('prompt')&&!payload.includes('originalSha256'));
}finally{await new Promise(resolve=>server.close(resolve));}
const report={at:new Date().toISOString(),complete,sourceImages:169,editedCandidates:collection.editedCandidates,originalsVerified:collection.records.length,imageExports:collection.records.length*4,filesHashed:files,archiveImages,archives:gallery.archives.length,maxWebpBytes,httpChecks,privateManifestsDenied:true,conflictingOverwriteDenied:true,containPreservesComposition:true,allCandidatesUnassigned:true,published:0,productsAdded:0,archivedImports:0};
await writeFile(inside(root,complete?'delivery-verification.json':'partial-delivery-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
