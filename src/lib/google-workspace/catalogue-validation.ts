import { validateAspectRatio4x5 } from './drive-media-delivery';

export interface SlideLayoutInput {
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly imageWidth?: number;
  readonly imageHeight?: number;
  readonly language: 'en' | 'hi';
}

export interface SlideLayoutValidationResult {
  readonly valid: boolean;
  readonly issues: readonly string[];
}

export interface PdfOutputInput {
  readonly pageCount: number;
  readonly bytes: number;
  readonly sha256: string;
  readonly targetProductsCount: number;
}

export interface PdfOutputValidationResult {
  readonly valid: boolean;
  readonly issues: readonly string[];
}

export interface CatalogueAccessResolution {
  readonly accessible: boolean;
  readonly accessType: 'studio_private' | 'denied';
  readonly reason?: string;
}

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_PDF_BYTES = 50 * 1024 * 1024; // 50 MB
const MIN_PDF_BYTES = 50 * 1024;        // 50 KB

/**
 * Validates a single slide's layout typography, image ratio, and language script
 */
export function validateSlideLayout(slide: SlideLayoutInput): SlideLayoutValidationResult {
  const issues: string[] = [];

  if (!slide.title || !slide.title.trim()) {
    issues.push('Slide title is required');
  } else if (slide.title.length > MAX_TITLE_LENGTH) {
    issues.push(`Slide title exceeds maximum length (${slide.title.length} > ${MAX_TITLE_LENGTH})`);
  }

  if (slide.description && slide.description.length > MAX_DESCRIPTION_LENGTH) {
    issues.push(`Slide description exceeds layout budget (${slide.description.length} > ${MAX_DESCRIPTION_LENGTH})`);
  }

  // Verify 4:5 vertical artwork ratio if dimensions provided
  if (slide.imageWidth && slide.imageHeight) {
    const ratioCheck = validateAspectRatio4x5(slide.imageWidth, slide.imageHeight);
    if (!ratioCheck.valid) {
      issues.push(`Product image ratio (${ratioCheck.ratio.toFixed(2)}) deviates from 4:5 vertical artwork standard`);
    }
  }

  // Language check: verify Devanagari script integrity for Hindi slides
  if (slide.language === 'hi') {
    const combinedText = `${slide.title} ${slide.description}`;
    const hasDevanagari = /[\u0900-\u097F]/.test(combinedText);
    const hasLatin = /[a-zA-Z]/.test(combinedText);
    if (!hasDevanagari && !hasLatin) {
      issues.push('Hindi slide text must contain valid UTF-8 characters');
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Validates declared PDF metadata only. Does not read PDF bytes or verify a checksum.
 */
export function validatePdfOutput(output: PdfOutputInput): PdfOutputValidationResult {
  const issues: string[] = [];

  // Minimum expected: 1 cover + 1 intro + products + 1 closing
  if (![output.pageCount, output.bytes, output.targetProductsCount].every(value => Number.isSafeInteger(value) && value >= 0)) issues.push('PDF metadata must contain finite non-negative integers');
  const expectedMinPages = output.targetProductsCount + 2;
  if (output.pageCount < expectedMinPages) {
    issues.push(`PDF page count (${output.pageCount}) is less than expected layout structure (minimum ${expectedMinPages})`);
  }

  if (output.bytes < MIN_PDF_BYTES) {
    issues.push(`PDF byte size (${output.bytes}) is abnormally small; check for generation failure`);
  } else if (output.bytes > MAX_PDF_BYTES) {
    issues.push(`PDF byte size (${output.bytes}) exceeds maximum delivery budget of 50 MB`);
  }

  if (!/^[a-f0-9]{64}$/.test(output.sha256)) {
    issues.push('PDF checksum must be a valid 64-character SHA-256 hex string');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Enforces strict access gating for generated catalogue artifacts:
 * - Artifacts are private to authenticated Studio staff only.
 * - Public sharing or external customer message delivery is prohibited without separate authorization.
 */
export function verifyCatalogueOutputAccess(
  driveId: string,
  isStudioStaff: boolean,
  authorizeRegisteredOutput?: (driveId: string) => boolean
): CatalogueAccessResolution {
  if (!driveId || !/^[A-Za-z0-9_-]{10,200}$/.test(driveId)) {
    return { accessible: false, accessType: 'denied', reason: 'Invalid or missing Drive ID' };
  }

  if (!isStudioStaff || !authorizeRegisteredOutput || !authorizeRegisteredOutput(driveId)) {
    return {
      accessible: false,
      accessType: 'denied',
      reason: 'Catalogue Slide and PDF generation outputs are restricted to authenticated Studio staff',
    };
  }

  return {
    accessible: true,
    accessType: 'studio_private',
  };
}
