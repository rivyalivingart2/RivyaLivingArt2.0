import {randomUUID} from 'node:crypto';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {isOrderStage,orderStages} from '@/lib/studio-orders';
import type {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic';
const headers = {'Cache-Control': 'private, no-store'};
function json(data: unknown, status = 200) { return Response.json(data, {status, headers}); }
function sameOrigin(request: NextRequest) {
  return request.headers.get('origin') === request.nextUrl.origin;
}
async function readSmallBody(request: NextRequest) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const {value, done} = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 4096) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return null; }
}
export async function GET(request:NextRequest) {
  try {
    const session=await studioSession();
    if (!session) return json({error: 'Sign in to continue.'}, 401);
    const sql = studioDb();
    const q=(request.nextUrl.searchParams.get('q')||'').trim().slice(0,150);
    const stage=request.nextUrl.searchParams.get('stage')||'';
    const assignee=request.nextUrl.searchParams.get('assignee')||'';
    const due=request.nextUrl.searchParams.get('due')==='1';
    const source=request.nextUrl.searchParams.get('source')||'';
    const product=request.nextUrl.searchParams.get('product')||'',category=request.nextUrl.searchParams.get('category')||'';
    const from=request.nextUrl.searchParams.get('from')||'',to=request.nextUrl.searchParams.get('to')||'';
    const validDate=(v:string)=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
    if(product.length>100||category.length>80||from&&!validDate(from)||to&&!validDate(to)||from&&to&&from>to)return json({error:'Check the piece, category and date filters.'},400);
    if(!['','website','manual'].includes(source))return json({error:'Invalid source filter.'},400);
    const page=Math.min(100000,Math.max(1,Number(request.nextUrl.searchParams.get('page'))||1));
    if(!Number.isInteger(page)||stage&&!isOrderStage(stage)||assignee&&assignee!=='unassigned'&&!/^[0-9a-f-]{36}$/i.test(assignee))return json({error:'Invalid filters.'},400);
    const orders = await sql`SELECT o.id, o.client, o.title, o.status, o.version, o.updated_at AS "updatedAt",
      o.created_at AS "createdAt",COALESCE(i.reference_count,(SELECT count(*)::integer FROM rivya_references r WHERE r.inquiry_id=i.id)) AS "referenceCount",i.reference,i.assignee,u.name AS "assigneeName",i.follow_up AS "followUp",i.request_kind AS "requestKind",CASE WHEN i.id IS NULL THEN 'manual' ELSE 'website' END AS source
      FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id LEFT JOIN rivya_staff u ON u.id=i.assignee
      WHERE (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid)
      AND (${q}='' OR concat_ws(' ',o.client,o.title,i.reference) ILIKE ${'%'+q+'%'})
      AND (${stage}='' OR o.status=${stage})
      AND (${assignee}='' OR i.assignee::text=${assignee} OR ${assignee}='unassigned' AND i.id IS NOT NULL AND i.assignee IS NULL)
      AND (${source}='' OR ${source}='manual' AND i.id IS NULL OR ${source}='website' AND i.id IS NOT NULL)
      AND (${product}='' OR i.product_id=${product})
      AND (${category}='' OR lower(i.product_snapshot->>'category')=lower(${category}))
      AND (NULLIF(${from},'')::date IS NULL OR o.created_at>=(NULLIF(${from},'')::date::timestamp AT TIME ZONE 'Asia/Kolkata'))
      AND (NULLIF(${to},'')::date IS NULL OR o.created_at<((NULLIF(${to},'')::date+1)::timestamp AT TIME ZONE 'Asia/Kolkata'))
      AND (NOT ${due} OR i.follow_up<=(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date AND o.status NOT IN ('COMPLETED','CLOSED'))
      ORDER BY o.created_at DESC,o.id LIMIT 51 OFFSET ${(page-1)*50}`;
    return json({orders: orders.slice(0,50), hasMore: orders.length > 50, page});
  } catch { return json({error: 'Orders are temporarily unavailable.'}, 503); }
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({error: 'Request not allowed.'}, 403);
  try {
    const session = await studioSession();
    if (!session) return json({error: 'Sign in to continue.'}, 401);
    if (Number(request.headers.get('content-length') || 0) > 4096) return json({error:'Request too large.'},413);
    const body = await readSmallBody(request);
    if (!body || typeof body !== 'object') return json({error:'Invalid request.'},400);
    const sql = studioDb();
    if(body.action==='edit'){
      if(session.role!=='admin')return json({error:'Administrator access required.'},403);
      if(typeof body.id!=='string'||!/^[0-9a-f-]{36}$/.test(body.id)||!Number.isSafeInteger(body.version)||typeof body.client!=='string'||!body.client.trim()||body.client.length>120||typeof body.title!=='string'||!body.title.trim()||body.title.length>240)return json({error:'Check the name and brief.'},400);
      const rows=await sql`WITH changed AS(
       UPDATE rivya_studio_orders o SET client=${body.client.trim()},title=${body.title.trim()},version=version+1,updated_at=now()
       WHERE o.id=${body.id}::uuid AND o.version=${body.version} AND NOT EXISTS(SELECT 1 FROM rivya_inquiries i WHERE i.id=o.id) RETURNING *
      ), logged AS(INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'manual-order:edit',id::text FROM changed)
      SELECT id,client,title,status,version,updated_at AS "updatedAt" FROM changed`;
      return rows.length?json({order:rows[0]}):json({error:'This record changed elsewhere or is a website inquiry. Reload before editing.'},409);
    }
    if (body.action === 'create') {
      if(session.role!=='admin')return json({error:'Administrator access required for manual orders.'},403);
      if (typeof body.client !== 'string' || typeof body.title !== 'string' || !body.client.trim() || !body.title.trim() || body.client.length > 120 || body.title.length > 240)
        return json({error:'Enter a client name and a brief within the displayed limits.'},400);
      if(body.requestId!==undefined&&(typeof body.requestId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.requestId)))return json({error:'Invalid save identity.'},400);
      const id = body.requestId || randomUUID();
      const rows = await sql`WITH created AS (
        INSERT INTO rivya_studio_orders (id, client, title) VALUES (${id}, ${body.client.trim()}, ${body.title.trim()}) ON CONFLICT(id) DO NOTHING RETURNING *
      ), logged AS (
        INSERT INTO rivya_studio_order_events (order_id, actor, from_status, to_status, version)
        SELECT id, ${session.adminId}, NULL, status, version FROM created
      ) SELECT id, client, title, status, version, updated_at AS "updatedAt" FROM created`;
      if(rows.length)return json({order: rows[0]},201);
      const recovered=await sql`SELECT o.id,o.client,o.title,o.status,o.version,o.updated_at AS "updatedAt" FROM rivya_studio_orders o
        WHERE o.id=${id}::uuid AND o.client=${body.client.trim()} AND o.title=${body.title.trim()}
        AND NOT EXISTS(SELECT 1 FROM rivya_inquiries i WHERE i.id=o.id)
        AND EXISTS(SELECT 1 FROM rivya_studio_order_events e WHERE e.order_id=o.id AND e.from_status IS NULL AND e.actor=${session.adminId})`;
      return recovered.length?json({order:recovered[0],recovered:true}):json({error:'This save identity already belongs to another saved brief. Review the board before starting a new record.'},409);
    }
    if (body.action !== 'move' || typeof body.id !== 'string' || !/^[0-9a-f-]{36}$/.test(body.id) || !isOrderStage(body.status) || !Number.isSafeInteger(body.version) || body.version < 1)
      return json({error:'Invalid order update.'},400);
    const reason=typeof body.reason==='string'?body.reason.trim():'';
    if(reason.length>500)return json({error:'Keep the reason within 500 characters.'},400);
    const current=await sql`SELECT o.status,o.version FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id
      WHERE o.id=${body.id}::uuid AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid)`;
    if(!current.length)return json({error:'This record is unavailable to your account.'},404);
    if(current[0].version!==body.version)return json({error:'This order changed elsewhere. Reload the board before moving it again.'},409);
    if(current[0].status===body.status)return json({unchanged:true});
    const needsReason=body.status==='CLOSED'||orderStages.indexOf(body.status)<orderStages.indexOf(current[0].status);
    if(needsReason&&!reason)return json({error:'Add a reason for closing or moving this record back.'},400);
    const rows = await sql`WITH previous AS (
      SELECT o.id, o.status FROM rivya_studio_orders o WHERE o.id = ${body.id}::uuid AND o.version = ${body.version}
      AND (${session.role==='admin'} OR EXISTS(SELECT 1 FROM rivya_inquiries i WHERE i.id=o.id AND i.assignee=${session.staffId}::uuid)) FOR UPDATE
    ), changed AS (
      UPDATE rivya_studio_orders AS o SET status = ${body.status}, version = o.version + 1, updated_at = now()
      FROM previous AS p WHERE o.id = p.id AND o.version = ${body.version}
      RETURNING o.*, p.status AS old_status
    ), logged AS (
      INSERT INTO rivya_studio_order_events (order_id, actor, from_status, to_status, version, reason)
      SELECT id, ${session.adminId}, old_status, status, version, ${reason||null} FROM changed
    ) SELECT id, client, title, status, version, updated_at AS "updatedAt" FROM changed`;
    if (!rows.length) return json({error:'This order changed elsewhere. Reload the board before moving it again.'},409);
    return json({order:rows[0]});
  } catch { return json({error:'The change could not be saved. Please try again.'},503); }
}
