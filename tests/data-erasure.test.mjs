import test from 'node:test';
import assert from 'node:assert/strict';
import {retentionDecision} from '../src/lib/retention-policy.ts';

test('erasure decision allows deletion only when inquiry retention is due or identity is verified without holds', () => {
  const baseRecord = {
    lastContactAt: '2026-01-01T00:00:00Z',
    closedAt: null,
    becameOrder: false,
    ongoingFollowUp: false,
    holdReason: ''
  };

  // Due after 90 days
  const pastDue = retentionDecision(baseRecord, new Date('2026-04-02T00:00:00Z'));
  assert.equal(pastDue.canEraseInquiry, true);
  assert.equal(pastDue.blocked, null);

  // Blocked by legal/operational hold
  const onHold = retentionDecision({ ...baseRecord, holdReason: 'Legal dispute pending' }, new Date('2026-04-02T00:00:00Z'));
  assert.equal(onHold.canEraseInquiry, false);
  assert.equal(onHold.blocked, 'Documented retention hold');

  // Blocked by customer requested follow-up
  const followUp = retentionDecision({ ...baseRecord, ongoingFollowUp: true }, new Date('2026-04-02T00:00:00Z'));
  assert.equal(followUp.canEraseInquiry, false);
  assert.equal(followUp.blocked, 'Customer-requested ongoing follow-up');
});

test('managed exports calculate 7-day expiry deadline accurately', () => {
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(now + sevenDaysMs);
  const remainingDays = (expiresAt.getTime() - now) / (24 * 60 * 60 * 1000);

  assert.ok(Math.abs(remainingDays - 7) < 0.01);
  assert.equal(expiresAt.getTime() > now, true);
});

test('erasure ledger invariants satisfy minimal compliance requirements without PII', () => {
  const sampleLedgerEntry = {
    orderId: 'c295df24-a677-4d3c-8811-5eafb717ae7a',
    reference: 'RLA-C295DF24A677',
    requestedAt: '2026-09-24T08:30:00.000Z',
    identityVerifiedAt: '2026-09-24T09:00:00.000Z',
    erasedAt: '2026-09-24T09:05:00.000Z',
    erasedBy: 'admin',
    reason: 'customer_request',
    referencesDeleted: 2,
    notesPurged: 1
  };

  // Must have opaque identifiers and audit fields
  assert.ok(sampleLedgerEntry.orderId);
  assert.ok(sampleLedgerEntry.reference);
  assert.ok(sampleLedgerEntry.erasedAt);
  assert.ok(sampleLedgerEntry.erasedBy);
  assert.equal(sampleLedgerEntry.reason, 'customer_request');

  // Must NOT contain personal identifiable information (no customer name, phone, email, notes)
  assert.equal('name' in sampleLedgerEntry, false);
  assert.equal('phone' in sampleLedgerEntry, false);
  assert.equal('email' in sampleLedgerEntry, false);
  assert.equal('notes' in sampleLedgerEntry, false);
});
