import test from 'node:test';
import assert from 'node:assert/strict';
import {cutoverOrchestrator} from '../src/lib/google-workspace/cutover-runbook.ts';
import {authoritySwitchManager} from '../src/lib/google-workspace/authority-switch.ts';
import {verifyProductionAcceptance} from '../src/lib/google-workspace/production-acceptance.ts';
import {setStorageProvider, getStorageProvider} from '../src/lib/google-workspace/provider-switch.ts';

test.beforeEach(() => { authoritySwitchManager.reset(); setStorageProvider(null); });

test('Schema inventory does not manufacture backup rows, payload hashes or verified media bytes', () => {
  const manifest = cutoverOrchestrator.generateBackupRecoveryManifest('test-snap');
  assert.equal(manifest.tablesTotal, 28);
  assert.equal(manifest.totalRows, null);
  assert.ok(manifest.tables.every(t => t.rowCount === null && t.payloadSha256 === null));
  assert.equal(manifest.status, 'INVENTORY_ONLY_NOT_A_BACKUP');
  assert.equal(manifest.mediaAssets.bytesVerified, false);
  assert.equal(authoritySwitchManager.validatePrerequisites(manifest).ready, false);
});

test('Retained write-pause and ledger model is explicitly a simulation', () => {
  assert.throws(() => cutoverOrchestrator.acquireWritePause({durationSeconds: 45, operator: 'test', reason: 'test', drainTimeoutMs: 1}), /30s/);
  const pause = cutoverOrchestrator.acquireWritePause({durationSeconds: 20, operator: 'test', reason: 'test', drainTimeoutMs: 1});
  assert.equal(pause.mode, 'simulation');
  assert.equal(pause.inFlightDrained, false);
  assert.equal(authoritySwitchManager.getState().isWritePaused, false);
  const event = cutoverOrchestrator.capturePostCutoverWrite({table: 'test_only', recordId: 'synthetic', operation: 'insert', payload: {}, actor: 'test'});
  assert.equal(event.mode, 'simulation');
});

test('Arbitrary token prefixes and environment booleans cannot execute a cutover', () => {
  for (const env of [{}, {RIVYA_CUTOVER_AUTHORIZED: 'true'}]) {
    assert.equal(authoritySwitchManager.isAuthorized('cutover-auth-' + 'a'.repeat(40), env), false);
    assert.equal(authoritySwitchManager.executeSwitch({targetProvider: 'google-workspace', authorizationToken: 'cutover-auth-' + 'a'.repeat(40), operator: 'test', reason: 'test'}, env).status, 'REJECTED');
  }
  assert.equal(getStorageProvider(), 'postgres');
  assert.equal(authoritySwitchManager.executeSwitch({targetProvider: 'google-workspace', dryRun: true, operator: 'test', reason: 'test'}).status, 'SIMULATED_DRY_RUN');
  assert.equal(getStorageProvider(), 'postgres');
});

test('Unimplemented rollback must not silently restore a stale SQL authority', () => {
  setStorageProvider('google-workspace');
  const result = authoritySwitchManager.emergencyRollback('test', 'test');
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.restoredAuthority, null);
  assert.equal(getStorageProvider(), 'google-workspace');
  setStorageProvider(null);
});

test('Production acceptance is read only and never writes a synthetic recovery event', () => {
  const before = cutoverOrchestrator.getPostCutoverLedger();
  const report = verifyProductionAcceptance();
  assert.equal(report.verdict, 'NOT_READY');
  assert.deepEqual(cutoverOrchestrator.getPostCutoverLedger(), before);
});
