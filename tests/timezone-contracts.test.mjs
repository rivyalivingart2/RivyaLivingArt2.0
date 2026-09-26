import test from 'node:test';
import assert from 'node:assert/strict';
import {businessDate, businessDayStart, formatBusinessTime} from '../src/lib/business-time.ts';

test('CR-20: IST business dates cross exactly at 18:30:00.000 UTC', () => {
  // One millisecond before midnight IST
  const beforeMidnight = new Date('2026-09-24T18:29:59.999Z');
  assert.equal(businessDate(beforeMidnight), '2026-09-24');

  // Exactly midnight IST (start of 2026-09-25 IST)
  const atMidnight = new Date('2026-09-24T18:30:00.000Z');
  assert.equal(businessDate(atMidnight), '2026-09-25');

  // End of 2026-09-25 IST
  const endOfDay = new Date('2026-09-25T18:29:59.999Z');
  assert.equal(businessDate(endOfDay), '2026-09-25');

  // Start of 2026-09-26 IST
  const nextDay = new Date('2026-09-25T18:30:00.000Z');
  assert.equal(businessDate(nextDay), '2026-09-26');
});

test('CR-20: Year and month rollover in Asia/Kolkata timezone', () => {
  // 31 Dec 23:59:59 IST is 18:29:59 UTC
  assert.equal(businessDate('2026-12-31T18:29:59.999Z'), '2026-12-31');
  // 1 Jan 00:00:00 IST is 18:30:00 UTC
  assert.equal(businessDate('2026-12-31T18:30:00.000Z'), '2027-01-01');

  // Leap year 2024 leap day rollover
  assert.equal(businessDate('2024-02-28T18:30:00.000Z'), '2024-02-29');
  assert.equal(businessDate('2024-02-29T18:29:59.999Z'), '2024-02-29');
  assert.equal(businessDate('2024-02-29T18:30:00.000Z'), '2024-03-01');
});

test('CR-20: Business day start generates exact UTC ISO timestamp for 00:00:00 IST', () => {
  assert.equal(businessDayStart('2026-09-25'), '2026-09-24T18:30:00.000Z');
  assert.equal(businessDayStart('2026-01-01'), '2025-12-31T18:30:00.000Z');

  // Invalid date formats and non-existent calendar days must fail closed
  for (const bad of ['2026-02-29', '2026-02-30', '2026-04-31', '2026-13-01', '2026-00-10', '2026-9-1', 'invalid']) {
    assert.throws(() => businessDayStart(bad), RangeError);
  }
});

test('CR-20: Operations export date filter semantics match Asia/Kolkata calendar day', () => {
  // Emulates the SQL filter in api/studio/operations/route.ts:
  // o.created_at >= (from::date::timestamp AT TIME ZONE 'Asia/Kolkata')
  // o.created_at < ((to::date + 1)::timestamp AT TIME ZONE 'Asia/Kolkata')
  const from = '2026-09-25';
  const to = '2026-09-25';

  const rangeStartUtc = new Date(from + 'T00:00:00+05:30').getTime();
  const nextDay = new Date(new Date(to + 'T00:00:00Z').getTime() + 86400000).toISOString().slice(0, 10);
  const rangeEndUtc = new Date(nextDay + 'T00:00:00+05:30').getTime();

  assert.equal(new Date(rangeStartUtc).toISOString(), '2026-09-24T18:30:00.000Z');
  assert.equal(new Date(rangeEndUtc).toISOString(), '2026-09-25T18:30:00.000Z');

  // Verify inclusion / exclusion
  const check = (iso) => {
    const t = new Date(iso).getTime();
    return t >= rangeStartUtc && t < rangeEndUtc;
  };

  assert.equal(check('2026-09-24T18:29:59.999Z'), false); // Previous day IST
  assert.equal(check('2026-09-24T18:30:00.000Z'), true);  // Exactly midnight IST
  assert.equal(check('2026-09-25T12:00:00.000Z'), true);  // Midday IST
  assert.equal(check('2026-09-25T18:29:59.999Z'), true);  // 23:59:59.999 IST
  assert.equal(check('2026-09-25T18:30:00.000Z'), false); // Next day IST
});

test('CR-20: Business time formatting renders unambiguous IST label', () => {
  const formatted = formatBusinessTime('2026-09-24T18:30:00.000Z');
  assert.match(formatted, /25 Sept(?:ember)? 2026/);
  assert.match(formatted, /12:00\s*(?:am|AM)/);
  assert.match(formatted, /IST/);
});
