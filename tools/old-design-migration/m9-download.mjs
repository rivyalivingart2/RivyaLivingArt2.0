import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const dir=resolve('test-results/old-design-migration/m9/sources');mkdirSync(dir,{recursive:true});
for(const source of JSON.parse(readFileSync('test-results/old-design-migration/m9/drive-downloads.json','utf8'))){
 assert.match(source.key,/^[A-Z][0-9]{2}$/);assert.ok(!/[\\/]/.test(source.name));
 const path=resolve(dir,source.key+'-'+source.name);if(existsSync(path))continue;
 const url=new URL(source.file.download_url);assert.equal(url.protocol,'https:');assert.ok(url.hostname.endsWith('.oaiusercontent.com'));
 const response=await fetch(url);assert.equal(response.status,200,'Authenticated asset retrieval failed');const bytes=Buffer.from(await response.arrayBuffer());assert.ok(bytes.length&&bytes.length<10000000);writeFileSync(path,bytes,{flag:'wx'});
 console.log(JSON.stringify({key:source.key,name:source.name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}));
}
