/**
 * HTTP regression checks against the actual installed, built Next.js server.
 * Run after `npm run build`: `npm run test:runtime` (Node 22 type stripping).
 * These checks do not execute browser JavaScript or verify hydration/layout.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { concepts } from '../src/lib/catalogue.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const nextBin = resolve(root, 'node_modules/next/dist/bin/next');
const fixtureRoutes = [
  '/collectible-design',
  '/memory-art',
  '/personal-art',
  ...concepts.map(piece => `/pieces/${piece.slug}`),
];
const fixtureNames = new RegExp('demoFixtureKey|DEMO_FIXTURE|<(?:h1|h2|h3)[^>]*>\\s*(?:'+concepts.map(piece=>piece.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\s*</(?:h1|h2|h3)>');
const unknownRoutes = [
  '/not-an-existing-collection',
  '/pieces/not-an-existing-piece',
  '/not-an-existing/nested/route',
];

async function reservePort() {
  const socket = createServer();
  await new Promise((resolveListen, reject) => {
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', resolveListen);
  });
  const address = socket.address();
  assert.ok(address && typeof address !== 'string');
  const port = address.port;
  await new Promise((resolveClose, reject) => socket.close(error => error ? reject(error) : resolveClose()));
  return port;
}

async function startBuiltServer(t, mode) {
  assert.ok(existsSync(nextBin), 'Install the actual dependencies first.');
  assert.ok(existsSync(resolve(root, '.next/BUILD_ID')), 'Run npm run build before this HTTP suite.');
  const port = await reservePort();
  const origin = `http://127.0.0.1:${port}`;
  const env = { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' };
  // Deliberately isolate deployment-policy cases in child processes only.
  // Blank explicitly: deleting these keys lets Next reload live .env.local values.
  Object.assign(env,{VERCEL_ENV:'',VERCEL:'',RIVYA_VISUAL_PREVIEW:'0',RIVYA_ENV:'',RIVYA_DATA_MODE:'isolated',DATABASE_URL:'',DATABASE_URL_UNPOOLED:'',BLOB_READ_WRITE_TOKEN:'',STUDIO_ADMIN_ID:'',STUDIO_ADMIN_PASSWORD:'',STUDIO_SESSION_SECRET:'',RIVYA_ORDER_INTAKE_ENABLED:'false',RIVYA_ORDER_MESSAGE_RETRY_ENABLED:'false',SITE_INDEXABLE:'false'});
  Object.assign(env, mode);
  const child = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: root,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  let spawnError;
  let exited = false;
  const append = chunk => { output = (output + chunk.toString()).slice(-12000); };
  child.stdout.on('data', append);
  child.stderr.on('data', append);
  child.on('error', error => { spawnError = error; });
  const exit = new Promise(resolveExit => child.once('exit', (code, signal) => {
    exited = true;
    resolveExit({ code, signal });
  }));
  t.after(async () => {
    mkdirSync(resolve(root,'test-results/runtime'),{recursive:true});
    writeFileSync(resolve(root,'test-results/runtime',`server-${port}.log`),output);
    if (exited || spawnError) return;
    child.kill('SIGTERM');
    const ended = await Promise.race([exit.then(() => true), delay(5000, undefined, { ref: false }).then(() => false)]);
    if (!ended) {
      child.kill('SIGKILL');
      await exit;
    }
  });
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (spawnError) throw spawnError;
    if (exited) assert.fail(`Next.js exited before accepting requests:\n${output}`);
    try {
      const response = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(1500) });
      await response.arrayBuffer();
      if (response.status === 200) return origin;
    } catch {
      // Starting a real Next.js process takes time; retry only during startup.
    }
    await delay(100);
  }
  assert.fail(`Next.js did not become ready within 30 seconds:\n${output}`);
}

async function getPage(origin, path) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(15000), redirect: 'manual' });
  const html = await response.text();
  return { response, html };
}

function assertNoindex(response, path) {
  assert.match(response.headers.get('x-robots-tag') ?? '', /\bnoindex\b/i, `${path} must remain non-indexable`);
}

// Positive published-page coverage lives in tools/release-qa/public.mjs against
// a verified disposable database. Source fixtures never replace published data.
test('built frontend HTTP access and publication boundaries', async t => {
  for (const mode of [{VERCEL_ENV:'preview',RIVYA_PUBLISHED_PREVIEW:'1'},{VERCEL_ENV:'production',RIVYA_VISUAL_PREVIEW:'1'}]) {
    await t.test(`${mode.VERCEL_ENV} fails closed when published storage is unavailable`, async t => {
      const origin = await startBuiltServer(t, mode);
      for (const path of ['/', ...fixtureRoutes]) await t.test(`GET ${path} does not publish fallback data`, async () => {
        const { response, html } = await getPage(origin, path);
        assert.equal(response.status, 500, `${path} must report unavailable storage`);
        assert.match(response.headers.get('content-type') ?? '', /text\/html/i);
        assertNoindex(response, path);
        assert.doesNotMatch(html, fixtureNames);
        assert.doesNotMatch(html, /postgres(?:ql)?:\/\/|password_hash|token_hash/);
      });
    });
  }
  await t.test('disabled public environment retains holding boundary and real 404s', async t => {
    const origin = await startBuiltServer(t, {VERCEL_ENV:'test',RIVYA_ENV:'test',RIVYA_PUBLISHED_PREVIEW:'0'});
    const home = await getPage(origin,'/');
    assert.equal(home.response.status,200);assert.match(home.html,/An atelier taking shape/);assert.doesNotMatch(home.html,fixtureNames);
    for (const path of fixtureRoutes) await t.test(`${path} denies unavailable public content`,async()=>{
      const {response,html}=await getPage(origin,path);assert.equal(response.status,404);assertNoindex(response,path);assert.doesNotMatch(html,fixtureNames);
    });
    for (const path of unknownRoutes) await t.test(`${path} returns a real 404`,async()=>{
      const {response,html}=await getPage(origin,path);assert.equal(response.status,404);assertNoindex(response,path);assert.match(html,/A different direction/);
    });
    for (const name of ['riverline','basin']) await t.test(`original ${name} asset remains byte-identical`,async()=>{
      const path=`/media/concepts/${name}.avif`,r=await fetch(origin+path);
      assert.equal(r.status,200);assertNoindex(r,path);assert.match(r.headers.get('content-type')||'',/^image\/avif/);
      assert.deepEqual(Buffer.from(await r.arrayBuffer()),await readFile(resolve(root,`public${path}`)));
    });
    for(const path of ['/studio','/studio/inquiries','/studio/follow-ups'])await t.test(`${path} requires staff sign-in`,async()=>{
      const {response}=await getPage(origin,path);assert.equal(response.status,307);assert.match(response.headers.get('location')||'',/\/studio\/login/);assertNoindex(response,path);
    });
    for(const path of ['/api/studio/orders','/api/studio/workspace','/api/studio/privacy'])await t.test(`${path} rejects anonymous access`,async()=>{
      const r=await fetch(origin+path);assert.equal(r.status,401);assert.match(r.headers.get('cache-control')||'',/no-store/);
    });
  });
});
