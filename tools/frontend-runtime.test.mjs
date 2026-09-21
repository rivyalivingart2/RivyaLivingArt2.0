/**
 * HTTP regression checks against the actual installed, built Next.js server.
 * Run after `npm run build`: `node --test tools/frontend-runtime.test.mjs`.
 * These checks do not execute browser JavaScript or verify hydration/layout.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const nextBin = resolve(root, 'node_modules/next/dist/bin/next');
const fixtureRoutes = [
  '/collectible-design',
  '/memory-art',
  '/personal-art',
  '/pieces/riverline-live-edge-dining-table',
  '/pieces/basin-shallow-pour-coffee-table',
];
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
  delete env.VERCEL_ENV;
  delete env.RIVYA_VISUAL_PREVIEW;
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

function internalTargets(html, origin) {
  const targets = new Set();
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), origin);
    if (url.origin === origin) targets.add(`${url.pathname}${url.search}`);
  }
  return targets;
}

test('built frontend HTTP behavior (not browser or hydration verification)', { timeout: 120000 }, async t => {
  await t.test('explicit local visual preview serves routes, local images and valid internal links', async t => {
    const origin = await startBuiltServer(t, { RIVYA_VISUAL_PREVIEW: '1' });
    const targets = new Set();
    for (const path of ['/', ...fixtureRoutes, '/studio']) {
      await t.test(`GET ${path} is a noindex HTML 200`, async () => {
        const { response, html } = await getPage(origin, path);
        assert.equal(response.status, 200, `${path} should render`);
        assert.match(response.headers.get('content-type') ?? '', /text\/html/i);
        assertNoindex(response, path);
        assert.match(html, /Development preview/);
        assert.match(html, /id="main-content"/);
        for (const target of internalTargets(html, origin)) targets.add(target);
      });
    }
    for (const path of unknownRoutes) {
      await t.test(`GET ${path} sends an actual HTTP 404`, async () => {
        const { response, html } = await getPage(origin, path);
        assert.equal(response.status, 404, `${path} must not stream a 200 with 404 content`);
        assertNoindex(response, path);
        assert.match(html, /404/);
      });
    }
    for (const name of ['riverline', 'basin']) {
      const path = `/media/concepts/${name}.avif`;
      await t.test(`GET ${path} matches the committed local image`, async () => {
        const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(15000) });
        assert.equal(response.status, 200);
        assert.match(response.headers.get('content-type') ?? '', /^image\/avif(?:;|$)/i);
        assertNoindex(response, path);
        const served = Buffer.from(await response.arrayBuffer());
        const expected = await readFile(resolve(root, `public${path}`));
        assert.deepEqual(served, expected);
      });
    }
    await t.test('rendered same-origin navigation targets resolve without redirects or errors', async () => {
      assert.ok(targets.size > 0, 'Expected ordinary server-rendered navigation links.');
      for (const path of targets) {
        const { response } = await getPage(origin, path);
        assert.equal(response.status, 200, `Broken internal navigation: ${path}`);
      }
    });
  });

  for (const { label, env } of [
    { label: 'local production without a preview flag', env: {} },
    { label: 'Vercel production even with the preview flag', env: { VERCEL_ENV: 'production', RIVYA_VISUAL_PREVIEW: '1' } },
  ]) {
    await t.test(`${label} holds home and denies fixture pages`, async t => {
      const origin = await startBuiltServer(t, env);
      await t.test('home returns a holding page without fixture names', async () => {
        const { response, html } = await getPage(origin, '/');
        assert.equal(response.status, 200);
        assertNoindex(response, '/');
        assert.match(html, /An atelier taking shape/);
        assert.doesNotMatch(html, /Riverline|Basin/);
      });
      for (const path of fixtureRoutes) {
        await t.test(`GET ${path} denies fixture content with HTTP 404`, async () => {
          const { response, html } = await getPage(origin, path);
          assert.equal(response.status, 404, `${path} must be denied in ${label}`);
          assertNoindex(response, path);
          assert.doesNotMatch(html, /Riverline|Basin/);
          assert.doesNotMatch(html, /<title>(?:Collectible design|Memory art|Personal art|Riverline|Basin)/i);
        });
      }
    });
  }
});
