import 'server-only';
import {createHash, createHmac, randomBytes, scrypt, timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {studioDb} from './studio-db';

const derive = promisify(scrypt);
export const sessionCookie = process.env.NODE_ENV === 'production' ? '__Host-rivya-studio' : 'rivya-studio';
export const sessionSeconds = 8 * 60 * 60;
export function studioConfigured() {
  return !!process.env.DATABASE_URL && !!process.env.STUDIO_ADMIN_ID?.trim() &&
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
export async function createStudioSession() {
  const sql = studioDb();
  const token = randomBytes(32).toString('base64url');
  await sql`INSERT INTO rivya_studio_sessions (token_hash, credential_version, expires_at, idle_expires_at)
    VALUES (${hash(token)}, ${fingerprint()}, now() + interval '8 hours', now() + interval '30 minutes')`;
  await sql`DELETE FROM rivya_studio_sessions WHERE expires_at <= now() OR idle_expires_at <= now()`;
  await sql`DELETE FROM rivya_studio_login_limits WHERE key = 'owner'`;
  return token;
}
export async function studioSession() {
  if (!studioConfigured()) return null;
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const sql = studioDb();
  const rows = await sql`UPDATE rivya_studio_sessions
    SET idle_expires_at = LEAST(expires_at, now() + interval '30 minutes')
    WHERE token_hash = ${hash(token)} AND credential_version = ${fingerprint()}
      AND expires_at > now() AND idle_expires_at > now() RETURNING token_hash`;
  return rows.length ? {adminId: process.env.STUDIO_ADMIN_ID!} : null;
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
