import {BOUNDED_LIMITS, boundedCursor, readBoundedRecords, validateBoundedLayout, validateBoundedManifest,
  validateBoundedPage, type BoundedCursor, type BoundedLayout, type BoundedManifestRead, type BoundedPage,
  type BoundedOperationOptions, type createBoundedProvider} from './bounded-store';
import {type GoogleWorkspaceRecord, type MutationActor} from './record-codec';
import {SecurityLookupError, securityLookupFail as fail, securityLookupCopy as copy, securityLookupExact as exact,
  securityLookupSame as same, securityLookupHash as hash, securityLookupDigest as digest, securityLookupKey,
  securityLookupClaimId, securityLookupMarkerId, validateSecurityLookupClaim, validateSecurityLookupMarker,
  validateSecurityStaffSource, validateSecurityRequestSource, type SecurityLookupKind} from './security-lookup-projection';

/** Explicit trusted registration from separately reconciled bootstrap/readback.
 * A planner proposal has no root and cannot satisfy this contract. Until atomic
 * index maintenance exists, ANY root revision change invalidates this reader,
 * even an unrelated session write. There is no readiness boolean or auto-adopt. */
export type SecurityLookupCoverage = {
  format: 'rivya-security-lookup-coverage-v1'; layoutSha256: string; root: BoundedCursor;
  markerRecordId: string; markerPayloadSha256: string;
};
export type SecurityLookupAuthorization = {
  phase: 'preflight' | 'guarded'; actor: MutationActor; kind: SecurityLookupKind; keySha256: string;
  marker: GoogleWorkspaceRecord | null; claim: GoogleWorkspaceRecord | null; source: GoogleWorkspaceRecord | null;
};
const MAX_PROOF_PAGES = 16; // marker + claim + source: at most five current-proof pages each

/** Internal server reader only. A returned source row can contain password/token
 * hashes and is never a login grant. Caller must validate current state and use
 * atomic credential/session operations. This module does not maintain claims,
 * provision registrations, query SQL or select an application provider. */
export function createBoundedSecurityLookupReader(config: {
  layout: BoundedLayout; coverage: SecurityLookupCoverage; actor: MutationActor;
  authorize: (context: SecurityLookupAuthorization) => boolean | Promise<boolean>; timeoutMs?: number;
}, provider: ReturnType<typeof createBoundedProvider>) {
  if (!config || !config.coverage) return fail('coverage-unverified');
  const layout = validateBoundedLayout(config.layout), coverage = copy(config.coverage), actor = copy(config.actor);
  const timeoutMs = config.timeoutMs ?? BOUNDED_LIMITS.operationTimeoutMs, authorize = config.authorize;
  if (layout.key !== 'security' || typeof authorize !== 'function' || !exact(actor, ['id']) || typeof actor.id !== 'string' ||
      !/^[A-Za-z0-9:_-]{1,160}$/.test(actor.id) || !Number.isInteger(timeoutMs) || timeoutMs < 1 ||
      timeoutMs > BOUNDED_LIMITS.operationTimeoutMs || !provider || typeof provider.readManifest !== 'function' ||
      typeof provider.readPages !== 'function') return fail('configuration');
  if (!exact(coverage, ['format', 'layoutSha256', 'root', 'markerRecordId', 'markerPayloadSha256']) ||
      coverage.format !== 'rivya-security-lookup-coverage-v1' || coverage.layoutSha256 !== hash(layout) ||
      !exact(coverage.root, ['epoch', 'revision', 'manifestSha256']) || typeof coverage.root.epoch !== 'string' ||
      !/^[A-Za-z0-9:_-]{1,240}$/.test(coverage.root.epoch) || !Number.isSafeInteger(coverage.root.revision) ||
      coverage.root.revision < 1 || !digest(coverage.root.manifestSha256) || !digest(coverage.markerPayloadSha256) ||
      !/^security-lookup:coverage:[0-9a-f]{64}$/.test(coverage.markerRecordId)) return fail('coverage-unverified');

  async function lookup(kind: SecurityLookupKind, value: string, requestKind: 'access' | 'recovery' | undefined,
    options: BoundedOperationOptions = {}): Promise<GoogleWorkspaceRecord | null> {
    if (options.deadline !== undefined && (!Number.isFinite(options.deadline) || options.deadline < 0)) return fail('invalid-input');
    const started = performance.now(), deadline = Math.min(started + timeoutMs, options.deadline ?? Infinity);
    const signal = options.signal, controller = new AbortController(), abort = () => controller.abort();
    if (signal?.aborted) abort();
    signal?.addEventListener('abort', abort, {once: true});
    const timer = setTimeout(abort, Math.max(0, deadline - started));
    const check = () => { if (controller.signal.aborted || performance.now() >= deadline) fail('unavailable'); };
    let cancel: () => void = () => {};
    const cancelled = new Promise<never>((_, reject) => {
      cancel = () => reject(new SecurityLookupError('unavailable'));
      controller.signal.addEventListener('abort', cancel, {once: true});
    });
    const work = async () => {
      check();
      const keySha256 = securityLookupKey(kind, value, requestKind), claimId = securityLookupClaimId(kind, keySha256);
      const permission = async (phase: 'preflight' | 'guarded', marker: GoogleWorkspaceRecord | null,
        claim: GoogleWorkspaceRecord | null, source: GoogleWorkspaceRecord | null) => {
        check();
        if (await authorize(copy({phase, actor, kind, keySha256, marker, claim, source})) !== true) fail('unauthorized');
        check();
      };
      await permission('preflight', null, null, null);
      const raw = await provider.readManifest({signal: controller.signal}); check();
      const verified = validateBoundedManifest(layout, raw.root, raw.manifest);
      const base: BoundedManifestRead = {root: verified.root, manifest: verified.manifest};
      if (!same(boundedCursor(base.root), coverage.root)) fail('coverage-unverified');
      const pages = new Map<number, BoundedPage>();
      const read = async (ids: string[]) => {
        const needed = new Set<number>();
        for (const id of ids) {
          const head = base.manifest.records.find(record => record[0] === id);
          if (!head) continue;
          const latest = base.manifest.mutations[head[3]];
          for (const page of [head[1], latest[3], latest[5], latest[7]]) needed.add(page);
          if (latest[2] >= 0) needed.add(base.manifest.mutations[latest[2]][7]);
        }
        if (new Set([...pages.keys(), ...needed]).size > MAX_PROOF_PAGES) fail('integrity');
        const missing = [...needed].filter(id => !pages.has(id));
        for (let offset = 0; offset < missing.length; offset += BOUNDED_LIMITS.readPagesPerRequest) {
          check(); const requested = missing.slice(offset, offset + BOUNDED_LIMITS.readPagesPerRequest);
          const returned = await provider.readPages(copy(base), [...requested], {signal: controller.signal}); check();
          if (!same(boundedCursor(base.root), coverage.root)) fail('coverage-unverified');
          if (!Array.isArray(returned) || returned.length !== requested.length ||
              new Set(returned.map(page => page.id)).size !== requested.length || returned.some(page => !requested.includes(page.id))) fail('integrity');
          for (const page of returned) pages.set(page.id, validateBoundedPage(base.manifest, page));
        }
        const records = readBoundedRecords(layout, {...base, pages: [...pages.values()]}, ids); check(); return records;
      };
      const first = await read([coverage.markerRecordId, claimId]);
      const markerRecord = first.get(coverage.markerRecordId);
      if (!markerRecord || markerRecord.archivedAt !== null || markerRecord.sourceUpdatedAt !== null ||
          markerRecord.payloadSha256 !== coverage.markerPayloadSha256) fail('coverage-unverified');
      const marker = validateSecurityLookupMarker(markerRecord.payload, layout);
      if (markerRecord.recordId !== securityLookupMarkerId(coverage.layoutSha256, marker.coverageId)) fail('coverage-unverified');
      const claimRecord = first.get(claimId) ?? null;
      if (!claimRecord) { await permission('guarded', markerRecord, null, null); return null; }
      if (claimRecord.archivedAt !== null || claimRecord.sourceUpdatedAt !== null) fail('integrity');
      const claim = validateSecurityLookupClaim(claimRecord.payload);
      if (claim.kind !== kind || claim.keySha256 !== keySha256 || claim.coverageId !== marker.coverageId) fail('integrity');
      const source = (await read([claim.sourceRecordId])).get(claim.sourceRecordId);
      if (!source || source.archivedAt !== null || source.lastMutationId === null) fail('integrity');
      if (kind === 'staff-login') {
        const row = validateSecurityStaffSource(source.payload);
        if (row.id !== claim.sourceId || securityLookupKey(kind, row.login) !== keySha256 || source.sourceUpdatedAt !== row.created_at) fail('integrity');
      } else {
        const row = validateSecurityRequestSource(source.payload);
        if (row.id !== claim.sourceId || source.sourceUpdatedAt !== row.updated_at ||
            kind === 'open-request' && (!['pending', 'approved'].includes(row.status) || securityLookupKey(kind, row.login, row.kind) !== keySha256) ||
            kind === 'access-token' && (row.token_hash === null || securityLookupKey(kind, row.token_hash) !== keySha256)) fail('integrity');
      }
      await permission('guarded', markerRecord, claimRecord, source);
      const result = copy(source); check(); return result;
    };
    try { check(); return await Promise.race([work(), cancelled]); }
    catch (error) {
      if (error instanceof SecurityLookupError) throw error;
      if (error && typeof error === 'object' && 'code' in error && error.code === 'conflict') return fail('coverage-unverified');
      return fail('unavailable');
    } finally {
      clearTimeout(timer); signal?.removeEventListener('abort', abort);
      controller.signal.removeEventListener('abort', cancel); controller.abort();
    }
  }
  return Object.freeze({
    lookupStaff: (login: string, options?: BoundedOperationOptions) => lookup('staff-login', login, undefined, options),
    lookupOpenRequest: (kind: 'access' | 'recovery', login: string, options?: BoundedOperationOptions) => lookup('open-request', login, kind, options),
    lookupAccessToken: (tokenHash: string, options?: BoundedOperationOptions) => lookup('access-token', tokenHash, undefined, options),
  });
}
