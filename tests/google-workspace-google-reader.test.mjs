import test from 'node:test';
import assert from 'node:assert/strict';
import {createGoogleWorkspaceReader,GoogleReadError} from '../src/lib/google-workspace/google-reader.ts';

const workbook='workbook_registered_123',fileId='file_registered_123',parentId='folder_registered_123';
const config={workbookIds:[workbook],files:[{id:fileId,expectedMimeType:'image/webp',expectedParentId:parentId}]};
const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json',...headers}});
const sheet=(values=[['id','title'],['0007','=literal text']])=>({spreadsheetId:workbook,valueRanges:[{range:"'Records'!A1:B2",majorDimension:'ROWS',values}]});
const metadata=(overrides={})=>({id:fileId,mimeType:'image/webp',trashed:false,parents:[parentId],size:'3',...overrides});
function harness(responses=[],options={}){
 const requests=[],sleeps=[];let tokenCalls=0;
 const dependencies={token:async()=>{tokenCalls++;return 'test-token.private';},fetch:async(url,init)=>{requests.push({url,init});const response=responses.shift();if(response instanceof Error)throw response;return typeof response==='function'?response(url,init):response;},sleep:async(ms)=>{sleeps.push(ms);},random:()=>0.5,...options.dependencies};
 return {reader:createGoogleWorkspaceReader(options.config??config,dependencies),requests,sleeps,get tokenCalls(){return tokenCalls;}};
}
const rejectsCode=(promise,code)=>assert.rejects(promise,error=>error instanceof GoogleReadError&&error.code===code);

test('unregistered workbooks and file IDs fail before token or network access',async()=>{
 const h=harness();
 for(const id of ['other_workbook_123','https://evil.invalid/x','../escape','file_registered_123?alt=media']){
  await rejectsCode(h.reader.readSheetRanges(id,['Records!A1:B2']),'not-registered');
  await rejectsCode(h.reader.readDriveMetadata(id),'not-registered');
  await rejectsCode(h.reader.readDriveFile(id),'not-registered');
 }
 assert.equal(h.tokenCalls,0);assert.equal(h.requests.length,0);
});

test('registration is snapshotted and configuration refuses unsafe IDs and excessive limits',async()=>{
 const supplied={workbookIds:[workbook],files:[{id:fileId,expectedMimeType:'image/webp',expectedParentId:parentId}]};
 const h=harness([json(metadata())],{config:supplied});
 supplied.workbookIds.push('new_workbook_123');supplied.files[0].expectedParentId='changed_folder_123';
 await rejectsCode(h.reader.readSheetRanges('new_workbook_123',['Records!A1:B2']),'not-registered');
 assert.equal((await h.reader.readDriveMetadata(fileId)).parents[0],parentId);
 for(const bad of [
  {...config,workbookIds:['https://evil.invalid']},{...config,workbookIds:[workbook,workbook]},
  {...config,files:[{id:fileId,expectedParentId:'../parent'}]},
  {...config,files:[{id:fileId,maxBytes:0}]},
  {...config,limits:{maxRetries:4}},{...config,limits:{timeoutMs:31_000}},
  {...config,limits:{maxResponseBytes:Infinity}},{...config,limits:{maxRanges:NaN}},
  {...config,limits:{unexpected:1}},{...config,limits:[]},
 ])assert.throws(()=>harness([],{config:bad}),error=>error.code==='configuration');
});

test('explicit A1 ranges are bounded before credentials or network are used',async()=>{
 const h=harness();
 for(const ranges of [[],['Records'],['Records!A:B'],['Records!A1:B'],['Records!B2:A1'],['Records!A0:B2'],['Records!A1:ZZZ2'],['Records!A1:B20001'],['https://evil.invalid!A1:B2'],['Records!A1:B2','\'Records\'!A1:B2'],['Records!A1:B2\n']])await rejectsCode(h.reader.readSheetRanges(workbook,ranges),'invalid-range');
 const small=harness([],{config:{...config,limits:{maxCells:5,maxRanges:2}}});
 await rejectsCode(small.reader.readSheetRanges(workbook,['Records!A1:B2','Other!A1:B2']),'invalid-range');
 await rejectsCode(small.reader.readSheetRanges(workbook,['A!A1:A1','B!A1:A1','C!A1:A1']),'invalid-range');
 assert.equal(h.tokenCalls,0);assert.equal(small.tokenCalls,0);
});

test('batchGet fixes host, rows, unformatted values, date serials and read-only fetch options',async()=>{
 const h=harness([json(sheet())]);const result=await h.reader.readSheetRanges(workbook,['Records!A1:B2']);
 assert.deepEqual(result.valueRanges[0].values,[['id','title'],['0007','=literal text']]);
 const {url,init}=h.requests[0],parsed=new URL(url);
 assert.equal(parsed.origin,'https://sheets.googleapis.com');
 assert.equal(parsed.pathname,'/v4/spreadsheets/'+workbook+'/values:batchGet');
 assert.deepEqual(parsed.searchParams.getAll('ranges'),['Records!A1:B2']);
 assert.equal(parsed.searchParams.get('majorDimension'),'ROWS');
 assert.equal(parsed.searchParams.get('valueRenderOption'),'UNFORMATTED_VALUE');
 assert.equal(parsed.searchParams.get('dateTimeRenderOption'),'SERIAL_NUMBER');
 assert.equal(init.method,'GET');assert.equal(init.redirect,'manual');assert.equal(init.cache,'no-store');assert.equal(init.credentials,'omit');assert.equal(init.body,undefined);
});

test('numbers, booleans and formula-looking literal text retain their type and value',async()=>{
 const h=harness([json(sheet([[true,123.45],['000123','=HYPERLINK("unsafe")']]))]);
 assert.deepEqual((await h.reader.readSheetRanges(workbook,['Records!A1:B2'])).valueRanges[0].values,[[true,123.45],['000123','=HYPERLINK("unsafe")']]);
});

test('quoted sheet names are encoded and response range order is verified semantically',async()=>{
 const response={spreadsheetId:workbook,valueRanges:[{range:"'Owner''s Records'!A1:A2",majorDimension:'ROWS',values:[['0001']]},{range:'Empty!B2:C4',majorDimension:'ROWS'}]};
 const h=harness([json(response)]);
 const result=await h.reader.readSheetRanges(workbook,["'Owner''s Records'!A1:A2",'Empty!B2:C4']);
 assert.equal(result.valueRanges[0].values[0][0],'0001');assert.deepEqual(result.valueRanges[1].values,[]);
 assert.deepEqual(new URL(h.requests[0].url).searchParams.getAll('ranges'),["'Owner''s Records'!A1:A2",'Empty!B2:C4']);
});

test('Sheets rejects wrong workbook, range, order, dimension, counts and non-cell JSON types',async()=>{
 const wrongs=[
  {...sheet(),spreadsheetId:'other_workbook_123'},
  {...sheet(),valueRanges:[]},
  {...sheet(),valueRanges:[{...sheet().valueRanges[0],majorDimension:'COLUMNS'}]},
  {...sheet(),valueRanges:[{...sheet().valueRanges[0],range:'Other!A1:B2'}]},
  {...sheet(),valueRanges:[{...sheet().valueRanges[0],range:'Records!A1:B999'}]},
  sheet(null),sheet([[null]]),sheet([[{}]]),sheet([['a','b','c']]),sheet([[],[],[]]),sheet(['not a row']),sheet([['x'.repeat(50_001)]])
 ];
 for(const response of wrongs){const h=harness([json(response)]);await rejectsCode(h.reader.readSheetRanges(workbook,['Records!A1:B2']),'invalid-response');}
});

test('wrong JSON, invalid UTF-8 and unexpected content types have sanitized errors',async()=>{
 for(const response of [new Response('token-secrets<html>',{headers:{'Content-Type':'application/json'}}),new Response(new Uint8Array([0xff,0xfe]),{headers:{'Content-Type':'application/json'}}),new Response(JSON.stringify(sheet()),{headers:{'Content-Type':'text/html'}})]){
  const h=harness([response]);await assert.rejects(h.reader.readSheetRanges(workbook,['Records!A1:B2']),error=>error.code==='invalid-response'&&!String(error).includes('token-secrets'));
 }
});

test('429 and 503 use bounded injected jitter and retry only the same fixed GET',async()=>{
 const h=harness([json({secret:'do not expose'},429),json({secret:'do not expose'},503,{'Retry-After':'0.5'}),json(sheet())]);
 await h.reader.readSheetRanges(workbook,['Records!A1:B2']);
 assert.equal(h.requests.length,3);assert.deepEqual(h.sleeps,[300,500]);
 assert.equal(new Set(h.requests.map(r=>r.url)).size,1);assert.ok(h.requests.every(r=>r.init.method==='GET'));
});

test('quota exhaustion and excessive Retry-After are bounded without exposing API response bodies',async()=>{
 const h=harness([json({message:'private provider token'},429),json({message:'private provider token'},503),json({message:'private provider token'},429)]);
 await assert.rejects(h.reader.readSheetRanges(workbook,['Records!A1:B2']),error=>error.code==='retry-exhausted'&&!String(error).includes('private provider token'));
 assert.equal(h.requests.length,3);assert.equal(h.sleeps.length,2);
 const long=harness([json({},429,{'Retry-After':'60'})]);
 await rejectsCode(long.reader.readSheetRanges(workbook,['Records!A1:B2']),'retry-exhausted');assert.equal(long.sleeps.length,0);
});

test('other HTTP errors and network failures do not retry or leak tokens, URLs or provider details',async()=>{
 for(const response of [json({message:'secret-staff-value'},401),json({message:'secret-staff-value'},403),json({message:'secret-staff-value'},404),json({message:'secret-staff-value'},500),new Error('secret-token https://private.invalid')]){
  const h=harness([response]);await assert.rejects(h.reader.readSheetRanges(workbook,['Records!A1:B2']),error=>error.code==='unavailable'&&!/secret|private\.invalid/.test(String(error))&&!error.cause);
  assert.equal(h.requests.length,1);assert.equal(h.sleeps.length,0);
 }
});

test('redirect responses and unexpectedly followed URLs are refused',async()=>{
 const followed=json(sheet());Object.defineProperty(followed,'redirected',{value:true});
 const changed=json(sheet());Object.defineProperty(changed,'url',{value:'https://other.invalid/private'});
 for(const response of [new Response(null,{status:302,headers:{Location:'https://other.invalid/private'}}),followed,changed]){
  const h=harness([response]);await rejectsCode(h.reader.readSheetRanges(workbook,['Records!A1:B2']),'redirect');assert.equal(h.requests.length,1);
 }
});

test('invalid token values and token-provider failures never make a fetch',async()=>{
 for(const token of ['', 'line\r\ninjection', 'two words', 'x'.repeat(8193)]){
  const h=harness([],{dependencies:{token:async()=>token}});await rejectsCode(h.reader.readDriveMetadata(fileId),'credentials');assert.equal(h.requests.length,0);
 }
 const h=harness([],{dependencies:{token:async()=>{throw Error('credential contents');}}});
 await assert.rejects(h.reader.readDriveMetadata(fileId),error=>error.code==='credentials'&&!String(error).includes('contents'));
});

test('already aborted operations do not acquire credentials',async()=>{
 const controller=new AbortController();controller.abort('private cancellation detail');const h=harness();
 await rejectsCode(h.reader.readSheetRanges(workbook,['Records!A1:B2'],{signal:controller.signal}),'aborted');assert.equal(h.tokenCalls,0);
});

test('abort during token acquisition cancels locally even if the supplier ignores its signal',async()=>{
 const controller=new AbortController();let began;
 const started=new Promise(resolve=>{began=resolve;});
 const h=harness([],{dependencies:{token:async()=>{began();return new Promise(()=>{});}}});
 const reading=h.reader.readDriveMetadata(fileId,{signal:controller.signal});await started;controller.abort();
 await rejectsCode(reading,'aborted');assert.equal(h.requests.length,0);
});

test('timeout includes a fetch that ignores its abort signal',async()=>{
 let receivedSignal;
 const h=harness([],{config:{...config,limits:{timeoutMs:15}},dependencies:{fetch:async(_url,init)=>{receivedSignal=init.signal;return new Promise(()=>{});}}});
 await rejectsCode(h.reader.readDriveMetadata(fileId),'timeout');assert.equal(receivedSignal.aborted,true);
});

test('abort during retry sleep stops retries even if injected sleep ignores its signal',async()=>{
 const controller=new AbortController();let began;
 const started=new Promise(resolve=>{began=resolve;});
 const h=harness([json({},429)],{dependencies:{sleep:async()=>{began();return new Promise(()=>{});}}});
 const reading=h.reader.readDriveMetadata(fileId,{signal:controller.signal});await started;controller.abort();
 await rejectsCode(reading,'aborted');assert.equal(h.requests.length,1);
});

test('content-length rejects oversized bodies before reading and truncated bodies fail',async()=>{
 const large=harness([new Response('abc',{headers:{'Content-Type':'application/json','Content-Length':'10000'}})],{config:{...config,limits:{maxResponseBytes:128}}});
 await rejectsCode(large.reader.readDriveMetadata(fileId),'too-large');
 const truncated=harness([new Response(JSON.stringify(metadata()),{headers:{'Content-Type':'application/json','Content-Length':'1'}})]);
 await rejectsCode(truncated.reader.readDriveMetadata(fileId),'invalid-response');
});

test('decompressed responses are bounded by their actual bytes, not compressed content-length',async()=>{
 const response=new Response(JSON.stringify(metadata()),{headers:{'Content-Type':'application/json','Content-Length':'30','Content-Encoding':'gzip'}});
 const h=harness([response]);assert.equal((await h.reader.readDriveMetadata(fileId)).id,fileId);
 const oversized=new Response(JSON.stringify(metadata({extra:'x'.repeat(200)})),{headers:{'Content-Type':'application/json','Content-Length':'30','Content-Encoding':'gzip'}});
 const small=harness([oversized],{config:{...config,limits:{maxResponseBytes:128}}});await rejectsCode(small.reader.readDriveMetadata(fileId),'too-large');
});

test('streamed oversized responses are cancelled without collecting the remaining chunks',async()=>{
 let cancelled=false;
 const stream=new ReadableStream({start(controller){controller.enqueue(new Uint8Array(80));controller.enqueue(new Uint8Array(80));},cancel(){cancelled=true;}});
 const h=harness([new Response(stream,{headers:{'Content-Type':'application/json'}})],{config:{...config,limits:{maxResponseBytes:128}}});
 await rejectsCode(h.reader.readDriveMetadata(fileId),'too-large');assert.equal(cancelled,true);
});

test('a stalled response stream times out and is cancelled',async()=>{
 let cancelled=false;
 const response=new Response(new ReadableStream({start(controller){controller.enqueue(new Uint8Array([123]));},cancel(){cancelled=true;}}),{headers:{'Content-Type':'application/json'}});
 const h=harness([response],{config:{...config,limits:{timeoutMs:15}}});
 await rejectsCode(h.reader.readDriveMetadata(fileId),'timeout');
 await new Promise(resolve=>setImmediate(resolve));assert.equal(cancelled,true);
});

test('Drive metadata validates exact registration and download returns only bounded raw bytes',async()=>{
 const h=harness([json(metadata()),new Response(new Uint8Array([7,8,9]),{headers:{'Content-Type':'image/webp','Content-Length':'3'}})]);
 assert.deepEqual(await h.reader.readDriveFile(fileId),new Uint8Array([7,8,9]));
 const metadataUrl=new URL(h.requests[0].url),mediaUrl=new URL(h.requests[1].url);
 assert.equal(metadataUrl.origin,'https://www.googleapis.com');assert.equal(metadataUrl.pathname,'/drive/v3/files/'+fileId);
 assert.equal(metadataUrl.searchParams.get('fields'),'id,mimeType,trashed,parents,size');
 assert.equal(mediaUrl.searchParams.get('alt'),'media');assert.equal(mediaUrl.searchParams.get('supportsAllDrives'),'true');
});

test('Drive refuses trashed, moved, mismatched and oversized files before media download',async()=>{
 for(const [override,code] of [[{trashed:true},'file-policy'],[{parents:['different_parent_123']},'file-policy'],[{mimeType:'image/jpeg'},'file-policy'],[{id:'different_file_123'},'invalid-response'],[{parents:null},'invalid-response'],[{parents:[parentId,parentId]},'invalid-response'],[{size:'99999999'},'too-large'],[{size:'-1'},'invalid-response']]){
  const h=harness([json(metadata(override))]);await rejectsCode(h.reader.readDriveFile(fileId),code);assert.equal(h.requests.length,1);
 }
});

test('Drive does not treat native Workspace files as downloadable media',async()=>{
 const h=harness([json(metadata({mimeType:'application/vnd.google-apps.presentation'}))],{config:{...config,files:[{id:fileId}]}});
 await rejectsCode(h.reader.readDriveFile(fileId),'file-policy');assert.equal(h.requests.length,1);
});

test('Drive MIME or size changes between metadata and bytes fail closed',async()=>{
 for(const response of [new Response(new Uint8Array([1,2]),{headers:{'Content-Type':'image/webp'}}),new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'text/html'}})]){
  const h=harness([json(metadata()),response]);await rejectsCode(h.reader.readDriveFile(fileId),'invalid-response');
 }
});

test('Drive can read bounded registered bytes with omitted size and optional parent policy',async()=>{
 const h=harness([json({id:fileId,mimeType:'image/webp',trashed:false}),new Response(new Uint8Array([1]),{headers:{'Content-Type':'image/webp'}})],{config:{workbookIds:[],files:[{id:fileId,maxBytes:4}]}});
 assert.deepEqual(await h.reader.readDriveFile(fileId),new Uint8Array([1]));
});
