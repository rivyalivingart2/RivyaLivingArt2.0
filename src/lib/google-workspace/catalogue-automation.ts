import { createHash } from 'node:crypto';
import type { Concept } from '../catalogue';

export type CatalogueTheme = 'editorial-luxury' | 'atelier-minimal' | 'collectors-lookbook';

export type CatalogueLanguage = 'en' | 'hi';

export type CatalogueOutputFormat = 'SLIDES_AND_PDF' | 'PDF_ONLY';

export type CataloguePriceDisplay = 'SHOW_PRICES' | 'ON_REQUEST_ONLY' | 'STARTING_FROM';

export interface CatalogueConfig {
  readonly title: string;
  readonly subtitle: string;
  readonly curatorStatement: string;
  readonly theme: CatalogueTheme;
  readonly language: CatalogueLanguage;
  readonly outputFormat: CatalogueOutputFormat;
  readonly priceDisplay: CataloguePriceDisplay;
  readonly targetCategoryIds: readonly string[];
  readonly targetProductIds: readonly string[];
  readonly excludedProductIds: readonly string[];
  readonly includeCustomizationFields: boolean;
  readonly date: string;
}

export interface SelectedCatalogueItem {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly tier: string;
  readonly image: string | null;
  readonly priceFormatted: string;
  readonly materials: readonly string[];
  readonly dimensionsFormatted: string;
  readonly description: string;
}

export interface CatalogueInputSnapshot {
  readonly snapshotId: string;
  readonly frozenAt: string;
  readonly sourceRevision: string;
  readonly config: CatalogueConfig;
  readonly selectedProducts: readonly SelectedCatalogueItem[];
  readonly snapshotSha256: string;
}

export interface ReusedArtifactEntry {
  readonly artifactId: string;
  readonly name: string;
  readonly type: 'SLIDES_TEMPLATE' | 'COVER_LAYOUT' | 'TYPOGRAPHY_THEME' | 'PALETTE_SPEC';
  readonly nativeGoogleDriveId: string;
  readonly version: number;
  readonly description: string;
}

/**
 * Registered native Drive artifacts and template references.
 * Reused without rebuilding templates needlessly.
 */
export const registeredTemplateArtifacts: readonly ReusedArtifactEntry[] = [
  {
    artifactId: 'tmpl-slides-luxury-master',
    name: 'Rivya Editorial Luxury Slides Master',
    type: 'SLIDES_TEMPLATE',
    nativeGoogleDriveId: '1tmpl_rivya_editorial_luxury_slides_v1',
    version: 1,
    description: '16:9 widescreen master template with obsidian background, champagne typography, and 4:5 image frames.',
  },
  {
    artifactId: 'tmpl-slides-minimal-master',
    name: 'Rivya Atelier Minimal Slides Master',
    type: 'SLIDES_TEMPLATE',
    nativeGoogleDriveId: '1tmpl_rivya_atelier_minimal_slides_v1',
    version: 1,
    description: 'Clean monochrome presentation with spacious margins and live-edge detail callouts.',
  },
  {
    artifactId: 'tmpl-cover-statement-v1',
    name: 'Rivya Signature Cover Layout',
    type: 'COVER_LAYOUT',
    nativeGoogleDriveId: '1tmpl_rivya_cover_signature_v1',
    version: 1,
    description: 'Cover layout featuring "The Signature — From liquid to light" atelier identity.',
  },
  {
    artifactId: 'tmpl-typography-bilingual-v1',
    name: 'Atelier Bilingual Typography Scale',
    type: 'TYPOGRAPHY_THEME',
    nativeGoogleDriveId: '1tmpl_rivya_typography_en_hi_v1',
    version: 1,
    description: 'Compatible typography token set supporting English (serif/sans) and Hindi (Devanagari script).',
  },
];

/**
 * Validates catalogue configuration
 */
export function validateCatalogueConfig(config: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Configuration must be a non-null object'] };
  }

  const c = config as Partial<CatalogueConfig>;

  if (!c.title || typeof c.title !== 'string' || !c.title.trim() || c.title.length > 120) {
    errors.push('title is required and must not exceed 120 characters');
  }
  if (!c.subtitle || typeof c.subtitle !== 'string' || c.subtitle.length > 200) {
    errors.push('subtitle must be a string up to 200 characters');
  }
  if (!c.curatorStatement || typeof c.curatorStatement !== 'string' || c.curatorStatement.length > 1000) {
    errors.push('curatorStatement must be a string up to 1000 characters');
  }

  const validThemes: readonly CatalogueTheme[] = ['editorial-luxury', 'atelier-minimal', 'collectors-lookbook'];
  if (!c.theme || !validThemes.includes(c.theme)) {
    errors.push(`Invalid theme: ${String(c.theme)}`);
  }

  const validLanguages: readonly CatalogueLanguage[] = ['en', 'hi'];
  if (!c.language || !validLanguages.includes(c.language)) {
    errors.push(`Invalid language: ${String(c.language)}`);
  }

  const validFormats: readonly CatalogueOutputFormat[] = ['SLIDES_AND_PDF', 'PDF_ONLY'];
  if (!c.outputFormat || !validFormats.includes(c.outputFormat)) {
    errors.push(`Invalid outputFormat: ${String(c.outputFormat)}`);
  }

  const validPriceDisplays: readonly CataloguePriceDisplay[] = ['SHOW_PRICES', 'ON_REQUEST_ONLY', 'STARTING_FROM'];
  if (!c.priceDisplay || !validPriceDisplays.includes(c.priceDisplay)) {
    errors.push(`Invalid priceDisplay: ${String(c.priceDisplay)}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Freezes an immutable catalogue input snapshot from approved catalogue records.
 * INVARIANT: Zero products added; reuses existing approved catalogue concepts only.
 */
export function createCatalogueInputSnapshot(
  config: CatalogueConfig,
  products: readonly Concept[],
  sourceRevision = 'ae5c41a'
): CatalogueInputSnapshot {
  const validation = validateCatalogueConfig(config);
  if (!validation.valid) {
    throw new Error(`Invalid catalogue configuration: ${validation.errors.join(', ')}`);
  }

  const excluded = new Set(config.excludedProductIds || []);
  const targetCats = new Set(config.targetCategoryIds || []);
  const targetProds = new Set(config.targetProductIds || []);

  const filtered = products.filter((p) => {
    if (excluded.has(p.id)) return false;
    if (targetProds.size > 0 && !targetProds.has(p.id)) return false;
    if (targetCats.size > 0 && !targetCats.has(p.category)) return false;
    return true;
  });

  const selectedItems: SelectedCatalogueItem[] = filtered.map((p) => {
    let priceFormatted = 'Price on request';
    if (config.priceDisplay === 'SHOW_PRICES' && p.priceAmountMinor) {
      priceFormatted = `₹${Math.round(p.priceAmountMinor / 100).toLocaleString('en-IN')}`;
    } else if (config.priceDisplay === 'STARTING_FROM' && p.priceAmountMinor) {
      priceFormatted = `From ₹${Math.round(p.priceAmountMinor / 100).toLocaleString('en-IN')}`;
    }

    const dims = p.dimensions;
    const dimsFormatted = `${dims.width} × ${dims.depth} × ${dims.height} mm`;

    return {
      id: p.id,
      title: p.title,
      category: p.category,
      tier: p.tier,
      image: p.image,
      priceFormatted,
      materials: p.materials.map((m) => m.label),
      dimensionsFormatted: dimsFormatted,
      description: p.description,
    };
  });

  const frozenAt = new Date().toISOString();
  const rawPayload = JSON.stringify({ config, selectedItems, sourceRevision });
  const snapshotSha256 = createHash('sha256').update(rawPayload).digest('hex');
  const snapshotId = `cat-snap-${snapshotSha256.slice(0, 16)}`;

  return {
    snapshotId,
    frozenAt,
    sourceRevision,
    config,
    selectedProducts: selectedItems,
    snapshotSha256,
  };
}
