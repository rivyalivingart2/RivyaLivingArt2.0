import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  furnitureConcepts as concepts, queryFurniture, catalogueHref, formatPrice, relatedConcepts,
  categoryOptions, materialOptions, sizeOptions, sortOptions,
} from '../src/lib/catalogue.ts';

const ids = (result) => result.items.map(piece => piece.id);
const words = (text) => text.trim().split(/\s+/).length;

test('all twelve fixtures have complete distinct blueprint content and typed sample specifications', () => {
  const expectedNames = {
    DP001: 'Riverline Live-Edge Dining Table', DP002: 'Stillwater Full-Pour Dining Table',
    DP013: 'Basin Shallow-Pour Coffee Table', DP014: 'Orbit Circular Centre Table',
    DP025: 'Twinleaf Matched Side-Table Pair', DP035: 'Span Narrow Console',
    DP043: 'Petal Sculptural Chair', DP048: 'Threshold Entry Bench',
    DP051: 'Single-Slab Atelier Desk', DP057: 'Horizon Band Wall Panel',
    DP069: 'Lattice Resin-and-3D Sculpture', DP077: 'Estuary Reception Counter',
  };
  assert.deepEqual(concepts.map(piece => piece.id).sort(), Object.keys(expectedNames).sort());
  for (const piece of concepts) {
    assert.equal(piece.name, expectedNames[piece.id]);
    assert.equal(piece.tier, 'LARGE');
    assert.ok(words(piece.description) >= 35 && words(piece.description) <= 60, `${piece.id} summary length`);
    assert.ok(words(piece.detail) >= 100 && words(piece.detail) <= 180, `${piece.id} detail length`);
    assert.equal(piece.dimensions.unit, 'mm');
    for (const value of [piece.dimensions.width, piece.dimensions.depth, piece.dimensions.height]) assert.ok(Number.isInteger(value) && value > 0);
    assert.ok(piece.materials.length > 0 && piece.finishes.length > 0);
    for (const material of piece.materials) assert.ok(materialOptions.some(option => option.value === material.id));
    assert.ok(piece.finishes.every(finish => finish.id && finish.label && finish.description));
    assert.ok(piece.leadTime.minWeeks > 0 && piece.leadTime.maxWeeks >= piece.leadTime.minWeeks);
    assert.ok(piece.care && piece.installation);
    assert.equal(piece.customization.version, 1);
    for (const field of ['Intended use', 'Proposed dimensions', 'Material and finish preference', 'Site access', 'Location', 'Timeline', 'Optional reference']) assert.ok(piece.customization.fields.includes(field));
    assert.equal(piece.contentStatus, 'DEMO_VISIBLE');
  }
  assert.equal(new Set(concepts.map(piece => piece.description)).size, 12);
  assert.equal(new Set(concepts.map(piece => piece.detail)).size, 12);
  assert.deepEqual([...new Set(concepts.map(piece => piece.availability))].sort(), ['MADE_TO_ORDER', 'READY_TO_SHIP']);
});

test('pricing modes use valid integer INR minor units and never invent on-request amounts', () => {
  assert.deepEqual(Object.fromEntries(['ON_REQUEST', 'STARTING_FROM', 'FIXED'].map(mode => [mode, concepts.filter(piece => piece.priceType === mode).length])), { ON_REQUEST: 7, STARTING_FROM: 3, FIXED: 2 });
  for (const piece of concepts) {
    assert.equal(piece.currency, 'INR');
    if (piece.priceType === 'ON_REQUEST') assert.equal(piece.priceAmountMinor, null);
    else assert.ok(Number.isSafeInteger(piece.priceAmountMinor) && piece.priceAmountMinor > 0);
  }
  assert.equal(formatPrice(concepts[0]), 'Price on request');
  assert.equal(formatPrice(concepts[1]), 'From ₹85,000');
  assert.equal(formatPrice({ priceType: 'FIXED', priceAmountMinor: 12500050, currency: 'INR' }), '₹1,25,000.5');
});

test('default furniture page is bounded and preserves deliberate editorial order', () => {
  const result = queryFurniture({});
  assert.equal(result.total, 12);
  assert.equal(result.pageSize, 6);
  assert.equal(result.page, 1);
  assert.equal(result.pageCount, 2);
  assert.deepEqual(ids(result), ['DP001', 'DP013', 'DP002', 'DP014', 'DP025', 'DP035']);
  assert.deepEqual(result.filters, { category: 'all', material: 'all', size: 'all', sort: 'featured' });
  const secondPage = queryFurniture({ page: '2' });
  assert.deepEqual(ids(secondPage), ['DP043', 'DP048', 'DP051', 'DP057', 'DP069', 'DP077']);
  assert.equal(new Set([...ids(result), ...ids(secondPage)]).size, 12);
});

test('category, material and dimension facets compose with an inclusive 1200 mm boundary', () => {
  assert.deepEqual(ids(queryFurniture({ category: 'seating' })), ['DP043', 'DP048']);
  assert.deepEqual(ids(queryFurniture({ category: 'tables', material: 'wood', size: 'compact' })), ['DP013', 'DP025']);
  assert.deepEqual(ids(queryFurniture({ category: 'installations', material: 'mineral', size: 'statement' })), ['DP057', 'DP077']);
  const compact = queryFurniture({ size: 'compact' });
  assert.equal(compact.total, 5);
  assert.ok(compact.items.every(piece => piece.dimensions.width <= 1200));
  assert.ok(compact.items.some(piece => piece.id === 'DP013'));
  assert.equal(queryFurniture({ size: 'statement' }).total, 7);
});

test('empty filter combinations return an honest bounded empty page', () => {
  const result = queryFurniture({ category: 'consoles', material: 'mineral', page: '99' });
  assert.equal(result.total, 0);
  assert.deepEqual(result.items, []);
  assert.equal(result.page, 1);
  assert.equal(result.pageCount, 1);
});

test('unsupported, repeated and object-prototype-like filter values normalize safely', () => {
  const defaults = queryFurniture({}).filters;
  for (const invalid of ['ALL', 'undefined', '__proto__', 'constructor', ' resin', '<script>', '', ['wood'], ['wood', 'mineral']]) {
    assert.deepEqual(queryFurniture({ category: invalid, material: invalid, size: invalid, sort: invalid }).filters, defaults);
  }
  assert.deepEqual(queryFurniture({ category: 'seating', extra: 'ignored' }).filters, { ...defaults, category: 'seating' });
});

test('page parsing rejects malformed numbers and clamps valid out-of-range requests', () => {
  for (const page of ['0', '-1', '1.5', 'Infinity', 'NaN', '1e2', ' 2', '02', ['2'], ['1', '2'], '999999999999999999999999']) {
    assert.equal(queryFurniture({ page }).page, 1);
  }
  assert.equal(queryFurniture({ page: '999999999' }).page, 2);
  assert.equal(queryFurniture({ category: 'seating', page: '2' }).page, 1);
});

test('sorting is applied before pagination and does not mutate curated source order', () => {
  const original = concepts.map(piece => piece.id);
  assert.deepEqual(ids(queryFurniture({ sort: 'width-asc' })), ['DP025', 'DP043', 'DP069', 'DP014', 'DP013', 'DP048']);
  assert.deepEqual(ids(queryFurniture({ sort: 'title-asc' })), ['DP013', 'DP077', 'DP057', 'DP069', 'DP014', 'DP043']);
  assert.deepEqual(ids(queryFurniture({ sort: 'price-asc' })), ['DP025', 'DP048', 'DP013', 'DP014', 'DP035', 'DP001']);
  assert.ok(queryFurniture({ sort: 'price-asc', page: '2' }).items.every(piece => piece.priceAmountMinor === null));
  assert.deepEqual(concepts.map(piece => piece.id), original);
});

test('shareable catalogue URLs retain active filters, omit defaults and reset page explicitly', () => {
  assert.equal(catalogueHref(), '/collectible-design');
  const filters = { category: 'tables', material: 'wood', size: 'compact', sort: 'width-asc' };
  assert.equal(catalogueHref(filters, 2), '/collectible-design?category=tables&material=wood&size=compact&sort=width-asc&page=2');
  assert.equal(catalogueHref(filters), '/collectible-design?category=tables&material=wood&size=compact&sort=width-asc');
  assert.equal(catalogueHref({ category: 'all', material: 'all', size: 'all', sort: 'featured' }), '/collectible-design');
  const parsed = Object.fromEntries(new URL(catalogueHref(filters), 'https://example.invalid').searchParams);
  assert.deepEqual(queryFurniture(parsed).filters, filters);
});

test('filter option values are unique and match supported normalized queries', () => {
  for (const [key, options] of Object.entries({ category: categoryOptions, material: materialOptions, size: sizeOptions, sort: sortOptions })) {
    assert.equal(new Set(options.map(option => option.value)).size, options.length);
    for (const option of options) assert.equal(queryFurniture({ [key]: option.value }).filters[key], option.value);
  }
});

test('related concepts prefer the same category without linking a piece to itself', () => {
  const bench = concepts.find(piece => piece.id === 'DP048');
  const related = relatedConcepts(bench, 3);
  assert.equal(related.length, 3);
  assert.equal(related[0].id, 'DP043');
  assert.ok(related.every(piece => piece.id !== bench.id && piece.tier === 'LARGE'));
  assert.deepEqual(relatedConcepts(bench, 0), []);
});
