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
test('the preserved source catalogue covers all 120 registered identities',()=>{
 assert.equal(concepts.length,120);
 for(const [tier,start,count] of [['LARGE',1,84],['MEDIUM',85,24],['SMALL',109,12]])assert.deepEqual(conceptsForTier(tier).map(p=>p.id).sort(),Array.from({length:count},(_,i)=>'DP'+String(start+i).padStart(3,'0')));
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
  assert.equal(concepts.filter(p => p.image).length, 120);
  for (const p of concepts) {
    if (p.image === null) {
      assert.equal(p.mediaStatus, 'VISUAL_PENDING');
      assert.deepEqual(p.gallery, []);
      continue;
    }
    assert.equal(p.mediaStatus, 'CONCEPT_VISUAL');
    assert.ok(p.gallery.length >= 1);
    assert.equal(p.gallery[0].src, p.image);
    assert.match(p.image, /^\/media\/(?:generated\/)?[a-z0-9-]+\.webp$/);
    assert.ok(existsSync(new URL('public'+p.image,root)));
    const bytes=readFileSync(new URL('public'+p.image,root));
    assert.equal(bytes.subarray(0,4).toString(),'RIFF');
    assert.equal(bytes.subarray(8,12).toString(),'WEBP');
    assert.ok(p.width>0 && p.height>0); assert.match(p.alt, /AI/i);
  }
});
test('unknown concepts never resolve to an arbitrary fallback product', () => {
  assert.equal(findConcept('not-a-product'),undefined);
  assert.equal(findConcept('../studio'),undefined);
  assert.equal(findConcept(concepts[0].slug)?.id,'DP001');
});
test('secondary collections resolve their own typed concepts without misclassified furniture', () => {
  assert.equal(conceptsForTier('MEDIUM').length,24); assert.equal(conceptsForTier('SMALL').length,12);
  assert.ok(conceptsForTier('MEDIUM').every(piece => piece.tier === 'MEDIUM' && 'memory' in piece && !('personal' in piece)));
  assert.ok(conceptsForTier('SMALL').every(piece => piece.tier === 'SMALL' && 'personal' in piece && !('memory' in piece)));
  assert.equal(findCollection('memory-art')?.tier,'MEDIUM'); assert.equal(findCollection('personal-art')?.tier,'SMALL');
  assert.equal(findCollection('collectible-design')?.tier,'LARGE'); assert.equal(findCollection('studio'),undefined);
});
test('public offers use published projections and fixture routes remain protected',()=>{
 assert.match(read('src/components/rivya/approved-entry.tsx'),/ShopSite/);
 assert.match(read('src/lib/public-preview.ts'),/isVisualPreviewAllowed/);
 assert.match(read('src/app/robots.ts'),/indexingEnabled/);
 assert.match(read('src/app/robots.ts'),/disallow: "\/"/);
 assert.match(read('src/lib/published-content.ts'),/published IS NOT NULL/);
});
test('Studio requires a real server session before rendering its workspace',()=>{
 const s=read('src/app/studio/page.tsx');assert.match(s,/await requireStudioSession\(\)/);assert.match(s,/PrivateStudioEntry/);assert.doesNotMatch(s,/localStorage|BuildHoldingScreen/);
});
test('saved handoff only opens WhatsApp through the explicit customer action',()=>{
 const s=read('src/components/shop/saved-order-actions.tsx');
 assert.match(s,/onClick=\{\(\)=>void refresh\(true\)\}/);
 assert.doesNotMatch(s,/autoOpen|automatic|refresh\(true,true\)/);
 const effect=s.slice(s.indexOf('useEffect(()=>'),s.indexOf('async function prepare'));
 assert.doesNotMatch(effect,/refresh\(|location.assign/);
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
