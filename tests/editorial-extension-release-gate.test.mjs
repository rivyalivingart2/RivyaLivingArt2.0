import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import {neon} from '@neondatabase/serverless';
import {editorialExtensionsEnabled,editorialExtensionDependencyUnion} from '../src/lib/editorial-extension-feature.ts';
import {publicationReadQueries} from '../src/lib/publication-read-query.ts';
import {subscriberFilters,subscriberCsv} from '../src/lib/subscriber-model.ts';

const isolated={RIVYA_RESTORATION_LOCAL:'true',RIVYA_QA_TARGET:'exact-legacy-local',RIVYA_DATA_MODE:'isolated',DATABASE_URL:'postgresql://rivya_restoration_qa@localhost:55443/rivya_restoration_local'};
const production={VERCEL:'1',VERCEL_ENV:'production',DATABASE_URL:'postgresql://synthetic@example.invalid/readonly'};
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('extension storage stays off by default and only the exact isolated target or explicit schema-ready flag enables it',()=>{
 for(const env of [{},production,{...isolated,VERCEL:'1'},{...isolated,RIVYA_QA_TARGET:'other'},{...isolated,RIVYA_DATA_MODE:'production'},{...isolated,DATABASE_URL:production.DATABASE_URL},{...isolated,BLOB_READ_WRITE_TOKEN:'synthetic'}, {...production,RIVYA_EDITORIAL_EXTENSIONS_SCHEMA_READY:'false'}, {...production,RIVYA_EDITORIAL_EXTENSIONS_SCHEMA_READY:'TRUE'}])assert.equal(editorialExtensionsEnabled(env),false);
 assert.equal(editorialExtensionsEnabled(isolated),true);
 assert.equal(editorialExtensionsEnabled({...production,RIVYA_EDITORIAL_EXTENSIONS_SCHEMA_READY:'true'}),true);
});

test('default public snapshot and identity SQL never reference an unapplied extension table',()=>{
 const off=publicationReadQueries(production),on=publicationReadQueries(isolated);
 for(const query of Object.values(off)){
  assert.doesNotMatch(query,/rivya_editorial_extensions|rivya_editorial_extension_revisions/);
  assert.match(query,/rivya_catalogue/);assert.match(query,/rivya_content/);assert.match(query,/rivya_public_media/);
 }
 assert.match(off.publishedSourceQuery,/'\[\]'::jsonb AS extensions/);
 for(const query of Object.values(on))assert.match(query,/FROM rivya_editorial_extensions WHERE published IS NOT NULL/);
 assert.equal(editorialExtensionDependencyUnion(production),'');
});

test('fixed dependency fragments compose with Neon without interpolating submitted text into SQL',()=>{
 const sql=neon('postgresql://synthetic@localhost:1/disposable'),untrusted="a'; DROP TABLE protected; --";
 for(const env of [production,isolated]){
  const query=sql`SELECT 'content' AS kind, ${untrusted} AS key, 'digest' AS fingerprint ${sql.unsafe(editorialExtensionDependencyUnion(env))}`;
  const compiled=query.queryData.toParameterizedQuery();
  assert.equal(compiled.params[0],untrusted);assert.ok(!compiled.query.includes(untrusted));
  assert.equal(compiled.query.includes('FROM rivya_editorial_extensions'),editorialExtensionsEnabled(env));
 }
});

// Execute the real route bodies with server dependencies replaced at the module
// boundary. No Next server, credentials, database or filesystem data is touched.
function route(path,{env=production,session={adminId:'synthetic-owner',role:'admin'},modules={}}={}){
 const calls={storage:0,body:0,files:0,session:0,subscribers:0};
 const blocked=kind=>()=>{calls[kind]++;throw Error('Forbidden test dependency');};
 const imports={
  '@/lib/studio-auth':{studioSession:async()=>{calls.session++;return session;}},
  '@/lib/studio-db':{studioDb:blocked('storage')},
  '@/lib/request-security':{originAllowed:()=>true,smallJson:blocked('body')},
  '@/lib/editorial-media-storage':{saveEditorialFile:blocked('files'),readEditorialFile:blocked('files')},
  '@/lib/editorial-extension-feature':{editorialExtensionsEnabled:()=>editorialExtensionsEnabled(env)},
  '@/lib/subscriber-model':{subscriberFilters,subscriberCsv},
  '@/lib/subscribers':{readSubscribers:async()=>{calls.subscribers++;return {total:0,pages:1,page:1,pageSize:50,rows:[]};}},
  ...modules,
 };
 const exports={};
 const compiled=ts.transpileModule(read(path),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 runInNewContext(compiled,{exports,require:name=>imports[name]??{},process:{env},Response,Request,URL,Headers,Buffer},{filename:path});
 return {exports,calls};
}

test('disabled extension routes authenticate, then return capability/no-write results before body, storage or file access',async()=>{
 const path='src/app/api/studio/editorial-extensions/route.ts',r=route(path);
 const get=await r.exports.GET(new Request('https://example.invalid/api/studio/editorial-extensions'));
 assert.equal(get.status,200);assert.deepEqual(await get.json(),{available:false,entries:[],categories:[]});
 for(const method of ['PUT','POST']){
  const response=await r.exports[method](new Request('https://example.invalid/api/studio/editorial-extensions',{method,body:'invalid body'}));
  assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:'Category and file metadata are not enabled for this website.'});
 }
 assert.deepEqual(r.calls,{storage:0,body:0,files:0,session:3,subscribers:0});
 const anonymous=route(path,{session:null});assert.equal((await anonymous.exports.GET(new Request('https://example.invalid/api/studio/editorial-extensions'))).status,401);
});

test('explicitly enabled extension GET reaches its storage contract, while file delivery is unavailable before storage exists',async()=>{
 const entries=[],categories=[],sql=async()=>[];
 const enabled=route('src/app/api/studio/editorial-extensions/route.ts',{env:isolated,modules:{'@/lib/studio-db':{studioDb:()=>sql}}});
 const response=await enabled.exports.GET(new Request('https://example.invalid/api/studio/editorial-extensions'));
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{available:true,entries,categories});
 const disabled=route('src/app/editorial-file/[id]/route.ts');
 assert.equal((await disabled.exports.GET(new Request('https://example.invalid/editorial-file/synthetic'),{params:Promise.resolve({id:'synthetic'})})).status,404);
 assert.deepEqual(disabled.calls,{storage:0,body:0,files:0,session:0,subscribers:0});
});

test('subscribers use the existing newsletter capability and never return an empty list as a disabled-state claim',async()=>{
 const path='src/app/api/studio/subscribers/route.ts',disabled=route(path);
 const list=await disabled.exports.GET(new Request('https://example.invalid/api/studio/subscribers'));
 assert.equal(list.status,200);assert.deepEqual(await list.json(),{available:false});
 const csv=await disabled.exports.GET(new Request('https://example.invalid/api/studio/subscribers?format=csv'));
 assert.equal(csv.status,503);assert.match((await csv.json()).error,/not enabled/);assert.equal(disabled.calls.subscribers,0);
 const enabled=route(path,{env:{...production,RIVYA_NEWSLETTER_ENABLED:'true'}});
 const result=await enabled.exports.GET(new Request('https://example.invalid/api/studio/subscribers'));
 assert.equal(result.status,200);assert.equal((await result.json()).available,true);assert.equal(enabled.calls.subscribers,1);
 const anonymous=route(path,{session:null});assert.equal((await anonymous.exports.GET(new Request('https://example.invalid/api/studio/subscribers'))).status,401);
 const editor=route(path,{session:{adminId:'synthetic-editor',role:'editor'}});assert.equal((await editor.exports.GET(new Request('https://example.invalid/api/studio/subscribers'))).status,403);
});

test('all existing publication mutations use the controlled fragment and disabled Studio consumers hide unavailable controls',()=>{
 for(const path of ['content','editorial-order','presentation']){
  const source=read(`src/app/api/studio/${path}/route.ts`);
  assert.match(source,/sql\.unsafe\(editorialExtensionDependencyUnion\(\)\)/);
  assert.doesNotMatch(source,/FROM rivya_editorial_extensions/);
 }
 for(const name of ['editorial-extensions','editorial-file-fields']){
  const source=read(`src/components/studio/${name}.tsx`);assert.match(source,/available!==true/);assert.match(source,/available===false|available!==false/);
 }
 assert.match(read('src/components/studio/subscriber-workspace.tsx'),/Newsletter collection is not enabled for this website/);
});
