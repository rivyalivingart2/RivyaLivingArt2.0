import {createHash} from 'node:crypto';
import sourceSchema from './schema.json';
import {validateBoundedLayout, type BoundedLayout} from './bounded-store';
import {canonicalArtifactJson, canonicalJson, digestPayload, makeRecord,
  type GoogleWorkspaceRecord, type JsonValue} from './record-codec';

export type SecurityLookupKind = 'staff-login' | 'open-request' | 'access-token';
export type SecurityLookupErrorCode = 'configuration' | 'invalid-input' | 'unsupported-source' |
  'duplicate-key' | 'broken-reference' | 'coverage-unverified' | 'integrity' | 'unauthorized' | 'unavailable';
export class SecurityLookupError extends Error {
  constructor(public readonly code: SecurityLookupErrorCode) { super('Security lookup: ' + code + '.'); }
}
export function securityLookupFail(code: SecurityLookupErrorCode): never { throw new SecurityLookupError(code); }
export const securityLookupHash = (value: unknown): string => createHash('sha256').update(canonicalArtifactJson(value), 'utf8').digest('hex');
export const securityLookupSame = (left: unknown, right: unknown): boolean => canonicalArtifactJson(left) === canonicalArtifactJson(right);
export const securityLookupCopy = <T>(value: T): T => JSON.parse(canonicalArtifactJson(value)) as T;
export const securityLookupExact = (value: unknown, keys: string[]): boolean => !!value && typeof value === 'object' &&
  !Array.isArray(value) && Object.keys(value).sort().join(',') === [...keys].sort().join(',');
const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
export const securityLookupDigest = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
const date = (value: unknown): value is string => typeof value === 'string' && value.length <= 40 && Number.isFinite(Date.parse(value));
const text = (value: unknown, min: number, max: number): value is string => typeof value === 'string' && value.length >= min && value.length <= max;
const version = (value: unknown): value is number => Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 2147483647;
const login = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9_.@-]{3,80}$/.test(value);
const staffFields = ['id', 'login', 'name', 'password_hash', 'role', 'active', 'version', 'created_at'];
const requestFields = ['id', 'kind', 'login', 'name', 'contact', 'status', 'staff_id', 'token_hash',
  'credential_version', 'expires_at', 'created_at', 'updated_at', 'decided_by', 'version'];
export type SecurityStaffSource = {
  id: string; login: string; name: string; password_hash: string; role: 'admin' | 'editor';
  active: boolean; version: number; created_at: string;
};
export type SecurityRequestSource = {
  id: string; kind: 'access' | 'recovery'; login: string; name: string; contact: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed'; staff_id: string | null; token_hash: string | null;
  credential_version: number | null; expires_at: string | null; created_at: string; updated_at: string;
  decided_by: string | null; version: number;
};
export type SecurityLookupClaim = {
  format: 'rivya-security-lookup-claim-v1'; coverageId: string; normalization: 'ascii-lower-v1';
  kind: SecurityLookupKind; keySha256: string; sourceTable: 'rivya_staff' | 'rivya_access_requests';
  sourceId: string; sourceRecordId: string;
};
export type SecurityLookupMarker = {
  format: 'rivya-security-lookup-marker-v1'; boundary: 'security'; layoutSha256: string;
  coverageId: string; normalization: 'ascii-lower-v1'; sourceSha256: string; claimsSha256: string;
  sourceCounts: {staff: number; requests: number};
  claimCounts: {staffLogin: number; openRequest: number; accessToken: number};
};

export function securitySourceRecordId(table: 'rivya_staff' | 'rivya_access_requests', id: string): string {
  if (!uuid(id)) return securityLookupFail('invalid-input');
  return 'r_' + createHash('sha256').update(canonicalJson([table, [id]])).digest('hex');
}
/** Current input paths trim before lookup; stored source logins themselves may
 * not be rewritten. Non-ASCII source logins require explicit reconciliation. */
export function securityLookupKey(kind: SecurityLookupKind, value: string, requestKind?: 'access' | 'recovery'): string {
  if (kind === 'access-token') {
    if (!securityLookupDigest(value) || requestKind !== undefined) return securityLookupFail('invalid-input');
    return securityLookupHash([kind, value]);
  }
  if (typeof value !== 'string' || value.length > 200 || !login(value.trim()) ||
      kind === 'staff-login' && requestKind !== undefined ||
      kind === 'open-request' && !['access', 'recovery'].includes(requestKind ?? '') ||
      !['staff-login', 'open-request'].includes(kind)) return securityLookupFail('invalid-input');
  return securityLookupHash(kind === 'open-request' ? [kind, requestKind, value.trim().toLowerCase()] : [kind, value.trim().toLowerCase()]);
}
export function securityLookupClaimId(kind: SecurityLookupKind, keySha256: string): string {
  if (!['staff-login', 'open-request', 'access-token'].includes(kind) || !securityLookupDigest(keySha256)) return securityLookupFail('invalid-input');
  return 'security-lookup:' + kind + ':' + keySha256;
}
export function securityLookupMarkerId(layoutSha256: string, coverageId: string): string {
  if (!securityLookupDigest(layoutSha256) || !/^[A-Za-z0-9:_-]{1,100}$/.test(coverageId)) return securityLookupFail('configuration');
  return 'security-lookup:coverage:' + securityLookupHash([layoutSha256, coverageId]);
}
export function validateSecurityStaffSource(value: unknown): SecurityStaffSource {
  const row = securityLookupCopy(value) as SecurityStaffSource;
  if (!securityLookupExact(row, staffFields) || !uuid(row.id) || !login(row.login) || !text(row.name, 1, 100) ||
      !/^[0-9a-f]{32}:[0-9a-f]{128}$/.test(row.password_hash) || !['admin', 'editor'].includes(row.role) ||
      typeof row.active !== 'boolean' || !version(row.version) || !date(row.created_at)) return securityLookupFail('unsupported-source');
  return row;
}
export function validateSecurityRequestSource(value: unknown): SecurityRequestSource {
  const row = securityLookupCopy(value) as SecurityRequestSource;
  if (!securityLookupExact(row, requestFields) || !uuid(row.id) || !['access', 'recovery'].includes(row.kind) || !login(row.login) ||
      !text(row.name, 1, 100) || !text(row.contact, 3, 160) || !['pending', 'approved', 'rejected', 'completed'].includes(row.status) ||
      !(row.staff_id === null || uuid(row.staff_id)) || !(row.token_hash === null || securityLookupDigest(row.token_hash)) ||
      !(row.credential_version === null || version(row.credential_version)) || !(row.expires_at === null || date(row.expires_at)) ||
      !date(row.created_at) || !date(row.updated_at) || !(row.decided_by === null || text(row.decided_by, 1, 240)) ||
      !version(row.version)) return securityLookupFail('unsupported-source');
  return row;
}
export function validateSecurityLookupClaim(value: unknown): SecurityLookupClaim {
  const claim = securityLookupCopy(value) as SecurityLookupClaim;
  if (!securityLookupExact(claim, ['format', 'coverageId', 'normalization', 'kind', 'keySha256', 'sourceTable', 'sourceId', 'sourceRecordId']) ||
      claim.format !== 'rivya-security-lookup-claim-v1' || claim.normalization !== 'ascii-lower-v1' ||
      !/^[A-Za-z0-9:_-]{1,100}$/.test(claim.coverageId) || !['staff-login', 'open-request', 'access-token'].includes(claim.kind) ||
      !securityLookupDigest(claim.keySha256) || claim.sourceTable !== (claim.kind === 'staff-login' ? 'rivya_staff' : 'rivya_access_requests') ||
      claim.sourceRecordId !== securitySourceRecordId(claim.sourceTable, claim.sourceId)) return securityLookupFail('integrity');
  return claim;
}
export function validateSecurityLookupMarker(value: unknown, layout: BoundedLayout): SecurityLookupMarker {
  const marker = securityLookupCopy(value) as SecurityLookupMarker;
  const count = (value: unknown): boolean => Number.isSafeInteger(value) && Number(value) >= 0;
  if (!securityLookupExact(marker, ['format', 'boundary', 'layoutSha256', 'coverageId', 'normalization', 'sourceSha256', 'claimsSha256', 'sourceCounts', 'claimCounts']) ||
      marker.format !== 'rivya-security-lookup-marker-v1' || marker.boundary !== 'security' || marker.layoutSha256 !== securityLookupHash(layout) ||
      marker.normalization !== 'ascii-lower-v1' || !/^[A-Za-z0-9:_-]{1,100}$/.test(marker.coverageId) ||
      !securityLookupDigest(marker.sourceSha256) || !securityLookupDigest(marker.claimsSha256) ||
      !securityLookupExact(marker.sourceCounts, ['staff', 'requests']) || !Object.values(marker.sourceCounts).every(count) ||
      !securityLookupExact(marker.claimCounts, ['staffLogin', 'openRequest', 'accessToken']) || !Object.values(marker.claimCounts).every(count) ||
      marker.claimCounts.staffLogin !== marker.sourceCounts.staff || marker.claimCounts.openRequest > marker.sourceCounts.requests ||
      marker.claimCounts.accessToken > marker.sourceCounts.requests) return securityLookupFail('integrity');
  return marker;
}

/** Pure, uninstalled projection of the COMPLETE supplied staff/request arrays.
 * It cannot prove the caller supplied every live row, reserve provider coverage,
 * maintain later indexes or authorize authentication. It preserves original IDs
 * and returns pointer-only records, never copied passwords or staff authority. */
export function planSecurityLookupProjection(input: {
  schema: {tables: unknown[]}; source: Record<string, unknown[]>; layout: BoundedLayout; coverageId: string;
}) {
  const layout = validateBoundedLayout(input.layout);
  if (layout.key !== 'security' || !input.schema || !Array.isArray(input.schema.tables) || !input.source ||
      typeof input.source !== 'object' || Array.isArray(input.source)) return securityLookupFail('configuration');
  const layoutSha256 = securityLookupHash(layout), markerRecordId = securityLookupMarkerId(layoutSha256, input.coverageId);
  for (const name of ['rivya_staff', 'rivya_access_requests']) {
    const tables = input.schema.tables.filter(table => !!table && typeof table === 'object' && 'sourceTable' in table && table.sourceTable === name);
    const expected = sourceSchema.tables.find(table => table.sourceTable === name);
    if (tables.length !== 1 || !securityLookupSame(tables[0], expected) || !Object.hasOwn(input.source, name) ||
        !Array.isArray(input.source[name])) return securityLookupFail('unsupported-source');
  }
  const staff = input.source.rivya_staff.map(validateSecurityStaffSource);
  const requests = input.source.rivya_access_requests.map(validateSecurityRequestSource);
  const staffIds = new Set(staff.map(row => row.id)), requestIds = new Set(requests.map(row => row.id));
  if (staffIds.size !== staff.length || requestIds.size !== requests.length) return securityLookupFail('duplicate-key');
  if (requests.some(row => row.staff_id !== null && !staffIds.has(row.staff_id))) return securityLookupFail('broken-reference');
  const claims: GoogleWorkspaceRecord[] = [], keys = new Set<string>();
  const claimCounts = {staffLogin: 0, openRequest: 0, accessToken: 0};
  const append = (kind: SecurityLookupKind, row: SecurityStaffSource | SecurityRequestSource, keySha256: string) => {
    const recordId = securityLookupClaimId(kind, keySha256);
    if (keys.has(recordId)) return securityLookupFail('duplicate-key');
    keys.add(recordId);
    const sourceTable = kind === 'staff-login' ? 'rivya_staff' : 'rivya_access_requests';
    const payload: SecurityLookupClaim = {format: 'rivya-security-lookup-claim-v1', coverageId: input.coverageId,
      normalization: 'ascii-lower-v1', kind, keySha256, sourceTable, sourceId: row.id, sourceRecordId: securitySourceRecordId(sourceTable, row.id)};
    claims.push(makeRecord({recordId, revision: 1, payload: payload as unknown as JsonValue, sourceUpdatedAt: null,
      archivedAt: null, lastMutationId: 'lookup-plan:' + securityLookupHash([input.coverageId, recordId])}));
  };
  for (const row of staff) { append('staff-login', row, securityLookupKey('staff-login', row.login)); claimCounts.staffLogin++; }
  for (const row of requests) {
    if (row.status === 'pending' || row.status === 'approved') {
      append('open-request', row, securityLookupKey('open-request', row.login, row.kind)); claimCounts.openRequest++;
    }
    if (row.token_hash !== null) { append('access-token', row, securityLookupKey('access-token', row.token_hash)); claimCounts.accessToken++; }
  }
  claims.sort((left, right) => left.recordId < right.recordId ? -1 : left.recordId > right.recordId ? 1 : 0);
  const sourceHashes = [
    ...staff.map(row => [securitySourceRecordId('rivya_staff', row.id), digestPayload(row)]),
    ...requests.map(row => [securitySourceRecordId('rivya_access_requests', row.id), digestPayload(row)]),
  ].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
  const payload: SecurityLookupMarker = {format: 'rivya-security-lookup-marker-v1', boundary: 'security', layoutSha256,
    coverageId: input.coverageId, normalization: 'ascii-lower-v1', sourceSha256: securityLookupHash(sourceHashes),
    claimsSha256: securityLookupHash(claims.map(record => [record.recordId, record.payloadSha256])),
    sourceCounts: {staff: staff.length, requests: requests.length}, claimCounts};
  const marker = makeRecord({recordId: markerRecordId, revision: 1, payload: payload as unknown as JsonValue,
    sourceUpdatedAt: null, archivedAt: null, lastMutationId: 'lookup-plan:' + securityLookupHash([input.coverageId, markerRecordId])});
  return {claims, marker,
    coverageProposal: {layoutSha256, markerRecordId, markerPayloadSha256: marker.payloadSha256},
    report: {kind: 'uninstalled-local-security-lookup-projection', sourceCounts: payload.sourceCounts, claimCounts,
      claims: claims.length, installed: false, providerVerified: false, canonicalWritten: false,
      liveSourceCompletenessVerified: false, atomicIndexMaintenanceImplemented: false,
      limitations: ['Completeness is checked only within the supplied staff/request arrays; this is not a live-source or provider coverage certificate.',
        'Expression/partial uniqueness rules are validated explicitly; schema.json does not represent those SQL indexes.',
        'ascii-lower-v1 is a local normalization model; actual SQL normalized-key/collation equivalence must be reconciled before bootstrap.',
        'A trusted root/marker coverage registration requires separately reconciled bootstrap; no readiness boolean or verified provider root is generated.',
        'All later source/key changes require same-workbook atomic claim maintenance before activation.']}};
}
