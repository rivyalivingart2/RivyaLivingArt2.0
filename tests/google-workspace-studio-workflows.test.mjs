import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  studioModules,
  studioNavigationModules,
  studioModule,
  studioRoute,
  studioChildHref,
  studioModulesByWorkflow,
  studioActiveModules,
} from '../src/lib/studio-modules.ts';
import {studioDestinations} from '../src/lib/studio-work-queue.ts';

test('GW-500: All 37 Studio modules are classified by workflow and status', () => {
  assert.equal(studioModules.length, 37);

  const validWorkflows = new Set(['operations', 'catalogue', 'editorial', 'presentation', 'governance']);
  const validStatuses = new Set(['active', 'guarded', 'status-only']);

  for (const mod of studioModules) {
    assert.ok(mod.key, `Module must have a key`);
    assert.ok(mod.label, `Module ${mod.key} must have a label`);
    assert.ok(validWorkflows.has(mod.workflow), `Module ${mod.key} has invalid workflow: ${mod.workflow}`);
    assert.ok(validStatuses.has(mod.status), `Module ${mod.key} has invalid status: ${mod.status}`);
  }

  // Check specific workflow groupings
  const operationsModules = studioModulesByWorkflow('operations');
  assert.ok(operationsModules.some(m => m.key === 'inquiries'));
  assert.ok(operationsModules.some(m => m.key === 'overview'));
  assert.ok(operationsModules.some(m => m.key === 'follow-ups'));
  assert.ok(operationsModules.some(m => m.key === 'subscribers'));

  const editorialModules = studioModulesByWorkflow('editorial');
  assert.ok(editorialModules.some(m => m.key === 'journal'));
  assert.ok(editorialModules.some(m => m.key === 'portfolio'));
  assert.ok(editorialModules.some(m => m.key === 'testimonials'));

  const catalogueModules = studioModulesByWorkflow('catalogue');
  assert.ok(catalogueModules.some(m => m.key === 'products'));
  assert.ok(catalogueModules.some(m => m.key === 'categories'));
  assert.ok(catalogueModules.some(m => m.key === 'media'));

  const activeModules = studioActiveModules();
  assert.ok(activeModules.length >= 28, 'At least 28 everyday modules must be active');
});

test('GW-500: Navigation modules correctly exclude status-only import tool', () => {
  assert.equal(studioNavigationModules.length, 36);
  assert.equal(studioNavigationModules.some(m => m.key === 'import'), false);

  // But import remains registered for guarded bookmark resolution
  const importModule = studioModule('import');
  assert.ok(importModule);
  assert.equal(importModule.status, 'status-only');
  assert.equal(importModule.adminOnly, true);
});

test('GW-501: Route admission, role scoping and child href resolution', () => {
  // Admin-only modules
  const adminOnlyKeys = studioModules.filter(m => m.adminOnly).map(m => m.key);
  assert.ok(adminOnlyKeys.includes('staff'));
  assert.ok(adminOnlyKeys.includes('settings'));
  assert.ok(adminOnlyKeys.includes('site-settings'));
  assert.ok(adminOnlyKeys.includes('subscribers'));
  assert.ok(adminOnlyKeys.includes('import'));
  assert.ok(adminOnlyKeys.includes('exports'));

  // Destinations for non-admin editors never include adminOnly modules
  const editorDestinations = studioDestinations(false);
  for (const dest of editorDestinations) {
    assert.equal(dest.adminOnly, false, `Editor destination should not be adminOnly: ${dest.key}`);
  }

  // Route admission via studioRoute
  assert.equal(studioRoute(['products'])?.key, 'products');
  assert.equal(studioRoute(['nonexistent']), undefined);

  // Child href resolution for supported entities
  assert.equal(studioChildHref(['inquiries', 'new']), '/studio/inquiries?create=1');
  assert.equal(studioChildHref(['products', 'DP101']), '/studio/products?record=DP101');
  assert.equal(studioChildHref(['journal', 'article-1']), '/studio/journal?record=article-1');

  // Unsupported entities or path traversals return null
  assert.equal(studioChildHref(['overview', 'sub']), null);
  assert.equal(studioChildHref(['products', '../escape']), null);
  assert.equal(studioChildHref(['inquiries', 'too/deep/path']), null);
});

test('GW-501: Workflow ledger CSV matches registered module definitions', () => {
  const csvContent = readFileSync(
    new URL('../docs/google-workspace-2026-10-24/studio-workflow-ledger.csv', import.meta.url),
    'utf8'
  );
  const lines = csvContent.trim().split('\n').slice(1);
  assert.equal(lines.length, 37, 'Ledger must have exactly 37 module rows');

  const ledgerKeys = lines.map(line => line.split(',')[0].replace(/"/g, ''));
  for (const mod of studioModules) {
    assert.ok(ledgerKeys.includes(mod.key), `Ledger missing entry for module ${mod.key}`);
  }
});

test('GW-502: Responsive breakpoints and style isolation in workspace.module.css', () => {
  const css = readFileSync(
    new URL('../src/components/studio/workspace.module.css', import.meta.url),
    'utf8'
  );

  // Check required breakpoint coverage
  assert.match(css, /@media\s*\(max-width:\s*(?:1080px|800px|540px)\)/, 'Responsive media queries must be defined');

  // Check reduced-motion compliance
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'Prefers-reduced-motion must be respected');

  // Check tabular numbers for numeric alignment
  assert.match(css, /font-family:\s*var\(--font-data\)|tabular-nums/, 'Data font or tabular numbers must be specified');

  // Check color-scheme dark
  assert.match(css, /color-scheme:\s*dark/, 'Dark color scheme must be explicitly defined');
});
