import test from 'node:test';
import assert from 'node:assert/strict';
import {localCreationAccess,localCreationRequest,creationPage} from '../src/lib/owner-creation-model.ts';
const local={RIVYA_RESTORATION_LOCAL:'true',RIVYA_QA_TARGET:'exact-legacy-local',RIVYA_DATA_MODE:'isolated',DATABASE_URL:'postgresql://rivya_restoration_qa@localhost:55443/rivya_restoration_local'};
test('owner-selected private images require the complete isolated local target',()=>{
 assert.equal(localCreationAccess(local),true);assert.equal(localCreationAccess({}),false);
 for(const patch of [{RIVYA_RESTORATION_LOCAL:'false'},{RIVYA_QA_TARGET:'other'},{RIVYA_DATA_MODE:'live'},{DATABASE_URL:'postgresql://remote/db'},{VERCEL:'1'},{BLOB_READ_WRITE_TOKEN:'remote-token'}])assert.equal(localCreationAccess({...local,...patch}),false);
});
test('local image requests refuse foreign hosts, origins and cross-site embedding',()=>{
 assert.equal(localCreationRequest(new Headers({host:'127.0.0.1:4210'})),true);
 assert.equal(localCreationRequest(new Headers({host:'127.0.0.1:4210',origin:'http://127.0.0.1:4210'})),true);
 for(const patch of [{host:'evil.example'},{host:'127.0.0.1:4210.evil.example'},{origin:'https://evil.example'},{'sec-fetch-site':'cross-site'}])assert.equal(localCreationRequest(new Headers({host:'127.0.0.1:4210',...patch})),false);
});
test('gallery navigation reaches every image once and filtering never mutates its source',()=>{
 const rows=Array.from({length:169},(_,i)=>({index:i+1,category:i%2?'Clock':'Keepsake'})),before=JSON.stringify(rows),seen=[];
 for(let n=1;n<=15;n++)seen.push(...creationPage(rows,'','',n).rows.map(r=>r.index));
 assert.equal(seen.length,169);assert.equal(new Set(seen).size,169);
 assert.equal(creationPage(rows,'Clock','',1).total,84);
 assert.deepEqual(creationPage(rows,'','169',1).rows.map(r=>r.index),[169]);
 assert.equal(creationPage(rows,'Clock','169',1).total,0);
 assert.equal(creationPage(rows,'','',999).page,15);assert.equal(creationPage(rows,'','',NaN).page,1);assert.equal(creationPage(rows,'','',-1).page,1);
 assert.equal(JSON.stringify(rows),before);
});
