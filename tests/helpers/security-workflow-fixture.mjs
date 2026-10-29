import {readFileSync} from 'node:fs';
import {buildBoundedState, boundedCursor, createBoundedStore, readBoundedRecords} from '../../src/lib/google-workspace/bounded-store.ts';
import {makeRecord, planRecordMutation} from '../../src/lib/google-workspace/record-codec.ts';
import {planSecurityLookupProjection, securitySourceRecordId, securityLookupHash} from '../../src/lib/google-workspace/security-lookup-projection.ts';
import {securityPrimaryId} from '../../src/lib/google-workspace/security-current-snapshot.ts';
import {createBoundedSecurityWorkflows} from '../../src/lib/google-workspace/bounded-security-workflows.ts';
import {boundedFixtureLayout, boundedGatewayHarness} from './google-workspace-bounded-harness.mjs';

// Synthetic local state only. No provider calls or business imports.
export const schema = JSON.parse(readFileSync(new URL('../../src/lib/google-workspace/schema.json', import.meta.url), 'utf8'));
export const layout = {...boundedFixtureLayout, key: 'security'};
export const at = Date.parse('2026-10-28T12:00:00.000Z'), stamp = new Date(at).toISOString();
export const actor = {id: 'security:local-workflow-test'};
export const owner = {login: 'Owner', fingerprint: 'e'.repeat(64), epochRecordId: 'owner-epoch:fixture'};
export const ownerToken = 'f'.repeat(64), admin = {kind: 'session', tokenHash: ownerToken}, publicAuthority = {kind: 'public'};
export const uuid = value => '00000000-0000-0000-0000-' + String(value).padStart(12, '0');
export const passwordHash = 'a'.repeat(32) + ':' + 'b'.repeat(128);
export const staff = (n = 1, changes = {}) => ({id: uuid(n), login: 'Editor' + n, name: 'Synthetic editor', password_hash: passwordHash,
  role: 'editor', active: true, version: 1, created_at: stamp, ...changes});
export const request = (n = 101, changes = {}) => ({id: uuid(n), kind: 'access', login: 'Applicant' + n, name: 'Synthetic applicant',
  contact: 'fixture@example.invalid', status: 'pending', staff_id: null, token_hash: null, credential_version: null, expires_at: null,
  created_at: stamp, updated_at: stamp, decided_by: null, version: 1, ...changes});
export const session = (tokenHash, staffId = null, changes = {}) => ({token_hash: tokenHash, credential_version: staffId ? '1' : owner.fingerprint,
  expires_at: new Date(at + 8 * 60 * 60 * 1000).toISOString(), idle_expires_at: new Date(at + 30 * 60 * 1000).toISOString(), staff_id: staffId, ...changes});
export const code = value => error => error?.code === value;
export function fixture({staffRows = [], requestRows = [], sessionRows = [session(ownerToken)], extra = [], transform = records => records, ownerConfig = owner} = {}) {
  const projection = planSecurityLookupProjection({schema, layout, coverageId: 'workflow-fixture',
    source: {rivya_staff: staffRows, rivya_access_requests: requestRows}});
  const wrap = (recordId, payload, sourceUpdatedAt = null) => makeRecord({recordId, payload, sourceUpdatedAt, archivedAt: null,
    revision: 1, lastMutationId: 'seed:' + securityLookupHash(recordId)});
  const records = [
    ...staffRows.map(row => wrap(securitySourceRecordId('rivya_staff', row.id), row, row.created_at)),
    ...requestRows.map(row => wrap(securitySourceRecordId('rivya_access_requests', row.id), row, row.updated_at)),
    ...projection.claims, projection.marker,
    wrap(ownerConfig.epochRecordId, {format: 'rivya-owner-credential-epoch-v1', fingerprint: ownerConfig.fingerprint}),
    ...sessionRows.map(row => wrap(securityPrimaryId('rivya_studio_sessions', row.token_hash), row)), ...extra.map(item => wrap(...item)),
  ];
  const plans = transform(records).map(record => planRecordMutation({current: null, previousMutation: null, actor, now: stamp, authorize: () => true,
    command: {recordId: record.recordId, expectedRevision: 0, mutationId: record.lastMutationId, payload: record.payload,
      sourceUpdatedAt: record.sourceUpdatedAt, archivedAt: record.archivedAt}}));
  const state = buildBoundedState({layout, epoch: 'local-workflow-fixture', plans});
  const h = boundedGatewayHarness(state, layout), coverage = {format: 'rivya-security-lookup-coverage-v1', ...projection.coverageProposal, root: boundedCursor(state.root)};
  const config = {layout, coverage, actor, owner: ownerConfig, clock: () => h.state.now, authorize: () => true};
  const engine = (overrides = {}, provider = h.provider) => createBoundedSecurityWorkflows({...config, ...overrides}, provider);
  const current = () => new Map(readBoundedRecords(layout, h.snapshot(), h.snapshot().manifest.records.map(row => row[0])));
  const mutate = async (id, payload, options = {}) => {
    const store = createBoundedStore({layout, now: () => new Date(h.state.now).toISOString(), policy: {authorize: () => true, validate: () => true}}, h.provider);
    const prior = await store.load(id, actor), mutationId = 'fixture-edit:' + h.snapshot().root.revision;
    return store.mutate({actor, operationId: mutationId, commands: [{recordId: id, expectedRevision: prior?.revision ?? 0, mutationId,
      payload, sourceUpdatedAt: options.sourceUpdatedAt ?? prior?.sourceUpdatedAt ?? null, archivedAt: options.archivedAt ?? null}]});
  };
  return {h, coverage, projection, config, engine, current, mutate};
}
export const approval = (changes = {}) => ({action: 'approve', operationId: 'approve:one', requestId: uuid(101), expectedVersion: 1,
  tokenHash: '1'.repeat(64), newStaffId: uuid(1), placeholderHash: passwordHash, ...changes});
export const redemption = (changes = {}) => ({action: 'redeem', operationId: 'redeem:one', tokenHash: '1'.repeat(64),
  passwordHash: 'c'.repeat(32) + ':' + 'd'.repeat(128), ...changes});
