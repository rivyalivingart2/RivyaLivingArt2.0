import {createHash} from 'node:crypto';
import sourceSchema from './schema.json';
import {BOUNDED_LIMITS, boundedCursor, readBoundedRecords, validateBoundedManifest, validateBoundedPage,
  type BoundedLayout, type BoundedManifestRead, type BoundedPage, type createBoundedProvider} from './bounded-store';
import {canonicalJson, type GoogleWorkspaceRecord} from './record-codec';
import type {SecurityLookupCoverage} from './bounded-security-lookup';
import {createBoundedSecurityLookupReader} from './bounded-security-lookup';
import {planSecurityLookupProjection, securityLookupCopy as copy, securityLookupSame as same,
  securityLookupExact as exact, securityLookupHash as hash, securityLookupDigest as digest,
  securitySourceRecordId, securityLookupMarkerId, validateSecurityLookupMarker, validateSecurityLookupClaim,
  validateSecurityStaffSource, validateSecurityRequestSource, type SecurityStaffSource, type SecurityRequestSource} from './security-lookup-projection';
import {securityWorkflowFail as fail, type SecurityOperation} from './security-operation';

/** Safety ceiling, not a sustainable production capacity claim. Current proofs
 * only: no ordinary request assembles the full immutable history. No truncation. */
export const SECURITY_SNAPSHOT_LIMITS = Object.freeze({records: 256, proofPages: 256, bytes: 8 * 1024 * 1024});
export const securityPrimaryId = (table: string, key: string): string =>
  'r_' + createHash('sha256').update(canonicalJson([table, [key]])).digest('hex');
const date = (value: unknown): value is string => typeof value === 'string' && value.length <= 40 && Number.isFinite(Date.parse(value));
const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
export type SecuritySessionSource = {token_hash: string; credential_version: string; expires_at: string; idle_expires_at: string; staff_id: string | null};
export function securitySessionSource(record: GoogleWorkspaceRecord): SecuritySessionSource {
  const p = record.payload as unknown as SecuritySessionSource;
  if (!exact(p, ['token_hash', 'credential_version', 'expires_at', 'idle_expires_at', 'staff_id']) || !digest(p.token_hash) ||
      typeof p.credential_version !== 'string' || !/^(?:[0-9]{1,10}|[0-9a-f]{64})$/.test(p.credential_version) ||
      !date(p.expires_at) || !date(p.idle_expires_at) || Date.parse(p.idle_expires_at) > Date.parse(p.expires_at) ||
      !(p.staff_id === null || uuid(p.staff_id)) || record.sourceUpdatedAt !== null ||
      record.recordId !== securityPrimaryId('rivya_studio_sessions', p.token_hash)) fail('integrity');
  return copy(p);
}
export type SecurityThrottleSource = {key: string; attempts: number; reset_at: string};
export function securityThrottleSource(record: GoogleWorkspaceRecord): SecurityThrottleSource {
  const p = record.payload as unknown as SecurityThrottleSource;
  if (!exact(p, ['key', 'attempts', 'reset_at']) || typeof p.key !== 'string' || p.key.length < 1 || p.key.length > 240 ||
      !Number.isSafeInteger(p.attempts) || p.attempts < 0 || Object.is(p.attempts, -0) || !date(p.reset_at) ||
      record.archivedAt !== null || record.sourceUpdatedAt !== null || record.recordId !== securityPrimaryId('rivya_studio_login_limits', p.key)) fail('integrity');
  return copy(p);
}
export type SecurityEvent = {format: 'rivya-security-event-v1'; operationId: string; requestSha256: string;
  actor: string; performedBy: string; action: string; entities: string[]; at: string; changedRecords: number};
export function securityEvent(record: GoogleWorkspaceRecord): SecurityEvent {
  const p = record.payload as unknown as SecurityEvent;
  if (!exact(p, ['format', 'operationId', 'requestSha256', 'actor', 'performedBy', 'action', 'entities', 'at', 'changedRecords']) ||
      p.format !== 'rivya-security-event-v1' || !/^[A-Za-z0-9:_-]{1,120}$/.test(p.operationId) || !digest(p.requestSha256) ||
      typeof p.actor !== 'string' || p.actor.length < 1 || p.actor.length > 160 || !/^[A-Za-z0-9:_-]+$/.test(p.actor) ||
      typeof p.performedBy !== 'string' || p.performedBy.length < 1 || p.performedBy.length > 160 ||
      !['request', 'approve', 'reject', 'redeem', 'staff-update', 'session-maintenance', 'login-reset'].includes(p.action) ||
      !Array.isArray(p.entities) || p.entities.length > 7 || p.entities.some(id => typeof id !== 'string' || !/^[A-Za-z0-9:_-]{1,160}$/.test(id)) ||
      !date(p.at) || !Number.isInteger(p.changedRecords) || p.changedRecords < 1 || p.changedRecords > 7 ||
      record.recordId !== 'security-event:' + hash([p.actor, p.operationId]) || record.revision !== 1 ||
      record.archivedAt !== null || record.sourceUpdatedAt !== null) fail('integrity');
  return copy(p);
}
export type SecurityCurrentSnapshot = {base: BoundedManifestRead; records: Map<string, GoogleWorkspaceRecord>;
  staff: Map<string, SecurityStaffSource>; requests: Map<string, SecurityRequestSource>; coverageId: string;
  claims: GoogleWorkspaceRecord[]};

export function validateSecurityCoverage(layout: BoundedLayout, coverage: SecurityLookupCoverage,
  provider: ReturnType<typeof createBoundedProvider>): void {
  // Reuse the strict registration validator. Construction performs no IO.
  createBoundedSecurityLookupReader({layout, coverage, actor: {id: 'coverage-validation'}, authorize: () => false}, provider);
}

/** Reconciles EVERY current canonical record and derived claim against the
 * trusted bootstrap marker. Root advancement is accepted only after this proof,
 * never because a flag or detached index job says ready. Bootstrap SQL source
 * completeness/collation still requires external reconciliation. */
export async function readSecurityCurrentSnapshot(layout: BoundedLayout, coverage: SecurityLookupCoverage,
  ownerEpochRecordId: string, provider: ReturnType<typeof createBoundedProvider>, operation: SecurityOperation): Promise<SecurityCurrentSnapshot> {
  operation.check(); const raw = await provider.readManifest({signal: operation.signal}); operation.check();
  const verified = validateBoundedManifest(layout, raw.root, raw.manifest);
  const base: BoundedManifestRead = {root: verified.root, manifest: verified.manifest};
  if (base.root.epoch !== coverage.root.epoch || base.root.revision < coverage.root.revision ||
      base.root.revision === coverage.root.revision && !same(boundedCursor(base.root), coverage.root)) fail('coverage-unverified');
  if (base.manifest.records.length > SECURITY_SNAPSHOT_LIMITS.records) fail('capacity');
  const ids = new Set<number>();
  for (const head of base.manifest.records) {
    const latest = base.manifest.mutations[head[3]];
    [head[1], latest[3], latest[5], latest[7]].forEach(id => ids.add(id));
    if (latest[2] >= 0) ids.add(base.manifest.mutations[latest[2]][7]);
  }
  if (ids.size > SECURITY_SNAPSHOT_LIMITS.proofPages) fail('capacity');
  let bytes = Buffer.byteLength(canonicalJson(base));
  const pages: BoundedPage[] = [], requestedIds = [...ids];
  for (let offset = 0; offset < requestedIds.length; offset += BOUNDED_LIMITS.readPagesPerRequest) {
    operation.check(); const requested = requestedIds.slice(offset, offset + BOUNDED_LIMITS.readPagesPerRequest);
    const result = await provider.readPages(copy(base), [...requested], {signal: operation.signal}); operation.check();
    if (!Array.isArray(result) || result.length !== requested.length || new Set(result.map(page => page.id)).size !== requested.length ||
        result.some(page => !requested.includes(page.id))) fail('integrity');
    for (const page of result) { const safe = validateBoundedPage(base.manifest, page); bytes += Buffer.byteLength(canonicalJson(safe)); pages.push(safe); }
    if (bytes > SECURITY_SNAPSHOT_LIMITS.bytes) fail('capacity');
  }
  const records = new Map(readBoundedRecords(layout, {...base, pages}, base.manifest.records.map(head => head[0])));
  const markerRecord = records.get(coverage.markerRecordId);
  if (!markerRecord || markerRecord.revision !== 1 || markerRecord.archivedAt !== null || markerRecord.sourceUpdatedAt !== null ||
      markerRecord.payloadSha256 !== coverage.markerPayloadSha256) fail('coverage-unverified');
  const marker = validateSecurityLookupMarker(markerRecord.payload, layout);
  if (markerRecord.recordId !== securityLookupMarkerId(hash(layout), marker.coverageId)) fail('coverage-unverified');
  const staff = new Map<string, SecurityStaffSource>(), requests = new Map<string, SecurityRequestSource>();
  const claims: GoogleWorkspaceRecord[] = [];
  for (const record of records.values()) {
    operation.check(); if (record.recordId === coverage.markerRecordId) continue;
    const p = record.payload;
    if (!p || typeof p !== 'object' || Array.isArray(p)) fail('integrity');
    if (record.recordId.startsWith('security-lookup:')) {
      const claim = validateSecurityLookupClaim(p);
      if (claim.coverageId !== marker.coverageId || record.sourceUpdatedAt !== null ||
          record.recordId !== 'security-lookup:' + claim.kind + ':' + claim.keySha256) fail('integrity');
      claims.push(record); continue;
    }
    if (record.recordId.startsWith('security-event:')) {
      const event = securityEvent(record), transactionId = 'security-flow:' + hash([event.actor, event.operationId]);
      const transaction = base.manifest.transactions.find(item => item[0] === transactionId);
      const head = base.manifest.records.find(item => item[0] === record.recordId)!;
      if (!transaction || transaction[2] !== event.changedRecords + 1 || head[3] !== transaction[1] + transaction[2] - 1 ||
          Array.from({length: transaction[2]}, (_, index) => base.manifest.mutations[transaction[1] + index][0])
            .some((mutationId, index) => mutationId !== transactionId + ':' + index)) fail('integrity');
      continue;
    }
    if (record.recordId === ownerEpochRecordId) {
      if (!exact(p, ['format', 'fingerprint']) || p.format !== 'rivya-owner-credential-epoch-v1' || !digest(p.fingerprint) ||
          record.archivedAt !== null || record.sourceUpdatedAt !== null) fail('integrity');
      continue;
    }
    if ('password_hash' in p) {
      const row = validateSecurityStaffSource(p);
      if (record.recordId !== securitySourceRecordId('rivya_staff', row.id) || record.archivedAt !== null || record.sourceUpdatedAt !== row.created_at) fail('integrity');
      staff.set(row.id, row); continue;
    }
    if ('kind' in p) {
      const row = validateSecurityRequestSource(p);
      if (record.recordId !== securitySourceRecordId('rivya_access_requests', row.id) || record.archivedAt !== null || record.sourceUpdatedAt !== row.updated_at) fail('integrity');
      requests.set(row.id, row); continue;
    }
    if ('staff_id' in p) { securitySessionSource(record); continue; }
    if ('attempts' in p) { securityThrottleSource(record); continue; }
    // Unknown or mis-shaped records cannot be silently excluded from coverage.
    fail('integrity');
  }
  for (const record of records.values()) {
    const p = record.payload;
    if (p && typeof p === 'object' && !Array.isArray(p) && 'idle_expires_at' in p) {
      const session = securitySessionSource(record);
      if (session.staff_id !== null && !staff.has(session.staff_id)) fail('integrity');
    }
  }
  const plan = planSecurityLookupProjection({schema: sourceSchema, layout, coverageId: marker.coverageId,
    source: {rivya_staff: [...staff.values()], rivya_access_requests: [...requests.values()]}});
  const expected = new Map(plan.claims.map(record => [record.recordId, record.payload]));
  for (const claim of claims) {
    const desired = expected.get(claim.recordId);
    if (claim.archivedAt === null) {
      if (!desired || !same(desired, claim.payload)) fail('coverage-unverified');
      expected.delete(claim.recordId);
    } else if (desired) fail('coverage-unverified');
  }
  if (expected.size) fail('coverage-unverified');
  operation.check(); return {base, records, staff, requests, coverageId: marker.coverageId, claims: plan.claims};
}
