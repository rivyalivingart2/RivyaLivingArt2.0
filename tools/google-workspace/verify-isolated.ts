/** GET-only installation readiness audit. Run with Node 22 + tsx:
 * RIVYA_GOOGLE_REGISTRY_PATH=/private/registry.json node --use-env-proxy --import tsx tools/google-workspace/verify-isolated.ts
 * Supply RIVYA_GOOGLE_ACCESS_TOKEN through secure runtime configuration, never argv.
 * No write, HMAC, provisioning, signed-gateway, migration or cutover acceptance is implied.
 */
import {createHash} from 'node:crypto';
import {readFile, stat} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec';
import {
  validateIsolatedSetupRegistry, WORKBOOK_SPECS, DRIVE_FOLDER_SPECS, TAB_SPECS, isolatedAppsScriptManifest,
  type IsolatedSetupRegistry, type WorkbookGroup, type TabKey,
} from './isolated-setup';

type JsonObject = Record<string, unknown>;
export type ReadinessCheck = {id: string; status: 'passed' | 'blocked' | 'not-run'; reason: string};
export type IsolatedReadinessReceipt = {
  schemaVersion: 1; kind: 'google-isolated-installation-readiness'; checkedAt: string;
  status: 'management-checks-passed' | 'blocked'; verificationBoundary: 'management-api-reads-only';
  checks: ReadinessCheck[]; acceptance: ReadinessCheck[];
  source: {expectedWriterSha256: string | null; expectedIsolatedManifestSha256: string | null};
  effects: {googleWrites: 0; appConfigurationChanges: 0; productsAdded: 0; migrations: 0};
};
type Options = {token?: string; fetch?: typeof fetch; now?: () => Date; timeoutMs?: number; maxResponseBytes?: number};
const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const pendingAcceptance = [
  'signed-gateway-read-write-reload', 'concurrent-client-revision-conflicts', 'lost-response-and-interrupted-script',
  'editor-protection-and-formula-injection', 'reserved-drive-id-create-hash-and-retry',
  'independent-job-restart-fencing-and-cancellation', 'publication-pointer-and-failure-recovery',
  'actual-provider-denial-quota-and-latency', 'actual-writer-execution-identity',
];
const object = (value: unknown): value is JsonObject => !!value && typeof value === 'object' && !Array.isArray(value);
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const strings = (value: unknown): string[] | null => Array.isArray(value) && value.every(item => typeof item === 'string') ? value : null;
const same = (a: unknown, b: unknown) => canonicalArtifactJson(a) === canonicalArtifactJson(b);
class ReadinessError extends Error {constructor(readonly code: string) {super('Google readiness check: ' + code);}}
const fail = (code: string): never => {throw new ReadinessError(code);};
const requireState = (condition: unknown, code: string): void => {if (!condition) fail(code);};
const sha = (text: string) => createHash('sha256').update(text.replace(/\r\n/g, '\n')).digest('hex');

function receipt(now: () => Date): IsolatedReadinessReceipt {
  return {schemaVersion: 1, kind: 'google-isolated-installation-readiness', checkedAt: now().toISOString(),
    status: 'blocked', verificationBoundary: 'management-api-reads-only', checks: [],
    source: {expectedWriterSha256: null, expectedIsolatedManifestSha256: null},
    acceptance: pendingAcceptance.map(id => ({id, status: 'not-run', reason: 'requires-separate-real-provider-acceptance'})),
    effects: {googleWrites: 0, appConfigurationChanges: 0, productsAdded: 0, migrations: 0}};
}

/** Errors are fixed codes only: no URL, resource ID, email, token or response body is returned. */
function googleRead(token: string, transport: typeof fetch, timeoutMs: number, maximum: number) {
  let calls = 0;
  return async (url: URL): Promise<JsonObject> => {
    requireState(url.protocol === 'https:' && ['www.googleapis.com', 'sheets.googleapis.com', 'script.googleapis.com'].includes(url.hostname) && !url.port && !url.username && !url.password && !url.hash, 'invalid-destination');
    requireState(++calls <= 48, 'request-budget-exhausted');
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), timeoutMs);
    const bounded = <T>(work: Promise<T>): Promise<T> => new Promise((resolveResult, reject) => {
      const stop = () => reject(new ReadinessError('request-timeout'));
      if (abort.signal.aborted) {stop(); return;}
      abort.signal.addEventListener('abort', stop, {once: true});
      work.then(resolveResult, reject).finally(() => abort.signal.removeEventListener('abort', stop));
    });
    let response: Response | undefined;
    try {
      response = await bounded(transport(url.href, {method: 'GET', headers: {Authorization: 'Bearer ' + token, Accept: 'application/json'},
        signal: abort.signal, redirect: 'manual', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer'}));
      requireState(!response.redirected && (!response.url || response.url === url.href) && !(response.status >= 300 && response.status < 400), 'unexpected-redirect');
      if ([401, 403].includes(response.status)) fail('access-denied');
      if (response.status === 404) fail('registered-resource-unavailable');
      if (response.status === 429) fail('rate-limited');
      requireState(response.status === 200, 'provider-response-failed');
      requireState((response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase() === 'application/json', 'invalid-response-type');
      const length = response.headers.get('content-length');
      requireState(length === null || /^\d+$/.test(length) && Number(length) <= maximum, 'response-too-large');
      const reader = response.body?.getReader();
      requireState(reader, 'invalid-response-body');
      const chunks: Uint8Array[] = []; let total = 0;
      try {
        while (true) {
          const chunk = await bounded(reader!.read());
          if (chunk.done) break;
          total += chunk.value.byteLength;
          requireState(total <= maximum, 'response-too-large');
          chunks.push(chunk.value);
        }
      } finally {void reader!.cancel().catch(() => {});}
      const parsed: unknown = JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(Buffer.concat(chunks)));
      requireState(object(parsed), 'invalid-response-object');
      return parsed as JsonObject;
    } catch (error) {
      if (error instanceof ReadinessError) throw error;
      return fail(abort.signal.aborted ? 'request-timeout' : 'provider-read-failed');
    } finally {clearTimeout(timer); if (response && !response.bodyUsed) void response.body?.cancel().catch(() => {});}
  };
}

function allowedReaders(registry: IsolatedSetupRegistry, group?: WorkbookGroup): Set<string> {
  return new Set([registry.ownerEmail, registry.writer.executionIdentityEmail,
    ...(!group || group === 'content' || group === 'operations' ? [registry.runtimePrincipalEmail] : [])]);
}

function validatePermissions(data: JsonObject, registry: IsolatedSetupRegistry, group?: WorkbookGroup) {
  requireState(!data.nextPageToken && Array.isArray(data.permissions) && data.permissions.length > 0 && data.permissions.length <= 100, 'permissions-not-completely-observed');
  const allowed = allowedReaders(registry, group), seen = new Set<string>();
  for (const raw of list(data.permissions)) {
    requireState(object(raw), 'invalid-permission-state');
    const permission = raw as JsonObject, email = permission.emailAddress;
    requireState(permission.type === 'user' && typeof email === 'string' && allowed.has(email) && !permission.deleted && !permission.pendingOwner, 'unexpected-sharing-principal');
    requireState(!seen.has(email as string), 'duplicate-sharing-principal'); seen.add(email as string);
    if (email === registry.ownerEmail) requireState(permission.role === 'owner', 'owner-role-mismatch');
    else if (email === registry.writer.executionIdentityEmail) requireState(permission.role === 'writer', 'writer-role-mismatch');
    else requireState(permission.role === 'reader', 'runtime-reader-role-mismatch');
  }
  requireState(seen.has(registry.ownerEmail) && seen.has(registry.writer.executionIdentityEmail), 'required-sharing-principal-missing');
}

function validateProtectedSheet(sheet: JsonObject, sheetId: number, registry: IsolatedSetupRegistry) {
  const allowed = new Set([registry.ownerEmail, registry.writer.executionIdentityEmail]);
  const protectedRanges = list(sheet.protectedRanges);
  requireState(protectedRanges.some(raw => {
    // Sheets omits the protobuf default sheetId=0 inside a GridRange. Only an
    // absent field defaults to zero; a missing range or explicit invalid ID fails.
    if (!object(raw) || (raw.warningOnly !== undefined && raw.warningOnly !== false) || !object(raw.range) ||
      (raw.range.sheetId === undefined ? 0 : raw.range.sheetId) !== sheetId ||
      (raw.unprotectedRanges !== undefined && (!Array.isArray(raw.unprotectedRanges) || raw.unprotectedRanges.length !== 0))) return false;
    const range = raw.range;
    if ((range.startRowIndex ?? 0) !== 0 || (range.startColumnIndex ?? 0) !== 0 || (range.endRowIndex ?? 100) !== 100 || (range.endColumnIndex ?? 12) !== 12) return false;
    if (!object(raw.editors)) return false;
    const users = strings(raw.editors.users ?? []), groups = strings(raw.editors.groups ?? []);
    return !!users && !!groups && groups.length === 0 && (raw.editors.domainUsersCanEdit === undefined || raw.editors.domainUsersCanEdit === false) &&
      users.every(email => allowed.has(email)) && (registry.writer.executionIdentityEmail === registry.ownerEmail || users.includes(registry.writer.executionIdentityEmail));
  }), 'canonical-sheet-protection-unverified');
}

function literalCell(raw: unknown): string {
  requireState(object(raw), 'invalid-grid-cell');
  const cell = raw as JsonObject;
  if (cell.userEnteredValue === undefined && cell.effectiveValue === undefined) return '';
  requireState(object(cell.userEnteredValue), 'canonical-cell-not-literal');
  const entered = cell.userEnteredValue as JsonObject;
  requireState(Object.keys(entered).length === 1 && typeof entered.stringValue === 'string', 'canonical-cell-not-literal');
  if (cell.effectiveValue === undefined) requireState(entered.stringValue === '', 'canonical-cell-value-mismatch');
  else requireState(object(cell.effectiveValue) && Object.keys(cell.effectiveValue).length === 1 && cell.effectiveValue.stringValue === entered.stringValue, 'canonical-cell-value-mismatch');
  return entered.stringValue as string;
}

function validateGrid(data: JsonObject, registry: IsolatedSetupRegistry, group: WorkbookGroup) {
  const workbook = registry.workbooks[group];
  requireState(data.spreadsheetId === workbook.workbookId && object(data.properties) && data.properties.title === WORKBOOK_SPECS[group].title, 'workbook-identity-mismatch');
  const sheets = list(data.sheets);
  requireState(sheets.length === 5, 'unexpected-sheet-membership');
  for (const tab of Object.keys(TAB_SPECS) as TabKey[]) {
    const expected = TAB_SPECS[tab], sheetId = workbook.sheetIds[tab];
    const found = sheets.filter(raw => object(raw) && object(raw.properties) && raw.properties.sheetId === sheetId);
    requireState(found.length === 1, 'registered-sheet-unavailable');
    const sheet = found[0] as JsonObject, properties = sheet.properties as JsonObject;
    requireState(properties.title === expected.title && object(properties.gridProperties) && properties.gridProperties.rowCount === 100 && properties.gridProperties.columnCount === 12, 'sheet-name-or-grid-size-mismatch');
    validateProtectedSheet(sheet, sheetId, registry);
    const blocks = list(sheet.data);
    requireState(blocks.length === 1 && object(blocks[0]) && (blocks[0].startRow ?? 0) === 0 && (blocks[0].startColumn ?? 0) === 0, 'incomplete-grid-observation');
    const rows = list((blocks[0] as JsonObject).rowData);
    requireState(rows.length > 0 && rows.length <= 100, 'incomplete-grid-observation');
    const normalized = rows.map(row => {
      requireState(object(row) && (row.values === undefined || Array.isArray(row.values)), 'invalid-grid-row');
      const values = list((row as JsonObject).values); requireState(values.length <= 12, 'unexpected-grid-width');
      return values.map(literalCell);
    });
    const first = normalized[0]; while (first.length && first[first.length - 1] === '') first.pop();
    if (tab === 'writerControl') requireState(first.length === 1 && first[0] === canonicalArtifactJson({format: 'rivya-writer-gate-v1', state: 'ready', mutationId: null, requestSha256: null, actorId: null}), 'writer-control-not-in-initial-ready-state');
    else requireState(same(first, expected.headers), 'canonical-header-mismatch');
    requireState(normalized.slice(1).every(row => row.every(value => value === '')), 'existing-probe-data-requires-review');
  }
}

export async function verifyIsolatedGoogleReadiness(input: unknown, options: Options = {}): Promise<IsolatedReadinessReceipt> {
  const result = receipt(options.now ?? (() => new Date()));
  const check = async (id: string, run: () => Promise<void>, success = 'verified-by-management-api-read') => {
    try {await run(); result.checks.push({id, status: 'passed', reason: success}); return true;}
    catch (error) {result.checks.push({id, status: 'blocked', reason: error instanceof ReadinessError ? error.code : 'readiness-check-failed'}); return false;}
  };
  let registry: IsolatedSetupRegistry;
  try {registry = validateIsolatedSetupRegistry(input); result.checks.push({id: 'registry', status: 'passed', reason: 'local-registry-shape-validated-only'});}
  catch {result.checks.push({id: 'registry', status: 'blocked', reason: 'invalid-private-registry'}); return result;}
  const token = options.token;
  // The managed HTTPS proxy may inject an opaque printable placeholder and
  // replace it at the approved destination. Validate header safety, not the
  // placeholder's provider-specific token alphabet; never inspect its value.
  if (typeof token !== 'string' || token.length === 0 || token.length > 8192 || !/^[\x21-\x7e]+$/.test(token)) {
    result.checks.push({id: 'runtime-access', status: 'blocked', reason: 'RIVYA_GOOGLE_ACCESS_TOKEN-missing-or-invalid'});
    result.checks.push({id: 'google-management-reads', status: 'not-run', reason: 'runtime-access-required'}); return result;
  }
  const timeoutMs = options.timeoutMs ?? 10_000, maximum = options.maxResponseBytes ?? 4 * 1024 * 1024;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 10 || timeoutMs > 30_000 || !Number.isSafeInteger(maximum) || maximum < 100 || maximum > 8 * 1024 * 1024) {
    result.checks.push({id: 'request-limits', status: 'blocked', reason: 'invalid-request-limits'}); return result;
  }
  const get = googleRead(token, options.fetch ?? fetch, timeoutMs, maximum);
  const account = await check('runtime-account', async () => {
    const url = new URL('https://www.googleapis.com/drive/v3/about'); url.searchParams.set('fields', 'user(emailAddress)');
    const data = await get(url);
    requireState(object(data.user) && data.user.emailAddress === registry.runtimePrincipalEmail, 'runtime-account-mismatch');
  });
  if (!account) {result.checks.push({id: 'registered-resource-reads', status: 'not-run', reason: 'verified-runtime-account-required'}); return result;}

  const inspectFile = async (label: string, id: string, name: string | null, mimeType: string, parentId: string | null, group?: WorkbookGroup) => {
    const metadataPassed = await check(label + '.metadata', async () => {
      const url = new URL('https://www.googleapis.com/drive/v3/files/' + id);
      url.searchParams.set('fields', 'id,name,mimeType,trashed,parents,owners(emailAddress),driveId'); url.searchParams.set('supportsAllDrives', 'true');
      const data = await get(url);
      requireState(data.id === id && (name === null || data.name === name) && data.mimeType === mimeType && data.trashed === false && !data.driveId, 'resource-metadata-mismatch');
      const owners = list(data.owners);
      requireState(owners.length === 1 && object(owners[0]) && owners[0].emailAddress === registry.ownerEmail, 'resource-owner-mismatch');
      if (parentId !== null) requireState(same(data.parents, [parentId]), 'resource-parent-mismatch');
    });
    if (!metadataPassed) {
      result.checks.push({id: label + '.permissions', status: 'not-run', reason: 'verified-resource-identity-required'});
      return false;
    }
    return check(label + '.permissions', async () => {
      const url = new URL('https://www.googleapis.com/drive/v3/files/' + id + '/permissions');
      url.searchParams.set('fields', 'nextPageToken,permissions(type,role,emailAddress,deleted,pendingOwner)'); url.searchParams.set('pageSize', '100'); url.searchParams.set('supportsAllDrives', 'true');
      validatePermissions(await get(url), registry, group);
    });
  };
  const rootPassed = await inspectFile('drive.root', registry.drive.rootFolderId, 'Rivya Workspace Sandbox', 'application/vnd.google-apps.folder', null, 'system');
  if (!rootPassed) {
    result.checks.push({id: 'registered-resource-reads', status: 'not-run', reason: 'verified-private-sandbox-root-required'});
    return result;
  }
  for (const key of Object.keys(DRIVE_FOLDER_SPECS) as (keyof typeof DRIVE_FOLDER_SPECS)[]) {
    await inspectFile('drive.' + key, registry.drive.folders[key], DRIVE_FOLDER_SPECS[key], 'application/vnd.google-apps.folder', registry.drive.rootFolderId, 'system');
  }
  for (const group of Object.keys(WORKBOOK_SPECS) as WorkbookGroup[]) {
    const workbook = registry.workbooks[group];
    const workbookPassed = await inspectFile('workbook.' + group, workbook.workbookId, WORKBOOK_SPECS[group].title, 'application/vnd.google-apps.spreadsheet', registry.drive.rootFolderId, group);
    if (!workbookPassed) {
      result.checks.push({id: 'workbook.' + group + '.structure', status: 'not-run', reason: 'verified-workbook-identity-and-access-required'});
      continue;
    }
    await check('workbook.' + group + '.structure', async () => {
      const url = new URL('https://sheets.googleapis.com/v4/spreadsheets/' + workbook.workbookId);
      url.searchParams.set('includeGridData', 'true');
      for (const spec of Object.values(TAB_SPECS)) url.searchParams.append('ranges', "'" + spec.title + "'!A1:L100");
      url.searchParams.set('fields', 'spreadsheetId,properties(title),sheets(properties(sheetId,title,gridProperties),protectedRanges(range,warningOnly,unprotectedRanges,editors),data(startRow,startColumn,rowData(values(userEnteredValue,effectiveValue))))');
      validateGrid(await get(url), registry, group);
    });
  }
  const scriptPassed = await inspectFile('apps-script.project', registry.writer.scriptId, null, 'application/vnd.google-apps.script', null, 'system');
  if (!scriptPassed) {
    for (const id of ['apps-script.deployment', 'apps-script.deployed-source']) result.checks.push({id, status: 'not-run', reason: 'verified-script-identity-and-access-required'});
    return result;
  }
  const deploymentPassed = await check('apps-script.deployment', async () => {
    const url = new URL('https://script.googleapis.com/v1/projects/' + registry.writer.scriptId + '/deployments/' + registry.writer.deploymentId);
    const data = await get(url), config = data.deploymentConfig;
    requireState(data.deploymentId === registry.writer.deploymentId && object(config) && config.scriptId === registry.writer.scriptId && config.versionNumber === registry.writer.versionNumber && config.manifestFileName === 'appsscript', 'deployment-version-mismatch');
    const entries = list(data.entryPoints);
    requireState(entries.length === 1 && object(entries[0]) && entries[0].entryPointType === 'WEB_APP' && object(entries[0].webApp), 'unexpected-deployment-entry-points');
    const web = (entries[0] as JsonObject).webApp as JsonObject;
    requireState(web.url === registry.writer.endpoint && object(web.entryPointConfig) && web.entryPointConfig.executeAs === 'USER_DEPLOYING' && web.entryPointConfig.access === 'ANYONE_ANONYMOUS', 'gateway-webapp-policy-mismatch');
  });
  if (!deploymentPassed) {
    result.checks.push({id: 'apps-script.deployed-source', status: 'not-run', reason: 'verified-deployment-version-required'});
    return result;
  }
  await check('apps-script.deployed-source', async () => {
    const url = new URL('https://script.googleapis.com/v1/projects/' + registry.writer.scriptId + '/content'); url.searchParams.set('versionNumber', String(registry.writer.versionNumber));
    const data = await get(url), files = list(data.files);
    requireState(data.scriptId === registry.writer.scriptId && files.length === 2, 'deployed-source-membership-mismatch');
    const writer = files.find(file => object(file) && file.name === 'Writer' && file.type === 'SERVER_JS');
    const manifest = files.find(file => object(file) && file.name === 'appsscript' && file.type === 'JSON');
    requireState(object(writer) && typeof writer.source === 'string' && object(manifest) && typeof manifest.source === 'string', 'deployed-source-missing');
    const expectedWriter = await readFile(resolve(root, 'tools/google-workspace/apps-script/Writer.gs'), 'utf8');
    const expectedManifest = isolatedAppsScriptManifest();
    result.source.expectedWriterSha256 = sha(expectedWriter);
    result.source.expectedIsolatedManifestSha256 = sha(canonicalArtifactJson(expectedManifest));
    requireState(sha((writer as JsonObject).source as string) === result.source.expectedWriterSha256, 'deployed-writer-source-mismatch');
    try {requireState(same(JSON.parse((manifest as JsonObject).source as string), expectedManifest), 'deployed-manifest-mismatch');}
    catch (error) {if (error instanceof ReadinessError) throw error; fail('deployed-manifest-invalid');}
  });
  result.status = result.checks.every(item => item.status === 'passed') ? 'management-checks-passed' : 'blocked';
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    console.log('GET-only isolated Google installation readiness. Supply a private registry via RIVYA_GOOGLE_REGISTRY_PATH and OAuth bearer access via secure RIVYA_GOOGLE_ACCESS_TOKEN. Run: node --use-env-proxy --import tsx tools/google-workspace/verify-isolated.ts [--registry /private/registry.json]. Use the environment proxy; network policy still applies. No writes or full provider acceptance.'); return;
  }
  let registryPath = process.env.RIVYA_GOOGLE_REGISTRY_PATH;
  if (args.length) {
    if (args.length !== 2 || args[0] !== '--registry') fail('invalid-cli-arguments');
    registryPath = args[1];
  }
  let input: unknown;
  try {
    if (!registryPath) throw new ReadinessError('private-registry-path-required');
    const file = await stat(registryPath); requireState(file.isFile() && file.size <= 64 * 1024, 'invalid-private-registry-file');
    input = JSON.parse(await readFile(registryPath, 'utf8'));
  } catch {
    const result = receipt(() => new Date()); result.checks.push({id: 'registry', status: 'blocked', reason: 'private-registry-missing-unreadable-or-invalid'});
    console.log(JSON.stringify(result, null, 2)); process.exitCode = 1; return;
  }
  const result = await verifyIsolatedGoogleReadiness(input, {token: process.env.RIVYA_GOOGLE_ACCESS_TOKEN});
  console.log(JSON.stringify(result, null, 2)); process.exitCode = result.status === 'management-checks-passed' ? 0 : 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(() => {
    const result = receipt(() => new Date()); result.checks.push({id: 'cli', status: 'blocked', reason: 'readiness-command-failed'});
    console.log(JSON.stringify(result, null, 2)); process.exitCode = 1;
  });
}
