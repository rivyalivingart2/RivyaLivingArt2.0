import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CANONICAL_SEVEN_VIEWPORTS,
  executeCrossModuleJourney,
  verifySecurityAndFailureResilience,
  verifySevenWidthResponsiveMatrix,
  proveProviderIndependence,
  runFullIntegratedVerification,
} from '../src/lib/google-workspace/integrated-verification.ts';

test('GW-900: Complete cross-module integration lifecycle journey', async () => {
  const result = await executeCrossModuleJourney();
  assert.equal(result.journeyId, 'GW-JOURNEY-001');
  assert.equal(result.success, true);
  assert.equal(result.checkpointsPassed, 6);
  assert.equal(result.totalCheckpoints, 6);

  // Validate cross-module details
  assert.ok(result.details.orderId);
  assert.ok(result.details.inquiryId);
  assert.ok(String(result.details.snapshotId).startsWith('cat-snap-'));
  assert.ok(String(result.details.slidesDriveId).startsWith('1slides_'));
  assert.ok(String(result.details.pdfDriveId).startsWith('1pdf_'));
  assert.ok(/^[a-f0-9]{64}$/.test(String(result.details.activePublicationHash)));
});

test('GW-901: Optimistic locking, response loss deduplication, and payload quarantine', async () => {
  const security = await verifySecurityAndFailureResilience();

  assert.equal(
    security.optimisticLockingVerified,
    true,
    'Optimistic locking must reject stale version updates'
  );
  assert.equal(
    security.responseLossDeduplicationVerified,
    true,
    'Response loss replay must deduplicate observations without duplicate commits'
  );
  assert.equal(
    security.malformedPayloadQuarantineVerified,
    true,
    'Corrupted payloads must be rejected safely'
  );
});

test('GW-901: Authentication security invariants, session revocation, and rate limiting', async () => {
  const security = await verifySecurityAndFailureResilience();

  assert.equal(
    security.sessionExpiryVerified,
    true,
    'Expired session tokens must fail validation'
  );
  assert.equal(
    security.credentialRevocationVerified,
    true,
    'Revoking credentials must invalidate active sessions'
  );
  assert.equal(
    security.rateLimitingVerified,
    true,
    'Excessive requests must trigger rate limiting throttling'
  );
  assert.equal(
    security.zeroSilentAuthElevation,
    true,
    'Unauthenticated requests must be denied without silent auth elevation'
  );
});

test('GW-902: Seven-width responsive viewport matrix and layout geometry', () => {
  assert.equal(CANONICAL_SEVEN_VIEWPORTS.length, 7);
  assert.deepEqual(
    CANONICAL_SEVEN_VIEWPORTS.map((v) => v.width),
    [375, 540, 768, 800, 1080, 1440, 1920]
  );

  const matrix = verifySevenWidthResponsiveMatrix();
  assert.equal(matrix.viewportsTested, 7);
  assert.equal(matrix.allViewportsPass, true);

  for (const vpResult of matrix.results) {
    assert.equal(vpResult.validHorizontalFit, true, `${vpResult.name} must fit viewport horizontally`);
    assert.equal(vpResult.touchTargetsCompliant, true, `${vpResult.name} must comply with touch target guidelines`);
    assert.equal(vpResult.textWrappingCompliant, true, `${vpResult.name} must wrap text safely without overflow`);
  }
});

test('GW-902: Complete provider independence proof with SQL disabled', async () => {
  const proof = await proveProviderIndependence();

  assert.equal(proof.sqlDisabled, true);
  assert.equal(proof.googleWorkspaceActive, true);
  assert.equal(proof.zeroSqlQueriesAttempted, true);
  assert.equal(proof.zeroFallbackToDeletedDb, true);
  assert.equal(proof.criticalFlowsOperationalWithoutSql, true);
  assert.equal(proof.simulatedOperationsPassed, 3);

  // Full integration verification run
  const report = await runFullIntegratedVerification('2847189');
  assert.equal(report.candidateRevision, '2847189');
  assert.equal(report.allChecksPassed, true);
  assert.equal(report.unresolvedIssues.length, 0);
  assert.equal(report.journeys.length, 1);
  assert.equal(report.journeys[0].success, true);
});
