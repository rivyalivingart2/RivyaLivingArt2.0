import {createHash, randomBytes, randomUUID, scrypt} from 'node:crypto';
import {promisify} from 'node:util';
import {parseAccessInput, validAccessPassword, validAccessToken, type AccessInput} from '../studio-access-validation';
import {BOUNDED_LIMITS, type BoundedOperationOptions} from './bounded-store';
import {loginResetOperationId, type BoundedSecurityWorkflows, type SecurityAuthority, type SecurityWorkflowInput} from './bounded-security-workflows';
import {securityPrimaryId} from './security-current-snapshot';
import {runSecurityOperation, securityWorkflowFail as fail, type SecurityOperation} from './security-operation';
import {securityLookupDigest} from './security-lookup-projection';

const derive = promisify(scrypt);
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex'), derived = await derive(password, salt, 64) as Buffer;
  return salt + ':' + derived.toString('hex');
}
export type SecurityRequestListEntry = Awaited<ReturnType<BoundedSecurityWorkflows['listRequests']>>[number];
export type LoginAttemptReceipt = {key: string; recordId: string; revision: number};

/** Server facade only. Cookie resolution is explicitly injected from the
 * authenticated request context; caller-provided role/login props are not proof.
 * Raw tokens exist only in this scope and return only on a NEW confirmed commit. */
export function createBoundedSecurityService(config: {workflows: BoundedSecurityWorkflows; ownerCredentialFingerprint: string;
  currentSessionToken: () => Promise<string | undefined>; timeoutMs?: number}) {
  const workflows = config.workflows, ownerCredentialFingerprint = config.ownerCredentialFingerprint;
  const currentSessionToken = config.currentSessionToken, timeoutMs = config.timeoutMs ?? BOUNDED_LIMITS.operationTimeoutMs;
  if (!securityLookupDigest(ownerCredentialFingerprint) || typeof currentSessionToken !== 'function' || !workflows || workflows.ownerCredentialFingerprint !== ownerCredentialFingerprint ||
      ['execute', 'lookupStaff', 'listRequests', 'listStaff', 'audit'].some(key => typeof workflows[key as keyof BoundedSecurityWorkflows] !== 'function') ||
      !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > BOUNDED_LIMITS.operationTimeoutMs) fail('configuration');
  const context = async (operation: SecurityOperation): Promise<SecurityAuthority> => {
    operation.check(); const token = await currentSessionToken(); operation.check();
    if (!validAccessToken(token)) fail('unauthorized'); return {kind: 'session', tokenHash: digest(token)};
  };
  const options = (operation: SecurityOperation): BoundedOperationOptions => ({signal: operation.signal, deadline: operation.deadline});
  const call = <T>(work: (operation: SecurityOperation) => Promise<T>) => runSecurityOperation(timeoutMs, {}, work);
  const execute = (operation: SecurityOperation, input: SecurityWorkflowInput, authority: SecurityAuthority) => {
    // Once handed to the writer, a facade timeout must conservatively report an
    // unknown write. It cannot know how far a still-running nested call got.
    operation.check(); operation.dispatched = true;
    return workflows.execute(input, authority, options(operation));
  };
  return Object.freeze({
    scope: 'BOUNDED_ATOMIC_SECURITY' as const, ownerCredentialFingerprint,
    lookupStaff: workflows.lookupStaff,
    async workspaceStaff() { return call(async operation => workflows.listStaff(await context(operation), options(operation))); },
    async requestStudioAccess(raw: AccessInput): Promise<void> {
      const input = parseAccessInput(raw); if (!input) fail('invalid-input');
      await call(async operation => execute(operation, {action: 'request', operationId: randomUUID(), id: randomUUID(), ...input}, {kind: 'public'}));
    },
    async listAccessRequests(): Promise<SecurityRequestListEntry[]> {
      return call(async operation => workflows.listRequests(await context(operation), options(operation)));
    },
    async decideAccessRequest(id: string, version: number, decision: 'approve' | 'reject'): Promise<{saved: true; linkToken?: string; expiresAt?: string} | null> {
      return call(async operation => {
        const authority = await context(operation), operationId = randomUUID();
        if (decision === 'reject') {
          const result = await execute(operation, {action: 'reject', operationId, requestId: id, expectedVersion: version}, authority);
          operation.check(); return result.status === 'committed' ? {saved: true} : null;
        }
        if (decision !== 'approve') fail('invalid-input');
        const token = randomBytes(32).toString('base64url');
        const placeholderHash = await hashPassword(randomBytes(48).toString('base64url')); operation.check();
        const result = await execute(operation, {action: 'approve', operationId, requestId: id, expectedVersion: version,
          tokenHash: digest(token), newStaffId: randomUUID(), placeholderHash}, authority);
        operation.check();
        if (result.status !== 'committed') return null;
        if (!result.expiresAt || !Number.isFinite(Date.parse(result.expiresAt))) fail('outcome-unknown');
        return {saved: true, linkToken: token, expiresAt: result.expiresAt};
      });
    },
    async redeemAccessLink(token: string, password: string): Promise<boolean> {
      if (!validAccessToken(token) || !validAccessPassword(password)) return false;
      return call(async operation => {
        const passwordHash = await hashPassword(password); operation.check();
        const result = await execute(operation, {action: 'redeem', operationId: randomUUID(), tokenHash: digest(token), passwordHash}, {kind: 'public'});
        operation.check(); return result.status === 'committed';
      });
    },
    async audit() { return call(async operation => workflows.audit(await context(operation), options(operation))); },
    async maintainSessions() {
      return call(operation => execute(operation, {action: 'session-maintenance', operationId: randomUUID()}, {kind: 'maintenance'}));
    },
    async resetSuccessfulLogin(token: string, receipt: LoginAttemptReceipt) {
      if (!validAccessToken(token) || !receipt || receipt.key !== 'owner') fail('invalid-input');
      const tokenHash = digest(token), safe = {...receipt};
      // Receipt identity is checked independently of caller's key string.
      if (safe.recordId !== securityPrimaryId('rivya_studio_login_limits', safe.key)) fail('invalid-input');
      return call(operation => execute(operation, {action: 'login-reset', operationId: loginResetOperationId(tokenHash),
        key: safe.key, expectedRevision: safe.revision}, {kind: 'session', tokenHash}));
    },
  });
}
export type StudioSecurityWorkflows = ReturnType<typeof createBoundedSecurityService>;
