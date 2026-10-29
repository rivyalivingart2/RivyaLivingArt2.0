import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createBoundedSecurityService} from '../src/lib/google-workspace/bounded-security-service.ts';
import {createBoundedSessionService, sessionOwnerFingerprint} from '../src/lib/google-workspace/bounded-session-service.ts';
import {createBoundedThrottleStore} from '../src/lib/google-workspace/bounded-throttle-store.ts';
import {GoogleWorkspaceSecurityAdapter} from '../src/lib/google-workspace/security-adapter.ts';
import {securityPrimaryId} from '../src/lib/google-workspace/security-current-snapshot.ts';
import {fixture, layout, actor, owner, uuid, request, staff, session, code, approval, admin, publicAuthority, redemption} from './helpers/security-workflow-fixture.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
const rawOwnerToken = 'Z'.repeat(43), ownerTokenHash = hash(rawOwnerToken);
const credentials = {login: 'Owner', password: 'synthetic-password-for-local-tests-only', sessionSecret: 'synthetic-session-secret-for-local-tests-only'};
const boundOwner = {...owner, fingerprint: sessionOwnerFingerprint(credentials)};
function services(options = {}) {
  const f = fixture({...options, ownerConfig: boundOwner,
    sessionRows: [session(ownerTokenHash, null, {credential_version: boundOwner.fingerprint}), ...(options.sessionRows ?? [])]});
  const service = (changes = {}, engine = f.engine()) => createBoundedSecurityService({workflows: engine,
    ownerCredentialFingerprint: boundOwner.fingerprint, currentSessionToken: async () => rawOwnerToken, ...changes});
  const lifecycle = createBoundedSessionService({layout, actor, owner: {...credentials, epochRecordId: owner.epochRecordId},
    clock: () => f.h.state.now, authorize: () => true}, f.h.provider);
  let crud = 0;
  const legacy = new Proxy({}, {get() { return async () => { crud++; throw Error('Legacy CRUD must not run'); }; }});
  const adapter = () => new GoogleWorkspaceSecurityAdapter(legacy,
    {adminId: credentials.login, adminPassword: credentials.password, sessionSecret: credentials.sessionSecret}, lifecycle, service());
  return {...f, service, lifecycle, adapter, crud: () => crud};
}

test('facade and existing adapter support access, approval, redemption, login and cold reload without split CRUD', async () => {
  const f = services();
  assert.equal(f.adapter().isConfigured(), true);
  await f.adapter().requestStudioAccess({kind: 'access', login: 'new.editor', name: 'Synthetic', contact: 'test@example.invalid'});
  const [pending] = await f.adapter().listAccessRequests();
  assert.equal(Object.hasOwn(pending, 'token_hash'), false);
  const result = await f.adapter().decideAccessRequest({adminId: 'ignored-client-prop', role: 'editor', staffId: uuid(99)}, pending.id, pending.version, 'approve');
  assert.match(result.linkToken, /^[A-Za-z0-9_-]{43}$/); assert.equal(result.expiresAt, '2026-10-28T12:30:00.000Z');
  const password = 'new-synthetic-password-with-sixteen-characters';
  assert.equal(await f.adapter().redeemAccessLink(result.linkToken, password), true);
  assert.equal(await f.adapter().redeemAccessLink(result.linkToken, password), false);
  f.h.restart();
  const identity = await f.adapter().authenticateStaff('NEW.EDITOR', password);
  assert.equal(identity.adminId, 'new.editor'); assert.equal(identity.role, 'editor');
  const token = await f.adapter().createStudioSession(identity);
  assert.equal((await f.adapter().studioSessionFromToken(token)).staffId, identity.staffId);
  assert.equal((await f.adapter().workspaceStaff({role: 'editor'})).length, 1);
  assert.equal((await f.service().audit()).length, 3); assert.equal(f.crud(), 0);
  const stored = JSON.stringify(f.h.snapshot());
  for (const secret of [result.linkToken, password, credentials.password, credentials.sessionSecret, token, rawOwnerToken]) assert.equal(stored.includes(secret), false);
});

test('persistent security rejects old CRUD methods and mismatched credential binding', async () => {
  const f = services(); const adapter = new GoogleWorkspaceSecurityAdapter({}, {adminId: credentials.login, adminPassword: credentials.password, sessionSecret: credentials.sessionSecret}, f.lifecycle);
  assert.equal(adapter.isConfigured(), false);
  for (const call of [() => adapter.authenticateStaff('abc', 'password'), () => adapter.requestStudioAccess({}),
    () => adapter.listAccessRequests(), () => adapter.decideAccessRequest({}, uuid(101), 1, 'approve'),
    () => adapter.redeemAccessLink('a'.repeat(43), 'b'.repeat(20)), () => adapter.workspaceStaff({})]) await assert.rejects(call(), code('ATOMIC_SECURITY_REQUIRED'));
  const changed = new GoogleWorkspaceSecurityAdapter({}, {adminId: credentials.login, adminPassword: credentials.password + 'changed', sessionSecret: credentials.sessionSecret}, f.lifecycle, f.service());
  await assert.rejects(changed.listAccessRequests(), code('SECURITY_BINDING_CHANGED'));
  assert.throws(() => f.service({ownerCredentialFingerprint: 'a'.repeat(64)}), code('configuration'));
});

test('authenticated lists and approval use current request cookie, not passed role props', async () => {
  const f = services({requestRows: [request()]});
  await assert.rejects(f.service({currentSessionToken: async () => undefined}).listAccessRequests(), code('unauthorized'));
  await assert.rejects(f.service({currentSessionToken: async () => 'malformed'}).decideAccessRequest(uuid(101), 1, 'approve'), code('unauthorized'));
  assert.equal(f.h.state.batches, 0);
});

test('approval response loss returns no raw token; committed record and audit remain reconcilable', async () => {
  const f = services({requestRows: [request()]}); f.h.state.fault = batch => batch === 2 ? 'lost' : undefined;
  await assert.rejects(f.service().decideAccessRequest(uuid(101), 1, 'approve'), code('outcome-unknown'));
  f.h.state.fault = null; f.h.restart();
  assert.equal((await f.service().listAccessRequests())[0].status, 'approved');
  assert.equal((await f.service().audit()).length, 1);
  // A new explicit approval can reissue at the returned current version. No
  // automatic second issuance follows the uncertain result.
  assert.equal(f.h.snapshot().manifest.transactions.filter(t => t[0].startsWith('security-flow:')).length, 1);
});

test('facade never returns an access token or success from a provider replay receipt', async () => {
  const f = services({requestRows: [request()]});
  const replay = {...f.engine(), execute: async () => ({status: 'replay', receiptOnly: true, changedRecords: 3})};
  assert.equal(await f.service({}, replay).decideAccessRequest(uuid(101), 1, 'approve'), null);
  assert.equal(await f.service({}, replay).redeemAccessLink('A'.repeat(43), 'B'.repeat(20)), false);
});

test('hung writer after dispatch and late acknowledgement are unknown; cookie timeout is unavailable', async () => {
  const f = services();
  await assert.rejects(f.service({timeoutMs: 20}, {...f.engine(), execute: () => new Promise(() => {})}).requestStudioAccess({kind: 'access', login: 'test.user', name: 'Test', contact: 'test@example.invalid'}), code('outcome-unknown'));
  await assert.rejects(f.service({timeoutMs: 20, currentSessionToken: () => new Promise(() => {})}).listAccessRequests(), code('unavailable'));
});

test('attempt receipt resets only that revision and once per fresh session, retaining subsequent attempts', async () => {
  const f = services(), throttle = createBoundedThrottleStore({layout, actorId: actor.id, clock: () => f.h.state.now}, f.h.provider);
  const input = {key: 'owner', limit: 10, windowMinutes: 15, now: new Date(f.h.state.now).toISOString()};
  const first = await throttle.consumeLoginAttemptWithReceipt(input); assert.equal(first.allowed, true);
  assert.equal(first.receipt.recordId, securityPrimaryId('rivya_studio_login_limits', 'owner'));
  const result = await f.service().resetSuccessfulLogin(rawOwnerToken, first.receipt); assert.equal(result.status, 'committed');
  const later = await throttle.consumeLoginAttemptWithReceipt(input);
  await assert.rejects(f.service().resetSuccessfulLogin(rawOwnerToken, later.receipt), code('conflict'));
  assert.equal(f.current().get(first.receipt.recordId).payload.attempts, 1);
  assert.equal((await f.service().resetSuccessfulLogin(rawOwnerToken, first.receipt)).status, 'replay');
  await assert.rejects(f.service().resetSuccessfulLogin(rawOwnerToken, {...later.receipt, recordId: 'wrong'}), code('invalid-input'));
});

test('maintenance never revokes solely for clock rollback or a stale worker fingerprint', async () => {
  const f = fixture(); f.h.state.now -= 1000;
  assert.equal((await f.engine().execute({action: 'session-maintenance', operationId: 'clock-back'}, {kind: 'maintenance'})).changedRecords, 0);
  const epoch = f.current().get(owner.epochRecordId); await f.mutate(owner.epochRecordId, {...epoch.payload, fingerprint: '1'.repeat(64)});
  const id = securityPrimaryId('rivya_studio_sessions', 'f'.repeat(64));
  const current = f.current().get(id); await f.mutate(id, {...current.payload, credential_version: '1'.repeat(64)});
  assert.equal((await f.engine().execute({action: 'session-maintenance', operationId: 'stale-worker'}, {kind: 'maintenance'})).changedRecords, 0);
  assert.equal(f.current().get(id).archivedAt, null);
});

test('role revocation during commit forces a fresh authorization decision and no approved request', async () => {
  const member = staff(2, {role: 'admin'}), tokenHash = '3'.repeat(64);
  const f = fixture({staffRows: [member], requestRows: [request()], sessionRows: [session(tokenHash, member.id)]});
  let changed = false;
  const provider = {...f.h.provider, async commit(prepared, options) {
    if (!changed) { changed = true; await f.mutate(securityPrimaryId('rivya_staff', member.id), {...member, role: 'editor'}); }
    return f.h.provider.commit(prepared, options);
  }};
  await assert.rejects(f.engine({}, provider).execute(approval(), {kind: 'session', tokenHash}), code('unauthorized'));
  assert.equal(f.current().get(securityPrimaryId('rivya_access_requests', uuid(101))).payload.status, 'pending');
});

test('credential rotation between redemption read and commit leaves the request unconsumed', async () => {
  const f = fixture({requestRows: [request()]}); await f.engine().execute(approval(), admin);
  let changed = false;
  const provider = {...f.h.provider, async commit(prepared, options) {
    if (!changed) { changed = true; const id = securityPrimaryId('rivya_staff', uuid(1)); await f.mutate(id, {...f.current().get(id).payload, version: 2}); }
    return f.h.provider.commit(prepared, options);
  }};
  assert.equal((await f.engine({}, provider).execute(redemption(), publicAuthority)).status, 'invalid');
  assert.equal(f.current().get(securityPrimaryId('rivya_access_requests', uuid(101))).payload.status, 'approved');
});
