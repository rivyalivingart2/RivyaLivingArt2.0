/** Export AI-edited candidates only. No network, database, product or publication writes. */
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import {resolve, relative, dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {zipSync, strToU8} from 'fflate';

export const collectionRoot = resolve('test-results/exact-legacy-2026-10-21/phase3-completion');
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function inside(root, name) {
  const path = resolve(root, name), rel = relative(root, path);
  assert.ok(rel && !rel.startsWith('..') && !rel.includes(':'), 'Path must remain inside private collection');
  return path;
}
export async function immutable(path, bytes) {
  await mkdir(dirname(path), {recursive: true});
  try { assert.equal(digest(await readFile(path)), digest(bytes), 'Refuse to overwrite different existing bytes'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; await writeFile(path, bytes, {flag: 'wx'}); }
}
export async function standardize(master) {
  // Encoding/size normalization only. Background and object edits were made by imagegen.
  // Contain preserves the entire master; brand-colour padding avoids cutting off tall/wide objects.
  return sharp(master).rotate().resize(1600, 2000, {fit: 'contain', background: '#08283a'}).png().toBuffer();
}

export async function prepareCollection({requireComplete = false} = {}) {
  const root = collectionRoot, read = async name => JSON.parse(await readFile(inside(root, name), 'utf8'));
  const sources = (await read('download-verification-private.json')).records;
  assert.equal(sources.length, 169, 'Expected the explicitly inventoried owner still-image folder');
  assert.equal(new Set(sources.map(r => r.index)).size, sources.length);
  const previousRoot = resolve(root, '../phase3-implementation');
  const previous = JSON.parse(await readFile(resolve(previousRoot, 'branded-input-private.json'), 'utf8'));
  const originalPreparation = JSON.parse(await readFile(resolve(previousRoot, 'preparation-input-private.json'), 'utf8'));
  const generations = new Map();
  for (const r of previous.records) {
    const id = String(r.creation).padStart(3, '0'), priorSource = originalPreparation.records.find(p => p.index === r.creation && !p.parentPath);
    assert.ok(priorSource);
    assert.equal(digest(await readFile(resolve(previousRoot, priorSource.path))), sources.find(s => s.index === r.creation).sha256, 'Prior batch source identity');
    const localMaster = 'generated-masters/owner-' + id + '-ocean.png';
    await immutable(inside(root, localMaster), await readFile(resolve(previousRoot, 'branded/masters/owner-creation-' + String(r.creation).padStart(2, '0') + '-ocean.png')));
    generations.set(r.creation, {index: r.creation, prompt: r.prompt, localMaster, checkpoint: 'f64294f'});
  }
  for (const name of (await readdir(root)).filter(n => /^generated(?:-record-\d{3})?-private\.json$/.test(n))) {
    const data = await read(name);
    for (const r of data.records || [data]) {
      assert.ok(Number.isInteger(r.index) && r.index >= 7 && r.index <= sources.length);
      assert.equal(r.localMaster, 'generated-masters/owner-' + String(r.index).padStart(3, '0') + '-ocean.png');
      assert.ok(typeof r.prompt === 'string' && r.prompt.length > 20);
      if (generations.has(r.index)) assert.equal(generations.get(r.index).localMaster, r.localMaster);
      generations.set(r.index, r);
    }
  }
  let notes = {};
  try { notes = (await read('source-review-private.json')).notes; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  const records = [], missing = [];
  for (const source of sources) {
    assert.ok(!source.error && source.sha256);
    assert.match(source.original, /^originals\/owner-\d{3}\.(?:jpg|heif)$/);
    assert.equal(digest(await readFile(inside(root, source.original))), source.sha256, 'Original bytes unchanged');
    const generation = generations.get(source.index);
    if (!generation) { missing.push(source.index); continue; }
    const master = await readFile(inside(root, generation.localMaster)), meta = await sharp(master).metadata();
    const normalized = await standardize(master), id = String(source.index).padStart(3, '0'), variants = [];
    const normalizedPath = 'normalized/owner-' + id + '-ocean.png';
    await immutable(inside(root, normalizedPath), normalized);
    for (const width of [640, 960, 1600]) {
      const height = width * 5 / 4;
      let output = await sharp(normalized).resize(width, height).webp({quality: 82}).toBuffer();
      for (const quality of [76, 68, 60]) { if (output.length <= 600000) break; output = await sharp(normalized).resize(width, height).webp({quality}).toBuffer(); }
      assert.ok(output.length <= 600000, 'Bounded WebP size');
      const path = 'image-pack/owner-' + id + '-ocean-' + width + 'x' + height + '.webp';
      await immutable(inside(root, path), output);
      variants.push({path, width, height, bytes: output.length, sha256: digest(output)});
    }
    const jpeg = await sharp(normalized).jpeg({quality: 92, mozjpeg: true}).toBuffer();
    const jpegPath = 'image-pack/owner-' + id + '-ocean-1600x2000.jpg';
    await immutable(inside(root, jpegPath), jpeg);
    const review = notes[source.index] || {category: 'Creation', flags: ['fidelity-review']};
    records.push({index: source.index, original: source.original, originalSha256: source.sha256, reviewSource: 'review/owner-' + id + '.jpg', generationMaster: generation.localMaster, generationMasterSha256: digest(master), generationSize: {width: meta.width, height: meta.height}, prompt: generation.prompt, classification: 'design-visualization', assignment: null, publicationApproved: false, review, normalizedPath, normalizedSha256: digest(normalized), exportResampled: true, normalization: 'contain; no product crop; deep-ocean padding where needed', jpeg: {path: jpegPath, width: 1600, height: 2000, bytes: jpeg.length, sha256: digest(jpeg)}, variants});
    if (records.length % 10 === 0) console.log(JSON.stringify({exported: records.length, total: sources.length}));
  }
  if (requireComplete) assert.deepEqual(missing, [], 'Missing generation records; never claim a partial batch complete');
  const receipt = {at: new Date().toISOString(), sourceImages: sources.length, editedCandidates: records.length, missing, originalBytesUnchanged: true, productsAdded: 0, archivedImports: 0, associationsWritten: 0, published: 0, palette: ['#080a0e','#08283a','#164e6b','#b89b63','#f4f1e9'], records};
  await writeFile(inside(root, 'collection-private.json'), JSON.stringify(receipt, null, 2));
  const description = `${records.length} AI-edited presentation candidates from ${sources.length} supplied still images. JPEG 1600 x 2000; WebP 640 x 800, 960 x 1200 and 1600 x 2000. All originals and generated masters remain separate. Generated sizes vary and are resampled with contain, without cropping product content. Export pixels do not imply native detail. Compare lettering, faces, marks and fine details with the original; these are private, unassigned visualizations, not approved documentary records. No products, customer records, reviews or archived lists were imported.\n`;
  const archives = [];
  for (let offset = 0; offset < records.length; offset += 30) {
    const items = records.slice(offset, offset + 30), entries = {'README.txt': strToU8(description)};
    for (const item of items) for (const file of [item.jpeg, ...item.variants]) entries[file.path.split('/').pop()] = new Uint8Array(await readFile(inside(root, file.path)));
    entries['prompts.json'] = strToU8(JSON.stringify(items.map(r => ({image: r.index, prompt: r.prompt})), null, 2));
    const name = 'rivya-ocean-images-' + String(offset / 30 + 1).padStart(2, '0') + '.zip', bytes = zipSync(entries, {level: 0, mtime: new Date('2026-10-23T00:00:00Z')});
    await writeFile(inside(root, name), bytes);
    archives.push({path: name, images: items.length, bytes: bytes.length, sha256: digest(bytes)});
  }
  // Browser payload deliberately omits Drive IDs, source titles, exact prompts and original filenames.
  const gallery = {total: sources.length, prepared: records.length, missing, description, archives, images: records.map(r => ({index: r.index, category: r.review.category, flags: r.review.flags, source: r.reviewSource, edited: r.variants[1].path, jpeg: r.jpeg.path, webp: r.variants[2].path}))};
  await writeFile(inside(root, 'gallery.json'), JSON.stringify(gallery));
  await writeFile(inside(root, 'README.txt'), description);
  console.log(JSON.stringify({sources: sources.length, edited: records.length, exports: records.length * 4, missing: missing.length, archives: archives.length, productsAdded: 0, published: 0}));
  return receipt;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await prepareCollection({requireComplete: process.argv.includes('--complete')});
