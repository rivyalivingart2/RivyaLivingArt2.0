import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {canonicalArtifactJson} from '../src/lib/google-workspace/record-codec.ts';
import {createControlledWriter} from '../src/lib/google-workspace/controlled-writer.ts';
import {createTestWriterProvider, literalCell} from './helpers/google-workspace-writer-provider.mjs';
import {WORKBOOK_SPECS, DRIVE_FOLDER_SPECS, TAB_SPECS, isolatedAppsScriptManifest, readyControlCell} from '../tools/google-workspace/isolated-setup.ts';
import {auditExistingGoogleSandbox, inspectExistingWorkbook, validateExistingSandboxBaseline} from '../tools/google-workspace/audit-existing.ts';

// Unit-only metadata and RAM snapshots; no Google access, private registry or
// business records. A successful test is not a live Google audit.
const identity = 'owner@rivya-acceptance.dev', token = 'unit-only.private-token';
function registration() {
  return {schemaVersion: 1, environment: 'isolated', ownerEmail: identity, runtimePrincipalEmail: identity,
    writer: {scriptId: 'registered_script_2468', deploymentId: 'registered_deployment_2468', versionNumber: 1,
      endpoint: 'https://script.google.com/macros/s/registered_deployment_2468/exec', keyId: 'acceptance_v1', executionIdentityEmail: identity},
    workbooks: Object.fromEntries(Object.entries(WORKBOOK_SPECS).map(([group, spec]) => [group, {workbookId: 'registered_workbook_' + group + '_2468', resourceKey: spec.resourceKey,
      sheetIds: {records: 0, ledger: 1, audit: 2, history: 3, writerControl: 4}}])),
    drive: {rootFolderId: 'registered_drive_root_2468', folders: Object.fromEntries(Object.keys(DRIVE_FOLDER_SPECS).map(key => [key, 'registered_folder_' + key + '_2468']))}};
}
const json = (value, status = 200) => new Response(JSON.stringify(value), {status, headers: {'Content-Type': 'application/json'}});
const hash = value => createHash('sha256').update(canonicalArtifactJson(value)).digest('hex');
async function fixture({withHashes = false} = {}) {
  const registry = registration(), grids = {}, baseline = {schemaVersion: 1, kind: 'rivya-existing-sandbox-baseline', workbooks: {}};
  for (const [group, book] of Object.entries(registry.workbooks)) {
    const ids = book.sheetIds, resource = {key: book.resourceKey, workbookId: book.workbookId,
      recordSheetId: ids.records, ledgerSheetId: ids.ledger, auditSheetId: ids.audit, historySheetId: ids.history};
    const provider = createTestWriterProvider(resource);
    if (group === 'content') {
      const writer = createControlledWriter({resources: [resource], policies: {[resource.key]: {authorize: () => true, validate: () => true}}},
        {...provider, now: () => '2026-10-24T12:00:00.000Z'});
      for (let revision = 0; revision < 2; revision++) {
        await writer.mutate({resourceKey: resource.key, actor: {id: 'synthetic-owner'},
          command: {recordId: 'probe:nonproduct', expectedRevision: revision, mutationId: 'probe:mutation:' + revision,
            payload: {kind: 'non-product-probe', literal: '=never-a-formula', sequence: revision}, sourceUpdatedAt: null, archivedAt: null}});
      }
    }
    const tabs = Object.fromEntries(['records', 'ledger', 'audit', 'history'].map(key => [key, provider.rows(ids[key])]));
    const count = tabs.ledger.length - 1;
    const ledger = count ? JSON.parse(tabs.ledger.at(-1)[4]) : null;
    const control = count ? {format: 'rivya-writer-gate-v1', state: 'committed', mutationId: ledger.mutationId, requestSha256: ledger.requestSha256, actorId: ledger.actorId} : JSON.parse(readyControlCell());
    baseline.workbooks[group] = {records: tabs.records.length - 1, ledger: count, audit: count, history: count, controlState: control.state,
      ...(withHashes ? {canonicalSha256: hash({tabs, writerControl: control})} : {})};
    grids[group] = {spreadsheetId: book.workbookId, properties: {title: WORKBOOK_SPECS[group].title}, sheets: Object.entries(TAB_SPECS).map(([key, spec]) => ({
      properties: {sheetId: ids[key], title: spec.title, gridProperties: {rowCount: 100, columnCount: 12}},
      // Google's default zero sheet ID may be omitted in protected GridRange.
      protectedRanges: [{range: ids[key] === 0 ? {} : {sheetId: ids[key]}, warningOnly: false, editors: {users: [identity]}}],
      data: [{rowData: (key === 'writerControl' ? [[canonicalArtifactJson(control)]] : tabs[key]).map(row => ({values: row.map(literalCell)}))}],
    }))};
  }
  return {registry, grids, baseline};
}
function harness(f, modify = () => undefined) {
  const requests = [], files = new Map(), {registry, grids, baseline} = f;
  files.set(registry.drive.rootFolderId, {name: 'Rivya Workspace Sandbox', mimeType: 'application/vnd.google-apps.folder'});
  for (const [key, id] of Object.entries(registry.drive.folders)) files.set(id, {name: DRIVE_FOLDER_SPECS[key], mimeType: 'application/vnd.google-apps.folder', parents: [registry.drive.rootFolderId]});
  for (const [key, book] of Object.entries(registry.workbooks)) files.set(book.workbookId, {name: WORKBOOK_SPECS[key].title, mimeType: 'application/vnd.google-apps.spreadsheet', parents: [registry.drive.rootFolderId]});
  files.set(registry.writer.scriptId, {name: 'Unit writer', mimeType: 'application/vnd.google-apps.script'});
  async function fetch(urlInput, init) {
    const url = new URL(urlInput); requests.push({url, init});
    assert.equal(init.method, 'GET'); assert.equal(init.redirect, 'manual');
    assert.equal(init.body, undefined); assert.equal(init.headers.Authorization, 'Bearer ' + token);
    let body;
    if (url.pathname === '/drive/v3/about') body = {user: {emailAddress: identity}};
    else if (url.pathname.startsWith('/drive/v3/files/')) {
      const [id, operation] = url.pathname.slice('/drive/v3/files/'.length).split('/');
      assert.ok(files.has(id));
      body = operation === 'permissions' ? {permissions: [{type: 'user', role: 'owner', emailAddress: identity}]} : {id, ...files.get(id), trashed: false, owners: [{emailAddress: identity}]};
    } else if (url.hostname === 'sheets.googleapis.com') {
      const group = Object.keys(registry.workbooks).find(key => url.pathname.endsWith(registry.workbooks[key].workbookId));
      assert.ok(group); assert.equal(url.searchParams.get('includeGridData'), 'true'); assert.equal(url.searchParams.getAll('ranges').length, 5);
      body = structuredClone(grids[group]);
    } else if (url.pathname.endsWith('/deployments/' + registry.writer.deploymentId)) body = {deploymentId: registry.writer.deploymentId,
      deploymentConfig: {scriptId: registry.writer.scriptId, versionNumber: 1, manifestFileName: 'appsscript'},
      entryPoints: [{entryPointType: 'WEB_APP', webApp: {url: registry.writer.endpoint, entryPointConfig: {executeAs: 'USER_DEPLOYING', access: 'ANYONE_ANONYMOUS'}}}]};
    else if (url.pathname.endsWith('/content')) {
      assert.equal(url.searchParams.get('versionNumber'), '1');
      body = {scriptId: registry.writer.scriptId, files: [{name: 'Writer', type: 'SERVER_JS', source: readFileSync('tools/google-workspace/apps-script/Writer.gs', 'utf8')},
        {name: 'appsscript', type: 'JSON', source: JSON.stringify(isolatedAppsScriptManifest())}]};
    } else throw Error('Unexpected unit-test request');
    const override = modify({url, body}); return override ?? json(body);
  }
  return {requests, run: options => auditExistingGoogleSandbox(registry, baseline, {token, fetch, ...options})};
}
const getCheck = (result, id) => result.checks.find(check => check.id === id);
function controlValue(grid, change) {
  const cell = grid.sheets.find(sheet => sheet.properties.title === 'writer_control').data[0].rowData[0].values[0];
  const value = JSON.parse(cell.userEnteredValue.stringValue); change(value);
  Object.assign(cell, literalCell(canonicalArtifactJson(value)));
}

test('populated coherent sandbox passes bounded GET-only checks without claiming historical byte equality from counts', async () => {
  const f = await fixture(), before = structuredClone(f), h = harness(f), result = await h.run();
  assert.equal(result.status, 'registered-management-and-canonical-checks-passed');
  assert.deepEqual(result.counts.content, {records: 1, ledger: 2, audit: 2, history: 2});
  assert.deepEqual(result.baseline, {countsCompared: 4, hashesCompared: 0, historicalByteEqualityVerified: false});
  assert.ok(result.checks.every(check => check.status === 'passed'));
  assert.ok(h.requests.length <= 48); assert.deepEqual(f, before);
  assert.deepEqual(result.effects, {googleWrites: 0, appConfigurationChanges: 0, productsAdded: 0, migrations: 0});
  const printed = JSON.stringify(result);
  for (const privateValue of [identity, token, f.registry.writer.scriptId, f.registry.writer.endpoint, 'probe:nonproduct', '=never-a-formula']) assert.ok(!printed.includes(privateValue));
  assert.match(printed, /artifact bytes/); assert.match(printed, /not certified/);
});

test('four externally supplied canonical hashes verify equality; wrong hash blocks without exposing it', async () => {
  const f = await fixture({withHashes: true});
  const good = await harness(f).run(); assert.equal(good.baseline.historicalByteEqualityVerified, true);
  f.baseline.workbooks.content.canonicalSha256 = '0'.repeat(64);
  const bad = await harness(f).run(); assert.equal(bad.status, 'blocked'); assert.equal(bad.baseline.historicalByteEqualityVerified, false);
  assert.equal(getCheck(bad, 'workbook.content.canonical').reason, 'checkpoint-canonical-hash-mismatch');
});

test('missing or invalid registry, baseline and credentials make zero provider requests', async () => {
  const f = await fixture(); let calls = 0;
  const fetch = async () => {calls++; throw Error('must not run');};
  for (const [registry, baseline, suppliedToken] of [[null, f.baseline, token], [f.registry, null, token], [f.registry, f.baseline, undefined], [f.registry, f.baseline, 'unsafe token\n']]) {
    const result = await auditExistingGoogleSandbox(registry, baseline, {token: suppliedToken, fetch});
    assert.equal(result.status, 'blocked'); assert.equal(calls, 0);
  }
});

test('baseline refuses unknown keys, inconsistent counts, unsafe hashes and ready nonempty checkpoints', async t => {
  const f = await fixture();
  for (const [label, change] of [
    ['extra secret', b => {b.secret = 'never-reflected';}],
    ['extra book', b => {b.workbooks.extra = b.workbooks.content;}],
    ['too many rows', b => {b.workbooks.content.records = 100;}],
    ['fraction', b => {b.workbooks.content.records = 0.5;}],
    ['history mismatch', b => {b.workbooks.content.audit = 1;}],
    ['empty committed', b => {b.workbooks.system.controlState = 'committed';}],
    ['ready populated', b => {b.workbooks.content.controlState = 'ready';}],
    ['invalid hash', b => {b.workbooks.content.canonicalSha256 = 'not-a-hash';}],
  ]) await t.test(label, () => {
    const b = structuredClone(f.baseline); change(b);
    assert.throws(() => validateExistingSandboxBaseline(b), {code: 'invalid-audit-baseline'});
  });
});

test('count drift is a blocked baseline comparison, never automatic checkpoint adoption', async () => {
  const f = await fixture(); f.baseline.workbooks.content.ledger = f.baseline.workbooks.content.audit = f.baseline.workbooks.content.history = 3;
  const result = await harness(f).run();
  assert.equal(getCheck(result, 'workbook.content.canonical').reason, 'checkpoint-counts-or-control-mismatch');
  assert.equal(result.status, 'blocked');
});

test('canonical formulas, changed payload and missing history are rejected', async t => {
  for (const [label, change] of [
    ['formula', g => {g.sheets[0].data[0].rowData[1].values[0] = {userEnteredValue: {formulaValue: '=1+1'}, effectiveValue: {numberValue: 2}};}],
    ['effective mismatch', g => {g.sheets[0].data[0].rowData[1].values[0].effectiveValue.stringValue = 'different';}],
    ['payload corruption', g => {g.sheets[0].data[0].rowData[1].values[2] = literalCell('{"changed":true}');}],
    ['missing history', g => {g.sheets[3].data[0].rowData.pop();}],
    ['missing audit', g => {g.sheets[2].data[0].rowData.pop();}],
  ]) await t.test(label, async () => {
    const f = await fixture(); change(f.grids.content);
    assert.throws(() => inspectExistingWorkbook(f.grids.content, f.registry, 'content'));
    assert.equal((await harness(f).run()).status, 'blocked');
  });
});

test('inflight, forged committed and reset-ready controls fail closed without changing cells', async t => {
  for (const [label, change, expected] of [
    ['inflight', c => {c.state = 'inflight';}, 'writer-outcome-unresolved'],
    ['wrong mutation', c => {c.mutationId = 'different';}, 'committed-control-ledger-mismatch'],
    ['wrong actor', c => {c.actorId = 'different';}, 'committed-control-ledger-mismatch'],
    ['ready reset', c => {Object.assign(c, JSON.parse(readyControlCell()));}, 'invalid-writer-control'],
    ['unknown state', c => {c.state = 'quarantined';}, 'invalid-writer-control'],
  ]) await t.test(label, async () => {
    const f = await fixture(); controlValue(f.grids.content, change); const before = structuredClone(f.grids.content);
    assert.throws(() => inspectExistingWorkbook(f.grids.content, f.registry, 'content'), {code: expected});
    assert.deepEqual(f.grids.content, before);
  });
});

test('extra control cells, missing protections and incomplete bounds cannot pass as populated state', async t => {
  for (const [label, change] of [
    ['extra control cell', g => {g.sheets[4].data[0].rowData[0].values.push(literalCell('extra'));}],
    ['extra control row', g => {g.sheets[4].data[0].rowData.push({values: [literalCell('extra')]});}],
    ['no protection', g => {g.sheets[0].protectedRanges = [];}],
    ['warning only', g => {g.sheets[0].protectedRanges[0].warningOnly = true;}],
    ['missing range', g => {delete g.sheets[0].protectedRanges[0].range;}],
    ['wrong grid', g => {g.sheets[0].properties.gridProperties.rowCount = 101;}],
    ['shifted block', g => {g.sheets[0].data[0].startRow = 1;}],
    ['duplicate tab', g => {g.sheets[1] = structuredClone(g.sheets[0]);}],
  ]) await t.test(label, async () => {
    const f = await fixture(); change(f.grids.content);
    assert.throws(() => inspectExistingWorkbook(f.grids.content, f.registry, 'content'));
  });
});

test('wrong account halts before resources; bad sharing prevents dependent workbook cells', async () => {
  const f = await fixture();
  const wrongAccount = harness(f, ({url, body}) => {if (url.pathname.endsWith('/about')) body.user.emailAddress = 'different@rivya-acceptance.dev';});
  assert.equal((await wrongAccount.run()).status, 'blocked'); assert.equal(wrongAccount.requests.length, 1);
  const unsafeSharing = harness(f, ({url, body}) => {
    if (url.pathname.endsWith(f.registry.workbooks.content.workbookId + '/permissions')) body.permissions.push({type: 'anyone', role: 'reader'});
  });
  const result = await unsafeSharing.run();
  assert.equal(getCheck(result, 'workbook.content.canonical').status, 'not-run');
  assert.ok(!unsafeSharing.requests.some(request => request.url.hostname === 'sheets.googleapis.com' && request.url.pathname.endsWith(f.registry.workbooks.content.workbookId)));
});

test('changed version, source or manifest are blocked separately from source completion', async t => {
  for (const [label, change] of [
    ['version', ({url, body}) => {if (url.pathname.includes('/deployments/')) body.deploymentConfig.versionNumber = 2;}],
    ['source', ({url, body}) => {if (url.pathname.endsWith('/content')) body.files[0].source += '\n// changed';}],
    ['manifest', ({url, body}) => {if (url.pathname.endsWith('/content')) body.files[1].source = '{}';}],
  ]) await t.test(label, async () => {assert.equal((await harness(await fixture(), change).run()).status, 'blocked');});
});

test('provider authentication failures return fixed sanitized reasons without response bodies', async () => {
  const h = harness(await fixture(), () => json({private: 'never-print-this'}, 401));
  const result = await h.run();
  assert.equal(getCheck(result, 'runtime-account').reason, 'access-denied'); assert.equal(h.requests.length, 1);
  assert.ok(!JSON.stringify(result).includes('never-print-this'));
});

test('portable CLI help and missing configuration work without private artifacts or network', async () => {
  const run = promisify(execFile), script = 'tools/google-workspace/audit-existing.ts';
  const env = {...process.env}; delete env.RIVYA_GOOGLE_REGISTRY_PATH; delete env.RIVYA_GOOGLE_AUDIT_BASELINE_PATH; delete env.RIVYA_GOOGLE_ACCESS_TOKEN;
  const help = await run(process.execPath, ['--import', 'tsx', script, '--help'], {env}); assert.match(help.stdout, /GET-only existing-sandbox/);
  await assert.rejects(run(process.execPath, ['--import', 'tsx', script], {env}), error => {
    const output = JSON.parse(error.stdout); assert.equal(error.code, 1); assert.equal(output.status, 'blocked');
    assert.equal(output.effects.googleWrites, 0); return true;
  });
});
