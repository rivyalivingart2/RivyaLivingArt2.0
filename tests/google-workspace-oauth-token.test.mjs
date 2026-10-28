import test from 'node:test';
import assert from 'node:assert/strict';
import {createGoogleOAuthTokenProvider} from '../src/lib/google-workspace/oauth-token-provider.ts';

// Emulated HTTP responses and non-working fixture secrets; no provider evidence.
const config = {clientId: 'fixture-client', clientSecret: 'fixture-secret&+', refreshToken: 'fixture-refresh/+='};
const signal = () => new AbortController().signal;
const json = (value, status = 200) => new Response(JSON.stringify(value), {status, headers: {'content-type': 'application/json'}});
const good = token => json({access_token: token, token_type: 'Bearer', expires_in: 3600});

test('Concurrent callers share renewal; cache expires early and a cold process renews independently', async () => {
  let clock = 0, calls = 0;
  const fetch = async (url, options) => {
    calls++;
    assert.equal(url, 'https://oauth2.googleapis.com/token');
    assert.equal(options.redirect, 'manual');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store');
    const body = new URLSearchParams(options.body);
    assert.equal(body.get('refresh_token'), config.refreshToken);
    assert.equal(body.get('client_secret'), config.clientSecret);
    assert.equal(body.has('scope'), false);
    return good('fixture-access-' + calls);
  };
  const provider = createGoogleOAuthTokenProvider(config, {fetch, clock: () => clock});
  assert.deepEqual(await Promise.all(Array.from({length: 8}, () => provider.token(signal()))), Array(8).fill('fixture-access-1'));
  assert.equal(calls, 1);
  clock = 3_539_999; assert.equal(await provider.token(signal()), 'fixture-access-1');
  clock = 3_540_000; assert.equal(await provider.token(signal()), 'fixture-access-2');
  const independent = createGoogleOAuthTokenProvider(config, {fetch, clock: () => clock});
  assert.equal(await independent.token(signal()), 'fixture-access-3');
  provider.invalidate(); assert.equal(await provider.token(signal()), 'fixture-access-4');
});

test('Revoked authority denies renewal without leaking the provider body or returning an expired token', async () => {
  let clock = 0, calls = 0;
  const provider = createGoogleOAuthTokenProvider(config, {clock: () => clock, fetch: async () => ++calls === 1 ? good('fixture-access') : json({error: 'invalid_grant', error_description: config.refreshToken}, 400)});
  await provider.token(signal()); clock = 4_000_000;
  await assert.rejects(provider.token(signal()), error => error.code === 'reauthorization-required' && !error.message.includes(config.refreshToken));
  await assert.rejects(provider.token(signal()), {code: 'reauthorization-required'});
  assert.equal(calls, 2); assert.equal(provider.status().reauthorizationRequired, true);
});

test('Cancellation of one caller leaves another renewal intact; a transport ignoring abort is bounded', async () => {
  let release;
  const provider = createGoogleOAuthTokenProvider(config, {fetch: () => new Promise(resolve => {release = resolve;})});
  const cancelled = new AbortController();
  const first = provider.token(cancelled.signal); const second = provider.token(signal());
  const denied = assert.rejects(first, {code: 'aborted'});
  await Promise.resolve(); cancelled.abort(); release(good('fixture-shared'));
  await denied; assert.equal(await second, 'fixture-shared');
  const stalled = createGoogleOAuthTokenProvider({...config, timeoutMs: 20}, {fetch: () => new Promise(() => {})});
  await assert.rejects(stalled.token(signal()), {code: 'timeout'});
});

test('Redirects, oversized or malformed responses, rotation and bad expiry fail closed', async () => {
  for (const response of [new Response(null, {status: 302, headers: {location: 'https://example.invalid/'}}), json({access_token: 'x'.repeat(33_000)}), json({access_token: 'fixture', token_type: 'Basic', expires_in: 3600}), json({access_token: 'fixture', token_type: 'Bearer', expires_in: 0}), json({access_token: 'fixture', token_type: 'Bearer', expires_in: 3600, refresh_token: 'changed-fixture-refresh'})]) {
    const provider = createGoogleOAuthTokenProvider(config, {fetch: async () => response});
    await assert.rejects(provider.token(signal()), error => ['invalid-response','reauthorization-required'].includes(error.code));
  }
  const networkFailure = createGoogleOAuthTokenProvider(config, {fetch: async () => {throw Error(config.clientSecret);}});
  await assert.rejects(networkFailure.token(signal()), error => error.code === 'unavailable' && !error.message.includes(config.clientSecret));
});
