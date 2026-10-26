import type { CandidateObservation } from './scraper-adapters';

export type CandidateDisposition = 'ACCEPTED_RESEARCH' | 'REJECTED' | 'NEEDS_INVESTIGATION';

export interface ProposedProductMapping {
  readonly candidateId: string;
  readonly sourceKey: string;
  readonly sourceExternalId: string;
  readonly sourceTitle: string;
  readonly proposedName: string;
  readonly proposedCategory: string;
  readonly proposedTier: 'LARGE' | 'MEDIUM' | 'SMALL';
  readonly suggestedMaterials: readonly string[];
  readonly estimatedPriceRange: { readonly min: number; readonly max: number; readonly currency: 'INR' } | null;
  readonly disposition: CandidateDisposition;
  readonly reviewNotes: string;
  readonly reviewedBy: string;
  readonly reviewedAt: string;
}

export interface CandidateReviewInput {
  readonly disposition: CandidateDisposition;
  readonly proposedName?: string;
  readonly proposedCategory?: string;
  readonly proposedTier?: 'LARGE' | 'MEDIUM' | 'SMALL';
  readonly suggestedMaterials?: readonly string[];
  readonly reviewNotes?: string;
  readonly reviewer: string;
}

export interface CandidateFilterParams {
  readonly disposition?: 'all' | CandidateDisposition;
  readonly tier?: 'all' | 'LARGE' | 'MEDIUM' | 'SMALL';
  readonly sourceKey?: 'all' | string;
  readonly query?: string;
}

/**
 * INVARIANT: Product creation from external scraper observations is strictly disabled.
 * Zero products added, zero archived catalogue/Sheets imports performed.
 */
export const CAN_CREATE_PRODUCT = false as const;

export function assertProductCreationDisabled(): void {
  throw new Error(
    'Product creation from scraper candidates is strictly disabled under current project boundaries. Candidate research remains isolated from catalogue records.'
  );
}

export function executeProductHandoff(): never {
  assertProductCreationDisabled();
  // Unreachable code path for runtime safety
  throw new Error('Unreachable: product handoff is disabled');
}

/**
 * Creates a structured proposal for candidate inspection without mutating catalogue records
 */
export function proposeCandidateMapping(
  observation: CandidateObservation,
  review: CandidateReviewInput
): ProposedProductMapping {
  if (!review.reviewer || typeof review.reviewer !== 'string' || !review.reviewer.trim()) {
    throw new Error('Reviewer identifier is required to record candidate inspection');
  }

  // Derive suggested tier if not specified
  let tier: 'LARGE' | 'MEDIUM' | 'SMALL' = review.proposedTier || 'MEDIUM';
  const titleLower = observation.rawTitle.toLowerCase();
  if (titleLower.includes('table') || titleLower.includes('console') || titleLower.includes('bench')) {
    tier = 'LARGE';
  } else if (titleLower.includes('earring') || titleLower.includes('ring') || titleLower.includes('rakhi') || titleLower.includes('coaster')) {
    tier = 'SMALL';
  }

  // Price estimate
  let estimatedPriceRange: ProposedProductMapping['estimatedPriceRange'] = null;
  if (observation.rawPrice && observation.rawPrice.amount > 0) {
    const amt = observation.rawPrice.amount;
    estimatedPriceRange = {
      min: Math.floor(amt * 0.9),
      max: Math.ceil(amt * 1.1),
      currency: 'INR',
    };
  }

  return {
    candidateId: observation.id,
    sourceKey: observation.sourceKey,
    sourceExternalId: observation.externalId,
    sourceTitle: observation.rawTitle,
    proposedName: review.proposedName || observation.rawTitle.replace(/\s*-\s*.*$/, ''),
    proposedCategory: review.proposedCategory || observation.rawCategory,
    proposedTier: tier,
    suggestedMaterials: review.suggestedMaterials || ['resin', 'wood'],
    estimatedPriceRange,
    disposition: review.disposition,
    reviewNotes: review.reviewNotes || 'Reviewed for material and format inspiration only.',
    reviewedBy: review.reviewer,
    reviewedAt: new Date().toISOString(),
  };
}

/**
 * Filter evaluation for candidate research review
 */
export function filterCandidateMappings(
  mappings: readonly ProposedProductMapping[],
  params: CandidateFilterParams = {}
): readonly ProposedProductMapping[] {
  const { disposition = 'all', tier = 'all', sourceKey = 'all', query = '' } = params;
  const q = query.trim().toLowerCase();

  return mappings.filter((m) => {
    if (disposition !== 'all' && m.disposition !== disposition) return false;
    if (tier !== 'all' && m.proposedTier !== tier) return false;
    if (sourceKey !== 'all' && m.sourceKey !== sourceKey) return false;
    if (q) {
      const matchName = m.proposedName.toLowerCase().includes(q);
      const matchTitle = m.sourceTitle.toLowerCase().includes(q);
      const matchCategory = m.proposedCategory.toLowerCase().includes(q);
      const matchNotes = m.reviewNotes.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchCategory && !matchNotes) return false;
    }
    return true;
  });
}
