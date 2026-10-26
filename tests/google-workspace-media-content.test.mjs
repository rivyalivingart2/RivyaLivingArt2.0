import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  validateMediaAssociation,
  baselineMediaAssociations,
  mediaAssociationRegistry,
} from '../src/lib/google-workspace/media-association-map.ts';
import {
  buildBaselineEntityInventory,
  applyEntityFilters,
  generateEntityCoverageReport,
} from '../src/lib/google-workspace/entity-coverage.ts';
import {
  validateAspectRatio4x5,
  verifyDerivativeSizes,
  resolveMediaDelivery,
  validateMediaUpload,
  recordMediaReplaceLineage,
  archiveMediaAsset,
  checkOrphanMediaAssets,
  validateMotionAsset,
} from '../src/lib/google-workspace/drive-media-delivery.ts';

test('GW-600: Media association validation enforces entity/slot compatibility and path safety', () => {
  // Valid category association
  const validCat = {
    id: 'assoc-cat-valid',
    entityKind: 'category',
    entityId: 'tables',
    slot: 'hero',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Sculptural dining table',
    caption: 'Curated tables',
    classification: 'design-visualization',
    provenance: 'Owner-approved visual.',
  };
  const res1 = validateMediaAssociation(validCat);
  assert.equal(res1.valid, true, `Expected valid category association, got: ${res1.errors.join(', ')}`);

  // Invalid slot for category (e.g. avatar)
  const invalidSlot = { ...validCat, id: 'assoc-cat-invalid', slot: 'avatar' };
  const res2 = validateMediaAssociation(invalidSlot);
  assert.equal(res2.valid, false);
  assert.ok(res2.errors.some((e) => e.includes('not valid for entityKind')));

  // Path traversal rejection
  const traversalAssoc = { ...validCat, id: 'assoc-traversal', mediaPath: '/media/../../etc/passwd' };
  const res3 = validateMediaAssociation(traversalAssoc);
  assert.equal(res3.valid, false);
  assert.ok(res3.errors.some((e) => e.includes('traversal')));

  // Private reference URL rejection
  const privateRefAssoc = { ...validCat, id: 'assoc-priv-ref', mediaPath: '/api/studio/reference/private?id=123' };
  const res4 = validateMediaAssociation(privateRefAssoc);
  assert.equal(res4.valid, false);
  assert.ok(res4.errors.some((e) => e.includes('private customer reference')));
});

test('GW-600: Truthful claims - Testimonials strictly prohibit invented customers or reviews', () => {
  // Genuine testimonial with full documented evidence passes
  const genuineTestimonial = {
    id: 'assoc-test-genuine',
    entityKind: 'testimonial',
    entityId: 'testimonial-arch-firm',
    slot: 'installation',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Office installation table',
    caption: 'Architectural installation',
    classification: 'genuine',
    provenance: 'Client approved installation capture.',
    attribution: 'Studio Mumbai Architects',
    review: {
      reviewer: 'lead-editor',
      approvedOn: '2026-10-15',
      source: 'Direct commission receipt & email consent',
      permission: 'Written consent on file',
    },
    rating: 5,
  };
  const res1 = validateMediaAssociation(genuineTestimonial);
  assert.equal(res1.valid, true, `Expected valid genuine testimonial: ${res1.errors.join(', ')}`);

  // Genuine testimonial missing attribution fails
  const missingAttr = { ...genuineTestimonial, id: 'assoc-test-no-attr', attribution: '' };
  const res2 = validateMediaAssociation(missingAttr);
  assert.equal(res2.valid, false);
  assert.ok(res2.errors.some((e) => e.includes('attribution')));

  // Genuine testimonial missing review record fails
  const missingReview = { ...genuineTestimonial, id: 'assoc-test-no-rev', review: undefined };
  const res3 = validateMediaAssociation(missingReview);
  assert.equal(res3.valid, false);
  assert.ok(res3.errors.some((e) => e.includes('review record')));

  // Fictional sample claiming a real person attribution fails closed
  const fakeReviewer = {
    id: 'assoc-test-fake',
    entityKind: 'testimonial',
    entityId: 'testimonial-fake',
    slot: 'installation',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Sample installation',
    caption: 'Fictional sample review',
    classification: 'fictional',
    provenance: 'Fictional guidance sample',
    attribution: 'Invented Customer Name',
  };
  const res4 = validateMediaAssociation(fakeReviewer);
  assert.equal(res4.valid, false);
  assert.ok(res4.errors.some((e) => e.includes('Fictional testimonial samples must not have real client attribution')));

  // Fictional sample claiming fabricated star rating fails closed
  const fakeRating = { ...fakeReviewer, id: 'assoc-test-fake-rating', attribution: '', rating: 5 };
  const res5 = validateMediaAssociation(fakeRating);
  assert.equal(res5.valid, false);
  assert.ok(res5.errors.some((e) => e.includes('must not claim star ratings')));

  // Fictional sample with human avatar fails closed
  const fakeAvatar = { ...fakeReviewer, id: 'assoc-test-fake-avatar', attribution: '', slot: 'avatar' };
  const res6 = validateMediaAssociation(fakeAvatar);
  assert.equal(res6.valid, false);
  assert.ok(res6.errors.some((e) => e.includes('must not feature fabricated human avatars')));
});

test('GW-600: Registry provides entity and media index queries', () => {
  const tableAssocs = mediaAssociationRegistry.getByEntity('category', 'tables');
  assert.ok(tableAssocs.length > 0);
  assert.equal(tableAssocs[0].slot, 'hero');

  const mediaAssocs = mediaAssociationRegistry.getByMedia('/media/product-hero-026-4x5.webp');
  assert.ok(mediaAssocs.length >= 3);

  const all = mediaAssociationRegistry.getAll();
  assert.ok(all.length >= baselineMediaAssociations.length);
});

test('GW-601: Entity coverage, studio filtering and duplicate prevention', () => {
  const inventory = buildBaselineEntityInventory();
  assert.ok(inventory.length >= 300, `Expected at least 300 baseline entities, got ${inventory.length}`);

  // Zero duplicate IDs
  const seenIds = new Set();
  for (const item of inventory) {
    assert.equal(seenIds.has(item.id), false, `Duplicate entity ID detected: ${item.id}`);
    seenIds.add(item.id);
  }

  // Filter by status: published
  const publishedOnly = applyEntityFilters(inventory, { status: 'published', pageSize: 50 });
  assert.ok(publishedOnly.total > 0);
  assert.ok(publishedOnly.items.every((i) => i.status === 'published'));

  // Filter by workflow: catalogue
  const catalogueOnly = applyEntityFilters(inventory, { workflow: 'catalogue', pageSize: 50 });
  assert.ok(catalogueOnly.total > 0);
  assert.ok(catalogueOnly.items.every((i) => i.workflow === 'catalogue'));

  // Query search matching
  const tableSearch = applyEntityFilters(inventory, { query: 'table', pageSize: 50 });
  assert.ok(tableSearch.total > 0);
  assert.ok(
    tableSearch.items.every(
      (i) =>
        i.title.toLowerCase().includes('table') ||
        i.id.toLowerCase().includes('table') ||
        i.tags.some((t) => t.includes('table')) ||
        i.category?.toLowerCase().includes('table')
    )
  );

  // Pagination boundaries
  const p1 = applyEntityFilters(inventory, { pageSize: 10, page: 1 });
  const p2 = applyEntityFilters(inventory, { pageSize: 10, page: 2 });
  assert.equal(p1.items.length, 10);
  assert.equal(p2.items.length, 10);
  assert.notEqual(p1.items[0].id, p2.items[0].id);

  // Coverage report generation
  const report = generateEntityCoverageReport();
  assert.equal(report.filterEvaluations.zeroDuplicateRecords, true);
  assert.equal(report.filterEvaluations.zeroFabricatedRecords, true);
  assert.equal(report.invariants.zeroProductsAdded, true);
  assert.equal(report.invariants.zeroInventedReviews, true);

  // Check generated JSON file on disk
  const reportJson = JSON.parse(
    readFileSync(new URL('../docs/google-workspace-2026-10-24/entity-coverage-report.json', import.meta.url), 'utf8')
  );
  assert.equal(reportJson.totals.totalDistinctRecords, report.totals.totalDistinctRecords);
  assert.equal(reportJson.invariants.zeroInventedReviews, true);
});

test('GW-602: 4:5 aspect ratio check and responsive derivative verification', () => {
  // 4:5 aspect ratio checks (0.8 ratio)
  const ratio640x800 = validateAspectRatio4x5(640, 800);
  assert.equal(ratio640x800.valid, true);

  const ratio960x1200 = validateAspectRatio4x5(960, 1200);
  assert.equal(ratio960x1200.valid, true);

  const ratio1600x2000 = validateAspectRatio4x5(1600, 2000);
  assert.equal(ratio1600x2000.valid, true);

  // 16:9 widescreen or square ratios fail the 4:5 vertical requirement
  const wideRatio = validateAspectRatio4x5(1600, 900);
  assert.equal(wideRatio.valid, false);

  const squareRatio = validateAspectRatio4x5(1000, 1000);
  assert.equal(squareRatio.valid, false);

  // Responsive derivative validation
  const validDerivatives = [
    { width: 640, height: 800, bytes: 85000, sha256: 'a'.repeat(64) },
    { width: 960, height: 1200, bytes: 195000, sha256: 'b'.repeat(64) },
    { width: 1600, height: 2000, bytes: 480000, sha256: 'c'.repeat(64) },
  ];
  const derivRes1 = verifyDerivativeSizes(validDerivatives);
  assert.equal(derivRes1.valid, true, `Expected valid derivatives: ${derivRes1.errors.join(', ')}`);

  // Missing required width (e.g. 1600 missing)
  const missing1600 = validDerivatives.slice(0, 2);
  const derivRes2 = verifyDerivativeSizes(missing1600);
  assert.equal(derivRes2.valid, false);
  assert.ok(derivRes2.missingWidths.includes(1600));

  // Oversized derivative exceeding 600 KB budget
  const oversized = [
    validDerivatives[0],
    validDerivatives[1],
    { width: 1600, height: 2000, bytes: 750000, sha256: 'c'.repeat(64) },
  ];
  const derivRes3 = verifyDerivativeSizes(oversized);
  assert.equal(derivRes3.valid, false);
  assert.ok(derivRes3.oversizedVariants.includes(1600));
});

test('GW-602: Media delivery gating, upload bounding, replace lineage, and motion validation', () => {
  // Public media delivery resolves
  const pubDel = resolveMediaDelivery('/media/product-hero-026-4x5.webp', false);
  assert.equal(pubDel.canDeliver, true);
  assert.equal(pubDel.accessType, 'public');

  // Creation media delivery resolves
  const creationDel = resolveMediaDelivery('/api/local-creations/001/960', false);
  assert.equal(creationDel.canDeliver, true);
  assert.equal(creationDel.accessType, 'public');

  // Private customer reference: unauthenticated fails
  const privUnauth = resolveMediaDelivery('/api/studio/reference/private?id=order-123', false);
  assert.equal(privUnauth.canDeliver, false);
  assert.equal(privUnauth.accessType, 'denied');

  // Private customer reference: authenticated staff succeeds
  const privAuth = resolveMediaDelivery('/api/studio/reference/private?id=order-123', true);
  assert.equal(privAuth.canDeliver, true);
  assert.equal(privAuth.accessType, 'private_gated');

  // Traversal path rejected
  const traversalDel = resolveMediaDelivery('/media/../../secret', false);
  assert.equal(traversalDel.canDeliver, false);

  // Upload bounding
  const validUpload = validateMediaUpload({
    filename: 'riverline-study.webp',
    bytes: 2500000,
    contentType: 'image/webp',
  });
  assert.equal(validUpload.valid, true);

  const oversizedUpload = validateMediaUpload({
    filename: 'huge-file.png',
    bytes: 25 * 1024 * 1024,
    contentType: 'image/png',
  });
  assert.equal(oversizedUpload.valid, false);
  assert.ok(oversizedUpload.error?.includes('20 MB'));

  const badMimeUpload = validateMediaUpload({
    filename: 'script.exe',
    bytes: 1024,
    contentType: 'application/x-msdownload',
  });
  assert.equal(badMimeUpload.valid, false);

  // Replace lineage tracking
  const parentSha = '1'.repeat(64);
  const childSha = '2'.repeat(64);
  const lineage = recordMediaReplaceLineage(parentSha, childSha, 'ai-edit');
  assert.equal(lineage.parentSha256, parentSha);
  assert.equal(lineage.newSha256, childSha);
  assert.equal(lineage.method, 'ai-edit');

  // Same hash replacement rejected
  assert.throws(() => recordMediaReplaceLineage(parentSha, parentSha, 'manual-crop'));

  // Archive media state
  const archive = archiveMediaAsset('media-101', 'PUBLISHED');
  assert.equal(archive.status, 'ARCHIVED');
  assert.equal(archive.previousStatus, 'PUBLISHED');

  // Orphan scanning
  const orphanScan = checkOrphanMediaAssets(
    ['/media/active-1.webp', '/media/active-2.webp', '/media/unused-1.webp'],
    ['/media/active-1.webp', '/media/active-2.webp']
  );
  assert.deepEqual(orphanScan.orphanPaths, ['/media/unused-1.webp']);

  // Motion asset validation
  const validMotion = validateMotionAsset({
    id: 'motion-resin-pour',
    motionKind: 'resin-pour',
    posterPath: '/media/product-hero-026-4x5.webp',
    durationSeconds: 15,
    hasAudio: false,
  });
  assert.equal(validMotion.valid, true);

  // Motion asset with audio rejected (must be silent process clip)
  const noisyMotion = validateMotionAsset({
    id: 'motion-noisy',
    motionKind: 'resin-pour',
    posterPath: '/media/product-hero-026-4x5.webp',
    durationSeconds: 15,
    hasAudio: true,
  });
  assert.equal(noisyMotion.valid, false);
  assert.ok(noisyMotion.error?.includes('silent'));
});
