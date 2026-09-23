import 'server-only';
import {createHash, createHmac, randomBytes, scrypt, timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {studioDb} from './studio-db';
export type StaffSession={adminId:string;role:'admin'|'editor';staffId:string|null;credentialVersion?:number};

const derive = promisify(scrypt);
export const sessionCookie = process.env.NODE_ENV === 'production' ? '__Host-rivya-studio' : 'rivya-studio';
export const sessionSeconds = 8 * 60 * 60;
export function studioConfigured() {
  return /^postgres(?:ql)?:\/\//.test(process.env.DATABASE_URL||'') && !!process.env.STUDIO_ADMIN_ID?.trim() &&
    (process.env.STUDIO_ADMIN_PASSWORD?.length ?? 0) >= 16 &&
    (process.env.STUDIO_SESSION_SECRET?.length ?? 0) >= 32;
}
function fingerprint() {
  return createHmac('sha256', process.env.STUDIO_SESSION_SECRET!)
    .update(JSON.stringify([process.env.STUDIO_ADMIN_ID, process.env.STUDIO_ADMIN_PASSWORD])).digest('hex');
}
function hash(value: string) { return createHash('sha256').update(value).digest('hex'); }

export async function verifyAdmin(id: string, password: string) {
  if (!studioConfigured()) return false;
  const salt = process.env.STUDIO_SESSION_SECRET!;
  const [actual, expected] = await Promise.all([
    derive(password, salt, 64), derive(process.env.STUDIO_ADMIN_PASSWORD!, salt, 64),
  ]);
  const idMatches = timingSafeEqual(Buffer.from(hash(id)), Buffer.from(hash(process.env.STUDIO_ADMIN_ID!)));
  return timingSafeEqual(actual as Buffer, expected as Buffer) && idMatches;
}

/** Durable account-wide throttle cannot be evaded by changing a browser or IP. */
export async function allowLoginAttempt() {
  const sql = studioDb();
  const rows = await sql`INSERT INTO rivya_studio_login_limits (key, attempts, reset_at)
    VALUES ('owner', 1, now() + interval '15 minutes')
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE WHEN rivya_studio_login_limits.reset_at <= now() THEN 1 ELSE rivya_studio_login_limits.attempts + 1 END,
      reset_at = CASE WHEN rivya_studio_login_limits.reset_at <= now() THEN now() + interval '15 minutes' ELSE rivya_studio_login_limits.reset_at END
    RETURNING attempts`;
  return Number(rows[0].attempts) <= 10;
}
export async function hashStaffPassword(password:string){const salt=randomBytes(16).toString('hex');return `${salt}:${((await derive(password,salt,64)) as Buffer).toString('hex')}`;}
export async function authenticateStaff(id:string,password:string):Promise<StaffSession|null>{
 if(await verifyAdmin(id,password))return {adminId:process.env.STUDIO_ADMIN_ID!,role:'admin',staffId:null};
 const rows=await studioDb()`SELECT id,login,password_hash,role,version FROM rivya_staff WHERE lower(login)=lower(${id}) AND active=true`;
 const row=rows[0];const [salt,expected]=(row?.password_hash||'00000000000000000000000000000000:'+ '0'.repeat(128)).split(':');
 const actual=await derive(password,salt,64) as Buffer;
 return row&&timingSafeEqual(actual,Buffer.from(expected,'hex'))?{adminId:row.login,role:row.role,staffId:row.id,credentialVersion:row.version}:null;
}
export async function createStudioSession(identity?:StaffSession) {
  const sql = studioDb();
  const token = randomBytes(32).toString('base64url');
  const staffId=identity?.staffId||null;
  if(staffId&&!Number.isSafeInteger(identity?.credentialVersion))throw new Error('Account must be authenticated again');
  const inserted=staffId?await sql`INSERT INTO rivya_studio_sessions(token_hash,credential_version,expires_at,idle_expires_at,staff_id)
    SELECT ${hash(token)},version::text,now()+interval '8 hours',now()+interval '30 minutes',id
    FROM rivya_staff WHERE id=${staffId}::uuid AND active=true AND version=${identity!.credentialVersion!} RETURNING token_hash`:
    await sql`INSERT INTO rivya_studio_sessions(token_hash,credential_version,expires_at,idle_expires_at,staff_id)
    VALUES(${hash(token)},${fingerprint()},now()+interval '8 hours',now()+interval '30 minutes',NULL) RETURNING token_hash`;
  if(!inserted.length)throw new Error('Staff access changed; sign in again');
  await sql`DELETE FROM rivya_studio_sessions WHERE expires_at <= now() OR idle_expires_at <= now()`;
  await sql`DELETE FROM rivya_studio_login_limits WHERE key = 'owner'`;
  return token;
}
export async function studioSession() {return studioSessionFromToken((await cookies()).get(sessionCookie)?.value);}
export async function studioSessionFromToken(token:string|undefined) {
  if (!studioConfigured()) return null;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const sql = studioDb();
  // Resolve credential version, role and session in one statement; do not read a new
  // role in a second query after a concurrent staff change revoked this session.
  const rows = await sql`WITH valid AS (
    SELECT s.token_hash,s.staff_id,u.login,u.role FROM rivya_studio_sessions s
    LEFT JOIN rivya_staff u ON u.id=s.staff_id
    WHERE s.token_hash=${hash(token)} AND s.expires_at>now() AND s.idle_expires_at>now()
    AND ((s.staff_id IS NULL AND s.credential_version=${fingerprint()}) OR
      (u.active=true AND s.credential_version=u.version::text))
  ) UPDATE rivya_studio_sessions s SET idle_expires_at=LEAST(s.expires_at,now()+interval '30 minutes')
    FROM valid v WHERE s.token_hash=v.token_hash
    RETURNING v.staff_id,v.login,v.role`;
  if(!rows.length)return null;
  const row=rows[0];
  return row.staff_id?{adminId:row.login,role:row.role,staffId:row.staff_id} as StaffSession:
    {adminId:process.env.STUDIO_ADMIN_ID!,role:'admin',staffId:null} as StaffSession;
}
export async function requireStudioSession() {
  let session;
  try { session = await studioSession(); } catch { redirect('/studio/login?status=unavailable'); }
  if (!session) redirect('/studio/login');
  return session;
}
export async function revokeStudioSession() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (token && process.env.DATABASE_URL) {
    const sql = studioDb();
    await sql`DELETE FROM rivya_studio_sessions WHERE token_hash = ${hash(token)}`;
  }
}
