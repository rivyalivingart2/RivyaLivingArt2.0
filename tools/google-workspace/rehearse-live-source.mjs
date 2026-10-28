/** Read-only source rehearsal. Never writes rows, raw exports or credentials.
 * Usage: node --import tsx tools/google-workspace/rehearse-live-source.mjs
 *   --env-file <existing private environment file> --out <ignored evidence.json>
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseEnv} from 'node:util';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {neon, neonConfig} from '@neondatabase/serverless';
import {parseLosslessRow, planSourceRecord, reconcileSource, verifySourceShape} from './migration.mjs';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec.ts';
import {writePrivateMetadata} from './isolated-setup.ts';
import {createSourceCapacityMeasurement} from './source-capacity.mjs';

const MAX_ROWS_PER_TABLE = 20_000;
const MAX_BYTES = 128 * 1024 * 1024;
const columnsQuery = "select table_name,column_name,data_type,is_nullable from information_schema.columns where table_schema='public' and table_name like 'rivya_%' order by table_name,ordinal_position";
const constraintsQuery = "select t.relname as source_table,c.conname as name,pg_get_constraintdef(c.oid) as definition from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace where n.nspname='public' and t.relname like 'rivya_%' and c.contype in ('p','u','f') order by t.relname,c.conname";
const digest = value => createHash('sha256').update(canonicalArtifactJson(value)).digest('hex');

export async function rehearseLiveSource(sql, schema, {pageSize=null,chunkCharacters=null,onProgress=()=>{}}={}) {
  if(pageSize!==null&&(!Number.isSafeInteger(pageSize)||pageSize<1||pageSize>100))throw Error('INVALID_PAGE_BUDGET');
  if(chunkCharacters!==null&&(pageSize===null||!Number.isSafeInteger(chunkCharacters)||chunkCharacters<1||chunkCharacters>65536))throw Error('INVALID_CHUNK_BUDGET');
  if(typeof onProgress!=='function')throw Error('INVALID_PROGRESS_CALLBACK');
  onProgress({stage:'schema'});
  const beforeColumns = await sql.query(columnsQuery);
  const names = [...new Set(beforeColumns.map(column => column.table_name))];
  if (!names.length || names.some(name => !/^rivya_[a-z0-9_]+$/.test(name) || !schema.tables.some(table => table.sourceTable === name))) throw Error('UNMAPPED_SOURCE_TABLE');
  const measuredSchema = {...schema, tables: schema.tables.filter(table => names.includes(table.sourceTable))};
  const projections = measuredSchema.tables.map(table => {
    if (table.fields.some(field => !/^[a-z0-9_]+$/.test(field.name))) throw Error('INVALID_COLUMN');
    return table.fields.map(field => '"' + field.name + '"' + (field.representation === 'decimal-string' ? '::text as "' + field.name + '"' : '')).join(',');
  });
  const from=(table,index)=>'select '+projections[index]+' from public."'+table.sourceTable+'"';
  const fingerprint=(table,index)=>'select count(*)::int as count, md5(coalesce(string_agg(row_hash,\'\' order by row_hash collate "C"),\'\')) as digest from (select md5(row_to_json(source)::text) as row_hash from ('+from(table,index)+') source) hashes';
  // The unpaged path retains one transaction. Paged reads must reproduce the
  // exact initial projection fingerprints, with a matching final source read.
  onProgress({stage:'initial-source',tables:measuredSchema.tables.length});
  const [columns, constraints, ...initial] = await sql.transaction([
    sql.query(columnsQuery), sql.query(constraintsQuery),
    ...measuredSchema.tables.map((table, index) => sql.query(pageSize===null?'select row_to_json(source)::text as row from ('+from(table,index)+' limit '+(MAX_ROWS_PER_TABLE+1)+') source':fingerprint(table,index))),
  ], {readOnly: true, isolationLevel: 'RepeatableRead'});
  if (canonicalArtifactJson(beforeColumns) !== canonicalArtifactJson(columns)) throw Error('SOURCE_SCHEMA_CHANGED');
  verifySourceShape(measuredSchema, columns, constraints);
  const results=[];
  let pagesRead=0,chunkReads=0,chunkBatches=0,transportBytes=0;
  const account=fragment=>{if(typeof fragment!=='string')throw Error('INVALID_SOURCE_RESPONSE');transportBytes+=Buffer.byteLength(fragment,'utf8');if(transportBytes>MAX_BYTES)throw Error('SOURCE_BYTE_BUDGET');};
  if(pageSize===null)results.push(...initial);
  else {
    for(const [index,table] of measuredSchema.tables.entries()){
      const expected=initial[index][0];
      if(!Number.isSafeInteger(expected?.count)||expected.count<0||expected.count>MAX_ROWS_PER_TABLE||!/^[a-f0-9]{32}$/.test(expected.digest))throw Error('SOURCE_ROW_BUDGET');
      const rows=[];
      onProgress({stage:'table',table:table.sourceTable,rows:expected.count});
      const order=table.primaryKey.map(key=>{if(!/^[a-z0-9_]+$/.test(key))throw Error('INVALID_COLUMN');return '"'+key+'"';}).join(',');
      for(let offset=0;offset<expected.count;offset+=pageSize){
        const projected='select row_to_json(source)::text as row from ('+from(table,index)+' order by '+order+' limit '+pageSize+' offset '+offset+') source';
        const query=chunkCharacters===null?projected:'select substring(row from 1 for '+chunkCharacters+') as row, char_length(row)::int as characters from ('+projected+') encoded';
        const [page]=await sql.transaction([sql.query(query)],{readOnly:true,isolationLevel:'RepeatableRead'});
        if(++pagesRead>2000||page.length!==Math.min(pageSize,expected.count-offset))throw Error('SOURCE_CHANGED_DURING_PAGING');
        for(const [rowIndex,item] of page.entries()){
          account(item.row);
          if(chunkCharacters===null)continue;
          if(!Number.isSafeInteger(item.characters)||item.characters<1||item.characters>MAX_BYTES||Array.from(item.row).length!==Math.min(chunkCharacters,item.characters))throw Error('INVALID_SOURCE_RESPONSE');
          // At most four fragments per read-only transaction bound the response
          // and round trips. Initial/readback/final hashes still reject drift.
          for(let groupStart=chunkCharacters+1;groupStart<=item.characters;groupStart+=chunkCharacters*4){
            const encoded='select row_to_json(source)::text as row from ('+from(table,index)+' order by '+order+' limit 1 offset '+(offset+rowIndex)+') source';
            const starts=Array.from({length:4},(_,i)=>groupStart+i*chunkCharacters).filter(start=>start<=item.characters);
            chunkReads+=starts.length;if(chunkReads>4000)throw Error('SOURCE_CHUNK_BUDGET');
            chunkBatches++;
            const parts=await sql.transaction(starts.map(start=>sql.query('select substring(row from '+start+' for '+chunkCharacters+') as fragment, char_length(row)::int as characters from ('+encoded+') encoded')),{readOnly:true,isolationLevel:'RepeatableRead'});
            for(const [partIndex,part] of parts.entries()){
              const start=starts[partIndex];
              if(part.length!==1||part[0].characters!==item.characters||typeof part[0].fragment!=='string'||Array.from(part[0].fragment).length!==Math.min(chunkCharacters,item.characters-start+1))throw Error('SOURCE_CHANGED_DURING_PAGING');
              account(part[0].fragment);item.row+=part[0].fragment;
            }
          }
        }
        rows.push(...page);
        if(pagesRead%50===0)onProgress({stage:'pages',pagesRead,chunkReads,chunkBatches,transportBytes});
      }
      const hashes=rows.map(x=>createHash('md5').update(x.row,'utf8').digest('hex')).sort().join('');
      if(createHash('md5').update(hashes).digest('hex')!==expected.digest)throw Error('SOURCE_CHANGED_DURING_PAGING');
      results.push(rows);
    }
    onProgress({stage:'final-source',pagesRead,transportBytes});
    const [finalColumns,finalConstraints,...final]=await sql.transaction([sql.query(columnsQuery),sql.query(constraintsQuery),...measuredSchema.tables.map((table,index)=>sql.query(fingerprint(table,index)))],{readOnly:true,isolationLevel:'RepeatableRead'});
    if(canonicalArtifactJson(finalColumns)!==canonicalArtifactJson(columns)||canonicalArtifactJson(finalConstraints)!==canonicalArtifactJson(constraints)||JSON.stringify(initial)!==JSON.stringify(final))throw Error('SOURCE_CHANGED_DURING_PAGING');
  }
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
  onProgress({stage:'reconcile',pagesRead,sourceBytes});
  const relationships = reconcileSource(measuredSchema, source);
  const capacity=createSourceCapacityMeasurement();
  const tables = measuredSchema.tables.map(table => {
    const rows = source[table.sourceTable], plans = rows.map(row => planSourceRecord(table, row));
    capacity.observe(table,plans);
    const identity = plans.map(plan => [plan.record?.recordId ?? plan.recordId, plan.record?.payloadSha256 ?? plan.payloadSha256]).sort((a,b) => a[0].localeCompare(b[0]));
    if (new Set(identity.map(item => item[0])).size !== rows.length) throw Error('DUPLICATE_STABLE_ID');
    return {table: table.sourceTable, rows: rows.length, inline: plans.filter(plan => plan.disposition === 'inline').length,
      driveArtifactsRequired: plans.filter(plan => plan.disposition === 'drive-artifact-required').length,
      sourceIdentityPayloadSha256: digest(identity), stableIdsUnique: true, losslessEncodingVerified: true};
  });
  return {schemaVersion: 1, kind: 'live-source-read-only-rehearsal', checkedAt: new Date().toISOString(),
    sourceTransaction: pageSize===null?'REPEATABLE READ READ ONLY':'PAGED READ ONLY; initial/readback/final projection fingerprints matched', pageSize,chunkCharacters,pagesRead,chunkReads,chunkBatches,sourceBytes, relationships, tables, capacity:capacity.finish(),
    absentMappedTables: schema.tables.filter(table => !names.includes(table.sourceTable)).map(table => table.sourceTable),
    productionWrites: 0, targetWrites: 0, rawRowsPersisted: 0, targetReconciled: false, backupCreated: false, restoreVerified: false};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  let lastStage='arguments';
  try {
    const args = process.argv.slice(2);
    if (args.length !== 4 || args[0] !== '--env-file' || args[2] !== '--out') throw Error('INVALID_ARGUMENTS');
    const out = resolve(args[3]);
    const privateRoot = resolve('test-results') + '/';
    if (!out.replaceAll('\\','/').startsWith(privateRoot.replaceAll('\\','/'))) throw Error('OUTPUT_MUST_BE_IGNORED_TEST_RESULTS');
    const config = parseEnv(readFileSync(args[1], 'utf8'));
    if (!config.DATABASE_URL) throw Error('SOURCE_NOT_CONFIGURED');
    const schema = JSON.parse(readFileSync('src/lib/google-workspace/schema.json','utf8'));
    // Each request has its own deadline; a shared signal alone would expire
    // midway through an otherwise healthy series of bounded page reads.
    const totalDeadline=AbortSignal.timeout(30*60*1000);
    neonConfig.fetchFunction=(url,options)=>fetch(url,{...options,signal:AbortSignal.any([totalDeadline,AbortSignal.timeout(45000)])});
    const sourceReaderSha256=createHash('sha256').update(readFileSync(new URL(import.meta.url),'utf8').replaceAll('\r\n','\n')).digest('hex');
    const report = await rehearseLiveSource(neon(config.DATABASE_URL), schema,{pageSize:10,chunkCharacters:32768,onProgress(event){lastStage=event.stage;console.error(JSON.stringify({kind:'incomplete-read-progress',...event}));}});
    report.sourceReaderSha256=sourceReaderSha256;
    await writePrivateMetadata(out, report);
    console.log(JSON.stringify({...report, tables: report.tables.map(table => ({table: table.table, rows: table.rows, inline: table.inline, driveArtifactsRequired: table.driveArtifactsRequired, stableIdsUnique: table.stableIdsUnique, losslessEncodingVerified: table.losslessEncodingVerified}))}));
  } catch (error) {
    // Never echo query text, connection strings, rows or provider error bodies.
    const code = /^[A-Z_]+$/.test(error?.code ?? '') ? error.code : /^[A-Z_]+$/.test(error?.message ?? '') ? error.message : 'SOURCE_REHEARSAL_FAILED';
    console.error(JSON.stringify({ok: false, code, lastStage, productionWrites: 0, targetWrites: 0}));
    process.exitCode = 1;
  }
}
