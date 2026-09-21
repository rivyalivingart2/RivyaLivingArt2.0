import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { concepts, collections, findConcept, findCollection, conceptsForTier } from '../src/lib/catalogue.ts';
import { isVisualPreviewAllowed } from '../src/lib/preview-mode.ts';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const envCases = [
  ['default is closed', {}, false],
  ['local development works without provider secrets', { NODE_ENV: 'development' }, true],
  ['local production build requires explicit preview flag', { NODE_ENV: 'production' }, false],
  ['explicit local visual preview is allowed', { NODE_ENV: 'production', RIVYA_VISUAL_PREVIEW: '1' }, true],
  ['Vercel preview needs explicit flag', { VERCEL_ENV: 'preview' }, false],
  ['configured Vercel preview works', { VERCEL_ENV: 'preview', RIVYA_VISUAL_PREVIEW: '1' }, true],
  ['production rejects preview flag', { VERCEL_ENV: 'production', RIVYA_VISUAL_PREVIEW: '1' }, false],
  ['production rejects development override', { VERCEL_ENV: 'production', NODE_ENV: 'development', RIVYA_VISUAL_PREVIEW: '1' }, false],
  ['unsupported deployment identity is closed', { VERCEL_ENV: 'unknown', RIVYA_VISUAL_PREVIEW: '1' }, false],
  ['nonexact flags are refused', { VERCEL_ENV: 'preview', RIVYA_VISUAL_PREVIEW: 'true' }, false],
];
for (const [label, env, expected] of envCases) test(label, () => assert.equal(isVisualPreviewAllowed(env), expected));

test('furniture, memory and personal worlds remain distinct and ordered', () => {
  assert.deepEqual(collections.map(x => x.tier), ['LARGE', 'MEDIUM', 'SMALL']);
  assert.equal(new Set(collections.map(x => x.slug)).size, 3);
});
test('the progressive catalogue contains twenty-four source fixtures, not a completed seed pack', () => {
  assert.equal(concepts.length, 24);
  assert.deepEqual(conceptsForTier('LARGE').map(x => x.id).sort(), ['DP001', 'DP002', 'DP013', 'DP014', 'DP025', 'DP035', 'DP043', 'DP048', 'DP051', 'DP057', 'DP069', 'DP077']);
  assert.deepEqual(conceptsForTier('MEDIUM').map(x => x.id).sort(), ['DP085', 'DP091', 'DP095', 'DP099', 'DP103', 'DP107']);
  assert.deepEqual(conceptsForTier('SMALL').map(x => x.id).sort(), ['DP109', 'DP111', 'DP112', 'DP113', 'DP114', 'DP120']);
});
test('fixture keys and slugs are unique', () => {
  for (const field of ['id','slug','demoFixtureKey']) assert.equal(new Set(concepts.map(x=>x[field])).size, concepts.length);
});
test('sample catalogue retains fictional provenance and contains no customer information', () => {
  for (const p of concepts) {
    assert.equal(p.originKind, 'DEMO_FIXTURE');
    assert.equal(p.demoFixtureKey, `product:${p.id}`);
    assert.equal(p.demoBatchId, 'rivya-r8-visual-2026-09');
    assert.equal(p.demoVersion, 1);
    for (const field of ['price','email','phone','customer','rating']) assert.equal(field in p, false);
    assert.match(p.description, /fictional/i);
  }
});
test('available fixture media is local and missing visuals have no substituted image', () => {
  assert.equal(concepts.filter(p => p.image).length, 2);
  for (const p of concepts) {
    if (p.image === null) {
      assert.equal(p.mediaStatus, 'VISUAL_PENDING');
      assert.deepEqual(p.gallery, []);
      continue;
    }
    assert.equal(p.mediaStatus, 'CONCEPT_VISUAL');
    assert.equal(p.gallery.length, 1);
    assert.equal(p.gallery[0].src, p.image);
    assert.match(p.image, /^\/media\/concepts\/[a-z-]+\.avif$/);
    assert.ok(existsSync(new URL('public'+p.image,root)));
    const bytes=readFileSync(new URL('public'+p.image,root));
    assert.equal(bytes.subarray(4,8).toString(),'ftyp');
    assert.ok(bytes.includes(Buffer.from('avif')));
    assert.ok(p.width>0 && p.height>0); assert.match(p.alt, /AI/i);
  }
});
test('unknown concepts never resolve to an arbitrary fallback product', () => {
  assert.equal(findConcept('not-a-product'),undefined);
  assert.equal(findConcept('../studio'),undefined);
  assert.equal(findConcept(concepts[0].slug)?.id,'DP001');
});
test('secondary collections resolve their own typed concepts without misclassified furniture', () => {
  assert.equal(conceptsForTier('MEDIUM').length,6); assert.equal(conceptsForTier('SMALL').length,6);
  assert.ok(conceptsForTier('MEDIUM').every(piece => piece.tier === 'MEDIUM' && 'memory' in piece && !('personal' in piece)));
  assert.ok(conceptsForTier('SMALL').every(piece => piece.tier === 'SMALL' && 'personal' in piece && !('memory' in piece)));
  assert.equal(findCollection('memory-art')?.tier,'MEDIUM'); assert.equal(findCollection('personal-art')?.tier,'SMALL');
  assert.equal(findCollection('collectible-design')?.tier,'LARGE'); assert.equal(findCollection('studio'),undefined);
});
test('no fixture route becomes a public indexed offer', () => {
  assert.match(read('src/app/layout.tsx'), /index: false, follow: false/);
  assert.match(read('src/app/robots.ts'), /disallow: "\/"/);
  assert.match(read('src/app/page.tsx'), /await connection\(\)/);
  assert.match(read('src/app/pieces/[slug]/page.tsx'), /isVisualPreviewAllowed/);
});
test('Studio does not include credential fields or create a fake session', () => {
  const s=read('src/app/studio/page.tsx');
  assert.doesNotMatch(s, /<input|<form|signIn\(|cookies\(|localStorage/);
  assert.match(s,/BuildHoldingScreen studio/);
});
test('hero interactions do not contact people or claim persistence', () => {
  const s=read('src/components/homepage.tsx');
  assert.doesNotMatch(s,/wa\.me|mailto:|tel:|localStorage|fetch\(/);
  assert.match(s,/does not send WhatsApp messages/);
});
test('dependency and configuration files do not include rejected integrations', () => {
  const pkg=JSON.parse(read('package.json'));
  assert.equal(pkg.private,true); assert.equal(pkg.dependencies.next,'16.3.5');
  assert.equal(pkg.dependencies.react,pkg.dependencies['react-dom']);
  assert.doesNotMatch(JSON.stringify(pkg), /sanity|higgsfield|stripe|razorpay|puppeteer|auth0/i);
  assert.equal(existsSync(new URL('tailwind.config.js',root)),false);
});
test('selection, focus and reduced motion are part of the real stylesheet', () => {
  const css=read('src/app/globals.css');
  for (const feature of ['::selection',':focus-visible','prefers-reduced-motion','@theme inline']) assert.ok(css.includes(feature));
});
