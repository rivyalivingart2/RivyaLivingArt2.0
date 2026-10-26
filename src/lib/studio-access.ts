import 'server-only';
import {createHash, randomBytes, randomUUID} from 'node:crypto';
import {studioDb} from './studio-db';
import {getSecurityAdapter, hashStaffPassword, type StaffSession} from './studio-auth';
import {type AccessInput, validAccessPassword, validAccessToken} from './studio-access-validation';

/** Do not authorize from client props or a hidden menu. Scope every record access. */
export async function canAccessInquiry(session:StaffSession,id:string){
  if(session.role==='admin')return true;
  if(!session.staffId)return false;
  const rows=await studioDb()`SELECT id FROM rivya_inquiries WHERE id=${id}::uuid AND assignee=${session.staffId}::uuid`;
  return rows.length===1;
}

const digest = (token: string) => createHash('sha256').update(token).digest('hex');
export async function requestStudioAccess(input: AccessInput) {
  const adapter = getSecurityAdapter();
  if (adapter) {
    return adapter.requestStudioAccess(input);
  }
  // Identical insert path for existing and unknown identities. Never change an account here.
  await studioDb()`INSERT INTO rivya_access_requests(id,kind,login,name,contact)
    VALUES(${randomUUID()}::uuid,${input.kind},${input.login},${input.name},${input.contact})
    ON CONFLICT (kind,lower(login)) WHERE status IN ('pending','approved') DO NOTHING`;
}
export async function listAccessRequests() {
  const adapter = getSecurityAdapter();
  if (adapter) {
    const list = await adapter.listAccessRequests();
    return list.map(r => ({
      id: r.id,
      kind: r.kind,
      login: r.login,
      name: r.name,
      contact: r.contact,
      status: r.status,
      version: r.version,
      createdAt: r.created_at,
      expiresAt: r.expires_at,
    }));
  }
  return studioDb()`SELECT id,kind,login,name,contact,status,version,created_at AS "createdAt",expires_at AS "expiresAt"
    FROM rivya_access_requests WHERE status IN ('pending','approved') ORDER BY created_at LIMIT 100`;
}
export async function decideAccessRequest(session: StaffSession, id: string, version: number, operation: 'approve'|'reject') {
  if (session.role !== 'admin') throw new Error('Administrator access required.');
  const adapter = getSecurityAdapter();
  if (adapter) {
    const res = await adapter.decideAccessRequest(session, id, version, operation);
    if (!res) return null;
    return {saved: true, token: res.linkToken, expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()};
  }
  const sql = studioDb();
  if (operation === 'reject') {
    const rows = await sql`WITH changed AS (
      UPDATE rivya_access_requests SET status='rejected',token_hash=NULL,expires_at=NULL,version=version+1,updated_at=now(),decided_by=${session.adminId}
      WHERE id=${id}::uuid AND version=${version} AND status IN ('pending','approved') RETURNING id
    ), logged AS (INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'staff:request-rejected',id::text FROM changed)
    SELECT id FROM changed`;
    return rows.length ? {saved:true} : null;
  }
  const token = randomBytes(32).toString('base64url');
  // New members start disabled with an unknowable password. Approval grants editor only.
  const placeholder = await hashStaffPassword(randomBytes(48).toString('base64url'));
  const rows = await sql`WITH request AS MATERIALIZED (
    SELECT * FROM rivya_access_requests WHERE id=${id}::uuid AND version=${version}
      AND status IN ('pending','approved') AND lower(login)<>lower(${process.env.STUDIO_ADMIN_ID || ''})
      AND lower(login)<>lower(${session.adminId}) FOR UPDATE
  ), created AS (
    INSERT INTO rivya_staff(id,login,name,password_hash,role,active)
    SELECT ${randomUUID()}::uuid,login,name,${placeholder},'editor',false FROM request
    WHERE kind='access' AND staff_id IS NULL
    ON CONFLICT DO NOTHING RETURNING id,version
  ), eligible AS (
    SELECT c.id,c.version FROM created c
    UNION ALL
    SELECT s.id,s.version FROM rivya_staff s JOIN request r ON
      ((r.kind='recovery' AND lower(s.login)=lower(r.login) AND s.active=true)
       OR (r.kind='access' AND r.staff_id=s.id AND s.active=false AND s.version=r.credential_version))
    WHERE s.id IS DISTINCT FROM ${session.staffId}::uuid
  ), changed AS (
    UPDATE rivya_access_requests r SET status='approved',staff_id=e.id,credential_version=e.version,
      token_hash=${digest(token)},expires_at=now()+interval '30 minutes',version=r.version+1,updated_at=now(),decided_by=${session.adminId}
    FROM request q,eligible e WHERE r.id=q.id RETURNING r.id,r.expires_at
  ), logged AS (INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'staff:access-link-issued',id::text FROM changed)
  SELECT id,expires_at AS "expiresAt" FROM changed`;
  // Token only appears in this authenticated one-time response, never in audit/list output.
  return rows.length ? {saved:true,token,expiresAt:rows[0].expiresAt} : null;
}
export async function redeemAccessLink(token: string, password: string) {
  if (!validAccessToken(token) || !validAccessPassword(password)) return false;
  const adapter = getSecurityAdapter();
  if (adapter) {
    return adapter.redeemAccessLink(token, password);
  }
  const passwordHash = await hashStaffPassword(password);
  const rows = await studioDb()`WITH candidate AS MATERIALIZED (
    SELECT r.id,r.staff_id,r.credential_version,r.kind FROM rivya_access_requests r JOIN rivya_staff s ON s.id=r.staff_id
    WHERE r.token_hash=${digest(token)} AND r.status='approved' AND r.expires_at>now()
      AND s.version=r.credential_version AND (r.kind='access' AND s.active=false OR r.kind='recovery' AND s.active=true)
      AND lower(s.login)<>lower(${process.env.STUDIO_ADMIN_ID || ''}) FOR UPDATE OF r,s
  ), changed AS (
    UPDATE rivya_staff s SET password_hash=${passwordHash},active=true,version=s.version+1
    FROM candidate c WHERE s.id=c.staff_id AND s.version=c.credential_version RETURNING s.id
  ), consumed AS (
    UPDATE rivya_access_requests r SET status='completed',token_hash=NULL,expires_at=NULL,version=r.version+1,updated_at=now()
    FROM candidate c,changed s WHERE r.id=c.id AND s.id=c.staff_id RETURNING r.id
  ), revoked AS (DELETE FROM rivya_studio_sessions WHERE staff_id IN (SELECT id FROM changed)),
  logged AS (INSERT INTO rivya_audit(actor,action,entity) SELECT 'verified-access-link','staff:password-set',id::text FROM changed)
  SELECT id FROM consumed`;
  return rows.length === 1;
}
