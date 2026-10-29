import test from 'node:test';
import assert from 'node:assert/strict';
import {createBoundedSessionStore} from '../src/lib/google-workspace/bounded-session-store.ts';
import {auditBoundedState, measureBoundedState, BoundedStoreError} from '../src/lib/google-workspace/bounded-store.ts';
import {securitySourceRecordId, securityLookupClaimId, securityLookupKey} from '../src/lib/google-workspace/security-lookup-projection.ts';
import {securityPrimaryId} from '../src/lib/google-workspace/security-current-snapshot.ts';
import {loginResetOperationId} from '../src/lib/google-workspace/bounded-security-workflows.ts';
import {fixture, layout, owner, actor, admin, publicAuthority, ownerToken, uuid, staff, request, session,
  passwordHash, code, approval, redemption} from './helpers/security-workflow-fixture.mjs';

const staffId = n => securitySourceRecordId('rivya_staff', uuid(n));
const requestId = n => securitySourceRecordId('rivya_access_requests', uuid(n));
const claimId = (kind, value, requestKind) => securityLookupClaimId(kind, securityLookupKey(kind, value, requestKind));
const localSessions = f => createBoundedSessionStore({layout, owner, actor, clock: () => f.h.state.now, authorize: () => true}, f.h.provider);
const submit = (changes = {}) => ({action: 'request', operationId: 'request:one', id: uuid(101), kind: 'access', login: 'Applicant101', name: 'Synthetic', contact: 'test@example.invalid', ...changes});

test('request, approval and redemption survive cold objects with atomic claims and sanitized domain audit', async () => {
  const f = fixture();
  assert.equal((await f.engine().execute(submit(), publicAuthority)).status, 'committed');
  assert.equal((await f.engine().execute(approval(), admin)).status, 'committed');
  f.h.restart();
  assert.equal((await f.engine().lookupStaff('applicant101')).active, false);
  assert.equal((await f.engine().execute(redemption(), publicAuthority)).status, 'committed');
  const rows = f.current(), s = rows.get(staffId(1)).payload, r = rows.get(requestId(101)).payload;
  assert.equal(s.id, uuid(1)); assert.equal(s.active, true); assert.equal(s.version, 2); assert.equal(s.role, 'editor');
  assert.equal(r.status, 'completed'); assert.equal(r.token_hash, null); assert.equal(r.version, 3);
  assert.ok(rows.get(claimId('access-token', '1'.repeat(64))).archivedAt);
  assert.ok(rows.get(claimId('open-request', 'Applicant101', 'access')).archivedAt);
  assert.equal(rows.get(claimId('staff-login', 'Applicant101')).archivedAt, null);
  assert.deepEqual(await f.engine().listRequests(admin), []);
  const events = await f.engine().audit(admin);
  assert.deepEqual(events.map(row => row.action).sort(), ['approve', 'redeem', 'request']);
  assert.equal(events.find(row => row.action === 'approve').actor, owner.login);
  assert.equal(events.find(row => row.action === 'redeem').actor, 'verified-access-link');
  assert.equal(JSON.stringify(events).includes('token'), false); assert.equal(JSON.stringify(events).includes(passwordHash), false);
  assert.equal(auditBoundedState(layout, f.h.snapshot()).providerVerified, false);
  assert.ok(measureBoundedState(layout, f.h.snapshot()));
});

test('approval racing an independent approval has one token, one disabled identity and one audit event', async () => {
  const f = fixture({requestRows: [request()]});
  const results = await Promise.allSettled([f.engine().execute(approval(), admin), f.engine().execute(approval({operationId: 'approve:two', newStaffId: uuid(2), tokenHash: '2'.repeat(64)}), admin)]);
  assert.equal(results.filter(r => r.status === 'fulfilled' && r.value.status === 'committed').length, 1);
  const rows = f.current(); assert.equal([...rows.values()].filter(r => r.payload?.password_hash).length, 1);
  assert.equal((await f.engine().audit(admin)).length, 1);
  assert.equal([...rows.values()].filter(r => r.payload?.kind === 'access-token' && r.archivedAt === null).length, 1);
});

test('one-time concurrent redemption advances credentials exactly once and the loser never authenticates', async () => {
  const f = fixture({requestRows: [request()]}); await f.engine().execute(approval(), admin);
  const results = await Promise.allSettled([f.engine().execute(redemption(), publicAuthority), f.engine().execute(redemption({operationId: 'redeem:two'}), publicAuthority)]);
  assert.equal(results.filter(r => r.status === 'fulfilled' && r.value.status === 'committed').length, 1);
  assert.equal(f.current().get(staffId(1)).payload.version, 2);
  const replay = await f.engine().execute(redemption(), publicAuthority);
  assert.equal(replay.status, 'replay'); assert.equal(replay.receiptOnly, true); assert.equal(Object.hasOwn(replay, 'identity'), false);
});

test('reissue atomically tombstones old token; reject releases open key; previously used token stays unavailable', async () => {
  const f = fixture({requestRows: [request()]}); await f.engine().execute(approval(), admin);
  await f.engine().execute(approval({operationId: 'approve:reissue', expectedVersion: 2, tokenHash: '2'.repeat(64)}), admin);
  assert.equal((await f.engine().execute(redemption(), publicAuthority)).status, 'invalid');
  assert.ok(f.current().get(claimId('access-token', '1'.repeat(64))).archivedAt);
  await assert.rejects(f.engine().execute(approval({operationId: 'approve:old-token', expectedVersion: 3}), admin), code('conflict'));
  await f.engine().execute({action: 'reject', operationId: 'reject:one', requestId: uuid(101), expectedVersion: 3}, admin);
  assert.ok(f.current().get(claimId('open-request', 'Applicant101', 'access')).archivedAt);
  await f.engine().execute(submit({operationId: 'request:replacement', id: uuid(102)}), publicAuthority);
  assert.equal(f.current().get(claimId('open-request', 'Applicant101', 'access')).payload.sourceId, uuid(102));
});

test('duplicate pending request does not change the existing contact or manufacture audit history', async () => {
  const f = fixture({requestRows: [request()]}); const before = f.h.snapshot();
  const result = await f.engine().execute(submit({contact: 'changed@example.invalid'}), publicAuthority);
  assert.equal(result.status, 'unchanged'); assert.deepEqual(f.h.snapshot(), before);
});

test('request action ID replay is receipt-only and changed inputs cannot reuse the audit ID', async () => {
  const f = fixture(); await f.engine().execute(submit(), publicAuthority);
  assert.equal((await f.engine().execute(submit(), publicAuthority)).status, 'replay');
  await assert.rejects(f.engine().execute(submit({name: 'changed'}), publicAuthority), code('conflict'));
});

test('current owner epoch and session proof required; role strings and a stale session do not approve', async () => {
  const f = fixture({requestRows: [request()], staffRows: [staff()], sessionRows: [session(ownerToken), session('3'.repeat(64), uuid(1))]});
  await assert.rejects(f.engine().execute(approval(), publicAuthority), code('unauthorized'));
  await assert.rejects(f.engine().execute(approval(), {kind: 'session', tokenHash: '3'.repeat(64)}), code('unauthorized'));
  await f.mutate(owner.epochRecordId, {format: 'rivya-owner-credential-epoch-v1', fingerprint: '4'.repeat(64)});
  await assert.rejects(f.engine().execute(approval(), admin), code('unauthorized'));
});

test('owner and self-recovery approval are denied without creating a staff identity', async () => {
  const f = fixture({requestRows: [request(101, {login: 'OWNER', kind: 'recovery'})]});
  assert.equal((await f.engine().execute(approval(), admin)).status, 'invalid');
  assert.equal([...f.current().values()].filter(r => r.payload?.password_hash).length, 0);
});

test('recovery preserves staff identity and invalidates every prior session by version before cleanup', async () => {
  const f = fixture({staffRows: [staff()], requestRows: [request(101, {kind: 'recovery', login: 'Editor1'})],
    sessionRows: [session(ownerToken), session('3'.repeat(64), uuid(1)), session('4'.repeat(64), uuid(1))]});
  await f.engine().execute(approval(), admin); await f.engine().execute(redemption(), publicAuthority);
  for (const tokenHash of ['3'.repeat(64), '4'.repeat(64)]) assert.equal((await localSessions(f).validateAndRefresh({operationId: 'check', tokenHash})).status, 'invalid');
  const cleanup = await f.engine().execute({action: 'session-maintenance', operationId: 'cleanup'}, {kind: 'maintenance'});
  assert.equal(cleanup.changedRecords, 2); assert.equal(cleanup.remaining, 0);
  assert.equal(f.current().get(staffId(1)).payload.id, uuid(1));
  assert.equal(f.current().get(securityPrimaryId('rivya_studio_sessions', ownerToken)).archivedAt, null);
});

test('expired redemption cannot commit after provider lock wait', async () => {
  const f = fixture({requestRows: [request()]}); await f.engine().execute(approval(), admin);
  const provider = {...f.h.provider, async commit(prepared, options) { f.h.state.now += 31 * 60 * 1000; return f.h.provider.commit(prepared, options); }};
  const result = await f.engine({}, provider).execute(redemption(), publicAuthority);
  assert.equal(result.status, 'invalid'); assert.equal(f.current().get(staffId(1)).payload.active, false);
});

test('direct source edits without atomic claims fail coverage and do not become a new trusted root', async () => {
  const f = fixture({staffRows: [staff()]});
  await f.mutate(staffId(1), {...staff(), login: 'Renamed'});
  await assert.rejects(f.engine().lookupStaff('Editor1'), code('coverage-unverified'));
  await assert.rejects(f.engine().execute(submit(), publicAuthority), code('coverage-unverified'));
});

test('atomic staff rename preserves identity and history and rebinds both lookup keys', async () => {
  const f = fixture({staffRows: [staff()]});
  await f.engine().execute({action: 'staff-update', operationId: 'staff:rename', staffId: uuid(1), expectedVersion: 1,
    login: 'Renamed', name: 'New name', role: 'editor', active: true}, admin);
  assert.equal(await f.engine().lookupStaff('Editor1'), null);
  assert.equal((await f.engine().lookupStaff('renamed')).id, uuid(1));
  assert.ok(f.current().get(claimId('staff-login', 'Editor1')).archivedAt);
  assert.equal(f.current().get(staffId(1)).payload.version, 2);
});

test('disabled staff reserve login; role editing and approval cannot take another identity', async () => {
  const f = fixture({staffRows: [staff(1, {active: false}), staff(2)], requestRows: [request(101, {login: 'EDITOR1'})]});
  assert.equal((await f.engine().execute(approval(), admin)).status, 'invalid');
  assert.equal((await f.engine().execute({action: 'staff-update', operationId: 'rename:collision', staffId: uuid(2), expectedVersion: 1,
    login: 'editor1', name: 'Edited', role: 'admin', active: true}, admin)).status, 'invalid');
});

test('unknown write retains atomic mutation and audit; retry resolves receipt without repeating effects', async () => {
  const f = fixture({requestRows: [request()]});
  f.h.state.fault = batch => batch === 2 ? 'lost' : undefined;
  await assert.rejects(f.engine().execute(approval(), admin), code('outcome-unknown'));
  f.h.state.fault = null; f.h.restart();
  const result = await f.engine().execute(approval(), admin);
  assert.equal(result.status, 'replay'); assert.equal(Object.hasOwn(result, 'expiresAt'), false);
  assert.equal((await f.engine().audit(admin)).length, 1);
});

test('quarantined inflight write cannot be treated as committed or retried under a new identity', async () => {
  const f = fixture({requestRows: [request()]}); f.h.state.fault = batch => batch === 2 ? 'pending' : undefined;
  await assert.rejects(f.engine().execute(approval(), admin), code('outcome-unknown'));
  await assert.rejects(f.engine().execute(approval({operationId: 'another'}), admin), code('outcome-unknown'));
});

test('policy denial happens before provider IO; synchronous capture prevents caller changes during authorization', async () => {
  const f = fixture();
  await assert.rejects(f.engine({authorize: () => false}).execute(submit(), publicAuthority), code('unauthorized'));
  assert.equal(f.h.state.reads.length, 0);
  const input = submit(), authority = {kind: 'public'};
  const promise = f.engine({authorize: async () => { await new Promise(resolve => setTimeout(resolve, 1)); return true; }}).execute(input, authority);
  input.login = 'Tampered'; authority.kind = 'maintenance';
  await promise; assert.equal(f.current().get(requestId(101)).payload.login, 'Applicant101');
});

test('one bounded deadline covers hung policy; abort and late reads never dispatch', async () => {
  const f = fixture();
  await assert.rejects(f.engine({timeoutMs: 20, authorize: () => new Promise(() => {})}).execute(submit(), publicAuthority), code('unavailable'));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(f.engine().execute(submit(), publicAuthority, {signal: controller.signal}), code('unavailable'));
  assert.equal(f.h.state.batches, 0);
});

test('malicious injected page provider cannot mutate the pinned base to substitute another revision', async () => {
  const f = fixture({staffRows: [staff()]});
  const provider = {...f.h.provider, async readPages(base, ids, options) { base.root.revision++; ids.push(999); return f.h.provider.readPages(base, ids, options); }};
  await assert.rejects(f.engine({}, provider).lookupStaff('Editor1'));
  assert.equal(f.h.state.batches, 0);
});

test('maintenance archives at most seven invalid sessions per atomic batch and retains every original payload', async () => {
  const invalid = Array.from({length: 9}, (_, i) => session(String(i + 1).repeat(64), null, {idle_expires_at: '2020-01-01T00:00:00.000Z'}));
  const f = fixture({sessionRows: [session(ownerToken), ...invalid]}), before = f.current();
  const first = await f.engine().execute({action: 'session-maintenance', operationId: 'cleanup:1'}, {kind: 'maintenance'});
  assert.equal(first.changedRecords, 7); assert.equal(first.remaining, 2);
  const second = await f.engine().execute({action: 'session-maintenance', operationId: 'cleanup:2'}, {kind: 'maintenance'});
  assert.equal(second.changedRecords, 2); assert.equal(second.remaining, 0);
  for (const row of invalid) { const id = securityPrimaryId('rivya_studio_sessions', row.token_hash); assert.ok(f.current().get(id).archivedAt); assert.deepEqual(f.current().get(id).payload, before.get(id).payload); }
  assert.equal((await f.engine().execute({action: 'session-maintenance', operationId: 'cleanup:3'}, {kind: 'maintenance'})).status, 'unchanged');
});

test('successful-login reset requires exact attempt revision and fresh valid session; later attempts survive', async () => {
  const counter = {key: 'owner', attempts: 4, reset_at: new Date(Date.parse('2026-10-28T12:00:00Z') + 900000).toISOString()};
  const id = securityPrimaryId('rivya_studio_login_limits', 'owner'), f = fixture({extra: [[id, counter]]});
  await f.mutate(id, {...counter, attempts: 5});
  const input = {action: 'login-reset', operationId: loginResetOperationId(ownerToken), key: 'owner', expectedRevision: 1};
  assert.equal((await f.engine().execute(input, admin)).status, 'invalid'); assert.equal(f.current().get(id).payload.attempts, 5);
  assert.equal((await f.engine().execute({...input, expectedRevision: 2}, admin)).status, 'committed');
  assert.equal(f.current().get(id).payload.attempts, 0);
  await f.mutate(id, {...counter, attempts: 1}); f.h.state.now += 30000;
  await assert.rejects(f.engine().execute({...input, expectedRevision: 4}, admin), code('conflict'));
  await assert.rejects(f.engine().execute({...input, operationId: 'another-reset', expectedRevision: 4}, admin), code('invalid-input'));
  assert.equal(f.current().get(id).payload.attempts, 1);
});

test('mutated marker, unknown record shapes and duplicate provider pages fail without writes', async () => {
  const f = fixture(); await f.mutate(f.coverage.markerRecordId, f.projection.marker.payload);
  await assert.rejects(f.engine().execute(submit(), publicAuthority), code('coverage-unverified'));
  const unknown = fixture({extra: [['unknown:record', {ready: true}]]});
  await assert.rejects(unknown.engine().execute(submit(), publicAuthority), code('integrity'));
  const duplicate = fixture({staffRows: [staff(), staff(2)]});
  const provider = {...duplicate.h.provider, async readPages(base, ids, options) { const rows = await duplicate.h.provider.readPages(base, ids, options); return rows.map(() => rows[0]); }};
  await assert.rejects(duplicate.engine({}, provider).execute(submit(), publicAuthority), code('integrity'));
  assert.equal(unknown.h.state.batches + duplicate.h.state.batches, 0);
});

test('fresh lookup remains valid after ordinary session refresh without trusting the previous root', async () => {
  const f = fixture({staffRows: [staff()]});
  assert.equal((await localSessions(f).validateAndRefresh({operationId: 'refresh', tokenHash: ownerToken})).status, 'valid');
  assert.equal((await f.engine().lookupStaff('Editor1')).id, uuid(1));
});

test('current-record ceiling fails explicitly without truncating coverage or dispatching a write', async () => {
  const f = fixture({sessionRows: Array.from({length: 255}, (_, i) => session(i.toString(16).padStart(64, '0')))});
  // 255 source sessions plus one marker and one owner epoch exceeds 256.
  await assert.rejects(f.engine().lookupStaff('Editor1'), code('capacity'));
  assert.equal(f.h.state.reads.filter(read => read.sheetId === layout.dataSheetId).length, 0);
  assert.equal(f.h.state.batches, 0);
});

test('an audit-looking row outside its claimed atomic group is rejected as forged receipt evidence', async () => {
  const f = fixture(); await f.engine().execute(submit(), publicAuthority);
  const event = [...f.current().values()].find(record => record.recordId.startsWith('security-event:'));
  await f.mutate(event.recordId, event.payload);
  await assert.rejects(f.engine().execute(submit(), publicAuthority), code('integrity'));
});

test('post-dispatch exception labeled conflict remains unknown and cannot trigger a second workflow', async () => {
  const f = fixture({requestRows: [request()]}); let calls = 0;
  const provider = {...f.h.provider, async commit(prepared, options) {
    calls++; await f.h.provider.commit(prepared, options); throw new BoundedStoreError('conflict');
  }};
  await assert.rejects(f.engine({}, provider).execute(approval(), admin), code('outcome-unknown'));
  assert.equal(calls, 1); assert.equal(f.current().get(requestId(101)).payload.status, 'approved');
});

test('admin session expiry under the provider lock prevents approval and audit together', async () => {
  const f = fixture({requestRows: [request()]});
  const provider = {...f.h.provider, async commit(prepared, options) {
    f.h.state.now += 31 * 60 * 1000; return f.h.provider.commit(prepared, options);
  }};
  await assert.rejects(f.engine({}, provider).execute(approval(), admin), code('unauthorized'));
  assert.equal(f.current().get(requestId(101)).payload.status, 'pending');
  assert.equal([...f.current().values()].filter(row => row.recordId.startsWith('security-event:')).length, 0);
});

test('fresh-session reset expires after thirty seconds even with an otherwise valid session and unused operation ID', async () => {
  const id = securityPrimaryId('rivya_studio_login_limits', 'owner'), f = fixture({extra: [[id,
    {key: 'owner', attempts: 4, reset_at: '2026-10-28T12:15:00.000Z'}]]});
  f.h.state.now += 30000;
  assert.equal((await f.engine().execute({action: 'login-reset', operationId: loginResetOperationId(ownerToken), key: 'owner', expectedRevision: 1}, admin)).status, 'invalid');
  assert.equal(f.current().get(id).payload.attempts, 4);
});
