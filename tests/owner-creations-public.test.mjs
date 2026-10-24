import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, resolve} from 'node:path';
import {validatePublicCreationManifest, verifyPortableCreations} from '../tools/google-workspace/package-selected-creations.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(resolve(root, 'src/lib/selected-creations-public.json'), 'utf8'));

test('portable selected collection retains every approved byte, dimension and delivery reference', async () => {
  assert.deepEqual(await verifyPortableCreations(), {
    images: 169,
    variants: 507,
    featured: 6,
    categories: 12,
    bytes: 97_229_902,
    manifestSha256: '47cbe580a9d0124288d82cbd9c248a28f71b32cd606b70cbace974bfa9dff196',
  });
});

test('public manifest permits only image presentation metadata and rejects private fields or resource URLs', () => {
  validatePublicCreationManifest(manifest);
  for (const mutate of [
    value => { value.driveId = 'private-source'; },
    value => { value.images[0].original = 'private-original'; },
    value => { value.images[0].variants[0].path = 'private-path'; },
    value => { value.images[0].variants[0].url = 'https://private.invalid/secret'; },
    value => { value.images[0].variants[0].url = '/media/owner-creations/../private.webp'; },
    value => { value.images[0].variants[0].height = 801; },
    value => { value.images[1].index = 1; },
    value => { value.images[0].classification = 'documentary'; },
    value => { value.featured.reverse(); },
  ]) {
    const altered = structuredClone(manifest);
    mutate(altered);
    assert.throws(() => validatePublicCreationManifest(altered));
  }
});

test('public creations load in production without database env, private evidence or local image API', async () => {
  const source = pathToFileURL(resolve(root, 'src/lib/owner-creations.ts')).href;
  const loader = pathToFileURL(resolve(root, 'node_modules/tsx/dist/loader.mjs')).href;
  const serverMarker = pathToFileURL(resolve(root, 'node_modules/next/dist/compiled/server-only/empty.js')).href;
  // Standalone Node needs the same server-only marker alias Next installs for
  // Server Components. No application dependency or data provider is mocked.
  const code = `import {registerHooks} from 'node:module';
    registerHooks({resolve(specifier,context,next){return specifier==='server-only'?{url:${JSON.stringify(serverMarker)},shortCircuit:true}:next(specifier,context);}});
    const {ownerCreations,ownerCreationBytes}=await import(${JSON.stringify(source)});
    const data=await ownerCreations();
    console.log(JSON.stringify({data,privateBytes:await ownerCreationBytes('006','960')}));`;
  const {stdout} = await promisify(execFile)(process.execPath,
    ['--conditions=react-server', '--import', loader, '--input-type=module', '--eval', code],
    {cwd: resolve(root, 'node_modules/tsx'), env: {NODE_ENV: 'production', VERCEL: '1'}, timeout: 10_000, maxBuffer: 512 * 1024});
  const result = JSON.parse(stdout);
  assert.equal(result.data.images.length, 169);
  assert.deepEqual(result.data.featured.map(image => image.index), manifest.featured);
  assert.equal(result.privateBytes, null);
  const expected = new Set(manifest.images.flatMap(image => image.variants.map(variant => variant.url)));
  const urls = result.data.images.flatMap(image => [image.small, image.image, image.large]);
  assert.equal(new Set(urls).size, 507);
  for (const url of urls) { assert.ok(expected.has(url)); assert.ok(!url.startsWith('/api/')); }
});

test('portable public read has no runtime environment, private filesystem or database dependency', async () => {
  const source = await readFile(resolve(root, 'src/lib/owner-creations.ts'), 'utf8');
  const publicRead = source.split('export async function ownerCreations()')[1].split('export async function ownerCreationBytes')[0];
  assert.match(publicRead, /publicSelection\.images/);
  assert.doesNotMatch(publicRead, /\b(?:selection|readFile|localCreationAccess|studioDb)\s*\(|process\.env|\/api\/local-creations/);
  const studio = await readFile(resolve(root, 'src/app/api/studio/owner-creations/route.ts'), 'utf8');
  assert.match(studio, /localCreationAccess\(\)&&localCreationRequest\(request\.headers\)/);
  assert.match(studio, /if\(!await studioSession\(\)\)/);
});
