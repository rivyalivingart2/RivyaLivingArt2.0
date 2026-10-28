/** Read-only source rehearsal. Never writes rows, raw exports or credentials.
 * Usage: node --import tsx tools/google-workspace/rehearse-live-source.mjs
 *   --env-file <existing private environment file> --out <ignored evidence.json>
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseEnv} from 'node:util';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {neon} from '@neondatabase/serverless';
import {parseLosslessRow, planSourceRecord, reconcileSource, verifySourceShape} from './migration.mjs';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec.ts';
import {writePrivateMetadata} from './isolated-setup.ts';

const MAX_ROWS_PER_TABLE = 20_000;
const MAX_BYTES = 128 * 1024 * 1024;
const columnsQuery = "select table_name,column_name,data_type,is_nullable from information_schema.columns where table_schema='public' and table_name like 'rivya_%' order by table_name,ordinal_position";
const constraintsQuery = "select t.relname as source_table,c.conname as name,pg_get_constraintdef(c.oid) as definition from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace where n.nspname='public' and t.relname like 'rivya_%' and c.contype in ('p','u','f') order by t.relname,c.conname";
const digest = value => createHash('sha256').update(canonicalArtifactJson(value)).digest('hex');

export async function rehearseLiveSource(sql, schema) {
  const beforeColumns = await sql.query(columnsQuery);
  const names = [...new Set(beforeColumns.map(column => column.table_name))];
  if (!names.length || names.some(name => !/^rivya_[a-z0-9_]+$/.test(name) || !schema.tables.some(table => table.sourceTable === name))) throw Error('UNMAPPED_SOURCE_TABLE');
  const measuredSchema = {...schema, tables: schema.tables.filter(table => names.includes(table.sourceTable))};
  const projections = measuredSchema.tables.map(table => {
    if (table.fields.some(field => !/^[a-z0-9_]+$/.test(field.name))) throw Error('INVALID_COLUMN');
    return table.fields.map(field => '"' + field.name + '"' + (field.representation === 'decimal-string' ? '::text as "' + field.name + '"' : '')).join(',');
  });
  // Metadata and every row are read in the same repeatable-read transaction.
  const [columns, constraints, ...results] = await sql.transaction([
    sql.query(columnsQuery), sql.query(constraintsQuery),
    ...measuredSchema.tables.map((table, index) => sql.query('select row_to_json(source)::text as row from (select ' + projections[index] + ' from public."' + table.sourceTable + '" limit ' + (MAX_ROWS_PER_TABLE + 1) + ') source')),
  ], {readOnly: true, isolationLevel: 'RepeatableRead'});
  if (canonicalArtifactJson(beforeColumns) !== canonicalArtifactJson(columns)) throw Error('SOURCE_SCHEMA_CHANGED');
  verifySourceShape(measuredSchema, columns, constraints);
  const source = {};
  let sourceBytes = 0;
  for (const [index, table] of measuredSchema.tables.entries()) {
    if (results[index].length > MAX_ROWS_PER_TABLE) throw Error('SOURCE_ROW_BUDGET');
    source[table.sourceTable] = results[index].map(result => {
      sourceBytes += Buffer.byteLength(result.row, 'utf8');
      if (sourceBytes > MAX_BYTES) throw Error('SOURCE_BYTE_BUDGET');
      return parseLosslessRow(result.row);
    });
  }
  const relationships = reconcileSource(measuredSchema, source);
  const tables = measuredSchema.tables.map(table => {
    const rows = source[table.sourceTable], plans = rows.map(row => planSourceRecord(table, row));
    const identity = plans.map(plan => [plan.record?.recordId ?? plan.recordId, plan.record?.payloadSha256 ?? plan.payloadSha256]).sort((a,b) => a[0].localeCompare(b[0]));
    if (new Set(identity.map(item => item[0])).size !== rows.length) throw Error('DUPLICATE_STABLE_ID');
    return {table: table.sourceTable, rows: rows.length, inline: plans.filter(plan => plan.disposition === 'inline').length,
      driveArtifactsRequired: plans.filter(plan => plan.disposition === 'drive-artifact-required').length,
      sourceIdentityPayloadSha256: digest(identity), stableIdsUnique: true, losslessEncodingVerified: true};
  });
  return {schemaVersion: 1, kind: 'live-source-read-only-rehearsal', checkedAt: new Date().toISOString(),
    sourceTransaction: 'REPEATABLE READ READ ONLY', sourceBytes, relationships, tables,
    absentMappedTables: schema.tables.filter(table => !names.includes(table.sourceTable)).map(table => table.sourceTable),
    productionWrites: 0, targetWrites: 0, rawRowsPersisted: 0, targetReconciled: false, backupCreated: false, restoreVerified: false};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 4 || args[0] !== '--env-file' || args[2] !== '--out') throw Error('INVALID_ARGUMENTS');
    const out = resolve(args[3]);
    const privateRoot = resolve('test-results') + '/';
    if (!out.replaceAll('\\','/').startsWith(privateRoot.replaceAll('\\','/'))) throw Error('OUTPUT_MUST_BE_IGNORED_TEST_RESULTS');
    const config = parseEnv(readFileSync(args[1], 'utf8'));
    if (!config.DATABASE_URL) throw Error('SOURCE_NOT_CONFIGURED');
    const schema = JSON.parse(readFileSync('src/lib/google-workspace/schema.json','utf8'));
    const report = await rehearseLiveSource(neon(config.DATABASE_URL), schema);
    await writePrivateMetadata(out, report);
    console.log(JSON.stringify({...report, tables: report.tables.map(table => ({table: table.table, rows: table.rows, inline: table.inline, driveArtifactsRequired: table.driveArtifactsRequired, stableIdsUnique: table.stableIdsUnique, losslessEncodingVerified: table.losslessEncodingVerified}))}));
  } catch (error) {
    // Never echo query text, connection strings, rows or provider error bodies.
    const code = /^[A-Z_]+$/.test(error?.code ?? '') ? error.code : /^[A-Z_]+$/.test(error?.message ?? '') ? error.message : 'SOURCE_REHEARSAL_FAILED';
    console.error(JSON.stringify({ok: false, code, productionWrites: 0, targetWrites: 0}));
    process.exitCode = 1;
  }
}
