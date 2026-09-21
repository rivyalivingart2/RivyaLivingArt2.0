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
test('the initial slice contains exactly two named source fixtures, not a completed seed pack', () => {
  assert.equal(concepts.length, 2); assert.deepEqual(concepts.map(x => x.id), ['DP001','DP013']);
});
test('fixture keys and slugs are unique', () => {
  for (const field of ['id','slug']) assert.equal(new Set(concepts.map(x=>x[field])).size, concepts.length);
});
test('sample catalogue exposes no numeric price or customer information', () => {
  for (const p of concepts) {
    assert.equal(p.originKind, 'DEMO_FIXTURE'); assert.equal(p.priceType,'ON_REQUEST');
    for (const field of ['price','email','phone','customer','rating']) assert.equal(field in p, false);
    assert.match(p.description, /fictional/i);
  }
});
test('all fixture media resolves to bundled files, not Drive hotlinks', () => {
  for (const p of concepts) {
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
test('secondary collections have honest empty states instead of misclassified furniture', () => {
  assert.equal(conceptsForTier('MEDIUM').length,0); assert.equal(conceptsForTier('SMALL').length,0);
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
