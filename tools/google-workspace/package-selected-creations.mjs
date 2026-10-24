import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstat, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

// Packaging approved derivatives is an explicit local command. No generation,
// recompression, credentials, database access or network transport is involved.
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const privateRoot = join(repoRoot, 'test-results/exact-legacy-2026-10-21');
const publicDirectory = join(repoRoot, 'public/media/owner-creations');
const manifestFile = join(repoRoot, 'src/lib/selected-creations-public.json');
const widths = [640, 960, 1600];
const featured = [6, 7, 8, 30, 33, 44];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const stem = (index, width) => `owner-${String(index).padStart(3, '0')}-ocean-${width}x${width * 1.25}.webp`;
const exactKeys = (value, keys) => assert.deepEqual(Object.keys(value).sort(), [...keys].sort());

export function validatePublicCreationManifest(manifest) {
  exactKeys(manifest, ['schemaVersion', 'featured', 'images']);
  assert.equal(manifest.schemaVersion, 1);
  assert.deepEqual(manifest.featured, featured);
  assert.equal(manifest.images.length, 169);
  for (const [position, image] of manifest.images.entries()) {
    exactKeys(image, ['index', 'category', 'classification', 'variants']);
    assert.equal(image.index, position + 1);
    assert.equal(image.classification, 'design-visualization');
    assert.match(image.category, /^[\p{L}\p{N} &'’/().-]{1,100}$/u);
    assert.equal(image.variants.length, widths.length);
    for (const [variantIndex, variant] of image.variants.entries()) {
      exactKeys(variant, ['width', 'height', 'bytes', 'sha256', 'url']);
      const width = widths[variantIndex];
      assert.equal(variant.width, width);
      assert.equal(variant.height, width * 1.25);
      assert.equal(variant.url, '/media/owner-creations/' + stem(image.index, width));
      assert.ok(Number.isSafeInteger(variant.bytes) && variant.bytes > 0 && variant.bytes <= 600_000);
      assert.match(variant.sha256, /^[a-f0-9]{64}$/);
    }
  }
  return manifest;
}

async function verifyBytes(bytes, expected) {
  assert.equal(sha(bytes), expected.sha256, 'Selected image hash differs');
  if (expected.bytes !== undefined) assert.equal(bytes.length, expected.bytes, 'Selected image byte count differs');
  assert.ok(bytes.length > 0 && bytes.length <= 600_000, 'Selected image exceeds its verified delivery budget');
  const metadata = await sharp(bytes, {limitInputPixels: 4_000_000}).metadata();
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, expected.width);
  assert.equal(metadata.height, expected.width * 1.25);
  assert.ok(metadata.pages === undefined || metadata.pages === 1);
  assert.equal(metadata.exif, undefined, 'Do not package private embedded EXIF');
  assert.equal(metadata.xmp, undefined, 'Do not package private embedded XMP');
  assert.equal(metadata.iptc, undefined, 'Do not package private embedded IPTC');
}

async function noLinkedParents(target) {
  const local = relative(repoRoot, target);
  assert.ok(local && !local.startsWith('..') && !local.startsWith(sep));
  let current = repoRoot;
  for (const part of local.split(sep)) {
    current = join(current, part);
    try { assert.equal((await lstat(current)).isSymbolicLink(), false, 'Refuse linked output paths'); }
    catch (error) { if (error.code === 'ENOENT') return; throw error; }
  }
}

async function immutableWrite(path, bytes) {
  await noLinkedParents(path);
  try { await writeFile(path, bytes, {flag: 'wx'}); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    assert.ok((await readFile(path)).equals(bytes), 'Existing delivery file differs; review instead of overwrite');
  }
}

export async function verifyPortableCreations() {
  const manifestBytes = await readFile(manifestFile);
  const manifest = validatePublicCreationManifest(JSON.parse(manifestBytes.toString('utf8')));
  const expectedNames = manifest.images.flatMap(image => image.variants.map(variant => stem(image.index, variant.width))).sort();
  const names = await readdir(publicDirectory);
  assert.deepEqual(names.sort(), expectedNames, 'Public collection must contain only its 507 approved variants');
  let bytes = 0;
  for (const image of manifest.images) {
    for (const variant of image.variants) {
      const path = join(publicDirectory, stem(image.index, variant.width));
      await noLinkedParents(path);
      const data = await readFile(path);
      await verifyBytes(data, variant);
      bytes += data.length;
    }
  }
  return {images: manifest.images.length, variants: expectedNames.length, featured: manifest.featured.length, categories: new Set(manifest.images.map(image => image.category)).size, bytes, manifestSha256: sha(manifestBytes)};
}

export async function packageSelectedCreations() {
  const selection = JSON.parse(await readFile(join(privateRoot, 'phase3-website-selection/selection-private.json'), 'utf8'));
  // These flags identify the owner's exact earlier selection. The separate,
  // later release authorization is not rewritten into the private evidence.
  assert.equal(selection.schemaVersion, 1);
  assert.equal(selection.selectedCollection, 'phase3-completion');
  assert.equal(selection.scope, 'local-website-only');
  assert.equal(selection.ownerSelected, true);
  assert.equal(selection.cutoutExperimentSelected, false);
  assert.equal(selection.productionPublicationApproved, false);
  assert.equal(selection.images.length, 169);
  assert.deepEqual(selection.featured, featured);
  const sources = [...selection.images].sort((a, b) => a.index - b.index);
  const images = [], files = [];
  // Verify every source before creating any delivery file. Keep complete exact
  // bytes; none of the private manifest or source lineage is spread into output.
  for (const [position, source] of sources.entries()) {
    assert.equal(source.index, position + 1);
    assert.equal(source.classification, 'design-visualization');
    assert.equal(source.variants.length, widths.length);
    assert.deepEqual(source.variants.map(v => v.width).sort((a, b) => a - b), widths);
    const variants = [];
    for (const width of widths) {
      const variant = source.variants.find(item => item.width === width);
      const filename = stem(source.index, width), expectedPath = 'image-pack/' + filename;
      assert.equal(variant.path, expectedPath, 'Use only the registered selected derivative path');
      assert.match(variant.sha256, /^[a-f0-9]{64}$/);
      const bytes = await readFile(join(privateRoot, 'phase3-completion', expectedPath));
      await verifyBytes(bytes, variant);
      variants.push({width, height: width * 1.25, bytes: bytes.length, sha256: variant.sha256, url: '/media/owner-creations/' + filename});
      files.push({filename, bytes});
    }
    images.push({index: source.index, category: source.category, classification: source.classification, variants});
  }
  const manifest = validatePublicCreationManifest({schemaVersion: 1, featured: [...featured], images});
  await noLinkedParents(publicDirectory);
  await mkdir(publicDirectory, {recursive: true});
  for (const file of files) await immutableWrite(join(publicDirectory, file.filename), file.bytes);
  await immutableWrite(manifestFile, Buffer.from(JSON.stringify(manifest, null, 2) + '\n'));
  return verifyPortableCreations();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv.length, 3, 'Use --package for the approved local source or --check for portable verification');
  const mode = process.argv[2];
  assert.ok(mode === '--package' || mode === '--check', 'Unsupported packaging mode');
  console.log(JSON.stringify(await (mode === '--package' ? packageSelectedCreations() : verifyPortableCreations()), null, 2));
}
