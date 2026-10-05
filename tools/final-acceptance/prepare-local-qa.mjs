import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
import {baselineProducts} from '../../src/lib/shop-model.ts';
import {baselineContent} from '../../src/lib/content-model.ts';
import {approvedPublicMedia} from '../../src/lib/public-media.ts';
import {defaultBusiness} from '../../src/lib/business-settings-model.ts';
import {compileHomepageSnapshot} from '../../src/lib/homepage-dependencies.ts';
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_LOCAL_PG_MODULE).href);
const connection={host:'127.0.0.1',port:55432,user:'rivya_local_qa'};
const admin=new pg.Client({...connection,database:'postgres'});await admin.connect();
const exists=await admin.query("SELECT 1 FROM pg_database WHERE datname='rivya_acceptance_local'");
assert.ok(exists.rowCount===0||process.argv.includes('--resume-empty'),'Local fixture database exists; preserve it and reuse its configuration. --resume-empty only resumes an interrupted empty initialization.');
if(!exists.rowCount)await admin.query('CREATE DATABASE rivya_acceptance_local');await admin.end();
const client=new pg.Client({...connection,database:'rivya_acceptance_local'});await client.connect();
try{
 if(exists.rowCount)for(const table of ['rivya_catalogue','rivya_content','rivya_studio_orders','rivya_studio_sessions']){const existsTable=await client.query('SELECT to_regclass($1) AS name',[table]);if(existsTable.rows[0].name)assert.equal((await client.query('SELECT count(*)::integer AS count FROM '+table)).rows[0].count,0,'Never overwrite populated local QA');}
 await client.query('CREATE TABLE IF NOT EXISTS local_qa_migrations(name text PRIMARY KEY)');
 for(const file of ['studio-schema.sql','redesign-preview-migration.sql','business-settings-schema.sql','content-schema.sql','revision-schema.sql','storage-provider-schema.sql','phase2-order-contract.sql','phase6-upload-identity.sql','phase11-privacy-controls.sql','phase11-erasure-engine.sql']){
  if((await client.query('SELECT 1 FROM local_qa_migrations WHERE name=$1',[file])).rowCount)continue;
  await client.query(readFileSync(resolve('scripts',file),'utf8'));await client.query('INSERT INTO local_qa_migrations VALUES($1)',[file]);
 }
 const dependencies={products:baselineProducts.map(document=>({key:document.id,version:1,fingerprint:'local-source',document})),content:baselineContent.filter(d=>d.id!=='page:home').map(document=>({key:document.id,version:1,fingerprint:'local-source',document})),media:approvedPublicMedia.map(document=>({key:document.path,version:0,fingerprint:'local-source',document}))};
 for(const product of baselineProducts)await client.query("INSERT INTO rivya_catalogue(product_id,draft,published,version,published_version,visible,updated_by) VALUES($1,$2,$2,1,1,true,'local-source-fixture')",[product.id,product]);
 for(const media of approvedPublicMedia)await client.query("INSERT INTO rivya_public_media(path,draft,published,version,updated_by) VALUES($1,$2,$2,1,'local-source-fixture')",[media.path,media]);
 for(const candidate of baselineContent){const document=candidate.id==='page:home'?{...candidate,homeSnapshot:compileHomepageSnapshot(candidate,dependencies)}:candidate;await client.query("INSERT INTO rivya_content(content_key,kind,route,draft,published,version,published_version,visible,updated_by) VALUES($1,$2,$3,$4,$4,1,1,true,'local-source-fixture')",[document.id,document.kind,document.route,document]);}
 await client.query("INSERT INTO rivya_business_settings(id,details,version,updated_by) VALUES(1,$1,1,'local-source-fixture')",[defaultBusiness]);
 const env={DATABASE_URL:'postgresql://rivya_local_qa@localhost:55432/rivya_acceptance_local',RIVYA_DATA_MODE:'isolated',RIVYA_QA_TARGET:'local',RIVYA_QA_BLOB_STORE_ID:'local-no-objects',STUDIO_ADMIN_ID:'local-acceptance-admin',STUDIO_ADMIN_PASSWORD:randomBytes(24).toString('hex'),STUDIO_SESSION_SECRET:randomBytes(32).toString('hex')};
 mkdirSync('test-results/final-acceptance',{recursive:true});writeFileSync('test-results/final-acceptance/.env.local-qa',Object.entries(env).map(([key,value])=>key+'='+value).join('\n'));
 console.log('Prepared local source-only QA: 120 catalogue fixtures, '+baselineContent.length+' content candidates, '+approvedPublicMedia.length+' static media records. No remote data or private objects copied.');
}finally{await client.end();}
