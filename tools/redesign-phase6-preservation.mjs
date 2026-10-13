import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {neon} from '@neondatabase/serverless';
assert.equal(globalThis.__rivyaMigrationLocalSql,true);
const sql=neon(process.env.DATABASE_URL),root='test-results/old-design-migration/';
const before=JSON.parse(await readFile(root+'local-phase6-before-private.json','utf8')),after=JSON.parse(await readFile(root+'local-phase6-after-private.json','utf8'));
const lifecycle=JSON.parse(await readFile('output/redesign-phase6/lifecycle.json','utf8'));
const events=await sql`SELECT id::text AS id FROM rivya_studio_order_events WHERE order_id=${lifecycle.fixture.id}::uuid`;
const eventIds=new Set(events.map(e=>e.id));assert.equal(eventIds.size,8);
const scopes={};let originalRows=0,addedRows=0;
for(const [table,rows]of Object.entries(before.records)){
 for(const [id,digest]of Object.entries(rows))assert.equal(after.records[table][id],digest,'Original protected record changed');
 const additions=Object.keys(after.records[table]).filter(id=>!(id in rows));
 for(const id of additions)assert.ok(table==='rivya_studio_orders'||table==='rivya_privacy_controls'?id===lifecycle.fixture.id:table==='rivya_staff'?id===lifecycle.staff.id:table==='rivya_studio_order_events'&&eventIds.has(id),'Unexpected added record');
 scopes[table]={original:Object.keys(rows).length,originalsUnchanged:true,added:additions.length,after:Object.keys(after.records[table]).length};originalRows+=Object.keys(rows).length;addedRows+=additions.length;
}
assert.equal(originalRows,1646);assert.equal(addedRows,11);assert.equal(lifecycle.fixture.status,'CLOSED');assert.equal(lifecycle.staff.active,false);
const report={at:new Date().toISOString(),scope:'Isolated local QA database; 13 inventoried scopes',originalRows,originalsUnchanged:true,addedRows,scopes,fixture:lifecycle.fixture,temporaryEditor:lifecycle.staff,additionPurpose:'One clearly fictional local QA order, eight stage events, its privacy row and one temporary editor retained disabled. No original record changed.',limits:'No production snapshot. Session, audit and rate-limit bookkeeping outside this inventory. Private original IDs and hashes remain ignored.'};
await writeFile('docs/redesign/modern-design-2026-10-13/phase6-preservation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({originalRows,originalsUnchanged:true,addedRows,orderClosed:true,qaEditorDisabled:true}));
