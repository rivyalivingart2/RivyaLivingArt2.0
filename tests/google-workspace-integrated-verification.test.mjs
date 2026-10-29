import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {CANONICAL_SEVEN_VIEWPORTS, INTEGRATED_REQUIREMENTS, RESPONSIVE_REQUIREMENTS, runFullIntegratedVerification, verifySevenWidthResponsiveMatrix} from '../src/lib/google-workspace/integrated-verification.ts';
import {verifyProductionAcceptance, PRODUCTION_ACCEPTANCE_REQUIREMENTS} from '../src/lib/google-workspace/production-acceptance.ts';
import {getStorageProvider} from '../src/lib/google-workspace/provider-switch.ts';
const now = new Date('2026-10-28T10:00:00Z');
const context = {revision: 'a'.repeat(40), deployment: 'isolated-test-deployment', environment: 'isolated'};
// Synthetic receipts exercise the evaluator only; this file is not provider acceptance.
const receipts = requirements => requirements.map(({id, kind}) => ({...context, checkId: id, kind, status: 'passed',
  observedAt: now.toISOString(), evidenceSha256: createHash('sha256').update(id).digest('hex'), networkRequests: 1}));

test('No network, missing providers and environment flags cannot pass integrated or release acceptance', async () => {
  const before = getStorageProvider();
  const integrated = await runFullIntegratedVerification();
  assert.equal(integrated.allChecksPassed, false);
  assert.equal(integrated.networkRequestsPerformed, 0);
  assert.equal(integrated.responsiveMatrix.viewportsTested, 0);
  assert.equal(integrated.unresolvedIssues.length, INTEGRATED_REQUIREMENTS.length);
  const production = verifyProductionAcceptance({RIVYA_STORAGE_PROVIDER: 'google-workspace', RIVYA_CUTOVER_AUTHORIZED: 'true'});
  assert.equal(production.verdict, 'NOT_READY');
  assert.equal(production.releaseAuthorized, false);
  assert.equal(getStorageProvider(), before);
});

test('Responsive coverage requires all five surfaces at each of the seven requested widths', () => {
  assert.deepEqual(CANONICAL_SEVEN_VIEWPORTS.map(v => v.width), [320, 512, 768, 992, 1200, 1440, 1920]);
  const data = receipts(RESPONSIVE_REQUIREMENTS);
  assert.equal(verifySevenWidthResponsiveMatrix(context, data, now).allViewportsPass, true);
  const partial = verifySevenWidthResponsiveMatrix(context, data.filter(r => r.checkId !== 'responsive:studio:320'), now);
  assert.equal(partial.allViewportsPass, false);
  assert.equal(partial.viewportsTested, 6);
});

test('Wrong revision, deployment, environment, stale, future, simulated, failed and zero-request evidence cannot pass', async () => {
  const data = receipts(INTEGRATED_REQUIREMENTS);
  assert.equal((await runFullIntegratedVerification(context, data, now)).allChecksPassed, true);
  for (const mutation of [
    {revision: 'b'.repeat(40)}, {deployment: 'other'}, {environment: 'production'},
    {observedAt: '2026-10-26T00:00:00Z'}, {observedAt: '2026-10-29T00:00:00Z'},
    {observedAt: 'invalid'}, {kind: 'simulation'}, {status: 'failed'}, {status: 'blocked'},
    {networkRequests: 0}, {networkRequests: NaN}, {evidenceSha256: ''},
  ]) {
    const altered = data.map((r, i) => i === 0 ? {...r, ...mutation} : r);
    assert.equal((await runFullIntegratedVerification(context, altered, now)).allChecksPassed, false, JSON.stringify(mutation));
  }
  assert.equal((await runFullIntegratedVerification(context, [...data, data[0]], now)).allChecksPassed, false);
});

test('Complete isolated receipts do not establish production readiness or authorize a release', () => {
  const result = verifyProductionAcceptance({}, {context, receipts: receipts(PRODUCTION_ACCEPTANCE_REQUIREMENTS), now});
  assert.equal(result.allChecksPassed, true);
  assert.equal(result.verdict, 'NOT_READY');
  assert.equal(result.releaseAuthorized, false);
  const production = {...context, environment: 'production'};
  const reviewed = verifyProductionAcceptance({}, {context: production, receipts: receipts(PRODUCTION_ACCEPTANCE_REQUIREMENTS).map(r => ({...r, environment: 'production'})), now});
  assert.equal(reviewed.verdict, 'EVIDENCE_COMPLETE_PENDING_RELEASE_REVIEW');
  assert.equal(reviewed.releaseAuthorized, false);
});
