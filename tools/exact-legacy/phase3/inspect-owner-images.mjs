/** Lossless decoding/orientation working copies; originals are never rewritten. */
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import sharp from 'sharp';
const exec=promisify(execFile),root=resolve('test-results/exact-legacy-2026-10-21/phase3-completion');
const input=JSON.parse(await readFile(resolve(root,'download-verification-private.json'),'utf8')).records;
const hash=b=>createHash('sha256').update(b).digest('hex'),exists=async p=>{try{await access(p);return true;}catch{return false;}};
await mkdir(resolve(root,'inspection'),{recursive:true});await mkdir(resolve(root,'decoded-heif'),{recursive:true});await mkdir(resolve(root,'review'),{recursive:true});
const results=[];
async function inspect(r){
 assert.ok(r.sha256&&!r.error);const source=resolve(root,r.original),bytes=await readFile(source);assert.equal(hash(bytes),r.sha256);
 const target='inspection/owner-'+String(r.index).padStart(3,'0')+'.png';let working=source;
 if(r.dimensions.format==='heif'){
  working=resolve(root,'decoded-heif/owner-'+String(r.index).padStart(3,'0')+'.png');
  if(!await exists(working))await exec('heif-convert.exe',[source,working],{windowsHide:true,maxBuffer:1000000});
 }
 if(!await exists(resolve(root,target)))await sharp(working).rotate().resize({width:1600,height:2000,fit:'inside',withoutEnlargement:true}).png().toFile(resolve(root,target));
 const inspection=await readFile(resolve(root,target)),m=await sharp(inspection).metadata();assert.equal(hash(await readFile(source)),r.sha256);
 const review='review/owner-'+String(r.index).padStart(3,'0')+'.jpg';
 if(!await exists(resolve(root,review)))await sharp(inspection).resize({width:1600,height:2000,fit:'inside',withoutEnlargement:true}).jpeg({quality:95}).toFile(resolve(root,review));
 return {index:r.index,original:r.original,originalSha256:r.sha256,inspection:target,inspectionSha256:hash(inspection),review,reviewSha256:hash(await readFile(resolve(root,review))),width:m.width,height:m.height,conversion:r.dimensions.format==='heif'?'libheif HEVC decode to PNG':'orientation and inspection resize only',originalPreserved:true};
}
for(let offset=0;offset<input.length;offset+=4){const slice=input.slice(offset,offset+4),settled=await Promise.allSettled(slice.map(inspect));for(let i=0;i<settled.length;i++){const r=settled[i];results.push(r.status==='fulfilled'?r.value:{index:slice[i].index,error:'Decode or source validation failed'});}await writeFile(resolve(root,'inspection-private.json'),JSON.stringify({at:new Date().toISOString(),records:results},null,2)+'\n');console.log(JSON.stringify({inspected:results.length,total:input.length,errors:results.filter(r=>r.error).length}));}
if(results.some(r=>r.error))process.exitCode=1;
