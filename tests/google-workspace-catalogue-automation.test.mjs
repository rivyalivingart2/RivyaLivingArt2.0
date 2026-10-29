import test from 'node:test';
import assert from 'node:assert/strict';
import { concepts } from '../src/lib/catalogue.ts';
import {
  validateCatalogueConfig,
  createCatalogueInputSnapshot,
  registeredTemplateArtifacts,
  catalogueTemplateSpecifications,
} from '../src/lib/google-workspace/catalogue-automation.ts';
import {
  catalogueWorkerManager,
} from '../src/lib/google-workspace/catalogue-worker.ts';
import {
  validateSlideLayout,
  validatePdfOutput,
  verifyCatalogueOutputAccess,
} from '../src/lib/google-workspace/catalogue-validation.ts';

test('GW-800: Catalogue configuration validation and artifact register', () => {
  // Layout specifications are not verified private Drive registrations.
  assert.ok(catalogueTemplateSpecifications.every(a => a.nativeGoogleDriveId === null));
  assert.equal(registeredTemplateArtifacts.length, 0);
  assert.ok(catalogueTemplateSpecifications.some((a) => a.type === 'SLIDES_TEMPLATE'));
  assert.ok(catalogueTemplateSpecifications.some((a) => a.type === 'COVER_LAYOUT'));
  assert.ok(catalogueTemplateSpecifications.some((a) => a.type === 'TYPOGRAPHY_THEME'));

  // Valid configuration
  const validConfig = {
    title: 'Rivya Autumn Atelier Lookbook',
    subtitle: 'From liquid to light · Vol. III',
    curatorStatement: 'A bespoke selection of live-edge timber and crystal epoxy pieces.',
    theme: 'editorial-luxury',
    language: 'en',
    outputFormat: 'SLIDES_AND_PDF',
    priceDisplay: 'SHOW_PRICES',
    targetCategoryIds: ['tables'],
    targetProductIds: [],
    excludedProductIds: [],
    includeCustomizationFields: true,
    date: '2026-10-26',
  };
  const valRes1 = validateCatalogueConfig(validConfig);
  assert.equal(valRes1.valid, true, `Expected valid config: ${valRes1.errors.join(', ')}`);

  // Invalid title fails
  const valRes2 = validateCatalogueConfig({ ...validConfig, title: '' });
  assert.equal(valRes2.valid, false);
  assert.ok(valRes2.errors.some((e) => e.includes('title')));

  // Invalid theme fails
  const valRes3 = validateCatalogueConfig({ ...validConfig, theme: 'unknown-theme' });
  assert.equal(valRes3.valid, false);
  assert.ok(valRes3.errors.some((e) => e.includes('theme')));
});

test('GW-800: Freeze immutable catalogue input snapshot from approved concepts', () => {
  const config = {
    title: 'Curated Architectural Consoles',
    subtitle: 'Sculptural Statement Pieces',
    curatorStatement: 'Statement tables and entry consoles designed for modern luxury interiors.',
    theme: 'atelier-minimal',
    language: 'en',
    outputFormat: 'SLIDES_AND_PDF',
    priceDisplay: 'STARTING_FROM',
    targetCategoryIds: ['tables', 'consoles'],
    targetProductIds: [],
    excludedProductIds: ['DP001'], // exclude specific product
    includeCustomizationFields: false,
    date: '2026-10-26',
  };

  const snapshot = createCatalogueInputSnapshot(config, concepts);
  assert.ok(snapshot.snapshotId.startsWith('cat-snap-'));
  assert.ok(/^[a-f0-9]{64}$/.test(snapshot.snapshotSha256));
  assert.ok(snapshot.selectedProducts.length > 0);
  assert.ok(snapshot.selectedProducts.every((p) => p.category === 'tables' || p.category === 'consoles'));
  assert.ok(snapshot.selectedProducts.every((p) => p.id !== 'DP001'), 'Excluded product DP001 must not appear');

  // Verify price formatting 'From ₹...'
  const pricedItem = snapshot.selectedProducts.find((p) => p.priceFormatted.startsWith('From ₹'));
  assert.ok(pricedItem, 'Items with price should be formatted with "From ₹"');

  // Verify dimensions formatting
  assert.ok(snapshot.selectedProducts[0].dimensionsFormatted.includes('mm'));
});

test('GW-801: Unconfigured catalogue worker blocks instead of inventing Drive outputs', async () => {
  const config = {
    title: 'Rivya Memory Art Collection',
    subtitle: 'Flower preservation and occasion keepsakes',
    curatorStatement: 'Handcrafted preservation art.',
    theme: 'editorial-luxury',
    language: 'en',
    outputFormat: 'SLIDES_AND_PDF',
    priceDisplay: 'SHOW_PRICES',
    targetCategoryIds: ['flower-preservation'],
    targetProductIds: [],
    excludedProductIds: [],
    includeCustomizationFields: true,
    date: '2026-10-26',
  };

  const snapshot = createCatalogueInputSnapshot(config, concepts);
  const job = catalogueWorkerManager.queueJob(snapshot);
  assert.equal(job.status, 'QUEUED');
  assert.equal(job.snapshotSha256, snapshot.snapshotSha256);

  // A local simulation must not return fabricated external outputs.
  const completedJob = await catalogueWorkerManager.executeJob(job.id, snapshot);
  assert.equal(completedJob.storage, 'simulation');
  assert.equal(completedJob.status, 'BLOCKED');
  assert.equal(completedJob.progressPercent, 0);
  for (const field of ['slidesDriveId', 'pdfDriveId', 'slidesUrl', 'pdfUrl', 'pageCount', 'outputBytes', 'outputSha256']) {
    assert.equal(completedJob[field], undefined);
  }
  assert.match(completedJob.errorMessage, /PROVIDER_NOT_CONFIGURED/);
  assert.equal(catalogueWorkerManager.queueJob(snapshot).id, job.id);

  // Cancellation & retry support
  const secondSnapshot = createCatalogueInputSnapshot(
    { ...config, title: 'Distinct Second Snapshot Run' },
    concepts
  );
  const cancellableJob = catalogueWorkerManager.queueJob(secondSnapshot);
  const cancelResult = catalogueWorkerManager.cancelJob(cancellableJob.id);
  assert.equal(cancelResult, true);
  assert.equal(cancellableJob.status, 'CANCELLED');

  // Retrying sets state back to QUEUED
  const retriedJob = catalogueWorkerManager.retryJob(cancellableJob.id);
  assert.equal(retriedJob.status, 'QUEUED');
  assert.equal(retriedJob.retryCount, 1);
});

test('GW-802: Slide layout validation, Hindi script support, and Studio access gating', () => {
  // Valid English slide
  const validSlide = {
    title: 'Riverline Live Edge Resin Dining Table',
    category: 'Tables',
    description: 'Sculptural presentation pairing centuries-old walnut with translucent azure resin.',
    imageWidth: 960,
    imageHeight: 1200, // exact 4:5 ratio (0.8)
    language: 'en',
  };
  const slideRes1 = validateSlideLayout(validSlide);
  assert.equal(slideRes1.valid, true, `Expected valid slide: ${slideRes1.issues.join(', ')}`);

  // Invalid image aspect ratio fails
  const badRatioSlide = { ...validSlide, imageWidth: 1600, imageHeight: 900 }; // 16:9 ratio
  const slideRes2 = validateSlideLayout(badRatioSlide);
  assert.equal(slideRes2.valid, false);
  assert.ok(slideRes2.issues.some((i) => i.includes('4:5 vertical artwork')));

  // Hindi slide with Devanagari script passes
  const hindiSlide = {
    title: 'रिव्या डाइनिंग टेबल',
    category: 'फर्नीचर',
    description: 'प्राकृतिक लकड़ी और उच्च कोटि के रेजिन का बेजोड़ संगम।',
    imageWidth: 960,
    imageHeight: 1200,
    language: 'hi',
  };
  const slideRes3 = validateSlideLayout(hindiSlide);
  assert.equal(slideRes3.valid, true);

  // PDF output validation
  const validPdf = {
    pageCount: 15,
    bytes: 4500000,
    sha256: 'a'.repeat(64),
    targetProductsCount: 12,
  };
  const pdfRes1 = validatePdfOutput(validPdf);
  assert.equal(pdfRes1.valid, true);

  // PDF with insufficient pages fails
  const shortPdf = { ...validPdf, pageCount: 5, targetProductsCount: 12 };
  const pdfRes2 = validatePdfOutput(shortPdf);
  assert.equal(pdfRes2.valid, false);
  assert.ok(pdfRes2.issues.some((i) => i.includes('less than expected')));

  // Access gating: Unauthenticated caller denied
  const unauthAccess = verifyCatalogueOutputAccess('1pdf_sample_drive_id', false);
  assert.equal(unauthAccess.accessible, false);
  assert.equal(unauthAccess.accessType, 'denied');

  // Access gating: Authenticated Studio staff granted private access
  const authAccess = verifyCatalogueOutputAccess('1pdf_sample_drive_id', true, id => id === '1pdf_sample_drive_id');
  assert.equal(authAccess.accessible, true);
  assert.equal(authAccess.accessType, 'studio_private');
});

test('Snapshot preserves exact price and demo provenance, detaches input and rejects later mutation', () => {
  const config = {title:'Fixture only', subtitle:'Fixture', curatorStatement:'Fixture', theme:'atelier-minimal', language:'en', outputFormat:'SLIDES_AND_PDF', priceDisplay:'SHOW_PRICES', targetCategoryIds:[], targetProductIds:[], excludedProductIds:[], includeCustomizationFields:false, date:'2026-10-28'};
  const product = {...concepts[0], priceType:'FIXED', priceAmountMinor:12345};
  const snapshot = createCatalogueInputSnapshot(config, [product]);
  assert.equal(snapshot.sourceRevision, 'unverified-caller-input');
  assert.equal(snapshot.inputSource, 'caller-supplied-concepts');
  assert.equal(snapshot.selectedProducts[0].priceFormatted, '₹123.45');
  assert.equal(snapshot.selectedProducts[0].priceAmountMinor, 12345);
  assert.equal(snapshot.selectedProducts[0].originKind, product.originKind);
  assert.match(snapshot.selectedProducts[0].disclosure, /Demonstration concept/);
  config.targetProductIds.push('unrelated'); product.title = 'changed';
  assert.deepEqual(snapshot.config.targetProductIds, []);
  assert.notEqual(snapshot.selectedProducts[0].title, 'changed');
  assert.throws(() => snapshot.selectedProducts[0].materials.push('changed'), TypeError);
  assert.throws(() => {snapshot.config.title = 'changed';}, TypeError);
  const zero = createCatalogueInputSnapshot({...config,targetProductIds:[]}, [{...product,priceAmountMinor:0}]);
  assert.equal(zero.selectedProducts[0].priceFormatted, '₹0');
});

test('Catalogue access needs a registered output policy; malformed declared PDF sizes cannot pass', () => {
  assert.equal(verifyCatalogueOutputAccess('unregistered_output',true).accessible,false);
  assert.equal(verifyCatalogueOutputAccess('unregistered_output',true,()=>false).accessible,false);
  const input = {pageCount:15,bytes:4500000,sha256:'a'.repeat(64),targetProductsCount:12};
  for (const key of ['pageCount','bytes','targetProductsCount']) for (const value of [NaN,Infinity,-1,0.5]) assert.equal(validatePdfOutput({...input,[key]:value}).valid,false);
});
