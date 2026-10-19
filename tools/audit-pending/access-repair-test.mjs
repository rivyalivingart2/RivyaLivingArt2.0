/** Local-only: tests the exact proposed SQL in a new synthetic PostgreSQL cluster. */
import assert from 'node:assert/strict';
import {appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {execFile, spawn} from 'node:child_process';
import {promisify} from 'node:util';
import {createServer} from 'node:net';
import {pathToFileURL} from 'node:url';
import {createHash, randomUUID} from 'node:crypto';

const run = promisify(execFile);
const base = resolve('test-results/audit-access-repair');
const root = resolve(base, 'run-' + new Date().toISOString().replace(/[:.]/g, '-'));
const data = resolve(root, 'pgdata');
assert.ok(root.startsWith(resolve('test-results') + sep));
assert.ok(!existsSync(root), 'Never reuse a previous test database.');
const bin = 'C:/Users/gonda/Documents/Codex/2026-09-23/continue-the-approved-rivyalivingart-redesign-read/work/tooling/postgresql-18.6/pgsql/bin';
const pgModule = 'C:/Users/gonda/Documents/Codex/2026-09-30/keep-rivyalivingart2-0-as-the-base/work/tooling/local-postgres/node_modules/pg/lib/index.js';
for (const name of ['initdb.exe', 'pg_ctl.exe', 'postgres.exe']) assert.ok(existsSync(resolve(bin, name)));
await new Promise((accept, reject) => {
  const server = createServer();
  server.once('error', reject);
  server.listen(55442, '127.0.0.1', () => server.close(accept));
});
const env = {...process.env};
for (const key of Object.keys(env)) {
  if (/DATABASE|BLOB|NEON|VERCEL|STUDIO_|^RIVYA_|^PG|^NODE_OPTIONS$/.test(key)) delete env[key];
}
mkdirSync(root, {recursive: true});
writeFileSync(resolve(root, 'SYNTHETIC-ONLY.txt'), 'New disposable PostgreSQL on 127.0.0.1:55442. No production connection or copied records.\n', {flag: 'wx'});
const control = args => new Promise((accept, reject) => {
  const child = spawn(resolve(bin, 'pg_ctl.exe'), args, {env, windowsHide: true, stdio: 'ignore'});
  child.once('error', reject);
  child.once('exit', code => code === 0 ? accept() : reject(Error('pg_ctl exited ' + code)));
});
const proposalPath = resolve('tools/audit-pending/access-repair-proposed.sql');
const verifyPath = resolve('tools/audit-pending/access-repair-verify.sql');
const proposal = readFileSync(proposalPath, 'utf8');
const verification = readFileSync(verifyPath, 'utf8');
const hash = text => createHash('sha256').update(text).digest('hex');
const report = {
  at: new Date().toISOString(),
  scope: 'Exact proposed SQL; new synthetic local PostgreSQL only. No production, cloud, HTTP or account actions.',
  proposalSha256: hash(proposal), verificationSha256: hash(verification),
  target: {host: '127.0.0.1', port: 55442, database: 'neondb', owner: 'neondb_owner', runtime: 'rivya_runtime_20260924'},
  checks: [], status: 'running', productionExecuted: false, privateRecordsCopied: 0,
};
const pass = name => report.checks.push({name, status: 'pass'});
let started = false;
let owner, runtime;
try {
  const init = await run(resolve(bin, 'initdb.exe'), ['-D', data, '-U', 'neondb_owner', '--auth-local=trust', '--auth-host=trust', '--encoding=UTF8', '--locale=C'], {env, windowsHide: true, maxBuffer: 2_000_000});
  writeFileSync(resolve(root, 'init.log'), init.stdout + init.stderr);
  appendFileSync(resolve(data, 'postgresql.conf'), "\nlisten_addresses = '127.0.0.1'\nport = 55442\nmax_connections = 12\nshared_buffers = '16MB'\n");
  await control(['start', '-D', data, '-l', resolve(root, 'postgres.log'), '-w', '-t', '30']);
  started = true;
  const {default: pg} = await import(pathToFileURL(pgModule).href);
  const connect = async (user = 'neondb_owner', database = 'neondb') => {
    const client = new pg.Client({host: '127.0.0.1', port: 55442, user, database});
    await client.connect();
    assert.deepEqual((await client.query('SELECT current_database() AS database,current_user AS role,host(inet_server_addr()) AS host,inet_server_port() AS port')).rows[0], {database, role: user, host: '127.0.0.1', port: 55442});
    return client;
  };
  const admin = await connect('neondb_owner', 'postgres');
  try {
    const actual = (await admin.query('SHOW data_directory')).rows[0].data_directory;
    assert.equal(resolve(actual).toLowerCase(), data.toLowerCase(), 'Must own this precise new cluster.');
    assert.equal((await admin.query("SELECT count(*)::int AS n FROM pg_database WHERE datname='neondb'")).rows[0].n, 0);
    await admin.query('CREATE DATABASE neondb OWNER neondb_owner');
    await admin.query('CREATE ROLE rivya_runtime_20260924 LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS');
    pass('New cluster identity and exact data directory verified before any fixture writes');
    await assert.rejects(admin.query(proposal), /ACCESS_REPAIR_TARGET/);
    await admin.query('ROLLBACK');
    assert.equal((await admin.query("SELECT to_regclass('public.rivya_access_requests')::text AS name")).rows[0].name, null);
    pass('Wrong database refuses the unmodified proposal without creating a table');
  } finally { await admin.end(); }
  owner = await connect();
  assert.equal(resolve((await owner.query('SHOW data_directory')).rows[0].data_directory).toLowerCase(), data.toLowerCase());
  await owner.query(`
    CREATE TABLE public.rivya_staff (
      id uuid PRIMARY KEY,login text UNIQUE NOT NULL,name text NOT NULL,password_hash text NOT NULL,
      role text NOT NULL CHECK(role IN ('admin','editor')),active boolean NOT NULL DEFAULT true,
      version integer NOT NULL DEFAULT 1,created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE public.rivya_studio_sessions (
      token_hash text PRIMARY KEY,credential_version text NOT NULL,expires_at timestamptz NOT NULL,
      idle_expires_at timestamptz NOT NULL,staff_id uuid REFERENCES public.rivya_staff(id)
    );
    GRANT SELECT,INSERT,UPDATE ON public.rivya_staff,public.rivya_studio_sessions TO rivya_runtime_20260924;
  `);
  const staffId = randomUUID();
  await owner.query("INSERT INTO public.rivya_staff(id,login,name,password_hash,role) VALUES($1,'synthetic-staff','Synthetic preservation record','not-a-real-password','editor')", [staffId]);
  await owner.query("INSERT INTO public.rivya_studio_sessions VALUES('synthetic-session','synthetic-credential',now()+interval '1 hour',now()+interval '30 minutes',$1)", [staffId]);
  const preserved = async () => {
    const rows = {};
    for (const table of ['rivya_staff', 'rivya_studio_sessions']) {
      rows[table] = (await owner.query(`SELECT * FROM public.${table} ORDER BY 1`)).rows;
    }
    const metadata = (await owner.query("SELECT c.relname,c.relowner,c.relacl::text,c.relrowsecurity,c.relforcerowsecurity FROM pg_class c WHERE c.oid IN ('public.rivya_staff'::regclass,'public.rivya_studio_sessions'::regclass) ORDER BY c.relname")).rows;
    const schema = (await owner.query("SELECT nspacl::text FROM pg_namespace WHERE nspname='public'")).rows;
    const defaults = (await owner.query('SELECT defaclrole,defaclnamespace,defaclobjtype,defaclacl::text FROM pg_default_acl ORDER BY 1,2,3')).rows;
    return hash(JSON.stringify({rows, metadata, schema, defaults}));
  };
  const before = await preserved();
  const absent = async () => assert.equal((await owner.query("SELECT to_regclass('public.rivya_access_requests')::text AS name")).rows[0].name, null);
  const refuses = async (client, pattern, name) => {
    const guardBefore = await preserved();
    await assert.rejects(client.query(proposal), pattern);
    await client.query('ROLLBACK');
    await absent();
    assert.equal(await preserved(), guardBefore, 'Rejected proposal must preserve its existing fixture state.');
    pass(name);
  };
  runtime = await connect('rivya_runtime_20260924');
  await refuses(runtime, /ACCESS_REPAIR_TARGET/, 'Wrong connection role refuses the exact proposal');
  await owner.query("SET default_transaction_read_only='on'");
  await refuses(owner, /ACCESS_REPAIR_TARGET/, 'Read-only transaction refuses the exact proposal');
  await owner.query("SET default_transaction_read_only='off'");
  await runtime.end(); runtime = null;
  await owner.query('REVOKE ALL ON public.rivya_staff,public.rivya_studio_sessions FROM rivya_runtime_20260924; DROP ROLE rivya_runtime_20260924');
  await refuses(owner, /ACCESS_REPAIR_ROLE/, 'Missing runtime role fails before DDL');
  await owner.query('CREATE ROLE rivya_runtime_20260924 LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS; GRANT SELECT,INSERT,UPDATE ON public.rivya_staff,public.rivya_studio_sessions TO rivya_runtime_20260924');
  // The recreated local role has a new OID; compare preservation after restoring
  // the equivalent fixture ACL, never mistake an OID replacement for app changes.
  const stableBefore = await preserved();
  await owner.query('GRANT CREATE ON SCHEMA public TO rivya_runtime_20260924');
  await refuses(owner, /ACCESS_REPAIR_ROLE/, 'Overprivileged runtime schema access fails closed');
  await owner.query('REVOKE CREATE ON SCHEMA public FROM rivya_runtime_20260924');
  await owner.query('ALTER TABLE public.rivya_staff RENAME COLUMN name TO fixture_name');
  await refuses(owner, /ACCESS_REPAIR_SIGNATURE/, 'Wrong staff column signature fails before DDL');
  await owner.query('ALTER TABLE public.rivya_staff RENAME COLUMN fixture_name TO name');
  await owner.query('ALTER TABLE public.rivya_studio_sessions ENABLE ROW LEVEL SECURITY');
  await refuses(owner, /ACCESS_REPAIR_SIGNATURE/, 'Unexpected authentication RLS fails closed');
  await owner.query('ALTER TABLE public.rivya_studio_sessions DISABLE ROW LEVEL SECURITY');
  await owner.query('CREATE TABLE public.rivya_access_queue(marker text)');
  await refuses(owner, /ACCESS_REPAIR_EXISTS/, 'Pre-existing target index name is preserved and refused');
  await owner.query('DROP TABLE public.rivya_access_queue');
  await owner.query('ALTER DEFAULT PRIVILEGES GRANT SELECT ON TABLES TO pg_monitor');
  await refuses(owner, /ACCESS_REPAIR_ACL/, 'Unexpected default grantee rolls back new table, indexes and grants atomically');
  for (const name of ['rivya_access_open_login', 'rivya_access_token', 'rivya_access_queue']) {
    assert.equal((await owner.query('SELECT to_regclass($1)::text AS name', ['public.' + name])).rows[0].name, null);
  }
  await owner.query('ALTER DEFAULT PRIVILEGES REVOKE SELECT ON TABLES FROM pg_monitor');
  // Revoke a temporary explicit schema grant can leave an equivalent serialized
  // ACL. Capture the baseline immediately before applying the exact proposal.
  const beforeRepair = await preserved();
  const publicRelations = async () => (await owner.query("SELECT relname FROM pg_class WHERE relnamespace='public'::regnamespace ORDER BY relname")).rows.map(r => r.relname);
  const beforeRelations = await publicRelations();
  await owner.query(proposal);
  assert.deepEqual((await publicRelations()).filter(name => !beforeRelations.includes(name)),
    ['rivya_access_open_login','rivya_access_queue','rivya_access_requests','rivya_access_requests_pkey','rivya_access_token']);
  pass('Exact proposed SQL creates only the target table and expected three secondary indexes');
  const verifyResults = await owner.query(verification);
  assert.equal(verifyResults.at(-2).rows.length, 0);
  assert.equal(verifyResults.at(-1).command, 'ROLLBACK');
  pass('Exact read-only verification completes with a zero-row application projection and ROLLBACK');
  const columns = (await owner.query("SELECT attname,atttypid::regtype::text AS type,attnotnull FROM pg_attribute WHERE attrelid='public.rivya_access_requests'::regclass AND attnum>0 AND NOT attisdropped ORDER BY attnum")).rows;
  assert.deepEqual(columns.map(c => c.attname), ['id','kind','login','name','contact','status','staff_id','token_hash','credential_version','expires_at','created_at','updated_at','decided_by','version']);
  assert.deepEqual(columns.map(c => c.type), ['uuid','text','text','text','text','text','uuid','text','integer','timestamp with time zone','timestamp with time zone','timestamp with time zone','text','integer']);
  assert.deepEqual(columns.filter(c => c.attnotnull).map(c => c.attname), ['id','kind','login','name','contact','status','created_at','updated_at','version']);
  pass('All 14 column types and required/nullability contracts match existing migration');
  const indexes = (await owner.query("SELECT i.relname AS name,x.indisunique,x.indisvalid,x.indisready,pg_get_indexdef(i.oid) AS definition FROM pg_index x JOIN pg_class i ON i.oid=x.indexrelid WHERE x.indrelid='public.rivya_access_requests'::regclass ORDER BY i.relname")).rows;
  assert.deepEqual(indexes.map(i => i.name), ['rivya_access_open_login','rivya_access_queue','rivya_access_requests_pkey','rivya_access_token']);
  assert.ok(indexes.every(i => i.indisready && i.indisvalid));
  assert.equal(indexes.filter(i => i.indisunique).length, 3);
  pass('Three secondary indexes and implicit primary-key index are valid and ready');
  const grants = (await owner.query("SELECT pg_get_userbyid(a.grantee) AS role,a.privilege_type,a.is_grantable FROM pg_class c CROSS JOIN LATERAL aclexplode(c.relacl) a WHERE c.oid='public.rivya_access_requests'::regclass AND a.grantee<>c.relowner ORDER BY privilege_type")).rows;
  assert.deepEqual(grants, ['INSERT','SELECT','UPDATE'].map(privilege_type => ({role:'rivya_runtime_20260924',privilege_type,is_grantable:false})));
  pass('Only runtime SELECT/INSERT/UPDATE are granted; PUBLIC and grant options absent');
  runtime = await connect('rivya_runtime_20260924');
  const inRollback = async action => {
    await runtime.query('BEGIN');
    try { await action(); } finally { await runtime.query('ROLLBACK'); }
  };
  const insert = async overrides => {
    const value = {id:randomUUID(),kind:'access',login:'synthetic-request',name:'Synthetic Request',contact:'synthetic@example.invalid',...overrides};
    const cols = Object.keys(value);
    return runtime.query(`INSERT INTO public.rivya_access_requests(${cols.join(',')}) VALUES(${cols.map((_,i)=>'$'+(i+1)).join(',')}) RETURNING *`, Object.values(value));
  };
  await inRollback(async () => {
    const r = (await insert({staff_id:staffId})).rows[0];
    assert.equal(r.status, 'pending'); assert.equal(r.version, 1); assert.ok(r.created_at && r.updated_at);
    assert.equal((await runtime.query('SELECT id FROM public.rivya_access_requests WHERE id=$1', [r.id])).rows.length, 1);
    assert.equal((await runtime.query("UPDATE public.rivya_access_requests SET status='rejected',version=version+1 WHERE id=$1 RETURNING version", [r.id])).rows[0].version, 2);
  });
  pass('Real runtime connection can INSERT/SELECT/UPDATE with correct defaults; fictional write rolled back');
  for (const [name, overrides, code] of [
    ['kind enum',{kind:'owner'},'23514'], ['status enum',{status:'unknown'},'23514'],
    ['short login',{login:'ab'},'23514'], ['long login',{login:'x'.repeat(81)},'23514'],
    ['empty name',{name:''},'23514'], ['long name',{name:'x'.repeat(101)},'23514'],
    ['short contact',{contact:'ab'},'23514'], ['long contact',{contact:'x'.repeat(161)},'23514'],
    ['short token digest',{token_hash:'a'.repeat(63)},'23514'],
    ['nonexistent staff',{staff_id:randomUUID()},'23503'], ['required contact',{contact:null},'23502'],
  ]) {
    await inRollback(async () => assert.rejects(insert(overrides), error => error.code === code));
    pass('Constraint rejects ' + name);
  }
  await inRollback(async () => {
    await insert({login:'Synthetic-Case'});
    await assert.rejects(insert({login:'synthetic-case'}), error => error.code === '23505');
  });
  pass('Open-login uniqueness is case-insensitive');
  await inRollback(async () => {
    await insert({login:'synthetic-repeat',status:'rejected'});
    await insert({login:'synthetic-repeat'});
    await insert({login:'synthetic-repeat',kind:'recovery'});
    await insert({login:'synthetic-token-a',token_hash:'a'.repeat(64)});
    await assert.rejects(insert({login:'synthetic-token-b',token_hash:'a'.repeat(64)}), error => error.code === '23505');
  });
  pass('Closed-login reuse, separate request kinds and unique non-null tokens follow existing contract');
  await inRollback(async () => {
    const sql = "INSERT INTO public.rivya_access_requests(id,kind,login,name,contact) VALUES($1,'access','synthetic-idempotent','Synthetic','synthetic@example.invalid') ON CONFLICT(kind,lower(login)) WHERE status IN ('pending','approved') DO NOTHING";
    assert.equal((await runtime.query(sql,[randomUUID()])).rowCount,1);
    assert.equal((await runtime.query(sql,[randomUUID()])).rowCount,0);
  });
  pass('Exact application ON CONFLICT target matches the new partial index');
  for (const sql of [
    'DELETE FROM public.rivya_access_requests', 'TRUNCATE public.rivya_access_requests',
    'ALTER TABLE public.rivya_access_requests ADD COLUMN forbidden text', 'DROP TABLE public.rivya_access_requests',
    'CREATE TABLE public.forbidden_runtime_table(id integer)',
  ]) {
    await inRollback(async () => assert.rejects(runtime.query(sql), error => error.code === '42501'));
    pass('Runtime denied: ' + sql.split(' ').slice(0,3).join(' '));
  }
  await assert.rejects(owner.query(proposal), /ACCESS_REPAIR_EXISTS/);
  await owner.query('ROLLBACK');
  pass('Second execution refuses existing target without modifying it');
  assert.equal((await owner.query('SELECT count(*)::int AS n FROM public.rivya_access_requests')).rows[0].n, 0);
  assert.equal(await preserved(), beforeRepair);
  pass('All fictional request mutations rolled back; pre-existing fixture bytes, table ACLs and schema/default privileges preserved');
  report.preservation = {rows:2,unchanged:true,beforeRepairHash:beforeRepair,afterRepairHash:await preserved(),guardFixtureInitialHash:before,guardFixtureRecreatedRoleHash:stableBefore,note:'Role/schema guard tests intentionally change disposable fixture metadata then restore equivalent access; exact before/after comparison surrounds the proposed repair itself.'};
  report.schema = {columns,indexes,grants};
  report.status = 'pass';
} catch (error) {
  report.status = 'fail';
  report.error = {name:error.name,message:error.message,stack:error.stack};
  process.exitCode = 1;
} finally {
  if (runtime) await runtime.end();
  if (owner) await owner.end();
  report.completedAt = new Date().toISOString();
  writeFileSync(resolve(root, 'results.json'), JSON.stringify(report,null,2));
  if (started) {
    assert.ok(data.startsWith(root + sep));
    await control(['stop','-D',data,'-m','fast','-w','-t','30']);
    writeFileSync(resolve(root,'cluster-stopped.json'),JSON.stringify({at:new Date().toISOString(),stopped:true,port:55442,dataDirectory:data},null,2));
  }
  writeFileSync(resolve(base,'latest-run.json'),JSON.stringify({root,results:resolve(root,'results.json')},null,2));
  console.log(JSON.stringify({status:report.status,checks:report.checks.length,error:report.error?.message,root}));
}
