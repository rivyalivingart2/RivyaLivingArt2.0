/** Read pinned tracked files only. Never execute seeds, import app code, or open SQL. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {summarizeCsv} from './csv-file-summary.mjs';
const source=resolve('../OLDWEBSITE-reference'),docs='docs/restoration/exact-legacy-2026-10-21';
const git=(...args)=>execFileSync('git',['-C',source,...args],{encoding:'utf8',windowsHide:true}).trim();
const commit=git('rev-parse','HEAD');assert.equal(commit,'2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6');assert.equal(git('status','--porcelain'),'');
const paths=git('ls-files','-z').split('\0').filter(Boolean);
const selected=paths.filter(p=>p==='prisma/schema.prisma'||/^prisma\/(migrations\/.*\.sql|seed.*\.ts)$/.test(p)||/^(content|messages|data)\//.test(p)||/^docs\/import\/.*\.csv$/.test(p)||/^docs\/archive\/sheets[^/]*\/.*\.csv$/.test(p));
const rows=selected.map(path=>{
 const bytes=readFileSync(resolve(source,path));
 const productData=/^data\/(tiers|rewrites)\//.test(path)&&!path.endsWith('.md')||/^docs\/import\/.*product.*\.csv$/.test(path)||path.includes('/sample/');
 const classification=productData?'OWNER_EXCLUDED_PRODUCT_DATA':path==='prisma/schema.prisma'?'SCHEMA_CONTRACT':path.startsWith('prisma/migrations/')?'MIGRATION_SOURCE_NOT_EXECUTION_PROOF':path.startsWith('prisma/seed')?'SEED_RECIPE_NOT_RECORD_EXPORT':path.startsWith('content/')?'EDITORIAL_FILE_CANDIDATE':path.startsWith('messages/')?'BUNDLED_COPY_NOT_DATABASE_OVERRIDE':path.endsWith('.md')?'ARCHIVE_DOCUMENTATION':path.startsWith('docs/archive/')?'HISTORICAL_IMPORT_LOG_NOT_DATABASE_EXPORT':'UNVERIFIED_IMPORT_CANDIDATE';
 let fileContent;
 if(/\.csv(?:\.gz)?$/.test(path)){const plain=path.endsWith('.gz')?gunzipSync(bytes,{maxOutputLength:128*1024*1024}):bytes;fileContent={...summarizeCsv(plain.toString('utf8')),uncompressedBytes:plain.length,scope:'FILE_RECORDS_NOT_DATABASE_ROWS',imported:0};}
 if(path.startsWith('data/rewrites/')){const value=JSON.parse(bytes.toString('utf8'));fileContent={records:Array.isArray(value)?value.length:Object.keys(value).length,scope:'SAVED_REWRITE_CANDIDATES_NOT_CURRENT_APPROVAL',imported:0};}
 return {path,classification,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),...(fileContent?{fileContent}:{}),disposition:classification==='OWNER_EXCLUDED_PRODUCT_DATA'?'Owner excluded: do not import, add products, repair for import or place in a future import backlog. Retain original historical files only.':classification==='SCHEMA_CONTRACT'?'Retain field and relationship contract':classification==='UNVERIFIED_IMPORT_CANDIDATE'?'No import authorized; classify against the latest owner restrictions before considering any non-product use':'Retain provenance; no automatic import or publication'};
});
const schema=readFileSync(resolve(source,'prisma/schema.prisma'),'utf8');
const entities=[...schema.matchAll(/^model\s+(\w+)\s*\{/gm)].map(m=>({entity:m[1],recordCount:null,recordCountStatus:'UNAVAILABLE_OWNER_REPORTED_DATABASE_DELETED',relationships:'SCHEMA_ONLY_NOT_RECORD_VERIFIED',destination:'See legacy-entities.csv',importedRecords:0}));
assert.equal(entities.length,45);
const groups=Object.fromEntries([...new Set(rows.map(r=>r.classification))].map(key=>[key,rows.filter(r=>r.classification===key).length]));
const result={at:new Date().toISOString(),sourceCommit:commit,authority:'Owner reported accidental deletion on 2026-10-21 and instructed continuation from files.',scope:'AVAILABLE_FILES_BASELINE_NOT_DELETED_DATABASE_RECOVERY',database:{availability:'OWNER_REPORTED_DELETED',verifiedRecovery:false,sourceRecordCount:null,sourceRelationshipVerification:false,exportFound:false},schema:{models:entities.length,fields:575,fieldEvidence:'inventory/legacy-fields.csv'},files:{total:rows.length,groups,entries:rows},entities,limitations:['Seed definitions, sample files and prior UI observations cannot establish the deleted database rows, IDs, overrides or publication state.','docs/import/tier1-owner-products.csv includes third-party descriptions; its filename does not establish ownership or completed projects.','No import, auth/session recovery, business-content publication or production mutation was performed.']};
result.ownerRestrictions={productAdditionsAllowed:false,productArchiveImportsAllowed:false,newProductFixturesAllowed:false,authority:'Latest owner instruction: DONT ADD PDODUCT AND THIS; quoted catalogue/Sheets archive counts.',excludedFiles:rows.filter(r=>r.classification==='OWNER_EXCLUDED_PRODUCT_DATA').map(r=>r.path)};
writeFileSync(docs+'/inventory/available-file-baseline.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({files:rows.length,groups,entities:entities.length,database:result.database},null,2));
