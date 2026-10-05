import {login,request,sql,record,fingerprint} from './common.mjs';
import assert from 'node:assert/strict';
const admin=await login(),before=await fingerprint();
// Retire only synthetic records created by these C5 runners. Keep their history.
const rows=await sql`SELECT id,status,version FROM rivya_studio_orders WHERE title ~ '^C5QA-[0-9]+ request [012]$' AND client ~ '^C5QA-[0-9]+ person [012]$' AND created_at>='2026-10-05'::date`;
const retired=[];
for(const row of rows)if(row.status!=='CLOSED'){assert.equal((await request(admin,'/api/studio/orders',{action:'move',id:row.id,version:row.version,status:'CLOSED',reason:'Synthetic C5 acceptance fixture retirement; retain history.'})).status,200);retired.push(row.id);}
const counts=(await sql`SELECT
 (SELECT count(*)::int FROM rivya_studio_orders WHERE (title ~ '^C5QA-[0-9]+ request [012]$' OR title ~ '^C5UI-[0-9]+ synthetic brief$') AND status<>'CLOSED') AS open_orders,
 (SELECT count(*)::int FROM rivya_staff WHERE login ~ '^qa-c5-([0-9]+|ui-[0-9]+)$' AND active=true) AS active_staff,
 (SELECT count(*)::int FROM rivya_content WHERE route ~ '^/p/c5(qa|ui)-[0-9]+$' AND visible=true) AS visible_pages,
 (SELECT count(*)::int FROM rivya_catalogue) AS products,
 (SELECT count(*)::int FROM rivya_public_media) AS media`)[0];
assert.equal(counts.open_orders,0);assert.equal(counts.active_staff,0);assert.equal(counts.visible_pages,0);assert.deepEqual(await fingerprint(),before);
const supplementalClosures=await sql`SELECT order_id AS id,created_at AS "closedAt" FROM rivya_studio_order_events WHERE reason='Synthetic C5 acceptance fixture retirement; retain history.' ORDER BY created_at`;
record('fixture-retirement',{checkedAt:new Date().toISOString(),complete:true,localAppSessionVerifiedInQaDatabase:true,retiredManualFixtures:retired,supplementalClosures,...counts,protectedRecordsUnchanged:true,productionWrites:false});console.log(JSON.stringify({complete:true,localAppSessionVerifiedInQaDatabase:true,...counts}));
