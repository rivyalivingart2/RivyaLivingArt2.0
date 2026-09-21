import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  conceptsForTier, findConcept, queryMemory, queryPersonal, memoryHref, personalHref,
  formatPrice, relatedConcepts, memoryOccasionOptions, preservationOptions,
  personalRecipientOptions, personalColourOptions, personalFestivalOptions, tierSortOptions,
} from '../src/lib/catalogue.ts';

const memory = conceptsForTier('MEDIUM');
const personal = conceptsForTier('SMALL');
const words = (text) => text.trim().split(/\s+/).length;
const ids = (result) => result.items.map(piece => piece.id);
const supported = (options, value) => value !== 'all' && options.some(option => option.value === value);

test('the memory and personal slice authors twelve distinct blueprint records with sample specifications', () => {
  const names = {
    DP085: 'Vow Framed Varmala Keepsake', DP091: 'Hourglass Floral Wall Clock',
    DP095: 'Union Engagement Tray', DP099: 'Letterlight Invitation Frame',
    DP103: 'Threshold Family Nameplate', DP107: 'First Chapter Baby Keepsake',
    DP109: 'Botanical Resin Pendant', DP111: 'Thread of Light Resin Rakhi',
    DP112: 'Initial Story Keychain', DP113: 'Chaptermark Flower Bookmark',
    DP114: 'Everyday Resin Coaster Set', DP120: 'Little Archive Keepsake Box',
  };
  const pieces = [...memory, ...personal];
  assert.deepEqual(pieces.map(piece => piece.id), Object.keys(names));
  for (const piece of pieces) {
    assert.equal(piece.name, names[piece.id]);
    assert.equal(findConcept(piece.slug), piece);
    assert.ok(words(piece.description) >= 35 && words(piece.description) <= 60, `${piece.id}: 35–60 word summary`);
    assert.ok(words(piece.detail) >= 100 && words(piece.detail) <= 180, `${piece.id}: 100–180 word narrative`);
    assert.match(piece.description, /fictional/i);
    assert.equal(piece.image, null);
    assert.equal(piece.mediaStatus, 'VISUAL_PENDING');
    assert.deepEqual(piece.gallery, []);
    assert.equal(piece.dimensions.unit, 'mm');
    for (const size of [piece.dimensions.width, piece.dimensions.depth, piece.dimensions.height]) assert.ok(Number.isInteger(size) && size > 0);
    assert.ok(piece.materials.length > 0 && piece.finishes.length > 0);
    assert.ok(piece.leadTime.minWeeks > 0 && piece.leadTime.maxWeeks >= piece.leadTime.minWeeks);
    assert.ok(piece.care);
    assert.equal(piece.customization.version, 1);
    assert.equal(piece.contentStatus, 'DEMO_VISIBLE');
    assert.equal('installation' in piece, false);
    assert.equal('edition' in piece, false);
  }
  assert.equal(new Set(pieces.map(piece => piece.description)).size, 12);
  assert.equal(new Set(pieces.map(piece => piece.detail)).size, 12);
});

test('memory records carry real tier fields for occasion, preservation, format and labelled sizes', () => {
  assert.equal(new Set(memory.map(piece => piece.category)).size, 6);
  for (const piece of memory) {
    const fields = piece.memory;
    assert.ok(fields.occasions.length > 0 && fields.occasions.every(value => supported(memoryOccasionOptions, value)));
    assert.ok(supported(preservationOptions, fields.preservation));
    assert.ok(fields.format && fields.materialsNote);
    assert.ok(fields.personalization.length > 0);
    assert.ok(fields.sizes.length > 0);
    assert.equal(new Set(fields.sizes.map(size => size.label)).size, fields.sizes.length);
    for (const size of fields.sizes) {
      assert.ok(size.label);
      assert.equal(size.dimensions.unit, 'mm');
      for (const value of [size.dimensions.width, size.dimensions.depth, size.dimensions.height]) assert.ok(Number.isInteger(value) && value > 0);
    }
    for (const field of ['Occasion', 'Names and dates', 'Format and size', 'Finish preference', 'Optional private reference']) assert.ok(piece.customization.fields.includes(field), `${piece.id}: ${field}`);
  }
});

test('personal records have bounded quantities and meaningful variants matching their colour facets', () => {
  for (const piece of personal) {
    const fields = piece.personal;
    assert.ok(fields.recipients.length > 0 && fields.recipients.every(value => supported(personalRecipientOptions, value)));
    assert.ok(fields.colours.length > 0 && fields.colours.every(value => supported(personalColourOptions, value)));
    assert.ok(fields.festivals.length > 0 && fields.festivals.every(value => supported(personalFestivalOptions, value)));
    assert.ok(fields.variants.length > 0 && fields.personalization.length > 0);
    assert.equal(new Set(fields.variants.map(variant => variant.id)).size, fields.variants.length);
    for (const variant of fields.variants) {
      assert.ok(variant.id && variant.label);
      assert.ok(fields.colours.includes(variant.colour));
    }
    assert.ok(Number.isInteger(fields.quantity.min) && fields.quantity.min > 0);
    assert.ok(Number.isInteger(fields.quantity.max) && fields.quantity.max >= fields.quantity.min);
    assert.ok(fields.giftNote);
    for (const field of ['Permitted personalization', 'Variant', 'Quantity', 'Gift message']) assert.ok(piece.customization.fields.includes(field), `${piece.id}: ${field}`);
  }
});

test('sample prices retain missing amounts and never turn a request-only concept into a zero-price offer', () => {
  assert.deepEqual([...memory, ...personal].filter(piece => piece.priceAmountMinor === null).map(piece => piece.id), ['DP085', 'DP107', 'DP120']);
  for (const piece of [...memory, ...personal]) {
    assert.equal(piece.currency, 'INR');
    if (piece.priceType === 'ON_REQUEST') {
      assert.equal(piece.priceAmountMinor, null);
      assert.equal(formatPrice(piece), 'Price on request');
    } else {
      assert.ok(Number.isSafeInteger(piece.priceAmountMinor) && piece.priceAmountMinor > 0);
      assert.match(formatPrice(piece), piece.priceType === 'STARTING_FROM' ? /^From ₹/ : /^₹/);
    }
  }
  assert.equal(formatPrice({ priceType: 'STARTING_FROM', priceAmountMinor: null, currency: 'INR' }), 'Price on request');
});

for (const { label, tier, query, href, pieces, options, defaults } of [
  { label: 'memory', tier: 'MEDIUM', query: queryMemory, href: memoryHref, pieces: memory,
    options: { occasion: memoryOccasionOptions, preservation: preservationOptions, sort: tierSortOptions },
    defaults: { occasion: 'all', preservation: 'all', sort: 'featured' } },
  { label: 'personal', tier: 'SMALL', query: queryPersonal, href: personalHref, pieces: personal,
    options: { recipient: personalRecipientOptions, colour: personalColourOptions, festival: personalFestivalOptions, sort: tierSortOptions },
    defaults: { recipient: 'all', colour: 'all', festival: 'all', sort: 'featured' } },
]) {
  test(`${label} pagination is tier-isolated, bounded and preserves editorial order`, () => {
    const first = query({});
    assert.deepEqual(first.filters, defaults);
    assert.equal(first.total, 6);
    assert.equal(first.pageSize, 4);
    assert.equal(first.page, 1);
    assert.equal(first.pageCount, 2);
    assert.deepEqual(ids(first), pieces.slice(0, 4).map(piece => piece.id));
    const second = query({ page: '2' });
    assert.deepEqual(ids(second), pieces.slice(4).map(piece => piece.id));
    assert.ok([...first.items, ...second.items].every(piece => piece.tier === tier));
    assert.equal(new Set([...ids(first), ...ids(second)]).size, 6);
    for (const page of ['0', '-1', '1.5', 'Infinity', 'NaN', '1e2', ' 2', '02', ['2'], ['1', '2'], '999999999999999999999999']) assert.equal(query({ page }).page, 1);
    assert.equal(query({ page: '999999999' }).page, 2);
  });

  test(`${label} filters reject ambiguous, unsupported and prototype-like input`, () => {
    for (const value of ['ALL', 'undefined', '__proto__', 'constructor', ' wedding', '<script>', '', ['wedding'], ['wedding', 'family']]) {
      assert.deepEqual(query(Object.fromEntries(Object.keys(options).map(key => [key, value]))).filters, defaults);
    }
    assert.deepEqual(query({ category: 'tables', size: 'compact', material: 'wood' }).filters, defaults);
    for (const [key, values] of Object.entries(options)) {
      assert.equal(new Set(values.map(option => option.value)).size, values.length);
      for (const option of values) assert.equal(query({ [key]: option.value }).filters[key], option.value);
    }
    assert.equal(query({ sort: 'width-asc' }).filters.sort, 'featured');
  });

  test(`${label} sort runs before pagination with missing prices last and leaves fixture order intact`, () => {
    const original = pieces.map(piece => piece.id);
    const sortedNames = [...query({ sort: 'title-asc' }).items, ...query({ sort: 'title-asc', page: '2' }).items];
    assert.deepEqual(sortedNames.map(piece => piece.title), pieces.map(piece => piece.title).sort((a, b) => a.localeCompare(b, 'en')));
    const sortedPrices = [...query({ sort: 'price-asc' }).items, ...query({ sort: 'price-asc', page: '2' }).items];
    const amounts = sortedPrices.filter(piece => piece.priceAmountMinor !== null).map(piece => piece.priceAmountMinor);
    assert.deepEqual(amounts, [...amounts].sort((a, b) => a - b));
    assert.ok(sortedPrices.slice(amounts.length).every(piece => piece.priceAmountMinor === null));
    assert.deepEqual(pieces.map(piece => piece.id), original);
  });

  test(`${label} URLs round-trip active facets, omit defaults and explicitly reset pagination`, () => {
    const expectedPath = tier === 'MEDIUM' ? '/memory-art' : '/personal-art';
    const active = Object.fromEntries(Object.entries(options).map(([key, values]) => [key, values[1].value]));
    assert.equal(href(), expectedPath);
    assert.equal(href(defaults), expectedPath);
    const first = new URL(href(active), 'https://example.invalid');
    assert.equal(first.pathname, expectedPath);
    assert.equal(first.searchParams.has('page'), false);
    assert.deepEqual(query(Object.fromEntries(first.searchParams)).filters, active);
    assert.equal(new URL(href(active, 2), 'https://example.invalid').searchParams.get('page'), '2');
    for (const invalid of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) assert.equal(new URL(href(active, invalid), 'https://example.invalid').searchParams.has('page'), false);
  });

  test(`${label} related concepts never cross tiers or link back to the current piece`, () => {
    for (const piece of pieces) {
      const related = relatedConcepts(piece);
      assert.equal(related.length, 3);
      assert.ok(related.every(other => other.id !== piece.id && other.tier === tier));
      assert.equal(new Set(related.map(other => other.id)).size, related.length);
      assert.deepEqual(relatedConcepts(piece, 0), []);
    }
  });
}

test('occasion/preservation and recipient/colour/festival facets compose, including honest empty results', () => {
  const wedding = queryMemory({ occasion: 'wedding', preservation: 'flowers' });
  assert.ok(wedding.total > 0);
  assert.ok(wedding.items.every(piece => piece.memory.occasions.includes('wedding') && piece.memory.preservation === 'flowers'));
  const gifts = queryPersonal({ recipient: 'reader', colour: 'clear', festival: 'everyday' });
  assert.ok(gifts.total > 0);
  assert.ok(gifts.items.every(piece => piece.personal.recipients.includes('reader') && piece.personal.colours.includes('clear') && piece.personal.festivals.includes('everyday')));
  for (const result of [queryMemory({ occasion: 'new-arrival', preservation: 'paper', page: '2' }), queryPersonal({ recipient: 'host', festival: 'rakhi', page: '2' })]) {
    assert.equal(result.total, 0);
    assert.deepEqual(result.items, []);
    assert.equal(result.page, 1);
    assert.equal(result.pageCount, 1);
  }
});
