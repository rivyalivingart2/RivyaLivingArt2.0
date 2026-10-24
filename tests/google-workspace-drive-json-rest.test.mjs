import test from 'node:test';
import assert from 'node:assert/strict';
import {createGoogleDriveJsonIO,MAX_MULTIPART_ARTIFACT_BYTES} from '../src/lib/google-workspace/drive-json-rest.ts';
import {createDriveDocumentStore,canonicalDocumentBytes,DriveCreatePreflightError} from '../src/lib/google-workspace/drive-documents.ts';
const registration={fileId:'reserved_json_file_001',parentId:'registered_folder_001',purpose:'record-payload',ownerId:'cms:one'};
const config={registrations:[registration]};
const signal=()=>new AbortController().signal;
const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json',...headers}});
const meta=(size,overrides={})=>({id:registration.fileId,mimeType:'application/json',parents:[registration.parentId],trashed:false,size:String(size),...overrides});
function server(){
 const files=new Map(),requests=[],sleeps=[];let tokens=0,loseAck=false;
 const dependencies={token:async()=>{tokens++;return 'private-test-token';},sleep:async ms=>{sleeps.push(ms);},fetch:async(url,init)=>{
  requests.push({url,init});const parsed=new URL(url);assert.equal(parsed.origin,'https://www.googleapis.com');
  if(init.method==='POST'){
   assert.equal(parsed.pathname,'/upload/drive/v3/files');assert.equal(parsed.searchParams.get('uploadType'),'multipart');
   const boundary=init.headers['Content-Type'].split('boundary=')[1],parts=Buffer.from(init.body).toString('utf8').split('--'+boundary);
   const content=part=>part.slice(part.indexOf('\r\n\r\n')+4,-2);
   const details=JSON.parse(content(parts[1])),bytes=new TextEncoder().encode(content(parts[2]));
   assert.equal(details.id,registration.fileId);assert.deepEqual(details.parents,[registration.parentId]);assert.equal(details.mimeType,'application/json');
   if(files.has(details.id))return json({private:'duplicate'},409);files.set(details.id,bytes);
   if(loseAck)throw Error('lost acknowledgement with token');return json({id:details.id},200);
  }
  assert.equal(init.method,'GET');assert.equal(parsed.pathname,'/drive/v3/files/'+registration.fileId);
  const bytes=files.get(registration.fileId);if(!bytes)return json({secret:'not found'},404);
  return parsed.searchParams.get('alt')==='media'?new Response(bytes,{headers:{'Content-Type':'application/json'}}):json(meta(bytes.length));
 }};
 return {files,requests,sleeps,dependencies,get tokens(){return tokens;},set loseAck(v){loseAck=v;},io:createGoogleDriveJsonIO(config,dependencies)};
}

test('real REST request construction supports verified create/read at one reserved ID using injected responses',async()=>{
 const h=server(),documents=createDriveDocumentStore(config,h.io),payload={title:'ગુજરાતી',id:'0007',formula:'=TEXT()',content:'x'.repeat(46000)};
 const ref=await documents.ensureJson(registration.fileId,payload);assert.deepEqual(await documents.readJson(ref),payload);
 assert.equal(h.files.size,1);assert.equal(h.requests.filter(r=>r.init.method==='POST').length,1);
 assert.ok(h.requests.every(r=>r.init.redirect==='manual'&&r.init.credentials==='omit'&&r.init.cache==='no-store'));
 assert.ok(h.requests.every(r=>['GET','POST'].includes(r.init.method)));
 assert.ok(h.requests.every(r=>!new URL(r.url).searchParams.has('q')));
});

test('REST provider plus document store recovers an unknown POST outcome by reading the reserved ID',async()=>{
 const h=server();h.loseAck=true;const documents=createDriveDocumentStore(config,h.io);
 const ref=await documents.ensureJson(registration.fileId,{title:'One'});assert.equal(ref.fileId,registration.fileId);assert.equal(h.files.size,1);assert.equal(h.requests.filter(r=>r.init.method==='POST').length,1);
});

test('unauthorized file IDs, parent changes and native MIME attempts fail before acquiring a token',async()=>{
 const h=server();for(const id of ['other_file_001','https://evil.invalid','../file'])await assert.rejects(h.io.metadata(id,signal()),{code:'UNREGISTERED_ARTIFACT'});
 for(const patch of [{parentId:'different_folder_001'},{mimeType:'application/vnd.google-apps.document'}])await assert.rejects(h.io.create({fileId:registration.fileId,parentId:registration.parentId,mimeType:'application/json',bytes:canonicalDocumentBytes({}),...patch},signal()),{code:'UNREGISTERED_ARTIFACT'});
 assert.equal(h.tokens,0);assert.equal(h.requests.length,0);
});

test('only metadata HTTP404 maps to unavailable; authorization and network failures remain errors',async()=>{
 const h=server();assert.equal(await h.io.metadata(registration.fileId,signal()),null);
 for(const code of [401,403,500]){
  const io=createGoogleDriveJsonIO(config,{token:async()=> 'private-token',fetch:async()=>json({message:'private provider body'},code)});
  await assert.rejects(io.metadata(registration.fileId,signal()),error=>error.code==='PROVIDER_UNAVAILABLE'&&!String(error).includes('private provider body'));
 }
 const io=createGoogleDriveJsonIO(config,{token:async()=>{throw Error('private credential');},fetch:async()=>{assert.fail('must not fetch');}});
 await assert.rejects(io.metadata(registration.fileId,signal()),error=>error.code==='PROVIDER_UNAVAILABLE'&&!String(error).includes('private credential'));
});

test('metadata validates ID, MIME, parent, trash and exact safe size before reading bytes',async()=>{
 for(const override of [{id:'other_file_001'},{mimeType:'application/vnd.google-apps.document'},{parents:['other_folder_001']},{trashed:true},{size:'-1'},{size:'9007199254740993'}]){
  let calls=0;const io=createGoogleDriveJsonIO(config,{token:async()=> 'token',fetch:async()=>{calls++;return json(meta(2,override));}});
  await assert.rejects(io.read(registration.fileId,100,signal()),{code:'ARTIFACT_MISMATCH'});assert.equal(calls,1);
 }
});

test('redirects and wrong response content types cannot forward credentials or become artifact bytes',async()=>{
 for(const response of [new Response(null,{status:302,headers:{Location:'https://evil.invalid'}}),new Response('{}',{headers:{'Content-Type':'text/html'}})]){
  let calls=0;const io=createGoogleDriveJsonIO(config,{token:async()=> 'token',fetch:async(_url,init)=>{calls++;assert.equal(init.redirect,'manual');return response;}});
  await assert.rejects(io.metadata(registration.fileId,signal()),{code:'PROVIDER_UNAVAILABLE'});assert.equal(calls,1);
 }
});

test('GET quota retry is bounded and POST failures are left for same-ID store recovery',async()=>{
 const sleeps=[];let calls=0;const io=createGoogleDriveJsonIO(config,{token:async()=> 'token',sleep:async ms=>sleeps.push(ms),fetch:async()=>{calls++;return json({private:'quota'},503);}});
 await assert.rejects(io.metadata(registration.fileId,signal()),{code:'PROVIDER_UNAVAILABLE'});assert.equal(calls,3);assert.deepEqual(sleeps,[200,400]);
 calls=0;await assert.rejects(io.create({fileId:registration.fileId,parentId:registration.parentId,mimeType:'application/json',bytes:canonicalDocumentBytes({})},signal()),{code:'PROVIDER_UNAVAILABLE'});assert.equal(calls,1);
});

test('multipart size bound and strict JSON validation reject without truncating or calling Google',async()=>{
 const h=server();const create=bytes=>h.io.create({fileId:registration.fileId,parentId:registration.parentId,mimeType:'application/json',bytes},signal());
 await assert.rejects(create(new Uint8Array(MAX_MULTIPART_ARTIFACT_BYTES+1)),{code:'ARTIFACT_TOO_LARGE'});
 await assert.rejects(create(new TextEncoder().encode('{"a":1,"a":2}')),{code:'INVALID_JSON'});assert.equal(h.tokens,0);
});

test('store preserves deterministic multipart preflight failures without retries or a misleading provider error',async()=>{
 const h=server(),documents=createDriveDocumentStore(config,h.io);
 await assert.rejects(documents.ensureJson(registration.fileId,{text:'x'.repeat(MAX_MULTIPART_ARTIFACT_BYTES)}),error=>error instanceof DriveCreatePreflightError&&error.code==='ARTIFACT_TOO_LARGE');
 assert.equal(h.requests.length,1);assert.equal(h.requests[0].init.method,'GET');assert.equal(h.files.size,0);
});

test('oversized response after POST is still ambiguous and recovered at the reserved ID',async()=>{
 const h=server(),fetch=h.dependencies.fetch;
 const io=createGoogleDriveJsonIO(config,{...h.dependencies,fetch:async(url,init)=>{const response=await fetch(url,init);return init.method==='POST'?json({id:registration.fileId,padding:'x'.repeat(300*1024)}):response;}});
 const documents=createDriveDocumentStore(config,io),ref=await documents.ensureJson(registration.fileId,{title:'Still created'});
 assert.equal(ref.fileId,registration.fileId);assert.equal(h.files.size,1);assert.equal(h.requests.filter(r=>r.init.method==='POST').length,1);
});

test('registered download fails on oversized, truncated or noncanonical bytes',async()=>{
 for(const body of ['{"a":1}', '{"a": 1}']){
  let calls=0;const bytes=new TextEncoder().encode(body);const io=createGoogleDriveJsonIO(config,{token:async()=> 'token',fetch:async()=>++calls===1?json(meta(body==='{"a":1}'?99:bytes.length)):new Response(bytes,{headers:{'Content-Type':'application/json'}})});
  await assert.rejects(io.read(registration.fileId,100,signal()),{code:body==='{"a":1}'?'ARTIFACT_MISMATCH':'INVALID_JSON'});
 }
 const io=createGoogleDriveJsonIO(config,{token:async()=> 'token',fetch:async()=>json(meta(101))});await assert.rejects(io.read(registration.fileId,100,signal()),{code:'ARTIFACT_TOO_LARGE'});
});

test('abort and timeout remain bounded for injected providers that ignore signals',async()=>{
 const abort=new AbortController();abort.abort();const h=server();await assert.rejects(h.io.metadata(registration.fileId,abort.signal),{code:'ABORTED'});assert.equal(h.tokens,0);
 const io=createGoogleDriveJsonIO({...config,timeoutMs:15},{token:async()=> 'token',fetch:async()=>new Promise(()=>{})});await assert.rejects(io.metadata(registration.fileId,signal()),{code:'TIMEOUT'});
});
