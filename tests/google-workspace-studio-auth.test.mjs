import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GoogleWorkspaceSecurityAdapter,
  InMemorySecurityStore,
} from '../src/lib/google-workspace/security-adapter.ts';

const adminId = 'admin@example.invalid';
const adminPassword = 'super-secure-admin-password-12345';
const sessionSecret = 'a-very-long-and-secure-session-secret-at-least-32-chars';

function createTestAdapter(overrides = {}) {
  const store = new InMemorySecurityStore();
  const adapter = new GoogleWorkspaceSecurityAdapter(store, {
    adminId,
    adminPassword,
    sessionSecret,
    ...overrides,
  });
  return {adapter, store};
}

test('GW-400: Security adapter configuration and admin verification', async () => {
  const {adapter} = createTestAdapter();
  assert.equal(adapter.isConfigured(), true);

  // Valid admin matches
  assert.equal(await adapter.verifyAdmin(adminId, adminPassword), true);
  assert.equal(await adapter.verifyAdmin(`  ${adminId}  `, adminPassword), true); // trimmed

  // Invalid admin credentials fail closed
  assert.equal(await adapter.verifyAdmin(adminId, 'wrong-password-here-123'), false);
  assert.equal(await adapter.verifyAdmin('intruder@example.invalid', adminPassword), false);

  // Incomplete configuration fails closed
  const brokenAdapter = new GoogleWorkspaceSecurityAdapter(new InMemorySecurityStore(), {
    adminId: 'admin',
    adminPassword: 'short', // < 16
    sessionSecret: 'short', // < 32
  });
  assert.equal(brokenAdapter.isConfigured(), false);
  assert.equal(await brokenAdapter.verifyAdmin('admin', 'short'), false);
});

test('GW-400: Staff password hashing and authentication', async () => {
  const {adapter, store} = createTestAdapter();

  const password = 'editor-secret-password-16chars';
  const passwordHash = await adapter.hashPassword(password);
  assert.ok(passwordHash.includes(':'));
  const [salt, hex] = passwordHash.split(':');
  assert.equal(salt.length, 32);
  assert.equal(hex.length, 128);

  const staffId = '00000000-0000-0000-0000-000000000001';
  await store.createStaff({
    id: staffId,
    login: 'editor.art',
    name: 'Art Editor',
    password_hash: passwordHash,
    role: 'editor',
    active: true,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Successful staff authentication
  const session = await adapter.authenticateStaff('editor.art', password);
  assert.ok(session);
  assert.equal(session.adminId, 'editor.art');
  assert.equal(session.role, 'editor');
  assert.equal(session.staffId, staffId);
  assert.equal(session.credentialVersion, 1);

  // Case-insensitive login
  const sessionUpper = await adapter.authenticateStaff('EDITOR.ART', password);
  assert.ok(sessionUpper);
  assert.equal(sessionUpper.staffId, staffId);

  // Wrong password fails
  assert.equal(await adapter.authenticateStaff('editor.art', 'wrong-pass-1234567'), null);

  // Inactive staff fails even with correct password
  await store.updateStaff({
    id: staffId,
    login: 'editor.art',
    name: 'Art Editor',
    password_hash: passwordHash,
    role: 'editor',
    active: false,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  assert.equal(await adapter.authenticateStaff('editor.art', password), null);

  // Admin authentication through authenticateStaff
  const adminSession = await adapter.authenticateStaff(adminId, adminPassword);
  assert.ok(adminSession);
  assert.equal(adminSession.role, 'admin');
  assert.equal(adminSession.staffId, null);
});

test('GW-400: Session lifecycle with absolute and idle expiration', async () => {
  const {adapter, store} = createTestAdapter();
  const baseTime = new Date('2026-10-26T12:00:00.000Z');

  const staffId = '00000000-0000-0000-0000-000000000002';
  await store.createStaff({
    id: staffId,
    login: 'curator.lead',
    name: 'Curator',
    password_hash: 'placeholder',
    role: 'editor',
    active: true,
    version: 3,
    created_at: baseTime.toISOString(),
    updated_at: baseTime.toISOString(),
  });

  const identity = {adminId: 'curator.lead', role: 'editor', staffId, credentialVersion: 3};
  const token = await adapter.createStudioSession(identity, baseTime);
  assert.equal(typeof token, 'string');
  assert.equal(token.length, 43);

  // Immediate validation succeeds
  const activeSession = await adapter.studioSessionFromToken(token, baseTime);
  assert.ok(activeSession);
  assert.equal(activeSession.adminId, 'curator.lead');
  assert.equal(activeSession.staffId, staffId);

  // After 20 minutes: idle window slides forward
  const after20m = new Date(baseTime.getTime() + 20 * 60 * 1000);
  const slidSession = await adapter.studioSessionFromToken(token, after20m);
  assert.ok(slidSession);

  // Idle expiration: 35 minutes of inactivity exceeds 30m idle window
  const after35mInactive = new Date(after20m.getTime() + 35 * 60 * 1000);
  const idleExpired = await adapter.studioSessionFromToken(token, after35mInactive);
  assert.equal(idleExpired, null);

  // Absolute expiration: new session, but after 8 hours + 1 second
  const token2 = await adapter.createStudioSession(identity, baseTime);
  const after8h1s = new Date(baseTime.getTime() + (8 * 60 * 60 + 1) * 1000);
  const absoluteExpired = await adapter.studioSessionFromToken(token2, after8h1s);
  assert.equal(absoluteExpired, null);
});

test('GW-400: Credential version invalidation revokes active sessions', async () => {
  const {adapter, store} = createTestAdapter();
  const now = new Date('2026-10-26T12:00:00.000Z');

  const staffId = '00000000-0000-0000-0000-000000000003';
  const staff = {
    id: staffId,
    login: 'staff.member',
    name: 'Staff Member',
    password_hash: 'placeholder',
    role: 'editor',
    active: true,
    version: 1,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };
  await store.createStaff(staff);

  const token = await adapter.createStudioSession({adminId: 'staff.member', role: 'editor', staffId, credentialVersion: 1}, now);
  assert.ok(await adapter.studioSessionFromToken(token, now));

  // Staff password changed or version incremented to 2
  staff.version = 2;
  await store.updateStaff(staff);

  // The existing session must be revoked immediately
  const revokedSession = await adapter.studioSessionFromToken(token, now);
  assert.equal(revokedSession, null);
});

test('GW-400: Explicit session revocation via revokeStudioSession', async () => {
  const {adapter} = createTestAdapter();
  const now = new Date();

  const token = await adapter.createStudioSession({adminId, role: 'admin', staffId: null}, now);
  assert.ok(await adapter.studioSessionFromToken(token, now));

  await adapter.revokeStudioSession(token);
  assert.equal(await adapter.studioSessionFromToken(token, now), null);
});

test('GW-400: Durable throttling and rate limit windows', async () => {
  const {adapter} = createTestAdapter();
  const startTime = new Date('2026-10-26T12:00:00.000Z');
  const key = 'login-ip:192.0.2.1';

  // 3 allowed attempts
  assert.equal(await adapter.recordLoginAttempt(key, 3, 15, startTime), true); // 1
  assert.equal(await adapter.recordLoginAttempt(key, 3, 15, startTime), true); // 2
  assert.equal(await adapter.recordLoginAttempt(key, 3, 15, startTime), true); // 3
  // 4th attempt rejected
  assert.equal(await adapter.recordLoginAttempt(key, 3, 15, startTime), false);

  // After 15 minutes window resets
  const after15m = new Date(startTime.getTime() + 15 * 60 * 1000 + 1000);
  assert.equal(await adapter.recordLoginAttempt(key, 3, 15, after15m), true); // 1 again
});

test('GW-400: Access and recovery request lifecycle with redemption', async () => {
  const {adapter, store} = createTestAdapter();
  const now = new Date('2026-10-26T12:00:00.000Z');

  // Submit request
  await adapter.requestStudioAccess({
    kind: 'access',
    login: 'new.curator',
    name: 'New Curator',
    contact: 'curator@gallery.invalid',
  }, now);

  const pending = await adapter.listAccessRequests();
  assert.equal(pending.length, 1);
  assert.equal(pending[0].login, 'new.curator');
  assert.equal(pending[0].status, 'pending');

  const adminSession = {adminId, role: 'admin', staffId: null};

  // Admin approves request
  const decision = await adapter.decideAccessRequest(adminSession, pending[0].id, 1, 'approve', now);
  assert.ok(decision);
  assert.ok(decision.saved);
  assert.ok(decision.linkToken);
  assert.equal(decision.linkToken.length, 43);

  // New staff record was created in disabled state
  const createdStaff = await store.getStaffByLogin('new.curator');
  assert.ok(createdStaff);
  assert.equal(createdStaff.active, false);

  // Redeem access link with a strong password
  const newPassword = 'new-curator-strong-password-16chars';
  const redeemed = await adapter.redeemAccessLink(decision.linkToken, newPassword, now);
  assert.equal(redeemed, true);

  // Staff is now active and can sign in
  const authenticated = await adapter.authenticateStaff('new.curator', newPassword);
  assert.ok(authenticated);
  assert.equal(authenticated.role, 'editor');

  // Redeeming same token twice fails
  assert.equal(await adapter.redeemAccessLink(decision.linkToken, newPassword, now), false);
});

test('GW-400: Workspace staff projection adheres to role scoping', async () => {
  const {adapter, store} = createTestAdapter();
  const now = new Date().toISOString();

  await store.createStaff({
    id: '00000000-0000-0000-0000-000000000010',
    login: 'admin.active',
    name: 'Active Admin',
    password_hash: 'ph',
    role: 'admin',
    active: true,
    version: 1,
    created_at: now,
    updated_at: now,
  });
  await store.createStaff({
    id: '00000000-0000-0000-0000-000000000011',
    login: 'editor.inactive',
    name: 'Inactive Editor',
    password_hash: 'ph',
    role: 'editor',
    active: false,
    version: 1,
    created_at: now,
    updated_at: now,
  });

  // Admin sees all staff including inactive and version
  const adminList = await adapter.workspaceStaff({adminId, role: 'admin', staffId: null});
  assert.equal(adminList.length, 2);
  assert.ok(adminList.some(s => s.login === 'editor.inactive'));

  // Editor sees only active staff
  const editorList = await adapter.workspaceStaff({adminId: 'some.editor', role: 'editor', staffId: '123'});
  assert.equal(editorList.length, 1);
  assert.equal(editorList[0].name, 'Active Admin');
});
