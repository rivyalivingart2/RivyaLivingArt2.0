/** GET-only audit of an already populated, registered private sandbox.
 * Never initializes, resets, repairs, signs requests or submits mutations.
 * Baselines come from retained private evidence, never automatic current-state adoption.
 */
import {createHash} from 'node:crypto';
import {readFile, stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec';
import {
  decodeCanonicalWriterSnapshot, normalizeWriterSnapshot,
  type WriterCell, type WriterResource, type WriterSnapshot,
} from '../../src/lib/google-workspace/controlled-writer';
import {
  validateIsolatedSetupRegistry, WORKBOOK_SPECS, DRIVE_FOLDER_SPECS, TAB_SPECS, isolatedAppsScriptManifest,
  type IsolatedSetupRegistry, type WorkbookGroup, type TabKey,
} from './isolated-setup';
import {
  createReadinessGoogleReader, validateIsolatedFilePermissions, validateIsolatedProtectedSheet,
  isolatedLiteralCell, IsolatedReadinessError, type ReadinessCheck,
} from './verify-isolated';

type JsonObject = Record<string, unknown>;
type Counts = {records: number; ledger: number; audit: number; history: number};
export type ExistingSandboxBaseline = {
  schemaVersion: 1; kind: 'rivya-existing-sandbox-baseline';
  workbooks: Record<WorkbookGroup, Counts & {controlState: 'ready' | 'committed'; canonicalSha256?: string}>;
};
export type ExistingSandboxAuditReceipt = {
  schemaVersion: 1; kind: 'google-existing-sandbox-audit'; checkedAt: string;
  status: 'registered-management-and-canonical-checks-passed' | 'blocked';
  verificationBoundary: 'management-api-reads-only-no-signed-runtime-acceptance';
  checks: ReadinessCheck[]; counts: Partial<Record<WorkbookGroup, Counts>>;
  baseline: {countsCompared: number; hashesCompared: number; historicalByteEqualityVerified: boolean};
  limitations: string[];
  effects: {googleWrites: 0; appConfigurationChanges: 0; productsAdded: 0; migrations: 0};
};
type Options = {token?: string; fetch?: typeof fetch; now?: () => Date; timeoutMs?: number; maxResponseBytes?: number};
const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const object = (value: unknown): value is JsonObject => !!value && typeof value === 'object' && !Array.isArray(value);
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const same = (a: unknown, b: unknown) => canonicalArtifactJson(a) === canonicalArtifactJson(b);
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const sourceHash = (value: string) => hash(value.replace(/\r\n/g, '\n'));
function fail(code: string): never {throw new IsolatedReadinessError(code);}
function requireState(condition: unknown, code: string): asserts condition {if (!condition) fail(code);}
function exact(value: unknown, keys: string[]): asserts value is JsonObject {
  requireState(object(value) && same(Object.keys(value).sort(), [...keys].sort()), 'invalid-audit-baseline');
}

/** Only explicit bounded counts/states and optional reviewed hashes are accepted.
 * Counts validate the configured checkpoint, not historical byte equality. */
export function validateExistingSandboxBaseline(input: unknown): ExistingSandboxBaseline {
  exact(input, ['schemaVersion', 'kind', 'workbooks']);
  requireState(input.schemaVersion === 1 && input.kind === 'rivya-existing-sandbox-baseline', 'invalid-audit-baseline');
  exact(input.workbooks, Object.keys(WORKBOOK_SPECS));
  for (const group of Object.keys(WORKBOOK_SPECS)) {
    const value = input.workbooks[group];
    requireState(object(value), 'invalid-audit-baseline');
    exact(value, ['records', 'ledger', 'audit', 'history', 'controlState', ...('canonicalSha256' in value ? ['canonicalSha256'] : [])]);
    for (const key of ['records', 'ledger', 'audit', 'history']) {
      requireState(Number.isSafeInteger(value[key]) && Number(value[key]) >= 0 && Number(value[key]) <= 99, 'invalid-audit-baseline');
    }
    requireState(value.ledger === value.audit && value.audit === value.history && Number(value.records) <= Number(value.history), 'invalid-audit-baseline');
    requireState(value.controlState === 'ready' || value.controlState === 'committed', 'invalid-audit-baseline');
    requireState(value.controlState === 'ready' ? value.history === 0 : Number(value.history) > 0, 'invalid-audit-baseline');
    requireState(value.canonicalSha256 === undefined || typeof value.canonicalSha256 === 'string' && /^[a-f0-9]{64}$/.test(value.canonicalSha256), 'invalid-audit-baseline');
  }
  return JSON.parse(canonicalArtifactJson(input)) as ExistingSandboxBaseline;
}

function receipt(now: () => Date): ExistingSandboxAuditReceipt {
  return {schemaVersion: 1, kind: 'google-existing-sandbox-audit', checkedAt: now().toISOString(), status: 'blocked',
    verificationBoundary: 'management-api-reads-only-no-signed-runtime-acceptance', checks: [], counts: {},
    baseline: {countsCompared: 0, hashesCompared: 0, historicalByteEqualityVerified: false},
    limitations: [
      'Configured resources only; unregistered folder members are not enumerated.',
      'Drive artifact bytes and hashes are not checked by this command.',
      'Management metadata does not verify signing-key configuration or signed gateway execution.',
      'No cross-workbook atomic snapshot; later or concurrent external mutations are outside this receipt.',
      'Counts alone do not establish equality with historical payload bytes; four reviewed hashes are required.',
      'Remaining acceptance groups, business migration, CMS publication, cutover and release are not certified.',
    ], effects: {googleWrites: 0, appConfigurationChanges: 0, productsAdded: 0, migrations: 0}};
}

/** Validate populated Google CellData through the existing canonical/history codec.
 * A committed control must identify its last coherent ledger entry. Inflight or
 * malformed control fails closed and is never normalized into a ready marker. */
export function inspectExistingWorkbook(data: unknown, registry: IsolatedSetupRegistry, group: WorkbookGroup) {
  const workbook = registry.workbooks[group];
  requireState(object(data) && data.spreadsheetId === workbook.workbookId && object(data.properties) && data.properties.title === WORKBOOK_SPECS[group].title, 'workbook-identity-mismatch');
  requireState(Array.isArray(data.sheets) && data.sheets.length === 5, 'unexpected-sheet-membership');
  const collected = new Map<TabKey, WriterCell[][]>();
  for (const tab of Object.keys(TAB_SPECS) as TabKey[]) {
    const sheetId = workbook.sheetIds[tab];
    const found = data.sheets.filter(raw => object(raw) && object(raw.properties) && raw.properties.sheetId === sheetId);
    requireState(found.length === 1, 'registered-sheet-unavailable');
    const sheet = found[0] as JsonObject, properties = sheet.properties as JsonObject;
    requireState(properties.title === TAB_SPECS[tab].title && object(properties.gridProperties) && properties.gridProperties.rowCount === 100 && properties.gridProperties.columnCount === 12, 'sheet-name-or-grid-size-mismatch');
    validateIsolatedProtectedSheet(sheet, sheetId, registry);
    const blocks = list(sheet.data);
    requireState(blocks.length === 1 && object(blocks[0]) && (blocks[0].startRow ?? 0) === 0 && (blocks[0].startColumn ?? 0) === 0, 'incomplete-grid-observation');
    const rows = list((blocks[0] as JsonObject).rowData);
    requireState(rows.length > 0 && rows.length <= 100, 'incomplete-grid-observation');
    const normalized = rows.map(row => {
      requireState(object(row) && (row.values === undefined || Array.isArray(row.values)), 'invalid-grid-row');
      const cells = list(row.values);
      requireState(cells.length <= 12, 'unexpected-grid-width');
      cells.forEach(isolatedLiteralCell);
      return cells as WriterCell[];
    });
    collected.set(tab, normalized);
  }
  const ids = workbook.sheetIds;
  const resource: WriterResource = {key: workbook.resourceKey, workbookId: workbook.workbookId,
    recordSheetId: ids.records, ledgerSheetId: ids.ledger, auditSheetId: ids.audit, historySheetId: ids.history};
  const snapshot: WriterSnapshot = {workbookId: workbook.workbookId,
    sheets: (['records', 'ledger', 'audit', 'history'] as const).map(key => ({sheetId: ids[key], complete: true, rows: collected.get(key)!}))};
  let canonical: ReturnType<typeof normalizeWriterSnapshot>;
  try {
    decodeCanonicalWriterSnapshot(resource, snapshot, {maxRowsPerSheet: 100});
    canonical = normalizeWriterSnapshot(resource, snapshot, {maxRowsPerSheet: 100});
  } catch {return fail('canonical-integrity-failed');}
  const controlRows = collected.get('writerControl')!.map(row => row.map(isolatedLiteralCell));
  while (controlRows.length && controlRows[controlRows.length - 1].every(value => value === '')) controlRows.pop();
  requireState(controlRows.length === 1, 'invalid-writer-control');
  const controlRow = controlRows[0];
  while (controlRow.length && controlRow[controlRow.length - 1] === '') controlRow.pop();
  requireState(controlRow.length === 1, 'invalid-writer-control');
  let control: JsonObject;
  try {control = JSON.parse(controlRow[0]) as JsonObject;} catch {return fail('invalid-writer-control');}
  requireState(object(control) && same(Object.keys(control).sort(), ['format', 'state', 'mutationId', 'requestSha256', 'actorId'].sort()) &&
    canonicalArtifactJson(control) === controlRow[0] && control.format === 'rivya-writer-gate-v1', 'invalid-writer-control');
  requireState(control.state !== 'inflight', 'writer-outcome-unresolved');
  requireState(control.state === 'ready' || control.state === 'committed', 'invalid-writer-control');
  const rows = Object.fromEntries((['records', 'ledger', 'audit', 'history'] as const).map(key => [key, canonical.sheets.get(ids[key])!])) as Record<keyof Counts, string[][]>;
  const counts: Counts = {records: rows.records.length - 1, ledger: rows.ledger.length - 1, audit: rows.audit.length - 1, history: rows.history.length - 1};
  if (control.state === 'ready') {
    requireState(counts.history === 0 && control.mutationId === null && control.requestSha256 === null && control.actorId === null, 'invalid-writer-control');
  } else {
    requireState(counts.ledger > 0, 'committed-control-without-ledger');
    const last = rows.ledger[rows.ledger.length - 1], entry = JSON.parse(last[4]) as JsonObject;
    requireState(control.mutationId === entry.mutationId && control.requestSha256 === entry.requestSha256 && control.actorId === entry.actorId, 'committed-control-ledger-mismatch');
  }
  // IDs stay in the private registry; canonical hashing uses stable tab names.
  const canonicalSha256 = hash(canonicalArtifactJson({tabs: rows, writerControl: control}));
  return {counts, controlState: control.state as 'ready' | 'committed', canonicalSha256};
}

export async function auditExistingGoogleSandbox(input: unknown, baselineInput: unknown, options: Options = {}): Promise<ExistingSandboxAuditReceipt> {
  const result = receipt(options.now ?? (() => new Date()));
  const check = async (id: string, run: () => Promise<void>, success = 'verified-by-management-api-read') => {
    try {await run(); result.checks.push({id, status: 'passed', reason: success}); return true;}
    catch (error) {result.checks.push({id, status: 'blocked', reason: error instanceof IsolatedReadinessError ? error.code : 'audit-check-failed'}); return false;}
  };
  let registry: IsolatedSetupRegistry, baseline: ExistingSandboxBaseline;
  try {registry = validateIsolatedSetupRegistry(input);} catch {result.checks.push({id: 'registry', status: 'blocked', reason: 'invalid-private-registry'}); return result;}
  try {baseline = validateExistingSandboxBaseline(baselineInput);} catch {result.checks.push({id: 'baseline', status: 'blocked', reason: 'invalid-or-missing-private-baseline'}); return result;}
  result.checks.push({id: 'registry-and-baseline', status: 'passed', reason: 'local-metadata-only'});
  const token = options.token;
  if (typeof token !== 'string' || !/^[\x21-\x7e]{1,8192}$/.test(token)) {
    result.checks.push({id: 'runtime-access', status: 'blocked', reason: 'RIVYA_GOOGLE_ACCESS_TOKEN-missing-or-invalid'}); return result;
  }
  const timeoutMs = options.timeoutMs ?? 10_000, maximum = options.maxResponseBytes ?? 4 * 1024 * 1024;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 10 || timeoutMs > 30_000 || !Number.isSafeInteger(maximum) || maximum < 100 || maximum > 8 * 1024 * 1024) {
    result.checks.push({id: 'request-limits', status: 'blocked', reason: 'invalid-request-limits'}); return result;
  }
  const get = createReadinessGoogleReader(token, options.fetch ?? fetch, timeoutMs, maximum);
  const accountPassed = await check('runtime-account', async () => {
    const url = new URL('https://www.googleapis.com/drive/v3/about'); url.searchParams.set('fields', 'user(emailAddress)');
    const data = await get(url);
    requireState(object(data.user) && data.user.emailAddress === registry.runtimePrincipalEmail, 'runtime-account-mismatch');
  });
  if (!accountPassed) return result;
  const inspectFile = async (label: string, id: string, name: string | null, mime: string, parent: string | null, group: WorkbookGroup = 'system') => {
    const metadata = await check(label + '.metadata', async () => {
      const url = new URL('https://www.googleapis.com/drive/v3/files/' + id);
      url.searchParams.set('fields', 'id,name,mimeType,trashed,parents,owners(emailAddress),driveId'); url.searchParams.set('supportsAllDrives', 'true');
      const data = await get(url), owners = list(data.owners);
      requireState(data.id === id && (name === null || data.name === name) && data.mimeType === mime && data.trashed === false && !data.driveId, 'resource-metadata-mismatch');
      requireState(owners.length === 1 && object(owners[0]) && owners[0].emailAddress === registry.ownerEmail, 'resource-owner-mismatch');
      requireState(parent === null || same(data.parents, [parent]), 'resource-parent-mismatch');
    });
    if (!metadata) {result.checks.push({id: label + '.permissions', status: 'not-run', reason: 'verified-resource-identity-required'}); return false;}
    return check(label + '.permissions', async () => {
      const url = new URL('https://www.googleapis.com/drive/v3/files/' + id + '/permissions');
      url.searchParams.set('fields', 'nextPageToken,permissions(type,role,emailAddress,deleted,pendingOwner)'); url.searchParams.set('pageSize', '100'); url.searchParams.set('supportsAllDrives', 'true');
      validateIsolatedFilePermissions(await get(url), registry, group);
    });
  };
  if (!await inspectFile('drive.root', registry.drive.rootFolderId, 'Rivya Workspace Sandbox', 'application/vnd.google-apps.folder', null)) return result;
  for (const key of Object.keys(DRIVE_FOLDER_SPECS) as (keyof typeof DRIVE_FOLDER_SPECS)[]) {
    await inspectFile('drive.' + key, registry.drive.folders[key], DRIVE_FOLDER_SPECS[key], 'application/vnd.google-apps.folder', registry.drive.rootFolderId);
  }
  for (const group of Object.keys(WORKBOOK_SPECS) as WorkbookGroup[]) {
    const workbook = registry.workbooks[group];
    const identity = await inspectFile('workbook.' + group, workbook.workbookId, WORKBOOK_SPECS[group].title, 'application/vnd.google-apps.spreadsheet', registry.drive.rootFolderId, group);
    if (!identity) {result.checks.push({id: 'workbook.' + group + '.canonical', status: 'not-run', reason: 'verified-workbook-identity-and-access-required'}); continue;}
    await check('workbook.' + group + '.canonical', async () => {
      const url = new URL('https://sheets.googleapis.com/v4/spreadsheets/' + workbook.workbookId);
      url.searchParams.set('includeGridData', 'true');
      for (const spec of Object.values(TAB_SPECS)) url.searchParams.append('ranges', "'" + spec.title + "'!A1:L100");
      url.searchParams.set('fields', 'spreadsheetId,properties(title),sheets(properties(sheetId,title,gridProperties),protectedRanges(range,warningOnly,unprotectedRanges,editors),data(startRow,startColumn,rowData(values(userEnteredValue,effectiveValue))))');
      const observed = inspectExistingWorkbook(await get(url), registry, group), expected = baseline.workbooks[group];
      result.counts[group] = observed.counts;
      const expectedCounts = {records: expected.records, ledger: expected.ledger, audit: expected.audit, history: expected.history};
      requireState(same(observed.counts, expectedCounts) && observed.controlState === expected.controlState, 'checkpoint-counts-or-control-mismatch');
      result.baseline.countsCompared++;
      if (expected.canonicalSha256 !== undefined) {
        requireState(observed.canonicalSha256 === expected.canonicalSha256, 'checkpoint-canonical-hash-mismatch');
        result.baseline.hashesCompared++;
      }
    });
  }
  const script = await inspectFile('apps-script.project', registry.writer.scriptId, null, 'application/vnd.google-apps.script', null);
  if (!script) return result;
  const deployment = await check('apps-script.deployment', async () => {
    const url = new URL('https://script.googleapis.com/v1/projects/' + registry.writer.scriptId + '/deployments/' + registry.writer.deploymentId);
    const data = await get(url), config = data.deploymentConfig, entries = list(data.entryPoints);
    requireState(data.deploymentId === registry.writer.deploymentId && object(config) && config.scriptId === registry.writer.scriptId && config.versionNumber === registry.writer.versionNumber && config.manifestFileName === 'appsscript', 'deployment-version-mismatch');
    requireState(entries.length === 1 && object(entries[0]) && entries[0].entryPointType === 'WEB_APP' && object(entries[0].webApp), 'unexpected-deployment-entry-points');
    const web = entries[0].webApp;
    requireState(web.url === registry.writer.endpoint && object(web.entryPointConfig) && web.entryPointConfig.executeAs === 'USER_DEPLOYING' && web.entryPointConfig.access === 'ANYONE_ANONYMOUS', 'gateway-webapp-policy-mismatch');
  });
  if (!deployment) return result;
  await check('apps-script.deployed-source', async () => {
    const url = new URL('https://script.googleapis.com/v1/projects/' + registry.writer.scriptId + '/content'); url.searchParams.set('versionNumber', String(registry.writer.versionNumber));
    const data = await get(url), files = list(data.files);
    requireState(data.scriptId === registry.writer.scriptId && files.length === 2, 'deployed-source-membership-mismatch');
    const writer = files.find(file => object(file) && file.name === 'Writer' && file.type === 'SERVER_JS');
    const manifest = files.find(file => object(file) && file.name === 'appsscript' && file.type === 'JSON');
    requireState(object(writer) && typeof writer.source === 'string' && object(manifest) && typeof manifest.source === 'string', 'deployed-source-missing');
    const expectedWriter = await readFile(resolve(root, 'tools/google-workspace/apps-script/Writer.gs'), 'utf8');
    requireState(sourceHash(writer.source) === sourceHash(expectedWriter), 'deployed-writer-source-mismatch');
    let observed: unknown;
    try {observed = JSON.parse(manifest.source);} catch {return fail('deployed-manifest-invalid');}
    requireState(same(observed, isolatedAppsScriptManifest()), 'deployed-manifest-mismatch');
  });
  result.baseline.historicalByteEqualityVerified = result.baseline.hashesCompared === 4;
  result.status = result.checks.every(item => item.status === 'passed') ? 'registered-management-and-canonical-checks-passed' : 'blocked';
  return result;
}

async function readPrivateJson(path: string | undefined): Promise<unknown> {
  requireState(typeof path === 'string' && path.length > 0, 'private-configuration-path-required');
  const info = await stat(path); requireState(info.isFile() && info.size <= 64 * 1024, 'invalid-private-configuration-file');
  return JSON.parse(await readFile(path, 'utf8')) as unknown;
}
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log('GET-only existing-sandbox audit. Node 22: node --use-env-proxy --import tsx tools/google-workspace/audit-existing.ts --baseline /private/baseline.json [--registry /private/registry.json]. Registry may use RIVYA_GOOGLE_REGISTRY_PATH; baseline may use RIVYA_GOOGLE_AUDIT_BASELINE_PATH. Supply OAuth via secure RIVYA_GOOGLE_ACCESS_TOKEN. Baseline: {schemaVersion:1,kind:"rivya-existing-sandbox-baseline",workbooks:{content:{records,ledger,audit,history,controlState,canonicalSha256?},operations:{...},security:{...},system:{...}}}. Use retained reviewed evidence, not automatic current-state adoption. Hash covers canonicalArtifactJson({tabs:{records,ledger,audit,history},writerControl}) using normalized string rows including headers. No writes, resets, HMAC or complete Google acceptance.'); return;
  }
  let registryPath = process.env.RIVYA_GOOGLE_REGISTRY_PATH, baselinePath = process.env.RIVYA_GOOGLE_AUDIT_BASELINE_PATH;
  const seen = new Set<string>();
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i], value = args[i + 1];
    requireState(['--registry', '--baseline'].includes(key) && !seen.has(key) && value && !value.startsWith('--'), 'invalid-cli-arguments');
    seen.add(key); if (key === '--registry') registryPath = value; else baselinePath = value;
  }
  const result = await auditExistingGoogleSandbox(await readPrivateJson(registryPath), await readPrivateJson(baselinePath), {token: process.env.RIVYA_GOOGLE_ACCESS_TOKEN});
  console.log(JSON.stringify(result, null, 2)); process.exitCode = result.status === 'registered-management-and-canonical-checks-passed' ? 0 : 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(() => {
    const result = receipt(() => new Date());
    result.checks.push({id: 'private-configuration', status: 'blocked', reason: 'configuration-missing-unreadable-invalid-or-arguments-invalid'});
    console.log(JSON.stringify(result, null, 2)); process.exitCode = 1;
  });
}
