// Real PostgreSQL SQL contracts using temporary, synthetic tables only. Never
// reads DATABASE_URL or copies production/QA/customer rows into the local server.
import {execFileSync} from 'node:child_process';
import {resolve,join} from 'node:path';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {contentReadQuery} from '../../src/lib/content-read-query.ts';
import {publicationIdentityQuery,publishedSourceQuery} from '../../src/lib/publication-read-query.ts';
import {contentListDocument} from '../../src/lib/content-list-document.ts';
assert.ok(process.env.RIVYA_LOCAL_PG_BIN,'Set the local PostgreSQL bin directory. No remote connection file is accepted.');
const literal=value=>"'"+String(value).replaceAll("'","''")+"'";
const document=id=>({id,kind:'page',route:'/p/'+id,title:'Synthetic '+id,eyebrow:'Local SQL verification',description:'X'.repeat(250),sections:[{id:'one',heading:'First',paragraphs:['Synthetic body '.repeat(1500)]},{id:'two',heading:'Second',group:'Group',paragraphs:['Another paragraph']}],pageSnapshot:{schemaVersion:1,dependencies:[],payload:'S'.repeat(40000)},translations:{hi:{title:'परीक्षण'}}});
const a=document('alpha'),b=document('beta'),draftB={...b,translations:{hi:{title:'बदला हुआ'}}};
const statements=[`BEGIN; SET LOCAL statement_timeout='10s';
CREATE TEMP TABLE rivya_content(content_key text PRIMARY KEY,kind text,route text,draft jsonb,published jsonb,version integer,published_version integer,visible boolean);
CREATE TEMP TABLE rivya_catalogue(product_id text PRIMARY KEY,published_version integer,visible boolean,published jsonb);
CREATE TEMP TABLE rivya_public_media(path text PRIMARY KEY,published jsonb);
INSERT INTO rivya_content VALUES ('alpha','page','/p/alpha',${literal(JSON.stringify(a))}::jsonb,${literal(JSON.stringify(a))}::jsonb,2,2,true),('beta','page','/p/beta',${literal(JSON.stringify(draftB))}::jsonb,${literal(JSON.stringify(b))}::jsonb,3,2,true);
INSERT INTO rivya_catalogue VALUES ('piece',1,true,'{"name":"Synthetic piece"}');
INSERT INTO rivya_public_media VALUES ('image','{"alt":"Synthetic media"}');`];
const query=(name,sql)=>statements.push(`SELECT jsonb_build_object('name',${literal(name)},'rows',COALESCE(jsonb_agg(t),'[]'::jsonb)) FROM (${sql}) t;`);
const content=(compact,record)=>contentReadQuery.replaceAll('$1',String(compact)).replaceAll('$2',record===null?'NULL':literal(record));
query('full',content(false,null));query('compact',content(true,null));query('selected',content(true,'alpha'));query('detail',content(false,'beta'));query('missing',content(false,"' OR true --"));
const identity=name=>{query(name,publicationIdentityQuery);query(name+'Full',publishedSourceQuery);};
identity('initial');
statements.push("UPDATE rivya_content SET draft=jsonb_set(draft,'{title}','\"A draft change\"') WHERE content_key='alpha';");identity('draftOnly');
statements.push("UPDATE rivya_catalogue SET published=jsonb_set(published,'{name}','\"Updated piece without version change\"');");identity('productEdit');
statements.push("UPDATE rivya_content SET route='/p/moved' WHERE content_key='alpha';");identity('routeEdit');
statements.push("UPDATE rivya_content SET published=jsonb_set(published,'{pageSnapshot,payload}','\"Changed captured snapshot\"') WHERE content_key='alpha';");identity('snapshotEdit');
statements.push("UPDATE rivya_content SET visible=false WHERE content_key='alpha';");identity('withdrawContent');
statements.push("UPDATE rivya_public_media SET published=NULL;");identity('withdrawMedia');
statements.push("UPDATE rivya_catalogue SET visible=false;");identity('withdrawProduct');
statements.push("UPDATE rivya_content SET published_version=published_version+1 WHERE content_key='beta';");identity('revisionEdit');
statements.push('TRUNCATE rivya_content,rivya_catalogue,rivya_public_media;');identity('empty');statements.push('ROLLBACK;');
const stdout=execFileSync(join(process.env.RIVYA_LOCAL_PG_BIN,'psql.exe'),['-X','-qAt','-v','ON_ERROR_STOP=1','-h','127.0.0.1','-p','55432','-U','rivya_local_qa','-d','postgres'],{input:statements.join('\n'),encoding:'utf8',maxBuffer:16*1024*1024,timeout:60000});
const result=Object.fromEntries(stdout.trim().split(/\r?\n/).map(line=>{const row=JSON.parse(line);return [row.name,row.rows];}));
let assertions=0;const equal=(actual,expected)=>{assert.deepEqual(actual,expected);assertions++;};
equal(result.full.length,2);equal(result.compact.length,2);equal(result.missing,[]);equal(result.detail.map(r=>r.content_key),['beta']);equal(result.detail[0].draft,draftB);
for(const full of result.full){const row=result.compact.find(r=>r.content_key===full.content_key);equal(row.draft,JSON.parse(JSON.stringify(contentListDocument(full.draft))));equal(row.published,JSON.parse(JSON.stringify(contentListDocument(full.published))));equal(row.detail_pending,true);}
equal(result.compact.map(r=>r.draft_status),['Aligned','Changes pending']);
equal(result.selected[0].draft,a);equal(result.selected[0].detail_pending,false);equal(result.selected[1].detail_pending,true);
equal(result.initial[0].identity,result.draftOnly[0].identity);
let previous=result.initial[0].identity;
for(const name of ['initial','draftOnly','productEdit','routeEdit','snapshotEdit','withdrawContent','withdrawMedia','withdrawProduct','revisionEdit','empty']){
 const digest=result[name][0].identity;equal(digest,result[name+'Full'][0].identity);assert.match(digest,/^[a-f0-9]{32}$/);assertions++;
 if(!['initial','draftOnly'].includes(name)){assert.notEqual(digest,previous);assertions++;}previous=digest;
}
const bytes=value=>Buffer.byteLength(JSON.stringify(value));
const fullBytes=bytes(result.full),compactBytes=bytes(result.compact);assert.ok(compactBytes<fullBytes*0.05);assertions++;
const report={at:new Date().toISOString(),environment:'Loopback PostgreSQL 18; synthetic temporary tables; transaction rolled back',assertions,passed:true,fullListBytes:fullBytes,compactListBytes:compactBytes,listReductionPercent:Number((100*(1-compactBytes/fullBytes)).toFixed(2)),identityBytes:bytes(result.initial),scope:'Actual SQL projection, exact selected detail, hidden body/translation/snapshot changes, membership/version/route invalidation, empty set and failed-record lookup. No remote queries or production data.'};
mkdirSync(resolve('test-results/final-acceptance'),{recursive:true});writeFileSync(resolve('test-results/final-acceptance/local-query-contracts.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
