import {createHash, createHmac, randomBytes, randomUUID, timingSafeEqual} from 'node:crypto';
import {BOUNDED_LIMITS, type createBoundedProvider} from './bounded-store';
import {createBoundedSessionStore, type BoundedSessionConfig, type BoundedSessionIdentity,
  type BoundedSessionOptions} from './bounded-session-store';
import type {StaffSession} from './security-adapter';

export type SessionLifecycleErrorCode = 'SESSION_CONFIGURATION' | 'SESSION_REAUTH_REQUIRED' |
  'SESSION_UNAVAILABLE' | 'SESSION_OUTCOME_UNKNOWN';
export class SessionLifecycleError extends Error {
  constructor(public readonly code: SessionLifecycleErrorCode) { super('Studio session: ' + code + '.'); }
}
/** Internal server contract. Fingerprint binds configuration; never serialize. */
export interface StudioSessionLifecycle {
  readonly scope: 'BOUNDED_ATOMIC_SESSIONS';
  readonly ownerCredentialFingerprint: string;
  createStudioSession(identity?: StaffSession): Promise<string>;
  studioSessionFromToken(token: string | undefined): Promise<StaffSession | null>;
  revokeStudioSession(token: string | undefined): Promise<void>;
}
export type BoundedSessionServiceConfig = Omit<BoundedSessionConfig, 'owner'> & {
  owner: {login: string; password: string; sessionSecret: string; epochRecordId: string};
};
const tokenValid = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value);
const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(value);
const hash = (value: string): string => createHash('sha256').update(value).digest('hex');
const exact = (value: object, keys: string[]) => Object.keys(value).sort().join(',') === [...keys].sort().join(',');
function fail(code: SessionLifecycleErrorCode): never { throw new SessionLifecycleError(code); }

/** Matches existing owner fingerprint; no environment lookup or rotation. */
export function sessionOwnerFingerprint(owner: Pick<BoundedSessionServiceConfig['owner'], 'login' | 'password' | 'sessionSecret'>): string {
  if (!owner || typeof owner.login !== 'string' || owner.login !== owner.login.trim() ||
      !/^[A-Za-z0-9_.@-]{3,80}$/.test(owner.login) || typeof owner.password !== 'string' ||
      owner.password.length < 16 || owner.password.length > 4096 || typeof owner.sessionSecret !== 'string' ||
      owner.sessionSecret.length < 32 || owner.sessionSecret.length > 4096) return fail('SESSION_CONFIGURATION');
  return createHmac('sha256', owner.sessionSecret).update(JSON.stringify([owner.login, owner.password])).digest('hex');
}

/** Token-level service. Provider is explicit; no cookies, SQL fallback, auto
 * registration or local storage. Identity comes from server authentication. */
export function createBoundedSessionService(config: BoundedSessionServiceConfig,
  provider: ReturnType<typeof createBoundedProvider>): StudioSessionLifecycle {
  if (!config || !config.owner || typeof config.clock !== 'function') return fail('SESSION_CONFIGURATION');
  const fingerprint = sessionOwnerFingerprint(config.owner), ownerLogin = config.owner.login;
  const timeoutMs = config.timeoutMs ?? BOUNDED_LIMITS.operationTimeoutMs, clock = config.clock;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > BOUNDED_LIMITS.operationTimeoutMs) return fail('SESSION_CONFIGURATION');
  const store = createBoundedSessionStore({...config, owner: {login: ownerLogin, fingerprint,
    epochRecordId: config.owner.epochRecordId}}, provider);
  const now = (): number => { const value = clock(); if (!Number.isSafeInteger(value) || value < 0 || value > 8_640_000_000_000_000) return fail('SESSION_UNAVAILABLE'); return value; };
  async function operation<T>(action: (options: BoundedSessionOptions, check: (attemptedWrite?: boolean) => void) => Promise<T>): Promise<T> {
    const deadline = performance.now() + timeoutMs, controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const check = (attemptedWrite = false) => {
      if (controller.signal.aborted || performance.now() >= deadline) return fail(attemptedWrite ? 'SESSION_OUTCOME_UNKNOWN' : 'SESSION_UNAVAILABLE');
    };
    try { check(); return await action({signal: controller.signal, deadline}, check); }
    catch (error) {
      if (error instanceof SessionLifecycleError) throw error;
      const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
      if (code === 'outcome-unknown') return fail('SESSION_OUTCOME_UNKNOWN');
      return fail('SESSION_UNAVAILABLE');
    } finally { clearTimeout(timer); controller.abort(); }
  }
  const identityForCreate = (value: StaffSession | undefined): BoundedSessionIdentity => {
    if (!value || typeof value !== 'object' || !['admin', 'editor'].includes(value.role) ||
        typeof value.adminId !== 'string' || !/^[A-Za-z0-9_.@-]{3,80}$/.test(value.adminId)) return fail('SESSION_REAUTH_REQUIRED');
    if (value.staffId === null) {
      if (!exact(value, ['adminId', 'role', 'staffId']) || value.role !== 'admin' ||
          !timingSafeEqual(Buffer.from(hash(value.adminId)), Buffer.from(hash(ownerLogin)))) return fail('SESSION_REAUTH_REQUIRED');
      return {kind: 'owner'};
    }
    if (!exact(value, ['adminId', 'role', 'staffId', 'credentialVersion']) || !uuid(value.staffId) ||
        !Number.isSafeInteger(value.credentialVersion) || value.credentialVersion! < 1 || value.credentialVersion! > 2147483647) return fail('SESSION_REAUTH_REQUIRED');
    return {kind: 'staff', staffId: value.staffId, credentialVersion: value.credentialVersion!, login: value.adminId, role: value.role};
  };
  return Object.freeze({
    scope: 'BOUNDED_ATOMIC_SESSIONS' as const,
    ownerCredentialFingerprint: fingerprint,
    async createStudioSession(identity?: StaffSession) {
      const subject = identityForCreate(identity);
      return operation(async (options, check) => {
        const token = randomBytes(32).toString('base64url');
        const outcome = await store.create({tokenHash: hash(token), identity: subject,
          createdAt: now(), operationId: 'session:create:' + randomUUID()}, options);
        check(true);
        if (outcome.status !== 'committed') return fail('SESSION_REAUTH_REQUIRED');
        // No fresh-token retry after uncertainty; no cookie for an orphan.
        return token;
      });
    },
    async studioSessionFromToken(token: string | undefined) {
      if (!tokenValid(token)) return null;
      return operation(async (options, check) => {
        const outcome = await store.validateAndRefresh({tokenHash: hash(token),
          operationId: 'session:refresh:' + randomUUID()}, options);
        check(outcome.status !== 'invalid');
        if (outcome.status !== 'valid') return null;
        return {...outcome.identity};
      });
    },
    async revokeStudioSession(token: string | undefined) {
      if (!tokenValid(token)) return;
      await operation(async (options, check) => {
        const outcome = await store.revoke({tokenHash: hash(token), operationId: 'session:revoke:' + randomUUID()}, options);
        check(outcome.status !== 'missing');
      });
    },
  });
}
