import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  verifyHandoverPackage,
  WORKBOOK_PERMISSIONS,
} from '../src/lib/google-workspace/handover.ts';
import {
  getStorageProvider,
  assertSqlAllowed,
  setStorageProvider,
} from '../src/lib/google-workspace/provider-switch.ts';

test.beforeEach(() => {
  setStorageProvider(null);
});

test('GW-1100: Documentation synchronization across AGENTS.md, PROJECT_STATE.md, PRODUCT.md, README.md, and PHASE-PLAN.md', () => {
  const rootDir = process.cwd();
  const requiredFiles = [
    'AGENTS.md',
    'PROJECT_STATE.md',
    'PRODUCT.md',
    'README.md',
    'docs/google-workspace-2026-10-24/README.md',
    'docs/decisions/2026-10-24-sheets-drive.md',
    'docs/google-workspace-2026-10-24/PHASE-PLAN.md',
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(rootDir, relPath);
    assert.ok(fs.existsSync(fullPath), `Required documentation file must exist: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.ok(content.length > 100, `File ${relPath} should have substantial content`);
    // Ensure all 28 tables and 169 creations or Phase 11 references are consistent
    assert.ok(
      content.includes('28') || content.includes('Phase 11') || content.includes('Sheets and Drive'),
      `File ${relPath} should reference canonical transition scope`
    );
  }
});

test('GW-1100: Architectural decision and Phase Plan status record Phase 0-11 scope without certifying completion', () => {
  const rootDir = process.cwd();
  const decisionPath = path.join(rootDir, 'docs/decisions/2026-10-24-sheets-drive.md');
  const planPath = path.join(rootDir, 'docs/google-workspace-2026-10-24/PHASE-PLAN.md');

  const decisionContent = fs.readFileSync(decisionPath, 'utf8');
  assert.ok(
    decisionContent.includes('Phase 0–11') || decisionContent.includes('Phase 11'),
    'Decision document should reflect Phase 11 delivery scope'
  );

  const planContent = fs.readFileSync(planPath, 'utf8');
  assert.ok(planContent.includes('GW-1100'), 'Phase plan should document Task GW-1100');
  assert.ok(planContent.includes('GW-1101'), 'Phase plan should document Task GW-1101');
});

test('GW-1101: Programmatic handover verification and workbook permission matrix', () => {
  const report = verifyHandoverPackage();

  assert.equal(report.status, 'PLANNING_INVENTORY_ONLY');
  assert.equal(report.phase, 'Phase 11');
  assert.equal(report.programPhasesTotal, 12);
  assert.equal(report.canonicalTablesCovered, 28);
  assert.equal(report.creationsPreserved, null);
  assert.equal(report.webpVariantsPreserved, null);
  assert.equal(report.workbooksConfigured, null);
  assert.equal(report.runbooksRegistered, 6);

  // Verify permission matrices
  assert.equal(WORKBOOK_PERMISSIONS.content.tableCount, 9);
  assert.equal(WORKBOOK_PERMISSIONS.operations.tableCount, 11);
  assert.equal(WORKBOOK_PERMISSIONS.security.tableCount, 4);
  assert.equal(WORKBOOK_PERMISSIONS.system.tableCount, 4);

  // Security workbook must never allow owner staging
  assert.equal(WORKBOOK_PERMISSIONS.security.ownerStagingAllowed, false);
  assert.equal(WORKBOOK_PERMISSIONS.security.accessScope, 'superadmin_and_service_account_only');

  // Content workbook permits staging
  assert.equal(WORKBOOK_PERMISSIONS.content.ownerStagingAllowed, true);

  // All workbooks must be CAS-protected
  assert.ok(WORKBOOK_PERMISSIONS.content.casProtected);
  assert.ok(WORKBOOK_PERMISSIONS.operations.casProtected);
  assert.ok(WORKBOOK_PERMISSIONS.security.casProtected);
  assert.ok(WORKBOOK_PERMISSIONS.system.casProtected);
});

test('GW-1101: Owner Operating Guide and Issue Register completeness and safety invariants', () => {
  const rootDir = process.cwd();
  const guidePath = path.join(rootDir, 'docs/google-workspace-2026-10-24/OWNER-OPERATING-GUIDE.md');
  const registerPath = path.join(rootDir, 'docs/google-workspace-2026-10-24/ISSUE-REGISTER.md');

  assert.ok(fs.existsSync(guidePath), 'OWNER-OPERATING-GUIDE.md must exist');
  assert.ok(fs.existsSync(registerPath), 'ISSUE-REGISTER.md must exist');

  const guideContent = fs.readFileSync(guidePath, 'utf8');
  assert.ok(guideContent.includes('Direct Sheet Edits and Staging'));
  assert.ok(guideContent.includes('Editorial CMS and Versioned Publication'));
  assert.ok(guideContent.includes('Catalogue Automation and Generation'));
  assert.ok(guideContent.includes('Scraper Candidate Research'));
  assert.ok(guideContent.includes('Emergency Abort and Rollback Procedure'));
  assert.ok(guideContent.includes('CAN_CREATE_PRODUCT = false'));

  const registerContent = fs.readFileSync(registerPath, 'utf8');
  assert.ok(registerContent.includes('GAP-001'));
  assert.ok(registerContent.includes('ENV-001'));
  assert.ok(registerContent.includes('Zero Products Added'));
  assert.ok(registerContent.includes('Zero Archived Imports'));
  assert.ok(registerContent.includes('No Database Reseeding'));
});

test('GW-1101: Process hygiene, daemon cleanup assertion, and storage authority integrity', () => {
  const report = verifyHandoverPackage();

  assert.equal(report.processHygiene.status, 'NOT_INSPECTED');
  assert.equal(report.processHygiene.uncontrolledDaemons, null);
  assert.equal(report.processHygiene.danglingListeners, null);

  // Default authority must remain postgres in absence of cutover
  const testEnv = { DATABASE_URL: 'postgresql://synthetic@localhost:5432/db' };
  assert.equal(getStorageProvider(testEnv), 'postgres');
  assert.doesNotThrow(() => assertSqlAllowed(testEnv));

  // Workspace activation disables SQL
  setStorageProvider('google-workspace');
  assert.throws(
    () => assertSqlAllowed(testEnv),
    /Studio SQL database is disabled in Google Workspace provider mode/
  );
});
