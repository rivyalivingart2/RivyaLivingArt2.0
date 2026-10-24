/** Materialize only connector-returned owner image references into private local evidence. */
import assert from 'node:assert/strict';
import {readFile,writeFile,readdir,mkdir,stat} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const root=resolve('test-results/exact-legacy-2026-10-21/phase3-completion');
const hash=b=>createHash('sha256').update(b).digest('hex');
const inventory=JSON.parse(await readFile(resolve(root,'owner-inventory-private.json'),'utf8'));
const batches=(await readdir(root)).filter(n=>/^download-batch-\d+-private\.json$/.test(n));
const refs=(await Promise.all(batches.map(n=>readFile(resolve(root,n),'utf8').then(JSON.parse)))).flat();
const receipts=[];
function target(path){const full=resolve(root,path),rel=relative(root,full);assert.ok(rel&&!rel.startsWith('..')&&!rel.includes(':'));assert.match(path,/^originals\/owner-\d{3}\.(jpg|heif)$/);return full;}
async function materialize(file){
 const output=target(file.localOriginal);let bytes;
 try{await stat(output);bytes=await readFile(output);}catch(e){
  if(e.code!=='ENOENT')throw e;
  const ref=refs.find(r=>r.index===file.index);assert.ok(ref&&!ref.error,'Missing connector download reference');
  const url=new URL(ref.url);assert.equal(url.protocol,'https:');assert.ok(url.hostname.endsWith('.oaiusercontent.com'));assert.ok(url.pathname.startsWith('/files/'));
  const response=await fetch(url,{signal:AbortSignal.timeout(60000)});assert.equal(response.status,200,'Authenticated source download status');
  assert.ok(Number(response.headers.get('content-length')||0)<=40000000);
  const chunks=[];let count=0;for await(const chunk of response.body){count+=chunk.length;assert.ok(count<=40000000,'Image download exceeds local limit');chunks.push(chunk);}
  bytes=Buffer.concat(chunks);assert.equal(bytes.length,Number(ref.expectedBytes),'Connector byte length mismatch');
  assert.equal(bytes.length,file.bytes,'Inventory byte length mismatch');await mkdir(dirname(output),{recursive:true});await writeFile(output,bytes,{flag:'wx'});
 }
 assert.equal(bytes.length,file.bytes,'Preserved source byte length mismatch');
 let dimensions,decodeError;try{const m=await sharp(bytes).metadata();dimensions={format:m.format,width:m.width,height:m.height,orientation:m.orientation||1,pages:m.pages||1};}catch{decodeError='Local raster decoder cannot read this source format';}
 return {index:file.index,id:file.id,original:file.localOriginal,bytes:bytes.length,sha256:hash(bytes),dimensions,decodeError,originalPreserved:true};
}
for(let offset=0;offset<inventory.files.length;offset+=6){
 const slice=inventory.files.slice(offset,offset+6),results=await Promise.allSettled(slice.map(materialize));
 for(let i=0;i<results.length;i++){const result=results[i];receipts.push(result.status==='fulfilled'?result.value:{index:slice[i].index,error:result.reason instanceof assert.AssertionError?result.reason.message:'Source download failed'});}
 await writeFile(resolve(root,'download-verification-private.json'),JSON.stringify({at:new Date().toISOString(),records:receipts},null,2)+'\n');
 console.log(JSON.stringify({processed:receipts.length,total:inventory.files.length,errors:receipts.filter(r=>r.error).length}));
}
const groups=new Map();for(const r of receipts.filter(r=>r.sha256)){const group=groups.get(r.sha256)||[];group.push(r.index);groups.set(r.sha256,group);}
const summary={at:new Date().toISOString(),sources:inventory.files.length,downloaded:receipts.filter(r=>r.sha256).length,errors:receipts.filter(r=>r.error).length,decodeErrors:receipts.filter(r=>r.decodeError).length,distinctByteHashes:groups.size,duplicateGroups:[...groups.values()].filter(g=>g.length>1),formats:receipts.reduce((a,r)=>{if(r.dimensions)a[r.dimensions.format]=(a[r.dimensions.format]||0)+1;return a;},{})};
await writeFile(resolve(root,'download-summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));if(summary.errors)process.exitCode=1;
