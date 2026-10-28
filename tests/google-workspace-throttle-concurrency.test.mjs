import test from 'node:test';
import assert from 'node:assert/strict';
import {GoogleWorkspaceSecurityAdapter, InMemorySecurityStore} from '../src/lib/google-workspace/security-adapter.ts';
import {createCanonicalThrottleStore} from '../src/lib/google-workspace/canonical-throttle-store.ts';
import {createTestWriterProvider, writerFixtureResource} from './helpers/google-workspace-writer-provider.mjs';

test('Two independent adapters cannot both consume a limit of one', async () => {
  const store = new InMemorySecurityStore();
  const a = new GoogleWorkspaceSecurityAdapter(store), b = new GoogleWorkspaceSecurityAdapter(store);
  const now = new Date();
  const results = await Promise.all([a.recordLoginAttempt('test', 1, 15, now), b.recordLoginAttempt('test', 1, 15, now)]);
  assert.equal(results.filter(Boolean).length, 1);
});

test('Persistent throttle CAS arbitrates independent clients, including expiry, through the controlled writer', async () => {
  let now = Date.parse('2026-10-28T10:00:00Z');
  const provider = createTestWriterProvider();
  const client = () => createCanonicalThrottleStore({resource: writerFixtureResource, actorId: 'auth-service', clock: () => now}, {...provider, now: () => new Date(now).toISOString()});
  const input = () => ({key: 'test-isolated-login', limit: 1, windowMinutes: 15, now: new Date(now).toISOString()});
  const outcomes = await Promise.allSettled([client().consumeLoginAttempt(input()), client().consumeLoginAttempt(input())]);
  assert.equal(outcomes.filter(r => r.status === 'fulfilled' && r.value).length, 1);
  assert.equal(provider.calls.applied, 1);
  assert.equal(await client().consumeLoginAttempt(input()), false);
  now += 15 * 60_000;
  assert.equal(await client().consumeLoginAttempt(input()), true);
  assert.equal(provider.calls.applied, 2);
});

test('Lost commit acknowledgement denies the attempt and does not retry with a new mutation', async () => {
  const now = Date.parse('2026-10-28T10:00:00Z'), provider = createTestWriterProvider();
  provider.faults.loseResponseOnce = true;
  const client = createCanonicalThrottleStore({resource: writerFixtureResource, actorId: 'auth-service', clock: () => now}, {...provider, now: () => new Date(now).toISOString()});
  const input = {key: 'isolated', limit: 1, windowMinutes: 15, now: new Date(now).toISOString()};
  await assert.rejects(client.consumeLoginAttempt(input), /THROTTLE_UNAVAILABLE/);
  assert.equal(provider.calls.applied, 1);
  assert.equal(await client.consumeLoginAttempt(input), false);
});

test('Malformed policy, corrupt state and unavailable storage fail closed', async () => {
  const store = new InMemorySecurityStore(), adapter = new GoogleWorkspaceSecurityAdapter(store);
  await assert.rejects(adapter.recordLoginAttempt('test', NaN), /INVALID_THROTTLE/);
  await store.saveLoginLimit({key: 'test', attempts: 1, reset_at: 'not-a-date'});
  await assert.rejects(adapter.recordLoginAttempt('test', 1), /INVALID_THROTTLE/);
  store.consumeLoginAttempt = async () => { throw new Error('unavailable'); };
  await assert.rejects(adapter.recordLoginAttempt('test', 1), /unavailable/);
});
