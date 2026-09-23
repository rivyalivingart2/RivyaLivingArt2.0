import {randomUUID} from 'node:crypto';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {isOrderStage} from '@/lib/studio-orders';
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
export async function GET() {
  try {
    if (!await studioSession()) return json({error: 'Sign in to continue.'}, 401);
    const sql = studioDb();
    const orders = await sql`SELECT id, client, title, status, version, updated_at AS "updatedAt" FROM rivya_studio_orders ORDER BY created_at DESC LIMIT 1001`;
    return json({orders: orders.slice(0,1000), truncated: orders.length > 1000});
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
    if (body.action === 'create') {
      if (typeof body.client !== 'string' || typeof body.title !== 'string' || !body.client.trim() || !body.title.trim() || body.client.length > 120 || body.title.length > 240)
        return json({error:'Enter a client name and a brief within the displayed limits.'},400);
      const id = randomUUID();
      const rows = await sql`WITH created AS (
        INSERT INTO rivya_studio_orders (id, client, title) VALUES (${id}, ${body.client.trim()}, ${body.title.trim()}) RETURNING *
      ), logged AS (
        INSERT INTO rivya_studio_order_events (order_id, actor, from_status, to_status, version)
        SELECT id, ${session.adminId}, NULL, status, version FROM created
      ) SELECT id, client, title, status, version, updated_at AS "updatedAt" FROM created`;
      return json({order: rows[0]},201);
    }
    if (body.action !== 'move' || typeof body.id !== 'string' || !/^[0-9a-f-]{36}$/.test(body.id) || !isOrderStage(body.status) || !Number.isSafeInteger(body.version) || body.version < 1)
      return json({error:'Invalid order update.'},400);
    const rows = await sql`WITH previous AS (
      SELECT id, status FROM rivya_studio_orders WHERE id = ${body.id}::uuid AND version = ${body.version} FOR UPDATE
    ), changed AS (
      UPDATE rivya_studio_orders AS o SET status = ${body.status}, version = o.version + 1, updated_at = now()
      FROM previous AS p WHERE o.id = p.id AND o.version = ${body.version}
      RETURNING o.*, p.status AS old_status
    ), logged AS (
      INSERT INTO rivya_studio_order_events (order_id, actor, from_status, to_status, version)
      SELECT id, ${session.adminId}, old_status, status, version FROM changed
    ) SELECT id, client, title, status, version, updated_at AS "updatedAt" FROM changed`;
    if (!rows.length) return json({error:'This order changed elsewhere. Reload the board before moving it again.'},409);
    return json({order:rows[0]});
  } catch { return json({error:'The change could not be saved. Please try again.'},503); }
}
