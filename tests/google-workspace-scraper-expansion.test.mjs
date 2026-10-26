import test from 'node:test';
import assert from 'node:assert/strict';
import {
  vendorRegistry,
  getVendorByKey,
  getVendorsByPlatform,
  getVendorsByTier,
  getActiveAutomatedVendors,
} from '../src/lib/google-workspace/scraper-registry.ts';
import {
  scraperJobManager,
} from '../src/lib/google-workspace/scraper-adapters.ts';
import {
  proposeCandidateMapping,
  filterCandidateMappings,
  assertProductCreationDisabled,
  executeProductHandoff,
  CAN_CREATE_PRODUCT,
} from '../src/lib/google-workspace/scraper-handoff.ts';

test('GW-700: Vendor registry has all 23 sources and enforces strict compliance boundaries', () => {
  assert.equal(vendorRegistry.length, 23, 'Must contain all 23 legacy configured sources');

  // Strict compliance invariants
  for (const v of vendorRegistry) {
    assert.ok(v.key, 'Vendor must have key');
    assert.ok(v.name, 'Vendor must have name');
    assert.ok(v.baseUrl.startsWith('http'), `Vendor ${v.key} must have valid URL`);
    assert.equal(v.bypassAccessControls, false, `Vendor ${v.key} must never bypass access controls`);
    assert.equal(v.requiresAuth, false, `Vendor ${v.key} must not use unapproved logins`);
  }

  // Check specific platforms and access methods
  const wooVendors = getVendorsByPlatform('WOOCOMMERCE');
  assert.ok(wooVendors.length >= 10, 'Expected at least 10 WooCommerce vendors');

  const shopifyVendors = getVendorsByPlatform('SHOPIFY');
  assert.ok(shopifyVendors.length >= 2, 'Expected at least 2 Shopify vendors');
  assert.ok(shopifyVendors.some((v) => v.key === 'leafy-affair'));
  assert.ok(shopifyVendors.some((v) => v.key === 'dinosaur-designs'));

  // Lookup queries
  const scarlet = getVendorByKey('scarlet-splendour');
  assert.ok(scarlet);
  assert.equal(scarlet.lastVerifiedStatus, 'BLOCKED_ACCESS');
  assert.equal(scarlet.collectionMode, 'MANUAL_RESEARCH');

  const poonam = getVendorByKey('poonam-shah-art');
  assert.ok(poonam);
  assert.equal(poonam.collectionMode, 'MANUAL_RESEARCH');

  const activeAutomated = getActiveAutomatedVendors();
  assert.ok(activeAutomated.length >= 4, 'Must identify active automated candidates');
  assert.ok(activeAutomated.every((v) => v.enabled && v.collectionMode === 'AUTOMATED_HTTP'));

  // Tiers
  const largeTier = getVendorsByTier('LARGE_FORMAT');
  assert.ok(largeTier.length >= 5);
  const smallTier = getVendorsByTier('SMALL_FORMAT');
  assert.ok(smallTier.length >= 5);
});

test('GW-701: Bounded scraper adapters prevent scraping manual/blocked sites and handle jobs safely', () => {
  // Attempting to create job on Cloudflare blocked site fails closed
  const blockedJob = scraperJobManager.createJob('scarlet-splendour');
  assert.equal(blockedJob.state, 'FAILED');
  assert.ok(blockedJob.errorMessage?.includes('prohibited to respect site access controls'));

  // Creating job on accessible source succeeds
  const saashiVendor = getVendorByKey('saashi');
  assert.ok(saashiVendor);
  const job = scraperJobManager.createJob('saashi', 10);
  assert.equal(job.state, 'QUEUED');
  assert.equal(job.sourceKey, 'saashi');

  // Process raw product items
  const mockItems = [
    {
      id: '101',
      title: 'Ocean Deep Resin Coaster Set',
      price: 1299,
      currency: 'INR',
      category: 'coasters',
      images: ['https://saashi.co.in/images/c1.jpg'],
    },
    {
      id: '102',
      title: 'Riverline Resin Wall Clock',
      price: '4500.00',
      currency: 'INR',
      category: 'clocks',
      images: [{ src: 'https://saashi.co.in/images/clock.jpg' }],
    },
  ];

  const obs = scraperJobManager.processObservations(job.id, saashiVendor, mockItems);
  assert.equal(obs.length, 2);
  assert.equal(job.processedCount, 2);
  assert.equal(job.state, 'COMPLETED');

  // Verify first observation
  const first = obs[0];
  assert.equal(first.externalId, '101');
  assert.equal(first.rawTitle, 'Ocean Deep Resin Coaster Set');
  assert.equal(first.rawPrice?.amount, 1299);
  assert.equal(first.status, 'PENDING_REVIEW');
  assert.ok(/^[a-f0-9]{64}$/.test(first.rawPayloadSha256));

  // Verify second observation parsed string price correctly
  const second = obs[1];
  assert.equal(second.rawPrice?.amount, 4500);

  // Cancellation support
  const cancelJob = scraperJobManager.createJob('saashi', 20);
  const cancelled = scraperJobManager.cancelJob(cancelJob.id);
  assert.equal(cancelled, true);
  assert.equal(cancelJob.state, 'CANCELLED');

  // Processing on cancelled job halts immediately
  const emptyObs = scraperJobManager.processObservations(cancelJob.id, saashiVendor, mockItems);
  assert.equal(emptyObs.length, 0);
});

test('GW-702: Candidate review, filtering, and strict prohibition of product creation', () => {
  // Invariant: Product creation is strictly disabled
  assert.equal(CAN_CREATE_PRODUCT, false);
  assert.throws(() => assertProductCreationDisabled(), /strictly disabled/);
  assert.throws(() => executeProductHandoff(), /strictly disabled/);

  // Propose candidate mapping
  const mockObs = {
    id: 'obs-saashi-201',
    jobId: 'job-1',
    sourceKey: 'saashi',
    sourceUrl: 'https://saashi.co.in/products/201',
    externalId: '201',
    rawTitle: 'Handcrafted Live Edge Epoxy Dining Table',
    rawPrice: { amount: 65000, currency: 'INR' },
    rawCategory: 'furniture',
    images: ['https://saashi.co.in/img/table.jpg'],
    extractedAt: '2026-10-26T10:00:00Z',
    status: 'PENDING_REVIEW',
    rawPayloadSha256: 'e'.repeat(64),
  };

  const proposal = proposeCandidateMapping(mockObs, {
    disposition: 'ACCEPTED_RESEARCH',
    proposedCategory: 'tables',
    suggestedMaterials: ['wood', 'resin', 'metal'],
    reviewNotes: 'Excellent reference for live edge grain preservation and blue river fill.',
    reviewer: 'researcher-1',
  });

  assert.equal(proposal.candidateId, mockObs.id);
  assert.equal(proposal.proposedTier, 'LARGE'); // Inferred from 'Dining Table'
  assert.equal(proposal.disposition, 'ACCEPTED_RESEARCH');
  assert.equal(proposal.estimatedPriceRange?.currency, 'INR');
  assert.equal(proposal.reviewedBy, 'researcher-1');

  // Second proposal with SMALL tier item
  const smallObs = {
    ...mockObs,
    id: 'obs-saashi-202',
    rawTitle: 'Resin Floral Earrings',
    rawPrice: { amount: 850, currency: 'INR' },
  };
  const smallProposal = proposeCandidateMapping(smallObs, {
    disposition: 'ACCEPTED_RESEARCH',
    reviewer: 'researcher-1',
  });
  assert.equal(smallProposal.proposedTier, 'SMALL'); // Inferred from 'Earrings'

  // Third proposal rejected
  const rejectedProposal = proposeCandidateMapping(smallObs, {
    disposition: 'REJECTED',
    reviewNotes: 'Duplicate of existing atelier catalogue design; rejected.',
    reviewer: 'researcher-1',
  });
  assert.equal(rejectedProposal.disposition, 'REJECTED');

  // Filter candidate proposals
  const allProposals = [proposal, smallProposal, rejectedProposal];
  const acceptedOnly = filterCandidateMappings(allProposals, { disposition: 'ACCEPTED_RESEARCH' });
  assert.equal(acceptedOnly.length, 2);

  const largeOnly = filterCandidateMappings(allProposals, { tier: 'LARGE' });
  assert.equal(largeOnly.length, 1);
  assert.equal(largeOnly[0].candidateId, proposal.candidateId);

  const searchTable = filterCandidateMappings(allProposals, { query: 'table' });
  assert.equal(searchTable.length, 1);
  assert.equal(searchTable[0].candidateId, proposal.candidateId);
});
