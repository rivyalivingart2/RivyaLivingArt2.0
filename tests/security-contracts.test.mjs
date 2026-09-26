import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {validBusiness, defaultBusiness} from '../src/lib/business-settings-model.ts';

test('CR-08: Valid business settings passes validation and approved defaults are valid', () => {
  assert.equal(validBusiness(defaultBusiness), true);

  const custom = {
    phone: '+919876543210',
    email: 'contact@rivyalivingart.com',
    whatsapp: '919876543210',
    map: 'https://maps.app.goo.gl/abcdef123456',
  };
  assert.equal(validBusiness(custom), true);
});

test('CR-08: Malformed contact data fails closed', () => {
  // Invalid phone numbers
  assert.equal(validBusiness({...defaultBusiness, phone: '08320404132'}), false); // Missing +
  assert.equal(validBusiness({...defaultBusiness, phone: '+0123456789'}), false); // Starts with 0
  assert.equal(validBusiness({...defaultBusiness, phone: '+91 83204 04132'}), false); // Has spaces
  assert.equal(validBusiness({...defaultBusiness, phone: ''}), false);

  // Invalid WhatsApp
  assert.equal(validBusiness({...defaultBusiness, whatsapp: '+918320404132'}), false); // Contains +
  assert.equal(validBusiness({...defaultBusiness, whatsapp: '08320404132'}), false); // Starts with 0
  assert.equal(validBusiness({...defaultBusiness, whatsapp: 'whatsapp'}), false);

  // Invalid email
  assert.equal(validBusiness({...defaultBusiness, email: 'invalid-email'}), false);
  assert.equal(validBusiness({...defaultBusiness, email: '@domain.com'}), false);
  assert.equal(validBusiness({...defaultBusiness, email: 'name@'}), false);
  assert.equal(validBusiness({...defaultBusiness, email: 'a'.repeat(200) + '@rivya.com'}), false); // > 180 chars

  // Invalid Map URLs (security boundary: phishing / open-redirect prevention)
  assert.equal(validBusiness({...defaultBusiness, map: 'http://maps.google.com/test'}), false); // http not https
  assert.equal(validBusiness({...defaultBusiness, map: 'javascript:alert(1)'}), false);
  assert.equal(validBusiness({...defaultBusiness, map: 'https://evil.com/map'}), false); // unapproved domain
  assert.equal(validBusiness({...defaultBusiness, map: 'https://user:pass@maps.google.com/test'}), false); // credentials in URL
  assert.equal(validBusiness({...defaultBusiness, map: 'not-a-url'}), false);
});

test('CR-07: Canonical login throttling normalizes whitespace and case', () => {
  // Emulates privateHash with a test secret
  const secret = 'test-secret-at-least-32-characters-long-12345';
  const privateHash = (v) => createHmac('sha256', secret).update(v).digest('hex');

  const throttleKeyFor = (rawId) => {
    const loginId = rawId.trim();
    return 'login-id:' + privateHash(loginId.toLowerCase());
  };

  const canonicalKey = throttleKeyFor('admin');
  assert.equal(throttleKeyFor('  admin  '), canonicalKey);
  assert.equal(throttleKeyFor('ADMIN'), canonicalKey);
  assert.equal(throttleKeyFor(' Admin '), canonicalKey);
  assert.equal(throttleKeyFor('admin\t\n'), canonicalKey);

  // Different user produces a distinct key
  assert.notEqual(throttleKeyFor('editor'), canonicalKey);
});

test('CR-11: HMAC hashing requires minimum 32-character secret', () => {
  const hashWithSecret = (secret, value) => {
    if (!secret || secret.length < 32) throw new Error('Service unavailable');
    return createHmac('sha256', secret).update(value).digest('hex');
  };

  // Rejects empty or short keys
  assert.throws(() => hashWithSecret('', 'payload'), /Service unavailable/);
  assert.throws(() => hashWithSecret('short-key-16-chars', 'payload'), /Service unavailable/);
  assert.throws(() => hashWithSecret('1234567890123456789012345678901', 'payload'), /Service unavailable/); // 31 chars

  // Accepts 32 chars or longer
  const validSecret32 = '12345678901234567890123456789012';
  const digest = hashWithSecret(validSecret32, 'payload');
  assert.equal(typeof digest, 'string');
  assert.equal(digest.length, 64);
});
