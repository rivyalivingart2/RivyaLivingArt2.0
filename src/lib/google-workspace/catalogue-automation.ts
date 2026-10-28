import { createHash } from 'node:crypto';
import type { Concept } from '../catalogue';
import {canonicalArtifactJson} from './record-codec';

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
  readonly originKind: Concept['originKind'];
  readonly contentStatus: Concept['contentStatus'];
  readonly mediaStatus: Concept['mediaStatus'];
  readonly disclosure: string;
  readonly priceAmountMinor: number | null;
  readonly currency: 'INR';
  readonly priceType: Concept['priceType'];
}

export interface CatalogueInputSnapshot {
  readonly inputSource: 'caller-supplied-concepts';
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
  readonly nativeGoogleDriveId: string | null;
  readonly registrationStatus: 'unverified-specification';
  readonly version: number;
  readonly description: string;
}

/**
 * Historical layout specifications, not discovered Drive resources.
 * Real template registrations belong in the private provider registry.
 */
export const catalogueTemplateSpecifications: readonly ReusedArtifactEntry[] = [
  {
    artifactId: 'tmpl-slides-luxury-master',
    name: 'Rivya Editorial Luxury Slides Master',
    type: 'SLIDES_TEMPLATE',
    nativeGoogleDriveId: null,
    registrationStatus: 'unverified-specification',
    version: 1,
    description: '16:9 widescreen master template with obsidian background, champagne typography, and 4:5 image frames.',
  },
  {
    artifactId: 'tmpl-slides-minimal-master',
    name: 'Rivya Atelier Minimal Slides Master',
    type: 'SLIDES_TEMPLATE',
    nativeGoogleDriveId: null,
    registrationStatus: 'unverified-specification',
    version: 1,
    description: 'Clean monochrome presentation with spacious margins and live-edge detail callouts.',
  },
  {
    artifactId: 'tmpl-cover-statement-v1',
    name: 'Rivya Signature Cover Layout',
    type: 'COVER_LAYOUT',
    nativeGoogleDriveId: null,
    registrationStatus: 'unverified-specification',
    version: 1,
    description: 'Cover layout featuring "The Signature — From liquid to light" atelier identity.',
  },
  {
    artifactId: 'tmpl-typography-bilingual-v1',
    name: 'Atelier Bilingual Typography Scale',
    type: 'TYPOGRAPHY_THEME',
    nativeGoogleDriveId: null,
    registrationStatus: 'unverified-specification',
    version: 1,
    description: 'Compatible typography token set supporting English (serif/sans) and Hindi (Devanagari script).',
  },
];

export const registeredTemplateArtifacts: readonly ReusedArtifactEntry[] = [];

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

  for (const key of ['targetCategoryIds', 'targetProductIds', 'excludedProductIds'] as const) {
    const ids = c[key];
    if (!Array.isArray(ids) || ids.length > 1000 || ids.some(id => typeof id !== 'string' || !id || id.length > 160) || new Set(ids).size !== ids.length) errors.push(`${key} must contain bounded unique identifiers`);
  }
  if (typeof c.includeCustomizationFields !== 'boolean') errors.push('includeCustomizationFields must be boolean');
  if (typeof c.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(c.date) || !Number.isFinite(Date.parse(c.date)) || new Date(c.date).toISOString().slice(0,10) !== c.date) errors.push('date must be a valid ISO date');

  return { valid: errors.length === 0, errors };
}

/**
 * Freezes caller-supplied concepts without importing/creating product records.
 * This source helper is not a verified Sheets snapshot. Retain demo provenance.
 */
export function createCatalogueInputSnapshot(
  config: CatalogueConfig,
  products: readonly Concept[],
  sourceRevision = 'unverified-caller-input'
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
    if (p.priceAmountMinor !== null && (!Number.isSafeInteger(p.priceAmountMinor) || p.priceAmountMinor < 0)) throw new Error('Invalid minor-unit price.');
    let priceFormatted = 'Price on request';
    if (config.priceDisplay !== 'ON_REQUEST_ONLY' && p.priceType !== 'ON_REQUEST' && p.priceAmountMinor !== null) {
      const amount = (p.priceAmountMinor / 100).toLocaleString('en-IN', {maximumFractionDigits: 2, minimumFractionDigits: p.priceAmountMinor % 100 === 0 ? 0 : 2});
      priceFormatted = `${config.priceDisplay === 'STARTING_FROM' || p.priceType === 'STARTING_FROM' ? 'From ' : ''}₹${amount}`;
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
      originKind: p.originKind, contentStatus: p.contentStatus, mediaStatus: p.mediaStatus,
      disclosure: 'Demonstration concept; imagery is a concept visualization, not evidence of completed inventory or an offer.',
      priceAmountMinor: p.priceAmountMinor, currency: p.currency, priceType: p.priceType,
    };
  });

  const frozenAt = new Date().toISOString();
  if (new Set(selectedItems.map(item => item.id)).size !== selectedItems.length) throw new Error('Duplicate catalogue identity.');
  const safeConfig: CatalogueConfig = JSON.parse(canonicalArtifactJson(config));
  const rawPayload = canonicalArtifactJson({ config: safeConfig, selectedItems, sourceRevision });
  const snapshotSha256 = createHash('sha256').update(rawPayload).digest('hex');
  const snapshotId = `cat-snap-${snapshotSha256.slice(0, 16)}`;

  const snapshot: CatalogueInputSnapshot = {
    inputSource: 'caller-supplied-concepts',
    snapshotId,
    frozenAt,
    sourceRevision,
    config: safeConfig,
    selectedProducts: selectedItems,
    snapshotSha256,
  };
  function freeze(value: unknown): void {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  }
  freeze(snapshot);
  return snapshot;
}
