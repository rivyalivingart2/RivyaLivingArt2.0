import sourceSchema from './schema.json';
import {BOUNDED_LIMITS, BoundedStoreError, boundedCursor, createBoundedStore, validateBoundedLayout,
  type BoundedLayout, type BoundedOperationOptions, type createBoundedProvider} from './bounded-store';
import {digestPayload, type JsonValue, type MutationActor, type RecordMutationCommand} from './record-codec';
import type {SecurityLookupCoverage} from './bounded-security-lookup';
import {planSecurityLookupProjection, securityLookupCopy as copy, securityLookupSame as same, securityLookupExact as exact,
  securityLookupHash as hash, securityLookupDigest as digest, securityLookupKey, securityLookupClaimId,
  securitySourceRecordId, validateSecurityStaffSource, validateSecurityRequestSource,
  type SecurityStaffSource, type SecurityRequestSource} from './security-lookup-projection';
import {readSecurityCurrentSnapshot, validateSecurityCoverage, securityPrimaryId, securitySessionSource,
  securityThrottleSource, securityEvent, type SecurityCurrentSnapshot, type SecurityEvent} from './security-current-snapshot';
import {runSecurityOperation, securityWorkflowFail as fail, type SecurityOperation} from './security-operation';

export type SecurityAuthority = {kind: 'public'} | {kind: 'maintenance'} | {kind: 'session'; tokenHash: string};
export type SecurityWorkflowInput =
  {action: 'request'; operationId: string; id: string; kind: 'access' | 'recovery'; login: string; name: string; contact: string} |
  {action: 'approve'; operationId: string; requestId: string; expectedVersion: number; tokenHash: string; newStaffId: string; placeholderHash: string} |
  {action: 'reject'; operationId: string; requestId: string; expectedVersion: number} |
  {action: 'redeem'; operationId: string; tokenHash: string; passwordHash: string} |
  {action: 'staff-update'; operationId: string; staffId: string; expectedVersion: number; login: string; name: string; role: 'admin' | 'editor'; active: boolean} |
  {action: 'session-maintenance'; operationId: string} |
  {action: 'login-reset'; operationId: string; key: string; expectedRevision: number};
export type SecurityWorkflowResult = {status: 'committed' | 'replay' | 'unchanged' | 'invalid'; receiptOnly: true;
  changedRecords: number; remaining?: number; expiresAt?: string};
type Principal = {login: string; staffId: string | null; role: 'admin' | 'editor'; expiresAt: number};
export type SecurityWorkflowAuthorization = {phase: 'preflight' | 'guarded'; action: SecurityWorkflowInput['action'] | 'lookup' | 'list-requests' | 'list-staff' | 'audit';
  actor: MutationActor; authority: SecurityAuthority; principal: Principal | null};
export type SecurityWorkflowsConfig = {layout: BoundedLayout; coverage: SecurityLookupCoverage; actor: MutationActor;
  owner: {login: string; fingerprint: string; epochRecordId: string}; clock: () => number; timeoutMs?: number;
  authorize: (context: SecurityWorkflowAuthorization) => boolean | Promise<boolean>};
const uuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v);
const version = (v: unknown): v is number => Number.isInteger(v) && Number(v) > 0 && Number(v) < 2147483647;
const password = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{32}:[0-9a-f]{128}$/.test(v);
const login = (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z0-9_.@-]{3,80}$/.test(v);
const text = (v: unknown, min: number, max: number): v is string => typeof v === 'string' && v.length >= min && v.length <= max && !/[\u0000-\u001f\u007f]/.test(v);
const safeId = (v: unknown, max = 160): v is string => typeof v === 'string' && v.length <= max && /^[A-Za-z0-9:_-]+$/.test(v);
export const loginResetOperationId = (tokenHash: string): string => {
  if (!digest(tokenHash)) fail('invalid-input'); return 'login-reset:' + hash(tokenHash);
};

/** Inactive server-only workflow boundary. Source rows, pointer claims and new
 * domain events share ONE Security transaction. Events are not dual-written to
 * historical rivya_audit/System; no synthetic SQL ID or cross-workbook atomicity. */
export function createBoundedSecurityWorkflows(config: SecurityWorkflowsConfig, provider: ReturnType<typeof createBoundedProvider>) {
  const layout = validateBoundedLayout(config.layout), coverage = copy(config.coverage), actor = copy(config.actor), owner = copy(config.owner);
  const timeoutMs = config.timeoutMs ?? BOUNDED_LIMITS.operationTimeoutMs, clock = config.clock, authorize = config.authorize;
  if (layout.key !== 'security' || !exact(actor, ['id']) || !safeId(actor.id) ||
      !exact(owner, ['login', 'fingerprint', 'epochRecordId']) || !login(owner.login) || !digest(owner.fingerprint) || !safeId(owner.epochRecordId) ||
      typeof clock !== 'function' || typeof authorize !== 'function' || !Number.isInteger(timeoutMs) || timeoutMs < 1 ||
      timeoutMs > BOUNDED_LIMITS.operationTimeoutMs || !provider || typeof provider.commit !== 'function') fail('configuration');
  validateSecurityCoverage(layout, coverage, provider);
  const now = () => { const value = clock(); if (!Number.isSafeInteger(value) || value < 0 || value > 8_640_000_000_000_000 - 86_400_000) fail('unavailable'); return value; };
  function validateAuthority(value: SecurityAuthority) {
    if (!(value?.kind === 'session' ? exact(value, ['kind', 'tokenHash']) && digest(value.tokenHash) :
      value && ['public', 'maintenance'].includes(value.kind) && exact(value, ['kind']))) fail('unauthorized');
  }
  function principal(snapshot: SecurityCurrentSnapshot, tokenHash: string): Principal | null {
    const record = snapshot.records.get(securityPrimaryId('rivya_studio_sessions', tokenHash));
    if (!record || record.archivedAt !== null) return null;
    const p = securitySessionSource(record), at = now(), expiresAt = Math.min(Date.parse(p.expires_at), Date.parse(p.idle_expires_at));
    if (expiresAt <= at || Date.parse(p.expires_at) - at > 8 * 60 * 60 * 1000 || Date.parse(p.idle_expires_at) - at > 30 * 60 * 1000) return null;
    if (p.staff_id === null) {
      const epoch = snapshot.records.get(owner.epochRecordId);
      return epoch && exact(epoch.payload, ['format', 'fingerprint']) &&
        (epoch.payload as {fingerprint: string}).fingerprint === owner.fingerprint && p.credential_version === owner.fingerprint ?
        {login: owner.login, role: 'admin', staffId: null, expiresAt} : null;
    }
    const staff = snapshot.staff.get(p.staff_id);
    return staff?.active && String(staff.version) === p.credential_version && staff.login.toLowerCase() !== owner.login.toLowerCase() ?
      {login: staff.login, role: staff.role, staffId: staff.id, expiresAt} : null;
  }
  async function permission(operation: SecurityOperation, action: SecurityWorkflowAuthorization['action'], authority: SecurityAuthority,
    phase: SecurityWorkflowAuthorization['phase'], snapshot?: SecurityCurrentSnapshot): Promise<Principal | null> {
    operation.check(); validateAuthority(authority);
    const who = snapshot && authority.kind === 'session' ? principal(snapshot, authority.tokenHash) : null;
    if (phase === 'guarded') {
      if (['approve', 'reject', 'staff-update', 'list-requests', 'audit'].includes(action) && who?.role !== 'admin') fail('unauthorized');
      if (['login-reset', 'list-staff'].includes(action) && !who) fail('unauthorized');
      if (action === 'session-maintenance' && authority.kind !== 'maintenance') fail('unauthorized');
      if (authority.kind === 'session' && !who) fail('unauthorized');
    }
    if (await authorize(copy({phase, action, actor, authority, principal: who})) !== true) fail('unauthorized');
    operation.check(); return who;
  }
  function validateInput(input: SecurityWorkflowInput): void {
    if (!input || !safeId(input.operationId, 120)) fail('invalid-input');
    const common = ['action', 'operationId'];
    switch (input.action) {
      case 'request':
        if (!exact(input, [...common, 'id', 'kind', 'login', 'name', 'contact']) || !uuid(input.id) || !['access', 'recovery'].includes(input.kind) ||
            !login(input.login) || !text(input.name, 1, 100) || !text(input.contact, 3, 160)) fail('invalid-input'); break;
      case 'approve':
        if (!exact(input, [...common, 'requestId', 'expectedVersion', 'tokenHash', 'newStaffId', 'placeholderHash']) || !uuid(input.requestId) ||
            !version(input.expectedVersion) || !digest(input.tokenHash) || !uuid(input.newStaffId) || !password(input.placeholderHash)) fail('invalid-input'); break;
      case 'reject':
        if (!exact(input, [...common, 'requestId', 'expectedVersion']) || !uuid(input.requestId) || !version(input.expectedVersion)) fail('invalid-input'); break;
      case 'redeem':
        if (!exact(input, [...common, 'tokenHash', 'passwordHash']) || !digest(input.tokenHash) || !password(input.passwordHash)) fail('invalid-input'); break;
      case 'staff-update':
        if (!exact(input, [...common, 'staffId', 'expectedVersion', 'login', 'name', 'role', 'active']) || !uuid(input.staffId) || !version(input.expectedVersion) ||
            !login(input.login) || !text(input.name, 1, 100) || !['admin', 'editor'].includes(input.role) || typeof input.active !== 'boolean') fail('invalid-input'); break;
      case 'login-reset':
        if (!exact(input, [...common, 'key', 'expectedRevision']) || input.key !== 'owner' || !Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 1) fail('invalid-input'); break;
      case 'session-maintenance': if (!exact(input, common)) fail('invalid-input'); break;
      default: fail('invalid-input');
    }
  }
  const unchanged = (status: 'unchanged' | 'invalid' = 'unchanged'): SecurityWorkflowResult => ({status, changedRecords: 0, receiptOnly: true});
  async function execute(raw: SecurityWorkflowInput, rawAuthority: SecurityAuthority, options: BoundedOperationOptions = {}): Promise<SecurityWorkflowResult> {
    // Synchronous capture: policy/provider awaits cannot alter a submitted intent.
    const input = copy(raw), authority = copy(rawAuthority); validateInput(input); validateAuthority(authority);
    if (input.action === 'login-reset' && (authority.kind !== 'session' || input.operationId !== loginResetOperationId(authority.tokenHash))) fail('invalid-input');
    return runSecurityOperation(timeoutMs, options, async operation => {
      const requestSha256 = hash({layout, input, authority, actor}), eventId = 'security-event:' + hash([actor.id, input.operationId]);
      const transactionId = 'security-flow:' + hash([actor.id, input.operationId]);
      for (let attempt = 0; attempt < 4; attempt++) {
        await permission(operation, input.action, authority, 'preflight');
        let snapshot: SecurityCurrentSnapshot;
        try { snapshot = await readSecurityCurrentSnapshot(layout, coverage, owner.epochRecordId, provider, operation); }
        catch (error) { if (error && typeof error === 'object' && 'code' in error && error.code === 'conflict') continue; throw error; }
        const who = await permission(operation, input.action, authority, 'guarded', snapshot);
        const priorEvent = snapshot.records.get(eventId);
        if (priorEvent) {
          const event = securityEvent(priorEvent);
          if (event.requestSha256 !== requestSha256 || event.action !== input.action) fail('conflict');
          return {status: 'replay', receiptOnly: true, changedRecords: event.changedRecords};
        }
        const at = now(), stamp = new Date(at).toISOString();
        const staff = new Map(snapshot.staff), requests = new Map(snapshot.requests);
        const changes = new Map<string, {payload: JsonValue; sourceUpdatedAt: string | null; archivedAt: string | null}>();
        const entities: string[] = [];
        let commitBefore: number | null = who?.expiresAt ?? null, expiresAt: string | undefined, remaining: number | undefined;
        const putStaff = (row: SecurityStaffSource) => {
          const safe = validateSecurityStaffSource(row); staff.set(safe.id, safe);
          changes.set(securitySourceRecordId('rivya_staff', safe.id), {payload: safe, sourceUpdatedAt: safe.created_at, archivedAt: null});
        };
        const putRequest = (row: SecurityRequestSource) => {
          const safe = validateSecurityRequestSource(row); requests.set(safe.id, safe);
          changes.set(securitySourceRecordId('rivya_access_requests', safe.id), {payload: safe, sourceUpdatedAt: safe.updated_at, archivedAt: null});
        };
        switch (input.action) {
          case 'request': {
            if ([...requests.values()].some(row => ['pending', 'approved'].includes(row.status) && row.kind === input.kind && row.login.toLowerCase() === input.login.toLowerCase())) return unchanged();
            if (requests.has(input.id)) fail('conflict');
            putRequest({id: input.id, kind: input.kind, login: input.login, name: input.name, contact: input.contact, status: 'pending', staff_id: null,
              token_hash: null, credential_version: null, expires_at: null, created_at: stamp, updated_at: stamp, decided_by: null, version: 1});
            entities.push(input.id); break;
          }
          case 'approve': case 'reject': {
            const row = requests.get(input.requestId);
            if (!row || row.version !== input.expectedVersion || !['pending', 'approved'].includes(row.status)) return unchanged('invalid');
            if (Date.parse(row.updated_at) > at) fail('integrity');
            if (input.action === 'reject') {
              putRequest({...row, status: 'rejected', token_hash: null, expires_at: null, decided_by: who!.login, updated_at: stamp, version: row.version + 1});
            } else {
              if (row.login.toLowerCase() === owner.login.toLowerCase() || row.login.toLowerCase() === who!.login.toLowerCase()) return unchanged('invalid');
              let target = row.kind === 'recovery' ? [...staff.values()].find(s => s.login.toLowerCase() === row.login.toLowerCase() && s.active) :
                row.staff_id ? staff.get(row.staff_id) : undefined;
              if (row.kind === 'access' && !row.staff_id) {
                if (staff.has(input.newStaffId) || [...staff.values()].some(s => s.login.toLowerCase() === row.login.toLowerCase())) return unchanged('invalid');
                target = {id: input.newStaffId, login: row.login, name: row.name, password_hash: input.placeholderHash, role: 'editor', active: false, version: 1, created_at: stamp};
                putStaff(target);
              } else if (!target || target.id === who!.staffId || target.login.toLowerCase() !== row.login.toLowerCase() ||
                row.kind === 'access' && (target.active || target.version !== row.credential_version)) return unchanged('invalid');
              if (!target) return unchanged('invalid');
              // A token previously used by any request cannot be reissued, even
              // if its claim is now a retained tombstone.
              if (snapshot.records.has(securityLookupClaimId('access-token', securityLookupKey('access-token', input.tokenHash)))) fail('conflict');
              expiresAt = new Date(at + 30 * 60 * 1000).toISOString();
              putRequest({...row, status: 'approved', staff_id: target.id, credential_version: target.version, token_hash: input.tokenHash,
                expires_at: expiresAt, decided_by: who!.login, updated_at: stamp, version: row.version + 1});
            }
            entities.push(row.id); break;
          }
          case 'redeem': {
            const row = [...requests.values()].find(r => r.token_hash === input.tokenHash);
            const target = row?.staff_id ? staff.get(row.staff_id) : undefined;
            if (!row || !target || row.status !== 'approved' || !row.expires_at || Date.parse(row.expires_at) <= at ||
                row.credential_version !== target.version || !version(target.version) || !version(row.version) ||
                target.login.toLowerCase() !== row.login.toLowerCase() || target.login.toLowerCase() === owner.login.toLowerCase() ||
                (row.kind === 'access' ? target.active : !target.active)) return unchanged('invalid');
            if (Date.parse(row.updated_at) > at || Date.parse(target.created_at) > at) fail('integrity');
            commitBefore = Math.min(commitBefore ?? Infinity, Date.parse(row.expires_at));
            putStaff({...target, password_hash: input.passwordHash, active: true, version: target.version + 1});
            putRequest({...row, status: 'completed', token_hash: null, expires_at: null, updated_at: stamp, version: row.version + 1});
            // Credential version revokes EVERY older session immediately; archive
            // cleanup is bounded and separate, never a partial password change.
            entities.push(row.id, target.id); break;
          }
          case 'staff-update': {
            const row = staff.get(input.staffId);
            if (!row || row.version !== input.expectedVersion || row.id === who!.staffId || input.login.toLowerCase() === owner.login.toLowerCase()) return unchanged('invalid');
            if ([...staff.values()].some(s => s.id !== row.id && s.login.toLowerCase() === input.login.toLowerCase())) return unchanged('invalid');
            if ([...requests.values()].some(r => r.staff_id === row.id && ['pending', 'approved'].includes(r.status)) && input.login !== row.login) fail('conflict');
            putStaff({...row, login: input.login, name: input.name, role: input.role, active: input.active, version: row.version + 1}); entities.push(row.id); break;
          }
          case 'session-maintenance': {
            const candidates = [...snapshot.records.values()].filter(record => {
              const p = record.payload;
              if (!p || typeof p !== 'object' || Array.isArray(p) || !('idle_expires_at' in p) || record.archivedAt !== null) return false;
              const session = securitySessionSource(record);
              if (Date.parse(session.expires_at) <= at || Date.parse(session.idle_expires_at) <= at) return true;
              if (session.staff_id !== null) {
                const member = staff.get(session.staff_id);
                return !member?.active || String(member.version) !== session.credential_version || member.login.toLowerCase() === owner.login.toLowerCase();
              }
              const epoch = snapshot.records.get(owner.epochRecordId);
              if (!epoch) fail('coverage-unverified');
              // Compare with canonical epoch, not this worker's potentially old
              // secret binding. Clock rollback alone is never revocation proof.
              return (epoch.payload as {fingerprint: string}).fingerprint !== session.credential_version;
            }).sort((a, b) => a.recordId.localeCompare(b.recordId));
            if (!candidates.length) return {...unchanged(), remaining: 0};
            for (const record of candidates.slice(0, 7)) {
              changes.set(record.recordId, {payload: record.payload, sourceUpdatedAt: null, archivedAt: stamp}); entities.push(record.recordId);
            }
            remaining = Math.max(0, candidates.length - 7); break;
          }
          case 'login-reset': {
            if (authority.kind !== 'session') fail('unauthorized');
            const session = snapshot.records.get(securityPrimaryId('rivya_studio_sessions', authority.tokenHash))!;
            const issuedAt = Date.parse(securitySessionSource(session).expires_at) - 8 * 60 * 60 * 1000;
            const counterId = securityPrimaryId('rivya_studio_login_limits', input.key), counter = snapshot.records.get(counterId);
            // Match the exact attempt receipt; never erase later concurrent
            // attempts. Only the first 30 seconds of an unrefreshed new session.
            if (session.revision !== 1 || at < issuedAt || at >= issuedAt + 30_000 || !counter || counter.revision !== input.expectedRevision) return unchanged('invalid');
            const limit = securityThrottleSource(counter); if (limit.attempts === 0) return unchanged();
            commitBefore = Math.min(commitBefore ?? Infinity, issuedAt + 30_000);
            changes.set(counterId, {payload: {...limit, attempts: 0}, sourceUpdatedAt: null, archivedAt: null}); entities.push(counterId); break;
          }
        }
        const projection = planSecurityLookupProjection({schema: sourceSchema, layout, coverageId: snapshot.coverageId,
          source: {rivya_staff: [...staff.values()], rivya_access_requests: [...requests.values()]}});
        const desiredClaims = new Map(projection.claims.map(record => [record.recordId, record]));
        for (const record of snapshot.records.values()) if (record.recordId.startsWith('security-lookup:') && record.recordId !== coverage.markerRecordId &&
          record.archivedAt === null && !desiredClaims.has(record.recordId)) {
          changes.set(record.recordId, {payload: record.payload, sourceUpdatedAt: null, archivedAt: stamp});
        }
        for (const record of desiredClaims.values()) {
          const existing = snapshot.records.get(record.recordId);
          if (!existing || existing.archivedAt !== null || !same(existing.payload, record.payload))
            changes.set(record.recordId, {payload: record.payload, sourceUpdatedAt: null, archivedAt: null});
        }
        if (!changes.size || changes.size >= BOUNDED_LIMITS.members) fail('capacity');
        const changedRecords = changes.size;
        const event: SecurityEvent = {format: 'rivya-security-event-v1', operationId: input.operationId, requestSha256,
          actor: actor.id, performedBy: who?.login ?? (input.action === 'redeem' ? 'verified-access-link' : authority.kind),
          action: input.action, entities, at: stamp, changedRecords};
        changes.set(eventId, {payload: event, sourceUpdatedAt: null, archivedAt: null});
        const commands: RecordMutationCommand[] = [...changes].map(([recordId, values], index) => ({recordId, ...values,
          expectedRevision: snapshot.records.get(recordId)?.revision ?? 0, mutationId: transactionId + ':' + index}));
        // Every proof comes from the same snapshot used to make the decision.
        // An intervening write of ANY kind conflicts and restarts the decision.
        const pinnedProvider: ReturnType<typeof createBoundedProvider> = {...provider,
          async readManifest(readOptions) {
            const fresh = await provider.readManifest(readOptions);
            if (!same(boundedCursor(fresh.root), boundedCursor(snapshot.base.root))) throw new BoundedStoreError('conflict');
            return copy(fresh);
          },
          async readPages(base, ids, readOptions) { return provider.readPages(copy(base), [...ids], readOptions); },
          async commit(prepared, commitOptions) {
            operation.check();
            if (!same(prepared.expected, snapshot.base.root)) fail('integrity');
            operation.dispatched = true; return provider.commit(copy(prepared), commitOptions);
          },
        };
        const store = createBoundedStore({layout, timeoutMs, now: () => new Date(now()).toISOString(), policy: {
          authorize: async context => {
            if (context.phase === 'preflight') await permission(operation, input.action, authority, 'preflight');
            return true;
          },
          validate: async context => {
            operation.check();
            if (context.replay || context.operationId !== transactionId || !same(context.commands, commands) || context.commitBefore !== commitBefore) fail('integrity');
            for (const command of commands) if (!context.originalsByMutation.has(command.mutationId) ||
              !same(context.originalsByMutation.get(command.mutationId), snapshot.records.get(command.recordId) ?? null)) throw new BoundedStoreError('conflict');
            await permission(operation, input.action, authority, 'guarded', snapshot);
            return true;
          },
        }}, pinnedProvider);
        try {
          const outcome = await store.mutate({commands, actor, operationId: transactionId, commitBefore}, {signal: operation.signal, deadline: operation.deadline});
          if (outcome.status === 'conflict') { operation.dispatched = false; continue; }
          if (outcome.status === 'unknown') fail('outcome-unknown');
          if (!('receipts' in outcome) || outcome.receipts.length !== commands.length || outcome.receipts.some((receipt, i) =>
            receipt.recordId !== commands[i].recordId || receipt.revision !== commands[i].expectedRevision + 1 ||
            receipt.payloadSha256 !== digestPayload(commands[i].payload) || receipt.lastMutationId !== commands[i].mutationId ||
            receipt.archivedAt !== commands[i].archivedAt || receipt.sourceUpdatedAt !== commands[i].sourceUpdatedAt)) fail('outcome-unknown');
          operation.check();
          // A provider replay is receipt-only. Never regenerate a token/grant.
          return {status: outcome.status, receiptOnly: true, changedRecords, ...(outcome.status === 'committed' && expiresAt ? {expiresAt} : {}),
            ...(remaining === undefined ? {} : {remaining})};
        } catch (error) {
          const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
          if (code === 'conflict' || code === 'REVISION_CONFLICT') { operation.dispatched = false; continue; }
          throw error;
        }
      }
      fail('conflict');
    });
  }
  async function read<T>(action: SecurityWorkflowAuthorization['action'], rawAuthority: SecurityAuthority,
    select: (snapshot: SecurityCurrentSnapshot, who: Principal | null) => T, options: BoundedOperationOptions = {}): Promise<T> {
    const authority = copy(rawAuthority); validateAuthority(authority);
    return runSecurityOperation(timeoutMs, options, async operation => {
      await permission(operation, action, authority, 'preflight');
      const snapshot = await readSecurityCurrentSnapshot(layout, coverage, owner.epochRecordId, provider, operation);
      const who = await permission(operation, action, authority, 'guarded', snapshot);
      return copy(select(snapshot, who));
    });
  }
  return Object.freeze({execute, ownerCredentialFingerprint: owner.fingerprint,
    /** Private password-verification input; never a session grant. */
    lookupStaff: (value: string, options?: BoundedOperationOptions) => {
      securityLookupKey('staff-login', value);
      return read('lookup', {kind: 'public'}, snapshot => [...snapshot.staff.values()].find(row => row.login.toLowerCase() === value.trim().toLowerCase()) ?? null, options);
    },
    listRequests: (authority: SecurityAuthority, options?: BoundedOperationOptions) => read('list-requests', authority,
      snapshot => [...snapshot.requests.values()].filter(row => ['pending', 'approved'].includes(row.status))
        .sort((a, b) => a.created_at.localeCompare(b.created_at)).slice(0, 100)
        .map(({id, kind, login, name, contact, status, version, created_at, expires_at}) => ({id, kind, login, name, contact, status, version, created_at, expires_at})), options),
    listStaff: (authority: SecurityAuthority, options?: BoundedOperationOptions) => read('list-staff', authority,
      (snapshot, who) => [...snapshot.staff.values()].filter(row => who!.role === 'admin' || row.active).sort((a, b) => a.name.localeCompare(b.name))
        .map(({id, login, name, role, active, version}) => ({id, login: who!.role === 'admin' ? login : '', name, role, active, version})), options),
    audit: (authority: SecurityAuthority, options?: BoundedOperationOptions) => read('audit', authority,
      snapshot => [...snapshot.records.values()].filter(record => record.recordId.startsWith('security-event:')).map(record => {
        const {action, performedBy, at, entities, changedRecords} = securityEvent(record); return {action, actor: performedBy, at, entities, changedRecords};
      }).sort((a, b) => b.at.localeCompare(a.at)), options),
  });
}
export type BoundedSecurityWorkflows = ReturnType<typeof createBoundedSecurityWorkflows>;
