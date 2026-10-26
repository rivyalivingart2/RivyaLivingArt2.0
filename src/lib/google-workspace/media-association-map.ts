import { approvedPublicMedia } from '../public-media';
import { isEditorialPath } from '../editorial-media-model';

export type EntityKind =
  | 'category'
  | 'article'
  | 'project'
  | 'testimonial'
  | 'page'
  | 'product_concept';

export type MediaSlotKind =
  | 'primary'
  | 'hero'
  | 'gallery'
  | 'avatar'
  | 'installation'
  | 'detail';

export type TruthfulClassification =
  | 'genuine'
  | 'concept'
  | 'fictional'
  | 'design-visualization'
  | 'guidance';

export interface MediaAssociationReview {
  readonly reviewer: string;
  readonly approvedOn: string;
  readonly source: string;
  readonly permission: string;
}

export interface MediaAssociation {
  readonly id: string;
  readonly entityKind: EntityKind;
  readonly entityId: string;
  readonly slot: MediaSlotKind;
  readonly mediaPath: string;
  readonly alt: string;
  readonly caption: string;
  readonly classification: TruthfulClassification;
  readonly provenance: string;
  readonly attribution?: string;
  readonly review?: MediaAssociationReview;
  readonly rating?: number;
}

export interface MediaAssociationValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

const VALID_SLOTS: Record<EntityKind, readonly MediaSlotKind[]> = {
  category: ['hero', 'primary'],
  article: ['hero', 'gallery', 'detail'],
  project: ['hero', 'primary', 'gallery', 'detail'],
  testimonial: ['avatar', 'installation'],
  page: ['hero', 'primary', 'gallery'],
  product_concept: ['primary', 'detail', 'gallery'],
};

/**
 * Validates a media association for entity/slot compatibility, path safety,
 * and truthfulness of claims (e.g. zero invented reviews or customers).
 */
export function validateMediaAssociation(
  association: unknown
): MediaAssociationValidationResult {
  const errors: string[] = [];
  if (!association || typeof association !== 'object') {
    return { valid: false, errors: ['Association must be a non-null object'] };
  }

  const a = association as Partial<MediaAssociation>;

  if (!a.id || typeof a.id !== 'string' || !/^[a-z0-9:_-]{3,100}$/i.test(a.id)) {
    errors.push('id must be an alphanumeric identifier between 3 and 100 characters');
  }

  const entityKinds: readonly EntityKind[] = [
    'category',
    'article',
    'project',
    'testimonial',
    'page',
    'product_concept',
  ];
  if (!a.entityKind || !entityKinds.includes(a.entityKind)) {
    errors.push(`Invalid entityKind: ${String(a.entityKind)}`);
    return { valid: false, errors };
  }

  if (!a.entityId || typeof a.entityId !== 'string' || a.entityId.length > 120) {
    errors.push('entityId must be a non-empty string up to 120 characters');
  }

  const validSlotsForKind = VALID_SLOTS[a.entityKind];
  if (!a.slot || !validSlotsForKind.includes(a.slot)) {
    errors.push(`Slot '${String(a.slot)}' is not valid for entityKind '${a.entityKind}'`);
  }

  // Media Path safety checks
  if (!a.mediaPath || typeof a.mediaPath !== 'string') {
    errors.push('mediaPath is required');
  } else {
    if (a.mediaPath.includes('..') || a.mediaPath.includes('//') || a.mediaPath.includes('\\')) {
      errors.push('mediaPath must not contain directory traversal characters');
    }
    if (a.mediaPath.startsWith('/api/studio/reference/private')) {
      errors.push('mediaPath must not expose private customer reference endpoints');
    }
    const isApprovedPublic = approvedPublicMedia.some((m) => m.path === a.mediaPath);
    const isEditorial = isEditorialPath(a.mediaPath);
    const isOwnerCreation = /^\/api\/local-creations\/\d{3}\/(?:640|960|1600)$/.test(a.mediaPath) || /^\/creations\/\d{3}$/.test(a.mediaPath);
    const isApprovedStatic = /^\/media\/[a-z0-9_-]+\.(?:webp|jpg|png)$/i.test(a.mediaPath);

    if (!isApprovedPublic && !isEditorial && !isOwnerCreation && !isApprovedStatic) {
      errors.push(`mediaPath '${a.mediaPath}' is not an approved public, editorial, or creation asset`);
    }
  }

  // Truthful Claims & Integrity Checks
  if (a.entityKind === 'testimonial') {
    if (a.classification === 'genuine') {
      if (!a.attribution || typeof a.attribution !== 'string' || !a.attribution.trim()) {
        errors.push('Genuine testimonials require explicit attribution of the client');
      }
      if (!a.review) {
        errors.push('Genuine testimonials require a review record with provenance and approval details');
      } else {
        if (!a.review.reviewer || !a.review.source || !a.review.permission) {
          errors.push('Review record must state reviewer, source, and explicit permission');
        }
        if (!a.review.approvedOn || !/^\d{4}-\d{2}-\d{2}$/.test(a.review.approvedOn)) {
          errors.push('Review record must have valid approvedOn date (YYYY-MM-DD)');
        }
      }
      if (a.rating !== undefined && (!Number.isInteger(a.rating) || a.rating < 1 || a.rating > 5)) {
        errors.push('Rating must be an integer between 1 and 5');
      }
    } else if (a.classification === 'fictional') {
      if (a.attribution && a.attribution.trim().length > 0) {
        errors.push('Fictional testimonial samples must not have real client attribution');
      }
      if (a.rating !== undefined) {
        errors.push('Fictional testimonial samples must not claim star ratings');
      }
      if (a.slot === 'avatar') {
        errors.push('Fictional testimonial samples must not feature fabricated human avatars');
      }
      if (!a.caption?.toLowerCase().includes('sample') && !a.provenance?.toLowerCase().includes('fictional')) {
        errors.push('Fictional testimonial must clearly disclose its fictional status in caption or provenance');
      }
    } else {
      errors.push(`Testimonials cannot have classification '${String(a.classification)}'`);
    }
  }

  if (a.entityKind === 'project') {
    if (a.classification !== 'genuine' && a.classification !== 'concept') {
      errors.push(`Projects must have classification 'genuine' or 'concept', got: ${String(a.classification)}`);
    }
    if (a.classification === 'concept') {
      const notes = `${a.caption || ''} ${a.provenance || ''}`.toLowerCase();
      if (!notes.includes('concept') && !notes.includes('visualization')) {
        errors.push('Concept projects must explicitly disclose design visualization / concept status');
      }
    }
  }

  if (a.entityKind === 'product_concept') {
    if (a.classification !== 'design-visualization' && a.classification !== 'concept') {
      errors.push(`Product concepts must be classified as 'design-visualization' or 'concept'`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Baseline Canonical Media Associations
 * Linking approved categories, baseline articles, curated projects, and guidance pages.
 */
export const baselineMediaAssociations: readonly MediaAssociation[] = [
  // Categories
  {
    id: 'assoc-cat-tables',
    entityKind: 'category',
    entityId: 'tables',
    slot: 'hero',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Sculptural riverline dining table design visualization',
    caption: 'Curated dining tables and architectural consoles',
    classification: 'design-visualization',
    provenance: 'Owner-approved category hero visualization retained in Drive.',
  },
  {
    id: 'assoc-cat-seating',
    entityKind: 'category',
    entityId: 'seating',
    slot: 'hero',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Bespoke sculptural bench design visualization',
    caption: 'Sculptural benches and architectural seating',
    classification: 'design-visualization',
    provenance: 'Owner-approved category hero visualization retained in Drive.',
  },
  {
    id: 'assoc-cat-consoles',
    entityKind: 'category',
    entityId: 'consoles',
    slot: 'hero',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Architectural entry console design visualization',
    caption: 'Entry consoles and wall-mounted slabs',
    classification: 'design-visualization',
    provenance: 'Owner-approved category hero visualization retained in Drive.',
  },
  // Articles
  {
    id: 'assoc-art-reading-grain',
    entityKind: 'article',
    entityId: 'reading-the-grain-wood-and-resin-in-a-shared-composition',
    slot: 'hero',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Wood grain and crystal resin in balance',
    caption: 'Reading the grain: live edge geometry meets fluid resin',
    classification: 'design-visualization',
    provenance: 'Owner-supplied journal visualization.',
  },
  {
    id: 'assoc-art-statement-table',
    entityKind: 'article',
    entityId: 'a-room-begins-with-a-statement-table',
    slot: 'hero',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Statement dining table in an architectural room setting',
    caption: 'Designing a living space around a centerpiece table',
    classification: 'design-visualization',
    provenance: 'Owner-supplied journal visualization.',
  },
  // Pages
  {
    id: 'assoc-page-materials-care',
    entityKind: 'page',
    entityId: 'page:materials-care',
    slot: 'hero',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Timber grain and resin in a sculptural design',
    caption: 'Texture, depth and everyday life',
    classification: 'design-visualization',
    provenance: 'Owner-supplied approved material image; original retained in Drive.',
  },
  // Projects (truthful disclosures)
  {
    id: 'assoc-proj-study-ocean',
    entityKind: 'project',
    entityId: 'project-ocean-riverline',
    slot: 'primary',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Ocean riverline resin dining table study',
    caption: 'Concept study — not a completed customer commission',
    classification: 'concept',
    provenance: 'Design visualization from atelier archives.',
  },
  // Guidance Testimonials (truthful sample disclosures, zero invented customers)
  {
    id: 'assoc-test-sample-guidance',
    entityKind: 'testimonial',
    entityId: 'testimonial-guidance-commission',
    slot: 'installation',
    mediaPath: '/media/product-hero-026-4x5.webp',
    alt: 'Table installation in daylight',
    caption: 'Fictional sample — illustrates customer testimonial presentation format',
    classification: 'fictional',
    provenance: 'Fictional guidance sample; zero customer claims.',
  },
];

/**
 * Registry map for efficient lookups
 */
class MediaAssociationRegistry {
  private associations: Map<string, MediaAssociation> = new Map();

  constructor(initial: readonly MediaAssociation[] = baselineMediaAssociations) {
    for (const assoc of initial) {
      const result = validateMediaAssociation(assoc);
      if (result.valid) {
        this.associations.set(assoc.id, assoc);
      }
    }
  }

  get(id: string): MediaAssociation | undefined {
    return this.associations.get(id);
  }

  getAll(): readonly MediaAssociation[] {
    return Array.from(this.associations.values());
  }

  getByEntity(entityKind: EntityKind, entityId: string): readonly MediaAssociation[] {
    return Array.from(this.associations.values()).filter(
      (a) => a.entityKind === entityKind && a.entityId === entityId
    );
  }

  getByMedia(mediaPath: string): readonly MediaAssociation[] {
    return Array.from(this.associations.values()).filter(
      (a) => a.mediaPath === mediaPath
    );
  }

  register(association: MediaAssociation): MediaAssociationValidationResult {
    const result = validateMediaAssociation(association);
    if (result.valid) {
      this.associations.set(association.id, association);
    }
    return result;
  }
}

export const mediaAssociationRegistry = new MediaAssociationRegistry();
