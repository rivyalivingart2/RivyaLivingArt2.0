import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Offline planning only. No credentials, provider calls, migration or activation.
const workbookKeys = ['content', 'operations', 'security', 'system'];
const fail = () => { throw new Error('Invalid or stale capacity planning input; no provider action performed.'); };
const integer = value => Number.isSafeInteger(value) && value >= 0;
const sha256 = value => createHash('sha256').update(value).digest('hex');

export function assessCapacity(profile, schema, policy) {
  if (profile?.kind !== 'source-census-not-target-migration' || !Array.isArray(profile.tables) || !Array.isArray(schema?.tables) ||
      !integer(profile.totalRows) || !integer(profile.sourceBytes) || typeof profile.observedAt !== 'string' || !Number.isFinite(Date.parse(profile.observedAt))) fail();
  const limits = policy?.writer;
  if (!limits || !['sandboxGridRows','defaultMaxRows','gatewayMaxRows','readsPerMutation','writesPerMutation','readsPerReadback','userReadsPerMinute','userWritesPerMinute'].every(key => integer(limits[key]) && limits[key] > 0) ||
      limits.sandboxGridRows < 2 || limits.defaultMaxRows < 2 || limits.gatewayMaxRows < 2) fail();
  const mapping = new Map();
  for (const row of schema.tables) {
    if (!/^rivya_[a-z_]+$/.test(row.sourceTable) || !workbookKeys.includes(row.workbook) || mapping.has(row.sourceTable)) fail();
    mapping.set(row.sourceTable, row.workbook);
  }
  const observed = new Map();
  for (const row of profile.tables) {
    if (!mapping.has(row.table) || observed.has(row.table) || !integer(row.rows) || !integer(row.inline) || !integer(row.driveArtifactsRequired) ||
        row.inline + row.driveArtifactsRequired !== row.rows) fail();
    // Deliberately project only aggregate counts, never arbitrary provider fields.
    observed.set(row.table, {rows:row.rows, inline:row.inline, driveArtifactsRequired:row.driveArtifactsRequired});
  }
  if ([...observed.values()].reduce((n,row)=>n+row.rows,0) !== profile.totalRows) fail();
  const tables = [...mapping].map(([table,workbook]) => ({table,workbook,sourceState:observed.has(table)?'observed':'absent',...(observed.get(table) ?? {rows:null,inline:null,driveArtifactsRequired:null})}));
  const workbooks = workbookKeys.map(workbook => {
    const rows = tables.filter(t=>t.workbook===workbook && t.sourceState==='observed');
    const sourceRows = rows.reduce((n,t)=>n+t.rows,0), requiredRowsPerCanonicalSheet = sourceRows+1;
    return {
      workbook, sourceRows, inlineRows:rows.reduce((n,t)=>n+t.inline,0), driveDocumentsRequired:rows.reduce((n,t)=>n+t.driveArtifactsRequired,0),
      assumedInitialMutations:sourceRows, requiredRowsPerCanonicalSheet,
      sandboxRowsShort:Math.max(0,requiredRowsPerCanonicalSheet-limits.sandboxGridRows),
      defaultRowsShort:Math.max(0,requiredRowsPerCanonicalSheet-limits.defaultMaxRows),
      theoreticalGatewayHistoryHeadroom:Math.max(0,limits.gatewayMaxRows-requiredRowsPerCanonicalSheet),
    };
  });
  const noContentionMutationCeiling = Math.min(Math.floor(limits.userReadsPerMinute/limits.readsPerMutation),Math.floor(limits.userWritesPerMinute/limits.writesPerMutation));
  const readbackMutationCeiling = Math.min(Math.floor(limits.userReadsPerMinute/(limits.readsPerMutation+limits.readsPerReadback)),Math.floor(limits.userWritesPerMinute/limits.writesPerMutation));
  return {
    schemaVersion:1, kind:'offline-capacity-assessment', status:'blocked-pending-provider-and-byte-measurements', sourceObservedAt:profile.observedAt,
    sourceRows:profile.totalRows, sourceBytes:profile.sourceBytes, observedTables:observed.size, absentTables:tables.filter(t=>t.sourceState==='absent').map(t=>t.table), tables, workbooks,
    assumptions:['One canonical record and one initial mutation per source row; four canonical tabs plus one control tab per boundary.',
      'One header row per canonical tab. No batching, retries, existing sandbox probe rows, staging rows or later writes included.',
      'History headroom is a row-only upper bound, not usable measured capacity. Character, wire-byte, latency and quota limits also apply.',
      'API-call arithmetic assumes one execution identity shares the documented per-user quota; actual installation accounting is unverified.'],
    quotaModel:{readsPerMutation:limits.readsPerMutation,writesPerMutation:limits.writesPerMutation,readsPerIndependentReadback:limits.readsPerReadback,noContentionWholeMutationsPerMinute:noContentionMutationCeiling,withReadbackWholeMutationsPerMinute:readbackMutationCeiling,sourceImportMinutesAtWholeMinuteBudget:readbackMutationCeiling?Math.ceil(profile.totalRows/readbackMutationCeiling):null},
    unmeasured:['canonicalSnapshotCharacters','signedResponseBytes','DriveRemainingBytes','peakDemand','p95Latency','lockContention','retentionGrowth','restoreDuration','installedRegistryLimits'],
    targetRowsVerified:null, providerVerified:false, runtimeActivated:false, databaseExceptionSelected:false,
  };
}

export async function buildCapacityPlan(repo, profilePath, policyPath) {
  const readJson = async path => JSON.parse(await readFile(resolve(repo,path),'utf8'));
  const policy = await readJson(policyPath);
  if (policy.sourceHashEncoding!=='utf8-lf' || !Array.isArray(policy.sourceBindings) || policy.sourceBindings.length!==4) fail();
  for (const binding of policy.sourceBindings) {
    if (!['src/lib/google-workspace/controlled-writer.ts','src/lib/google-workspace/writer-gateway.ts','src/lib/google-workspace/schema.json','tools/google-workspace/apps-script/Writer.gs'].includes(binding.path) ||
        !/^[a-f0-9]{64}$/.test(binding.sha256) || sha256((await readFile(resolve(repo,binding.path),'utf8')).replace(/\r\n/g,'\n'))!==binding.sha256) fail();
  }
  if (new Set(policy.sourceBindings.map(x=>x.path)).size!==4) fail();
  return assessCapacity(await readJson(profilePath),await readJson('src/lib/google-workspace/schema.json'),policy);
}

if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const args=process.argv.slice(2);
    if(args.length!==2 || args[0]!=='--out') fail();
    const repo=fileURLToPath(new URL('../',import.meta.url));
    const report=await buildCapacityPlan(repo,'docs/netlify-free-first-2026-10-28/phase1/source-profile.json','docs/netlify-free-first-2026-10-28/phase1/capacity-policy.json');
    // Exclusive output prevents overwriting source or an earlier receipt.
    await writeFile(resolve(args[1]),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
    console.log(JSON.stringify({status:report.status,sourceRows:report.sourceRows,providerCalls:0,providerWrites:0}));
  } catch { console.error('Capacity planning failed; invalid/stale input or unavailable output. No provider action performed.'); process.exitCode=1; }
}
