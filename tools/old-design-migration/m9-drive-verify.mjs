import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='docs/editorial-production/m9/',refs=JSON.parse(await readFile('test-results/old-design-migration/m9/drive-readback-references.json','utf8')),media=JSON.parse(await readFile(root+'media-manifest.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex'),checks=[];
for(const ref of refs){
 const url=new URL(ref.file.download_url);assert.equal(url.protocol,'https:');assert.ok(url.hostname.endsWith('.oaiusercontent.com'));
 const response=await fetch(url);assert.equal(response.status,200,'Drive readback unavailable: '+ref.name);const bytes=Buffer.from(await response.arrayBuffer());assert.ok(bytes.length>0&&bytes.length<20000000);
 let expected;
 if(ref.kind==='image')expected=media.find(m=>m.key===ref.name).metadata.sha256;
 else{const path=ref.kind==='delivery'?'test-results/old-design-migration/m9/delivery/'+ref.name:'public/media/migration/'+({V03:'hero-pour-loop.mp4',V04:'hero-pour-loop.webm',A11:'hero-pour-loop-poster.jpg'}[ref.key]);expected=hash(await readFile(path));}
 assert.equal(hash(bytes),expected,'Drive bytes differ: '+ref.name);
 checks.push({name:ref.name,driveId:ref.id,kind:ref.kind,bytes:bytes.length,sha256:expected,parentVerified:true,bytesVerified:true});
 console.log(JSON.stringify({name:ref.name,bytes:bytes.length,verified:true}));
}
await writeFile(root+'drive-verification.json',JSON.stringify({at:new Date().toISOString(),folderId:'1THI4I4cSuA5Af1AmxtqfDD_aWJT-dRQ1',files:checks.length,checks},null,2)+'\n');
