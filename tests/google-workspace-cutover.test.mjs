import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cutoverOrchestrator,
} from '../src/lib/google-workspace/cutover-runbook.ts';
import {
  authoritySwitchManager,
} from '../src/lib/google-workspace/authority-switch.ts';
import {
  verifyProductionAcceptance,
} from '../src/lib/google-workspace/production-acceptance.ts';
import {
  setStorageProvider,
  getStorageProvider,
  assertSqlAllowed,
} from '../src/lib/google-workspace/provider-switch.ts';

test.beforeEach(() => {
  authoritySwitchManager.reset();
  cutoverOrchestrator.reset();
  setStorageProvider(null);
});

test('GW-1000: Generate backup/recovery manifest across all 28 canonical tables and 169 creations', () => {
  const manifest = cutoverOrchestrator.generateBackupRecoveryManifest('test-snap-001');

  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.snapshotId, 'test-snap-001');
  assert.equal(manifest.tablesTotal, 28);
  assert.equal(manifest.tables.length, 28);
  assert.ok(manifest.totalRows > 0);

  // Verify all 4 workbooks are accounted for
  assert.ok(manifest.workbooks.content);
  assert.ok(manifest.workbooks.operations);
  assert.ok(manifest.workbooks.security);
  assert.ok(manifest.workbooks.system);

  assert.equal(manifest.workbooks.security.sheetCount, 4);
  assert.equal(manifest.workbooks.content.sheetCount, 9);
  assert.equal(manifest.workbooks.operations.sheetCount, 11);
  assert.equal(manifest.workbooks.system.sheetCount, 4);

  // Verify media assets preservation (169 creations, 507 variants)
  assert.equal(manifest.mediaAssets.creationsCount, 169);
  assert.equal(manifest.mediaAssets.variantsCount, 507);
  assert.match(manifest.mediaAssets.checksumSha256, /^[a-f0-9]{64}$/);
  assert.equal(manifest.status, 'COMPLETE_AND_VERIFIED');
});

test('GW-1000: Write pause protocol, timeout enforcement (< 30s budget), and non-blocking drain', () => {
  // 1. Budget enforcement: > 30s must throw
  assert.throws(
    () => {
      cutoverOrchestrator.acquireWritePause({
        durationSeconds: 45,
        drainTimeoutMs: 5000,
        reason: 'Budget test',
        operator: 'test-admin',
      });
    },
    /exceeds 30s safety budget/
  );

  // 2. Valid acquisition within budget
  const receipt = cutoverOrchestrator.acquireWritePause({
    durationSeconds: 25,
    drainTimeoutMs: 2000,
    reason: 'Planned cutover preparation',
    operator: 'release-lead',
  });

  assert.ok(receipt.lockId.startsWith('wp-lock-'));
  assert.equal(receipt.durationSeconds, 25);
  assert.equal(receipt.inFlightDrained, true);
  assert.equal(cutoverOrchestrator.isWritePaused(), true);

  // 3. Safe release
  const released = cutoverOrchestrator.releaseWritePause(receipt.lockId);
  assert.equal(released, true);
  assert.equal(cutoverOrchestrator.isWritePaused(), false);

  // 4. Final delta sync plan
  const deltaPlan = cutoverOrchestrator.planFinalDeltaSync([
    { table: 'rivya_newsletter_subscribers', id: 'sub-001', rev: 1, data: { email: 'art@rivya.in' } },
    { table: 'rivya_studio_orders', id: 'ord-001', rev: 1, data: { status: 'CONFIRMED' } },
  ]);

  assert.equal(deltaPlan.totalChanges, 2);
  assert.equal(deltaPlan.zeroCanonicalDeletions, true);
  assert.match(deltaPlan.batchSha256, /^[a-f0-9]{64}$/);
});

test('GW-1001: Authority switch state machine, authorization guard, and simulated dry-run validation', () => {
  const prereqs = authoritySwitchManager.validatePrerequisites();
  assert.equal(prereqs.ready, true);
  assert.equal(prereqs.checks.tablesReconciled, true);
  assert.equal(prereqs.checks.mediaAssetsReconciled, true);

  // 1. Unauthenticated attempt -> triggers simulated dry run without mutation
  const dryRunResult = authoritySwitchManager.executeSwitch({
    targetProvider: 'google-workspace',
    operator: 'staging-tester',
    reason: 'Pre-flight dry run validation',
  });

  assert.equal(dryRunResult.status, 'SIMULATED_DRY_RUN');
  assert.equal(dryRunResult.currentAuthority, 'postgres');
  assert.equal(getStorageProvider(), 'postgres');
  assert.ok(dryRunResult.transitionId?.startsWith('dry-run-'));

  // 2. Explicit dryRun flag even with valid token -> stays in simulated mode
  const explicitDryRun = authoritySwitchManager.executeSwitch({
    targetProvider: 'google-workspace',
    authorizationToken: 'cutover-auth-1234567890abcdef1234567890abcdef',
    dryRun: true,
    operator: 'release-engineer',
    reason: 'Operator dry run test',
  });

  assert.equal(explicitDryRun.status, 'SIMULATED_DRY_RUN');
  assert.equal(getStorageProvider(), 'postgres');
});

test('GW-1001: Authorized atomic authority switch execution, audit logging, and emergency rollback', () => {
  const authToken = 'cutover-auth-99887766554433221100aabbccddeeff';

  // 1. Authorized switch
  const switchResult = authoritySwitchManager.executeSwitch({
    targetProvider: 'google-workspace',
    authorizationToken: authToken,
    operator: 'chief-architect',
    reason: 'Production cutover execution',
  });

  assert.equal(switchResult.status, 'AUTHORITY_SWITCHED');
  assert.equal(switchResult.currentAuthority, 'google-workspace');
  assert.equal(getStorageProvider(), 'google-workspace');

  // Verify SQL queries are disabled under Google Workspace
  assert.throws(
    () => {
      assertSqlAllowed();
    },
    /disabled in Google Workspace provider mode/
  );

  // 2. Capture post-cutover write into recovery ledger
  const auditRecord = cutoverOrchestrator.capturePostCutoverWrite({
    table: 'rivya_inquiries',
    operation: 'insert',
    recordId: 'inq-cutover-live-1',
    payload: { customer: 'Private Collector', inquiryType: 'BESPOKE' },
    actor: 'web-storefront',
  });

  assert.equal(auditRecord.sequence, 1);
  assert.equal(auditRecord.table, 'rivya_inquiries');
  assert.match(auditRecord.signature, /^[a-f0-9]{64}$/);
  assert.equal(cutoverOrchestrator.getPostCutoverLedger().length, 1);

  // 3. Emergency Rollback Procedure
  const rollbackResult = authoritySwitchManager.emergencyRollback(
    'Simulated emergency rollback drill',
    'security-incident-lead'
  );

  assert.equal(rollbackResult.status, 'ROLLED_BACK');
  assert.equal(rollbackResult.restoredAuthority, 'postgres');
  assert.equal(getStorageProvider(), 'postgres');
  assert.equal(cutoverOrchestrator.getStage(), 'ROLLED_BACK');
});

test('GW-1002: Read-only production acceptance inspection, SQL disablement, and recovery readiness', () => {
  // Ensure provider is set to google-workspace for acceptance check
  setStorageProvider('google-workspace');

  const report = verifyProductionAcceptance();

  assert.equal(report.schemaVersion, 1);
  assert.equal(report.provider, 'google-workspace');
  assert.equal(report.sqlDisabled, true);

  // Public storefront invariants
  assert.equal(report.publicStorefront.creationsAccessible, 169);
  assert.equal(report.publicStorefront.variantsAccessible, 507);
  assert.equal(report.publicStorefront.signaturePreserved, true);
  assert.equal(report.publicStorefront.footerPreserved, true);
  assert.equal(report.publicStorefront.zeroVisualDrift, true);

  // Studio security invariants
  assert.equal(report.studioSecurity.loginErgonomicsPreserved, true);
  assert.equal(report.studioSecurity.rateLimitsActive, true);
  assert.equal(report.studioSecurity.sessionsScoped, true);

  // Recovery readiness
  assert.equal(report.recoveryReadiness.postCutoverLedgerArmed, true);
  assert.equal(report.recoveryReadiness.backupManifestVerified, true);
  assert.equal(report.recoveryReadiness.rollbackPathTested, true);

  assert.equal(report.verdict, 'READY_FOR_RELEASE');
});
